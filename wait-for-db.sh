set -e

host="$1"
shift
until mysql -h "$host" -u"$DB_USERNAME" -p"$DB_PASSWORD" -e "use $DB_NAME"; do
  >&2 echo "Database is unavailable - sleeping"
  sleep 2
done

exec "$@"