# Owner CMS Setup

1. Create a Supabase project.
2. Open the SQL Editor and run `schema.sql`.
3. In Authentication, create the owner's email/password account.
4. In the SQL Editor, grant that account the private owner role:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"owner"}'::jsonb
where email = 'OWNER_EMAIL_HERE';
```

5. Copy `.env.example` to `.env.local`.
6. Add the project URL, anonymous key and owner email.
7. Restart the Vite development server or redeploy the site.

Public visitors can insert enquiries. Only an authenticated account carrying the
`owner` role can read or update lead records.
