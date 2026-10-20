import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
config({ path: ".env.local" });
const sql = neon(process.env.DATABASE_URL);
const rows = await sql`
  select u.email, count(pa.id)::int as assessment_count
  from users u
  left join performance_assessments pa on pa.user_id = u.id
  where u.email like 'release-%@example.test'
  group by u.email, u.created_at
  order by u.created_at desc
  limit 2
`;
console.log(JSON.stringify(rows));
