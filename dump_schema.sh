pg_dump \
  --clean \
  --if-exists \
  --quote-all-identifiers \
  --exclude-table-data 'storage.objects' \
  --exclude-schema 'extensions|graphql|graphql_public|net|pgbouncer|pgsodium|pgsodium_masks|realtime|supabase_functions|pg_toast|pg_catalog|information_schema' \
  --schema '*' \
  -s \
  --dbname "$DB_URL" \
> data/schema.sql
