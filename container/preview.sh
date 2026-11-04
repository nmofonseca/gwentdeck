#!/bin/sh
set -eu

preview_repo=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
preview_image=gwentdeck:local
preview_name=gwentdeck-preview

case "${1:-help}" in
    build)
        preview_revision=$(git -C "$preview_repo" rev-parse HEAD 2>/dev/null || printf unknown)
        exec nerdctl build --file "$preview_repo/Dockerfile" \
            --tag "$preview_image" --build-arg "VCS_REF=$preview_revision" "$preview_repo"
        ;;
    run)
        preview_port=${GWENTDECK_PORT:-5173}
        preview_bind=${GWENTDECK_BIND_ADDRESS:-0.0.0.0}
        case "$preview_port" in ''|*[!0-9]*) printf '%s\n' 'GWENTDECK_PORT must be an integer.' >&2; exit 2;; esac
        if [ "$preview_port" -lt 1024 ] || [ "$preview_port" -gt 65535 ]; then
            printf '%s\n' 'Choose an unprivileged host port between 1024 and 65535.' >&2
            exit 2
        fi
        exec nerdctl run --detach --name "$preview_name" --pull=never \
            --publish "$preview_bind:$preview_port:8080/tcp" \
            --user 65532:65532 --read-only \
            --tmpfs /tmp:rw,noexec,nosuid,nodev,size=16m,uid=65532,gid=65532,mode=0700 \
            --cap-drop ALL --security-opt no-new-privileges \
            --pids-limit 64 --memory 128m --memory-swap 128m --cpus 1 \
            --ulimit nofile=1024:1024 --stop-signal SIGQUIT --stop-timeout 10 \
            --restart unless-stopped "$preview_image"
        ;;
    start|stop|rm)
        exec nerdctl "$1" "$preview_name"
        ;;
    logs)
        exec nerdctl logs --tail 50 "$preview_name"
        ;;
    status)
        exec nerdctl inspect --format '{{.Name}}: {{.State.Status}} ({{.Config.Image}})' "$preview_name"
        ;;
    *)
        printf '%s\n' 'Usage: container/preview.sh {build|run|start|stop|rm|logs|status}'
        ;;
esac
