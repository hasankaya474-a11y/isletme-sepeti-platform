# Persistence Contract v1
Production persistence must provide transactional execution, parameterized statements, migrations, unique/foreign-key constraints, indexes, backup/restore capability and least-privilege credentials.

Domain services must not depend directly on a cloud vendor. A persistence adapter implements exec, run, all and transaction. Migration history is append-only through schema_migrations.

MemoryStore remains test/development-only and is forbidden as production persistence.
