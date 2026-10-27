| Test ID | Request | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|
| T01 | GET /api/issues | 200; JSON array returned. | Pending: rerun with the Neon `DATABASE_URL` configured. | Not run |
| T02 | POST /api/issues with valid title, description and priority | 201; complete issue returned with server-generated id and status Open. | Pending: rerun with the Neon `DATABASE_URL` configured. | Not run |
| T03 | PATCH /api/issues/{id}/status with status Resolved | 200; updated issue returned with status Resolved. | Pending: rerun with the Neon `DATABASE_URL` configured and verify the row in Neon. | Not run |
| T04 | POST /api/issues with invalid priority | 400; VALIDATION_ERROR returned. | Pending: rerun against the deployed API. | Not run |
| T05 | PATCH /api/issues/does-not-exist/status with status Resolved | 404; ISSUE_NOT_FOUND returned. | Pending: rerun against the deployed API. | Not run |