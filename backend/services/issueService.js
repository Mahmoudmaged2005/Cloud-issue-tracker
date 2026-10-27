const { randomUUID } = require('crypto');
const { neon } = require('@neondatabase/serverless');

function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured.');
  }

  return neon(process.env.DATABASE_URL);
}

function toIssue(row) {
  return {
    id: String(row.id),
    title: row.title,
    description: row.description,
    priority: row.priority,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString()
  };
}

async function readIssues() {
  const sql = getSql();
  const rows = await sql`
    SELECT id, title, description, priority, status, created_at
    FROM issues
    ORDER BY created_at DESC
  `;

  return rows.map(toIssue);
}

async function createIssue(input) {
  const sql = getSql();
  const [row] = await sql`
    INSERT INTO issues (id, title, description, priority, status)
    VALUES (
      ${randomUUID()},
      ${input.title.trim()},
      ${input.description.trim()},
      ${input.priority},
      'Open'
    )
    RETURNING id, title, description, priority, status, created_at
  `;

  return toIssue(row);
}

async function updateIssueStatus(id, status) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return null;
  }

  const sql = getSql();
  const [row] = await sql`
    UPDATE issues
    SET status = ${status}
    WHERE id = ${id}
    RETURNING id, title, description, priority, status, created_at
  `;

  return row ? toIssue(row) : null;
}

module.exports = {
  readIssues,
  createIssue,
  updateIssueStatus
};
    