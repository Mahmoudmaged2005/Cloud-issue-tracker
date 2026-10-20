| Test ID | Request | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|
| T01 | GET /api/issues | 200; JSON array returned. | 200 OK; JSON array returned. | Pass |
| T02 | POST /api/issues with valid title, description and priority | 201; complete issue returned with server-generated id and status Open. | 201 Created; complete issue returned with generated id and status Open. | Pass |
| T03 | PATCH /api/issues/{id}/status with status Resolved | 200; updated issue returned with status Resolved. | 200 OK; updated issue returned with status Resolved; confirmed in data/issues.json. | Pass |
| T04 | POST /api/issues with invalid priority | 400; VALIDATION_ERROR returned. | 400 Bad Request; VALIDATION_ERROR returned. | Pass |
| T05 | PATCH /api/issues/does-not-exist/status with status Resolved | 404; ISSUE_NOT_FOUND returned. | 404 Not Found; ISSUE_NOT_FOUND returned. | Pass |