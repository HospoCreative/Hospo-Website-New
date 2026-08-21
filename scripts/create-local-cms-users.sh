#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${LOCAL_CMS_PASSWORD:-}" ]]; then
  echo "Set LOCAL_CMS_PASSWORD before creating local CMS users."
  exit 1
fi

docker_bin="${DOCKER_BIN:-docker}"
supabase_cmd=(npx --yes supabase@latest)
status_env="$("${supabase_cmd[@]}" status -o env)"
api_url="$(printf '%s\n' "$status_env" | sed -n 's/^API_URL="\(.*\)"$/\1/p')"
anon_key="$(printf '%s\n' "$status_env" | sed -n 's/^ANON_KEY="\(.*\)"$/\1/p')"
db_container="$($docker_bin ps --format '{{.Names}}' | grep '^supabase_db_' | head -n 1)"

if [[ -z "$api_url" || -z "$anon_key" || -z "$db_container" ]]; then
  echo "Local Supabase is not running. Start it with npx supabase@latest start."
  exit 1
fi

create_user() {
  local email="$1"
  local full_name="$2"
  local role="$3"
  local user_id

  curl -sS -X POST "$api_url/auth/v1/signup" \
    -H "apikey: $anon_key" \
    -H "Content-Type: application/json" \
    --data "{\"email\":\"$email\",\"password\":\"$LOCAL_CMS_PASSWORD\"}" >/dev/null

  user_id="$($docker_bin exec "$db_container" psql -U postgres -d postgres -Atc "select id from auth.users where email = '$email' limit 1")"
  if [[ -z "$user_id" ]]; then
    echo "Could not create $email."
    exit 1
  fi

  $docker_bin exec "$db_container" psql -U postgres -d postgres -v ON_ERROR_STOP=1 -c \
    "insert into public.profiles (id,email,full_name,role) values ('$user_id','$email','$full_name','$role') on conflict (id) do update set full_name=excluded.full_name, role=excluded.role;" >/dev/null
}

create_user "admin@hospo.local" "Local CMS Admin" "admin"
create_user "editor@hospo.local" "Local CMS Editor" "editor"
echo "Local admin and editor profiles are ready."
