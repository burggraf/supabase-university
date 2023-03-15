if [ -z "$DB" ];
then
  echo "ERROR: DB environment variable not set";
  echo "run this first:";
  echo "export DB=https://postgres:password@db.projectref.supabase.co";
else
  supabase gen types typescript --db-url $DB > ./src/interfaces/schema.ts
fi
