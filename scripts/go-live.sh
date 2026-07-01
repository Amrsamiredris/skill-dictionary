#!/usr/bin/env bash
# Full go-live automation for skilldic.
# Requires: SUPABASE_ACCESS_TOKEN from https://supabase.com/dashboard/account/tokens
#
# Usage:
#   export SUPABASE_ACCESS_TOKEN="sbp_..."
#   ./scripts/go-live.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PROD_URL="${PROD_URL:-https://skill-dictionary-as.vercel.app}"
DB_PASS="${DB_PASS:-$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)}"
PROJECT_NAME="${PROJECT_NAME:-skilldic}"

die() { echo "ERROR: $*" >&2; exit 1; }

[[ -n "${SUPABASE_ACCESS_TOKEN:-}" ]] || die "Set SUPABASE_ACCESS_TOKEN (https://supabase.com/dashboard/account/tokens)"

echo "==> Fetching Supabase organizations..."
ORGS=$(curl -s -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" https://api.supabase.com/v1/organizations)
ORG_ID=$(echo "$ORGS" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); const o=d[0]; if(!o) process.exit(1); console.log(o.id);")
echo "    Using org: $ORG_ID"

echo "==> Creating Supabase project '$PROJECT_NAME'..."
CREATE=$(curl -s -X POST https://api.supabase.com/v1/projects \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"organization_id\":\"$ORG_ID\",\"name\":\"$PROJECT_NAME\",\"region\":\"us-east-1\",\"db_pass\":\"$DB_PASS\"}")
REF=$(echo "$CREATE" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); if(d.ref) console.log(d.ref); else { console.error(JSON.stringify(d)); process.exit(1); }")
echo "    Project ref: $REF"
echo "    DB password (save this): $DB_PASS"

echo "==> Waiting for project to become active..."
for i in $(seq 1 60); do
  STATUS=$(curl -s -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
    "https://api.supabase.com/v1/projects/$REF" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log(d.status||'');")
  if [[ "$STATUS" == "ACTIVE_HEALTHY" ]]; then
    echo "    Active."
    break
  fi
  echo "    Status: $STATUS (attempt $i/60)"
  sleep 10
done

echo "==> Fetching API keys..."
KEYS=$(curl -s -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  "https://api.supabase.com/v1/projects/$REF/api-keys?reveal=true")
SUPABASE_URL="https://${REF}.supabase.co"
ANON_KEY=$(echo "$KEYS" | node -e "
const d=JSON.parse(require('fs').readFileSync(0,'utf8'));
const k=d.find(x=>x.name==='anon'||x.type==='publishable');
if(k) console.log(k.api_key||k.key);
else process.exit(1);
")
SERVICE_KEY=$(echo "$KEYS" | node -e "
const d=JSON.parse(require('fs').readFileSync(0,'utf8'));
const k=d.find(x=>x.name==='service_role'||x.type==='secret');
if(k) console.log(k.api_key||k.key);
else process.exit(1);
")

echo "==> Writing .env.local..."
cat > .env.local <<EOF
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_KEY
ADMIN_EMAIL=amrsamiredris@gmail.com
SUPABASE_DB_URL=postgresql://postgres.${REF}:${DB_PASS}@aws-0-us-east-1.pooler.supabase.com:6543/postgres
EOF

echo "==> Running migrations..."
node scripts/apply-migrations.mjs

echo "==> Configure Auth redirect URLs in Supabase dashboard:"
echo "    Site URL: $PROD_URL"
echo "    Redirect URLs:"
echo "      http://localhost:3000/auth/callback"
echo "      http://localhost:3000/**"
echo "      $PROD_URL/auth/callback"
echo "      $PROD_URL/**"

echo "==> Setting Vercel env vars..."
for env in production preview development; do
  printf '%s' "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL "$env" --force 2>/dev/null || \
    printf '%s' "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL "$env"
  printf '%s' "$ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY "$env" --force 2>/dev/null || \
    printf '%s' "$ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY "$env"
  printf '%s' "$SERVICE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY "$env" --force 2>/dev/null || \
    printf '%s' "$SERVICE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY "$env"
  printf '%s' "amrsamiredris@gmail.com" | vercel env add ADMIN_EMAIL "$env" --force 2>/dev/null || \
    printf '%s' "amrsamiredris@gmail.com" | vercel env add ADMIN_EMAIL "$env"
done

echo "==> Redeploying Vercel..."
vercel --prod --yes

echo ""
echo "DONE. Production: $PROD_URL"
echo "Admin stats: $PROD_URL/admin/stats (sign in as amrsamiredris@gmail.com)"
echo "Manually set Supabase Auth redirect URLs (see above) if magic links fail."
