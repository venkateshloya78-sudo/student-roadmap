-- Run this as the postgres superuser after PostgreSQL is installed
-- Sets up the studentroadmap database and user for local dev

-- Create the database user
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'studentroadmap') THEN
    CREATE ROLE studentroadmap LOGIN PASSWORD 'localdev123';
  END IF;
END
$$;

-- Create the database
SELECT 'CREATE DATABASE studentroadmap OWNER studentroadmap'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'studentroadmap')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE studentroadmap TO studentroadmap;

-- Connect to the new database and enable extensions
\c studentroadmap

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "citext";

-- pgvector is optional at this stage (requires separate install)
-- CREATE EXTENSION IF NOT EXISTS "vector";

\echo 'Database setup complete. Connection string:'
\echo 'postgresql+asyncpg://studentroadmap:localdev123@localhost:5432/studentroadmap'
