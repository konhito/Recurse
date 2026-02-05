import { Pool } from 'pg';

// NEON DATABASE CONNECTION
// NOTE: This file is server-side only. Do not import into client components.
const connectionString = 'postgresql://neondb_owner:npg_2IohOpNYad9B@ep-snowy-sunset-a1osfb3k-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
    connectionString,
});

export default pool;
