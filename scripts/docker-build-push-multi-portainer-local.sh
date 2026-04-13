#!/usr/bin/env bash
# Chạy local luồng tương đương .github/workflows/docker-build-push-multi-portainer.yml:
#   yarn install → yarn build:ci → docker build mọi DockerBuild/StaticBuild.*.Dockerfile
#   → mặc định: docker push → recreate container trên Portainer theo manifest.
#   → --no-portainer: vẫn push, bỏ bước Portainer.
#   → --no-push: chỉ build image local, không push / không Portainer.
#
# Yêu cầu: bash, Node 20+, Yarn (Corepack), Docker.
# jq + curl khi chạy bước Portainer (mặc định bật; bỏ qua nếu --no-portainer hoặc --no-push).
# Script Portainer (portainer-recreate-container.sh) cần thêm python3.
# Windows: chạy trong Git Bash hoặc WSL (không chạy trực tiếp bằng cmd.exe).
#
# Biến môi trường: khai báo trong scripts/.env (cùng thư mục với file .sh này).
#   Mẫu: scripts/.env.example — copy thành scripts/.env và điền giá trị (không commit .env).
#   Các khóa thường dùng:
#     DOCKER_IMAGE_REPO, PORTAINER_DEPLOY_MANIFEST
#     DOCKERHUB_USERNAME, DOCKERHUB_TOKEN (mặc định có push)
#     PORTAINER_URL, PORTAINER_API_TOKEN, PORTAINER_ENDPOINT_ID (mặc định deploy sau push)
#     VERSION (tuỳ chọn; nếu không có thì dùng tham số hoặc package.json + git SHA)
#
# Ví dụ:
#   ./scripts/docker-build-push-multi-portainer-local.sh 3.0.0-rc1
#   ./scripts/docker-build-push-multi-portainer-local.sh --no-push
#   ./scripts/docker-build-push-multi-portainer-local.sh --no-portainer
#   VERSION=3.0.0-abc1234 ./scripts/docker-build-push-multi-portainer-local.sh --skip-install

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT"

ENV_FILE="${SCRIPT_DIR}/.env"
if [[ -f "$ENV_FILE" ]]; then
  echo ">>> Nạp biến môi trường: $ENV_FILE"
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
else
  echo ">>> Gợi ý: tạo $ENV_FILE (mẫu: ${SCRIPT_DIR}/.env.example)" >&2
fi

VERSION_ARG=""
PUSH=1
SKIP_INSTALL=0
SKIP_BUILD=0
NO_PORTAINER=0

usage() {
  sed -n '1,35p' "$0" | sed -n '/^#/p' | sed 's/^# \{0,1\}//'
  cat <<'EOF'

Cú pháp:
  docker-build-push-multi-portainer-local.sh [VERSION] [tùy chọn]

Tùy chọn:
  (mặc định)          Push image lên registry + deploy Portainer theo manifest (cần .env / docker login).
  --push              Giữ tương thích: bật push (mặc định đã bật).
  --no-push           Chỉ build image local, không push và không Portainer.
  --skip-install      Bỏ yarn install (đã có node_modules).
  --skip-build        Bỏ yarn build:ci (đã có thư mục build/).
  --no-portainer      Vẫn push; bỏ bước recreate container trên Portainer.
  -h, --help          Hiển thị hướng dẫn.

VERSION:
  Nếu không truyền: lấy package.json.version + '-' + git short SHA (7 ký tự).
  Có thể đặt VERSION trong scripts/.env hoặc export trước khi chạy.

Biến môi trường: scripts/.env (cùng thư mục với script). Mẫu: scripts/.env.example
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help)
      usage
      exit 0
      ;;
    --push)
      PUSH=1
      shift
      ;;
    --no-push)
      PUSH=0
      shift
      ;;
    --skip-install)
      SKIP_INSTALL=1
      shift
      ;;
    --skip-build)
      SKIP_BUILD=1
      shift
      ;;
    --no-portainer)
      NO_PORTAINER=1
      shift
      ;;
    -*)
      echo "Không rõ tùy chọn: $1" >&2
      usage >&2
      exit 1
      ;;
    *)
      if [[ -n "${VERSION_ARG}" ]]; then
        echo "Chỉ được một VERSION (positional)." >&2
        exit 1
      fi
      VERSION_ARG="$1"
      shift
      ;;
  esac
done

DOCKER_REPO="${DOCKER_IMAGE_REPO:-dungnt118/freepbx}"
MANIFEST_DEFAULT="${PORTAINER_DEPLOY_MANIFEST:-deploy/portainer-deploy-manifest.json}"

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Thiếu lệnh bắt buộc: $1" >&2
    exit 1
  }
}

need_cmd node
need_cmd docker

if [[ -n "${VERSION_ARG}" ]]; then
  VERSION="${VERSION_ARG}"
elif [[ -n "${VERSION:-}" ]]; then
  VERSION="${VERSION}"
else
  PKG="$(node -p "require('./package.json').version")"
  SHA="$(git rev-parse --short=7 HEAD 2>/dev/null || echo "nogit")"
  VERSION="${PKG}-${SHA}"
fi

echo ">>> ROOT=$ROOT"
echo ">>> VERSION=$VERSION"
echo ">>> DOCKER_REPO=$DOCKER_REPO"
echo ">>> PUSH=$PUSH"

if [[ "${SKIP_INSTALL}" -eq 0 ]]; then
  if command -v corepack >/dev/null 2>&1; then
    corepack enable
  fi
  need_cmd yarn
  echo ">>> yarn install"
  yarn install
fi

if [[ "${SKIP_BUILD}" -eq 0 ]]; then
  echo ">>> yarn build:ci"
  yarn build:ci
fi

dockerfiles=()
while IFS= read -r line; do
  [[ -n "$line" ]] && dockerfiles+=("$line")
done < <(find DockerBuild -maxdepth 1 -name 'StaticBuild.*.Dockerfile' -print 2>/dev/null | sort)

if [[ ${#dockerfiles[@]} -eq 0 ]]; then
  echo "Lỗi: không tìm thấy DockerBuild/StaticBuild.*.Dockerfile" >&2
  exit 1
fi

if [[ "${PUSH}" -eq 1 ]]; then
  if [[ -n "${DOCKERHUB_USERNAME:-}" && -n "${DOCKERHUB_TOKEN:-}" ]]; then
    echo ">>> docker login (DOCKERHUB_USERNAME)"
    echo "${DOCKERHUB_TOKEN}" | docker login -u "${DOCKERHUB_USERNAME}" --password-stdin
  else
    echo "Gợi ý: chưa set DOCKERHUB_USERNAME/DOCKERHUB_TOKEN — dùng 'docker login' thủ công trước khi push." >&2
  fi
fi

for dockerfile in "${dockerfiles[@]}"; do
  base=$(basename "$dockerfile")
  name="${base#StaticBuild.}"
  name="${name%.Dockerfile}"
  tag="${DOCKER_REPO}:${name}_cms_v${VERSION}"
  echo "========================================"
  echo ">>> docker build -t ${tag} -f ${dockerfile} ."
  docker build -t "$tag" -f "$dockerfile" .
  if [[ "${PUSH}" -eq 1 ]]; then
    echo ">>> docker push ${tag}"
    docker push "$tag"
  fi
done

echo ">>> Hoàn tất ${#dockerfiles[@]} image(s), VERSION=${VERSION}, PUSH=${PUSH}, NO_PORTAINER=${NO_PORTAINER}"

if [[ "${PUSH}" -eq 0 ]]; then
  echo ">>> Bỏ qua docker push và Portainer (--no-push)." >&2
  exit 0
fi

if [[ "${NO_PORTAINER}" -eq 1 ]]; then
  echo ">>> Đã push xong; bỏ qua Portainer (--no-portainer)."
  exit 0
fi

need_cmd jq
need_cmd curl

MANIFEST="${MANIFEST_DEFAULT}"
if [[ ! -f "$MANIFEST" ]]; then
  echo ">>> Không có file manifest ($MANIFEST) — bỏ qua deploy Portainer."
  exit 0
fi

if ! jq -e '.targets | type == "array"' "$MANIFEST" >/dev/null 2>&1; then
  echo "Lỗi: Manifest $MANIFEST: thiếu mảng .targets hợp lệ." >&2
  exit 1
fi

n="$(jq '.targets | length' "$MANIFEST")"
if [[ "$n" -eq 0 ]]; then
  echo ">>> Manifest $MANIFEST: targets rỗng — bỏ qua deploy Portainer."
  exit 0
fi

missing=()
[[ -z "${PORTAINER_URL:-}" ]] && missing+=("PORTAINER_URL")
[[ -z "${PORTAINER_API_TOKEN:-}" ]] && missing+=("PORTAINER_API_TOKEN")
[[ -z "${PORTAINER_ENDPOINT_ID:-}" ]] && missing+=("PORTAINER_ENDPOINT_ID")

if [[ "${#missing[@]}" -gt 0 ]]; then
  echo "Lỗi: Portainer (manifest): thiếu biến bắt buộc: ${missing[*]}" >&2
  exit 1
fi

export PORTAINER_URL
export PORTAINER_API_TOKEN
DEFAULT_EID="${PORTAINER_ENDPOINT_ID}"

for ((i = 0; i < n; i++)); do
  row="$(jq -c ".targets[$i]" "$MANIFEST")"
  en="$(echo "$row" | jq -r 'if has("enabled") then .enabled else true end')"
  if [[ "$en" != "true" && "$en" != "True" ]]; then
    echo ">>> Bỏ qua target[$i] (enabled=$en)"
    continue
  fi

  suffix="$(echo "$row" | jq -r '.staticBuildSuffix // empty')"
  cname="$(echo "$row" | jq -r '.containerName // empty')"
  if [[ -z "$suffix" ]]; then
    echo "Lỗi: targets[$i]: thiếu staticBuildSuffix" >&2
    exit 1
  fi
  if [[ -z "$cname" ]]; then
    echo "Lỗi: targets[$i]: thiếu containerName" >&2
    exit 1
  fi
  case "$cname" in
    CHANGEME_*|changeme_*)
      echo "Lỗi: targets[$i]: sửa containerName (placeholder $cname) trong $MANIFEST" >&2
      exit 1
      ;;
  esac

  hp="$(echo "$row" | jq -r 'if .hostPort == null or .hostPort == "" then empty else (.hostPort | tostring) end')"
  if [[ -z "$hp" ]]; then
    echo "Lỗi: targets[$i]: thiếu hostPort" >&2
    exit 1
  fi

  df="DockerBuild/StaticBuild.${suffix}.Dockerfile"
  if [[ ! -f "$df" ]]; then
    echo "Lỗi: targets[$i]: không có $df (staticBuildSuffix=$suffix)" >&2
    exit 1
  fi

  eid_override="$(echo "$row" | jq -r '.endpointId // empty')"
  if [[ -n "$eid_override" && "$eid_override" != "null" ]]; then
    export PORTAINER_ENDPOINT_ID="$eid_override"
  else
    export PORTAINER_ENDPOINT_ID="$DEFAULT_EID"
  fi

  export PORTAINER_NEW_IMAGE="${DOCKER_REPO}:${suffix}_cms_v${VERSION}"
  export PORTAINER_CONTAINER_NAME="$cname"
  export PORTAINER_CONTAINER_NETWORK="$(echo "$row" | jq -r '.containerNetwork // "qltn-shared-net"')"
  export PORTAINER_NETWORK_ALIASES="$(echo "$row" | jq -r '.networkAliases // "cms"')"
  export PORTAINER_HOST_PORT="$hp"
  export PORTAINER_CONTAINER_PORT="$(echo "$row" | jq -r '.containerPort // 80 | tostring')"
  export PORTAINER_HOST_IP="$(echo "$row" | jq -r '.hostIp // ""')"
  export PORTAINER_BOOTSTRAP_ENV_JSON="$(echo "$row" | jq -c '.env // []')"
  if echo "$row" | jq -e '.restartPolicy' >/dev/null 2>&1; then
    export PORTAINER_BOOTSTRAP_RESTART_JSON="$(echo "$row" | jq -c '.restartPolicy')"
  else
    unset PORTAINER_BOOTSTRAP_RESTART_JSON
  fi
  unset PORTAINER_CONTAINER_BOOTSTRAP_SPEC

  echo "========================================"
  echo ">>> Portainer [$i] $cname → $PORTAINER_NEW_IMAGE (host :${PORTAINER_HOST_PORT}→${PORTAINER_CONTAINER_PORT})"
  bash scripts/portainer-recreate-container.sh
done

echo ">>> Portainer manifest: hoàn tất $n target(s) đã xét (đã bỏ qua enabled=false)."
