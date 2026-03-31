#!/usr/bin/env bash
# Recreate hoặc **tạo lần đầu** container thuần qua Portainer Docker API.
#
# Biến môi trường (bắt buộc):
#   PORTAINER_URL, PORTAINER_API_TOKEN, PORTAINER_ENDPOINT_ID
#   PORTAINER_CONTAINER_NAME, PORTAINER_CONTAINER_NETWORK, PORTAINER_NEW_IMAGE
#   PORTAINER_NETWORK_ALIASES — CSV (mặc định: cms)
#
# Khi container **đã tồn tại**: inspect → stop → rm → create (giữ cấu hình) + start.
# Khi **chưa có**: đọc file bootstrap JSON (Docker Engine POST /containers/create body),
#   gắn Image + NetworkingConfig từ biến môi trường → create + start.
#
# File bootstrap (mặc định deploy/portainer-container-bootstrap.json):
#   Sao chép từ deploy/portainer-container-bootstrap.spec.example.json, chỉnh Env / port / volume,
#   commit vào repo. KHÔNG commit secret trong Env.
#
# Tuỳ chọn: PORTAINER_CONTAINER_BOOTSTRAP_SPEC — đường dẫn file JSON khác (từ root repo).
#
# Pull image private qua Docker API (images/create, containers/create) **không** dùng registry đã lưu trong UI Portainer
# trừ khi gửi header X-Registry-Auth (base64 JSON username/password/serveraddress).
# Tuỳ chọn (khuyến nghị cho private Docker Hub):
#   DOCKERHUB_USERNAME, DOCKERHUB_TOKEN — workflow truyền cùng secret đã dùng để push
#   DOCKER_REGISTRY_SERVERADDRESS — mặc định https://index.docker.io/v1/
# Hoặc: REGISTRY_USERNAME, REGISTRY_PASSWORD (+ DOCKER_REGISTRY_SERVERADDRESS cho registry khác).

set -euo pipefail

: "${PORTAINER_URL:?}"
: "${PORTAINER_API_TOKEN:?}"
: "${PORTAINER_ENDPOINT_ID:?}"
: "${PORTAINER_CONTAINER_NAME:?}"
: "${PORTAINER_CONTAINER_NETWORK:?}"
: "${PORTAINER_NEW_IMAGE:?}"

BASE="${PORTAINER_URL%/}"
EID="${PORTAINER_ENDPOINT_ID}"
NAME="${PORTAINER_CONTAINER_NAME#\/}"
ALIASES="${PORTAINER_NETWORK_ALIASES:-cms}"
BOOTSTRAP_SPEC="${PORTAINER_CONTAINER_BOOTSTRAP_SPEC:-deploy/portainer-container-bootstrap.json}"
HDR=( -H "X-API-Key: ${PORTAINER_API_TOKEN}" -H "Content-Type: application/json" )

REGISTRY_HDR=()
_REG_USER="${DOCKERHUB_USERNAME:-${REGISTRY_USERNAME:-}}"
_REG_PASS="${DOCKERHUB_TOKEN:-${REGISTRY_PASSWORD:-}}"
if [ -n "${_REG_USER}" ] && [ -n "${_REG_PASS}" ]; then
  export _REG_USER _REG_PASS
  if _REG_AUTH_B64="$(
    python3 <<'PY'
import base64, json, os

u = os.environ.get("_REG_USER", "")
p = os.environ.get("_REG_PASS", "")
addr = os.environ.get("DOCKER_REGISTRY_SERVERADDRESS") or "https://index.docker.io/v1/"
if not u or not p:
    raise SystemExit(1)
blob = json.dumps({"username": u, "password": p, "serveraddress": addr}, separators=(",", ":"))
print(base64.b64encode(blob.encode("utf-8")).decode("ascii"))
PY
  )"; then
    REGISTRY_HDR=( -H "X-Registry-Auth: ${_REG_AUTH_B64}" )
    echo "::notice::Đã gắn header X-Registry-Auth cho pull/create (registry private)."
  fi
  unset _REG_USER _REG_PASS
else
  echo "::notice::Không có DOCKERHUB_USERNAME/DOCKERHUB_TOKEN (hoặc REGISTRY_*) — pull private qua API có thể bị denied."
fi

encode_from_image() {
  python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "$1"
}

name_enc_query() {
  python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe='-_.'))" "$1"
}

DOCKER_API="${BASE}/api/endpoints/${EID}/docker"

echo ">>> Pull image trên endpoint (có thể vài phút)..."
FI_ENC="$(encode_from_image "${PORTAINER_NEW_IMAGE}")"
pull_body="$(mktemp)"
PH="$(curl -sS -o "$pull_body" -w "%{http_code}" -X POST "${HDR[@]}" "${REGISTRY_HDR[@]}" \
  "${DOCKER_API}/images/create?fromImage=${FI_ENC}" --max-time 600)" || PH="000"
if [ "$PH" != "200" ]; then
  pull_msg="$(jq -r '.message // empty' "$pull_body" 2>/dev/null || true)"
  if [ -z "$pull_msg" ]; then
    pull_msg="$(head -c 800 "$pull_body" 2>/dev/null || true)"
  fi
  [ "${#pull_msg}" -gt 800 ] && pull_msg="${pull_msg:0:800}…"
  echo "::warning::Pull HTTP ${PH}${pull_msg:+ — $pull_msg}"
  echo "::notice::Vẫn thử create; nếu pull lỗi (404/401/403), create thường trả 404 «No such image». Private: truyền DOCKERHUB_USERNAME/DOCKERHUB_TOKEN vào job (header X-Registry-Auth) hoặc docker login trên host."
fi
rm -f "$pull_body"

echo ">>> Tìm container /${NAME}"
LIST="$(curl -fsS "${HDR[@]}" "${DOCKER_API}/containers/json?all=true")"
CID="$(echo "$LIST" | jq -r --arg n "$NAME" '
  .[] | select(
    (.Names[]? | ltrimstr("/")) == $n
  ) | .Id' | head -n1)"

merge_bootstrap_payload() {
  jq \
    --arg img "${PORTAINER_NEW_IMAGE}" \
    --arg net "${PORTAINER_CONTAINER_NETWORK}" \
    --arg aliases "${ALIASES}" '
    ($aliases | split(",") | map(gsub("^\\s+|\\s+$"; "")) | map(select(length > 0))) as $al |
    . + {
      Image: $img,
      NetworkingConfig: {
        EndpointsConfig: {
          ($net): { Aliases: $al }
        }
      }
    }
    | walk(
        if type == "object" then with_entries(select(.value != null))
        elif type == "array" then map(select(. != null))
        else . end
      )
  ' "$1"
}

build_create_from_inspect() {
  local inspect_json="$1"
  echo "$inspect_json" | jq \
    --arg img "${PORTAINER_NEW_IMAGE}" \
    --arg net "${PORTAINER_CONTAINER_NETWORK}" \
    --arg aliases "${ALIASES}" '
    ($aliases | split(",") | map(gsub("^\\s+|\\s+$"; "")) | map(select(length > 0))) as $al |
    {
      Hostname: .Config.Hostname,
      Domainname: .Config.Domainname,
      User: .Config.User,
      AttachStdin: false,
      AttachStdout: true,
      AttachStderr: true,
      Tty: (.Config.Tty // false),
      OpenStdin: false,
      StdinOnce: false,
      Env: (.Config.Env // []),
      Cmd: .Config.Cmd,
      Healthcheck: .Config.Healthcheck,
      ArgsEscaped: .Config.ArgsEscaped,
      Image: $img,
      Volumes: (.Config.Volumes // {}),
      WorkingDir: (.Config.WorkingDir // ""),
      Entrypoint: .Config.Entrypoint,
      Labels: (.Config.Labels // {}),
      ExposedPorts: .Config.ExposedPorts,
      StopSignal: .Config.StopSignal,
      HostConfig: (
        .HostConfig
        | {
            Binds: .Binds,
            PortBindings: .PortBindings,
            RestartPolicy: .RestartPolicy,
            PublishAllPorts: .PublishAllPorts,
            Dns: .Dns,
            DnsSearch: .DnsSearch,
            DnsOptions: .DnsOptions,
            ExtraHosts: .ExtraHosts,
            VolumesFrom: .VolumesFrom,
            CapAdd: .CapAdd,
            CapDrop: .CapDrop,
            GroupAdd: .GroupAdd,
            Privileged: .Privileged,
            ReadonlyRootfs: .ReadonlyRootfs,
            Ulimits: .Ulimits,
            LogConfig: .LogConfig,
            CgroupParent: .CgroupParent,
            ShmSize: .ShmSize,
            SecurityOpt: .SecurityOpt,
            StorageOpt: .StorageOpt,
            Tmpfs: .Tmpfs,
            Sysctls: .Sysctls,
            Devices: .Devices,
            DeviceCgroupRules: .DeviceCgroupRules,
            Init: .Init
          }
        | with_entries(select(.value != null and .value != {} and .value != []))
      ),
      NetworkingConfig: {
        EndpointsConfig: {
          ($net): {
            Aliases: $al
          }
        }
      }
    }
    | walk(
        if type == "object" then with_entries(select(.value != null))
        elif type == "array" then map(select(. != null))
        else . end
      )
  '
}

do_create_and_start() {
  local create_json="$1"
  local tmp
  tmp="$(mktemp)"
  echo "$create_json" >"$tmp"
  local name_enc
  name_enc="$(name_enc_query "$NAME")"
  echo ">>> POST /containers/create (name=${NAME})"
  local create_out ch
  create_out="$(mktemp)"
  ch="$(curl -sS -o "$create_out" -w "%{http_code}" -X POST "${HDR[@]}" "${REGISTRY_HDR[@]}" \
    "${DOCKER_API}/containers/create?name=${name_enc}" \
    -d @"$tmp")"
  rm -f "$tmp"
  local create_resp
  create_resp="$(cat "$create_out")"
  rm -f "$create_out"
  if [ "$ch" != "200" ] && [ "$ch" != "201" ]; then
    err_msg="$(echo "$create_resp" | jq -r '.message // .' 2>/dev/null || echo "$create_resp")"
    echo "::error::create HTTP ${ch}: ${err_msg}"
    echo "::notice::Thường do image «${PORTAINER_NEW_IMAGE}» chưa có trên daemon (pull thất bại: tag sai, chưa push, hoặc private cần docker login / registry trên Portainer)."
    exit 1
  fi
  local new_cid
  new_cid="$(echo "$create_resp" | jq -r '.Id // empty')"
  if [ -z "$new_cid" ] || [ "$new_cid" = "null" ]; then
    echo "::error::create thiếu Id trong response: $create_resp"
    exit 1
  fi
  echo ">>> Start ${new_cid:0:12}"
  curl -fsS -X POST "${HDR[@]}" "${REGISTRY_HDR[@]}" "${DOCKER_API}/containers/${new_cid}/start"
}

if [ -z "$CID" ] || [ "$CID" = "null" ]; then
  echo "::notice::Chưa có container '${NAME}' — chế độ bootstrap (file spec)."
  if [ ! -f "$BOOTSTRAP_SPEC" ]; then
    echo "::error::Thiếu file bootstrap: ${BOOTSTRAP_SPEC}"
    echo "Sao chép deploy/portainer-container-bootstrap.spec.example.json → ${BOOTSTRAP_SPEC}, chỉnh Env/port/volume, commit rồi chạy lại pipeline."
    exit 1
  fi
  CREATE_JSON="$(merge_bootstrap_payload "$BOOTSTRAP_SPEC")"
  do_create_and_start "$CREATE_JSON"
  echo "OK: tạo mới xong — ${NAME} → ${PORTAINER_NEW_IMAGE} (network ${PORTAINER_CONTAINER_NETWORK})"
  exit 0
fi

echo ">>> Inspect ${CID:0:12} (recreate)"
INSPECT="$(curl -fsS "${HDR[@]}" "${DOCKER_API}/containers/${CID}/json")"
CREATE_JSON="$(build_create_from_inspect "$INSPECT")"

echo ">>> Stop container cũ"
curl -fsS -X POST "${HDR[@]}" "${DOCKER_API}/containers/${CID}/stop?t=30" || true

echo ">>> Xóa container cũ"
curl -fsS -X DELETE "${HDR[@]}" "${DOCKER_API}/containers/${CID}?force=1"

do_create_and_start "$CREATE_JSON"

echo "OK: recreate xong — ${NAME} → ${PORTAINER_NEW_IMAGE} trên network ${PORTAINER_CONTAINER_NETWORK}"
