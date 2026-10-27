# Run and deploy the API

The API keeps the existing lab routes and validation. Issue data is stored in
Neon Postgres instead of the local JSON file.

## 1. Prepare the Neon table

In the Neon Console, choose the `production` branch and open **SQL Editor**.
Run the SQL in [`schema.sql`](./schema.sql). It creates the `issues` table if
needed and adds `created_at` to an existing table without deleting its rows.

## 2. Run both parts locally

In PowerShell, from this folder, copy `.env.example` to `.env`:

```powershell
Copy-Item .env.example .env
```

In `.env`, replace the example `DATABASE_URL` with the pooled connection string
from Neon’s **Connect** dialog. Keep `.env` private; it is ignored by Git. Never
put this database URL in the frontend or share it in a screenshot.

Open a terminal in `backend` and run:

```powershell
npm install
npm start
```

In a second terminal, open `frontend` and run:

```powershell
npm install
npm start
```

Open `http://localhost:8080`. The browser calls the API at
`http://localhost:3000`.

## 3. Deploy the API to Vercel

Create a separate Vercel project for the API, using the GitHub repository that
contains both `backend` and `frontend`. Set its **Root Directory** to
`backend`. Vercel detects the Express app in `server.js`.

In the Vercel project’s **Settings → Environment Variables**, add:

- `DATABASE_URL`: the pooled Neon connection string. Keep this secret.
- `FRONTEND_ORIGINS`: the exact Cloudflare Pages site origin, for example
  `https://your-site.pages.dev` (no path and no trailing slash).

Set the project’s Node.js version to 22.x or later, then deploy. If the
Cloudflare address is not ready yet, deploy the API first and update
`FRONTEND_ORIGINS` after creating the Pages site; then redeploy the API.

The API should return JSON at
`https://your-api-project.vercel.app/api/issues`.

## 4. Deploy the static frontend to Cloudflare Pages

The screenshot’s `npx wrangler deploy` command is for a Worker. This project’s
frontend is plain HTML, CSS, and JavaScript, so create a **Pages** project from
the same GitHub repository instead. Confirm that the selected repository
contains the `frontend` folder.

Use these Pages settings:

- **Root directory:** `frontend` (relative path, without a leading slash)
- **Build command:** leave blank
- **Build output directory:** `.`

If Cloudflare says the root directory cannot be found, first check that the
project is connected to the repository containing this folder. This workspace
uses `Mahmoudmaged2005/Cloud-issue-tracker`.

## 5. Point the frontend to the deployed API

After Vercel gives you the API project URL, edit
[`../frontend/Js/config.js`](../frontend/Js/config.js). Set `apiBaseUrl` to the
API origin, such as `https://your-api-project.vercel.app` (do not add
`/api/issues`). This URL is public; do not put the database connection string
here. Commit and push the change so Cloudflare rebuilds the frontend.

Finally, set Vercel’s `FRONTEND_ORIGINS` to the exact Pages website origin and
redeploy the API. This lets the browser call the API without exposing the
database to the browser.