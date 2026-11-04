# Local container preview (nerdctl Compose)

The multi-stage [Dockerfile](../Dockerfile) builds and tests the application with
Docker Hardened Node, then serves the static output with Docker Hardened Nginx.
[compose.yaml](../compose.yaml) defines the local preview service.
GitHub Pages deployment is unchanged. This is a built snapshot, not the Vite
live-reload server: rebuild after editing source files.

## Build and run

Run these commands from the repository checkout:

```bash
nerdctl login dhi.io
nerdctl compose build --build-arg VCS_REF="$(git rev-parse HEAD)"
nerdctl compose up -d
curl --fail http://127.0.0.1:5173/healthz
```

Open `http://127.0.0.1:5173/#/catalogue` or use this computer's LAN address on a
phone connected to the same network. Port 5173 is published on all IPv4
interfaces by default, preserving the existing localStorage origin. The existing
LAN-only UFW TCP rule still applies. For a loopback-only preview instead:

```bash
GWENTDECK_BIND_ADDRESS=127.0.0.1 nerdctl compose up -d
```

Binding/port overrides apply when creating the container. Run
`nerdctl compose up -d --force-recreate` with the new overrides to change them.
Choose another host port
with `GWENTDECK_PORT=5174` if necessary; a different origin has separate browser
storage. Collections and saved decks remain in the browser, never in a container
volume. Use the application's export/import controls when changing origins.

## Stop, inspect, rebuild

```bash
nerdctl compose ps
nerdctl compose logs --tail 50
nerdctl compose stop
nerdctl compose start
```

To replace the container with a newly built snapshot:

```bash
nerdctl compose build --build-arg VCS_REF="$(git rev-parse HEAD)"
nerdctl compose up -d --force-recreate
```

Remove the preview container and its Compose network with `nerdctl compose down`.
For a quick build/start without a commit revision label, use
`nerdctl compose up --build -d`; the Dockerfile revision defaults to `unknown`.
The `unless-stopped` restart policy uses containerd's restart management. There is
no GwentDeck systemd unit; the host's existing rootless containerd/BuildKit setup
is independent of the application preview.

## Migration from the old shell runner

The former `container/preview.sh` helper has been replaced by Compose. Build
the new image first with the command above. If its standalone container
`gwentdeck-preview` still exists, remove it before starting Compose on port 5173;
nerdctl reserves the published port even while that old container is stopped:

```bash
nerdctl rm --force gwentdeck-preview
nerdctl compose up -d
curl --fail http://127.0.0.1:5173/healthz
```

The standalone container holds no collection data or persistent volumes. The
new Compose container is named `gwentdeck-preview-1` by default. Browser data
stays at the same origin and is unaffected by this migration. For an optional
trial before removing the old container, run a separate project on port 5174:

```bash
GWENTDECK_PORT=5174 nerdctl compose --project-name gwentdeck-check up -d
curl --fail http://127.0.0.1:5174/healthz
GWENTDECK_PORT=5174 nerdctl compose --project-name gwentdeck-check down
```

## Pinned inputs

Resolved on 2026-11-03. The Dockerfile records the verified multi-platform index
SHA-256 alongside every full image/frontend version:

| Input | Version |
| --- | --- |
| Dockerfile frontend | docker/dockerfile 1.28.0 |
| DHI build image | Node 26.13.0, Debian 13, dev variant |
| npm supplied by that image | 11.21.1, checked during build |
| DHI runtime image | Nginx 1.31.8, Debian 13, runtime variant |
| Application/build tools | Exact versions and integrity hashes in package-lock.json |

The builder runs as UID 1000. `npm ci --ignore-scripts` verifies the lockfile and
package integrity without dependency lifecycle scripts; the explicitly requested
lint, unit tests and production build then run with networking disabled. No new
CLI tool is fetched from an unversioned download URL.

Host tools used for verification: nerdctl 2.4.1, BuildKit 0.34.1 and
rootless containerd 2.4.2. These host tools are not installed by the Dockerfile.
The documented build command sets `VCS_REF` to label the application commit.
Record any uncommitted edits separately when building a dirty working tree.

To update inputs, inspect current versions in the
[DHI catalogue](https://hub.docker.com/hardened-images/catalog) and
[Dockerfile releases](https://github.com/moby/buildkit/releases). Pull each new
full version and obtain its `RepoDigests` with `nerdctl image inspect`. Update the
tag and digest together, update the Node/npm version checks if applicable, then
rebuild and rerun the checks. A pinned digest does not automatically receive
security updates. Registry credentials stay in the host credential store; do not
pass them as Docker build arguments or copy them into the context.

## Runtime protection and checks

Compose enforces UID/GID 65532, a read-only root, no Linux capabilities,
`no-new-privileges`, a 16 MiB `noexec,nosuid,nodev` tmpfs, 64 PIDs, 128 MiB memory,
and one CPU. nerdctl Compose 2.4.1 does not apply `memswap_limit`, so that
unsupported setting is omitted. With this memory limit, the tested runtime
allows up to 128 MiB additional swap (256 MiB RAM-plus-swap total), subject to
host availability. This default is accepted for local static-site testing. No
host directories or engine sockets are mounted. Only the built site and licence notices are copied from the build stage;
Node, npm, node_modules and TypeScript sources stay out of the runtime image.
The DHI runtime has no shell or package manager.

Nginx listens on unprivileged port 8080, logs to stdout/stderr, uses SIGQUIT for
graceful shutdown, returns real 404s for missing assets, and exposes `/healthz`
for external HTTP readiness checks. Hashed assets receive a long cache lifetime;
HTML is revalidated. Security headers include a CSP that still supports the
application's inline fallback styles and personal image URL overrides. Zod
validation uses its supported jitless mode so the script policy does not need
`unsafe-eval`. No HSTS
is sent by this local HTTP preview.

After startup, verify `/healthz`, the library and optimiser in a browser, and a
card image such as `/card-faces/neutral-geralt-of-rivia.webp`. Missing assets and
`/.env` must not return the application HTML. Verify any replacement container
before removing an older preview service.

References: [DHI Node guide](https://hub.docker.com/hardened-images/catalog/dhi/node/guides),
[DHI Nginx guide](https://hub.docker.com/hardened-images/catalog/dhi/nginx/guides),
[Dockerfile frontend pinning](https://docs.docker.com/build/buildkit/frontend/).

Use service-level `pids_limit`, not `deploy.resources.limits.pids`, which
nerdctl Compose 2.4.1 ignores. CPU and memory also use service-level fields
because this version rejects mixing service-level PIDs with deployment-level CPU/memory
limits. nerdctl emits deprecation notices for `cpus` and `mem_limit`, but both
are applied; the deployment-only PID alternative is ignored. Verify the actual
OCI spec after changing the Compose file,
including `noNewPrivileges`, capabilities, read-only root, memory/swap, PID and
CPU limits, and tmpfs options. There is intentionally no shell-based HEALTHCHECK
in this shell-free runtime; `/healthz` is checked externally.

Compatibility reference: [nerdctl 2.4.1 Compose service parser](https://github.com/containerd/nerdctl/blob/v2.4.1/pkg/composer/serviceparser/serviceparser.go).
