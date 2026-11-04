# Local container preview (nerdctl)

The multi-stage [Dockerfile](../Dockerfile) builds and tests the application with
Docker Hardened Node, then serves the static output with Docker Hardened Nginx.
GitHub Pages deployment is unchanged. This is a built snapshot, not the Vite
live-reload server: rebuild after editing source files.

## Build and run

Run these commands from the repository checkout:

```bash
nerdctl login dhi.io
container/preview.sh build
container/preview.sh run
curl --fail http://127.0.0.1:5173/healthz
```

Open `http://127.0.0.1:5173/#/catalogue` or use this computer's LAN address on a
phone connected to the same network. Port 5173 is published on all IPv4
interfaces by default, preserving the existing localStorage origin. The existing
LAN-only UFW TCP rule still applies. For a loopback-only preview instead:

```bash
GWENTDECK_BIND_ADDRESS=127.0.0.1 container/preview.sh run
```

Binding/port overrides apply when creating the container. Stop and remove an
existing container before changing them. Choose another host port
with `GWENTDECK_PORT=5174` if necessary; a different origin has separate browser
storage. Collections and saved decks remain in the browser, never in a container
volume. Use the application's export/import controls when changing origins.

## Stop, inspect, rebuild

```bash
container/preview.sh status
container/preview.sh logs
container/preview.sh stop
container/preview.sh start
```

To replace the container with a newly built snapshot:

```bash
container/preview.sh build
container/preview.sh stop
container/preview.sh rm
container/preview.sh run
```

Remove the stopped preview container with `container/preview.sh rm`.
The `unless-stopped` restart policy uses containerd's restart management. There is
no GwentDeck systemd unit; the host's existing rootless containerd/BuildKit setup
is independent of the application preview.

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
The helper sets the `VCS_REF` build argument to label the application commit; include the fact that
a working tree is dirty in your own release records if building uncommitted edits.

To update inputs, inspect current versions in the
[DHI catalogue](https://hub.docker.com/hardened-images/catalog) and
[Dockerfile releases](https://github.com/moby/buildkit/releases). Pull each new
full version and obtain its `RepoDigests` with `nerdctl image inspect`. Update the
tag and digest together, update the Node/npm version checks if applicable, then
rebuild and rerun the checks. A pinned digest does not automatically receive
security updates. Registry credentials stay in the host credential store; do not
pass them as Docker build arguments or copy them into the context.

## Runtime protection and checks

The runner enforces UID/GID 65532, a read-only root, no Linux capabilities,
`no-new-privileges`, a 16 MiB `noexec,nosuid,nodev` tmpfs, 64 PIDs, 128 MiB memory,
no additional swap, and one CPU. No host directories or engine sockets are
mounted. Only the built site and licence notices are copied from the build stage;
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

The helper uses nerdctl run directly because nerdctl Compose 2.4.1 ignores some
resource fields. The verification checked the actual OCI spec, including
`noNewPrivileges`, empty capabilities, read-only root, memory/swap, PID and CPU
limits, and the tmpfs mount options. There is intentionally no shell-based
HEALTHCHECK in this shell-free runtime; `/healthz` is checked externally.
