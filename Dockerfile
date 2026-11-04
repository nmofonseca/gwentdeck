# syntax=docker/dockerfile:1.28.0@sha256:bb22d9815c728170f72750f4e5b0d672e06176142e1d602c7e66c050100b7e5b
# check=error=true

# Verified multi-platform registry digests; see docs/containers.md for updates.
FROM dhi.io/node:26.13.0-debian13-dev@sha256:5a92bf639721c31a2b66c0b7c81debcc7804d7f4a738561ba8fc4f15f55452c3 AS build
WORKDIR /app
RUN <<'EOF'
set -eu
chown 1000:1000 /app
EOF
USER 1000:1000
ENV HOME=/home/node \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_AUDIT=false \
    NPM_CONFIG_FUND=false

# npm is supplied by the pinned DHI image, not downloaded from a moving tag.
RUN <<'EOF'
set -eu
test "$(node --version)" = "v26.13.0"
test "$(npm --version)" = "11.21.1"
EOF
COPY --chown=1000:1000 package.json package-lock.json ./
RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000,sharing=locked <<'EOF'
set -eu
npm ci --include=dev --ignore-scripts
EOF

COPY --chown=1000:1000 index.html tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts .oxlintrc.json .gitignore ./
COPY --chown=1000:1000 src/ ./src/
COPY --chown=1000:1000 public/ ./public/
# Compilation and tests have no network access. npm lock integrity pins all tools.
RUN --network=none <<'EOF'
set -eu
npm run lint
npm test
npm run build
EOF

FROM dhi.io/nginx:1.31.8-debian13@sha256:5ac78884109e0c132a72f31aa79f6a252238d27c38bcc9c26ff9c6520b8b35b8 AS runtime
ARG VCS_REF=unknown
LABEL org.opencontainers.image.title="GwentDeck local preview" \
      org.opencontainers.image.description="Static TW3 card library and deck optimiser" \
      org.opencontainers.image.source="https://github.com/nmofonseca/gwentdeck" \
      org.opencontainers.image.revision="${VCS_REF}"
COPY --from=build --chown=0:0 /app/dist/ /srv/gwentdeck/
COPY --chown=0:0 --chmod=0444 container/nginx.conf /etc/nginx/nginx.conf
COPY --chown=0:0 --chmod=0444 LICENSE NOTICE-ART.md /usr/share/licenses/gwentdeck/
WORKDIR /srv/gwentdeck
USER 65532:65532
EXPOSE 8080
STOPSIGNAL SIGQUIT
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
