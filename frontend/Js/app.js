const issueForm = document.querySelector('#issue-form');
const titleInput = document.querySelector('#title');
const descriptionInput = document.querySelector('#description');
const priorityInput = document.querySelector('#priority');
const issuesList = document.querySelector('#issues-list');
const issueCount = document.querySelector('#issue-count');
const formMessage = document.querySelector('#form-message');
const apiUrl = `${window.APP_CONFIG.apiBaseUrl.replace(/\/$/, '')}/api/issues`;
let issues = [];

function renderIssues() {
  issuesList.replaceChildren();
  issueCount.textContent = issues.length;

  issues.forEach((issue) => {
    const card = document.createElement('article');
    card.className = 'issue-card';

    const heading = document.createElement('h3');
    heading.textContent = issue.title;

    const description = document.createElement('p');
    description.textContent = issue.description;

    const meta = document.createElement('p');
    meta.textContent = `Priority: ${issue.priority} | Status: ${issue.status}`;

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = issue.status === 'Open' ? 'Mark Resolved' : 'Reopen';
    button.addEventListener('click', () => toggleIssueStatus(issue.id));

    card.append(heading, description, meta, button);
    issuesList.append(card);
  });
}

async function getErrorMessage(response) {
  const body = await response.json().catch(() => null);
  return body?.error?.message || `Request failed (${response.status}).`;
}

async function loadIssues() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    issues = await response.json();
    renderIssues();
  } catch (error) {
    formMessage.textContent = `Could not load issues: ${error.message}`;
  }
}

issueForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  formMessage.textContent = '';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        priority: priorityInput.value
      })
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    issues.unshift(await response.json());
    issueForm.reset();
    priorityInput.value = 'Medium';
    formMessage.textContent = 'Issue added.';
    renderIssues();
  } catch (error) {
    formMessage.textContent = `Could not add issue: ${error.message}`;
  }
});

async function toggleIssueStatus(issueId) {
  const issue = issues.find((item) => item.id === issueId);
  if (!issue) {
    console.error('Issue not found:', issueId);
    return;
  }

  const status = issue.status === 'Open' ? 'Resolved' : 'Open';
  try {
    const response = await fetch(`${apiUrl}/${encodeURIComponent(issueId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    const updatedIssue = await response.json();
    issues = issues.map((item) => item.id === issueId ? updatedIssue : item);
    renderIssues();
  } catch (error) {
    formMessage.textContent = `Could not update issue: ${error.message}`;
  }
}

loadIssues();
