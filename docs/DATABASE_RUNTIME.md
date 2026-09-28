# Database Runtime
Status: FOUNDATION IMPLEMENTED

Local/development migration execution uses Node's SQLite adapter when available. The migration runner records versions in schema_migrations and executes each migration transactionally.

Production remains provider-adapted. Selecting a hosted database does not change domain contracts. Production requires backup/restore testing, least-privilege credentials, encryption controls, monitoring and a reviewed migration procedure.

Run locally with DB_FILE set to the desired development database path. Production execution is locked.
