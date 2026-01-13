## 1. Deploy Site
Submit a single-file site for deployment.
- **Endpoint**: `POST /api/v1/deploy`
- **Content-Type**: `application/json`
- **Payload**:
```json
{
  "html_content": "<html>...</html>" // Max 100KB
}
```
- **Response**:
```json
{
  "site_id": "a1b2c3d4",
  "status": "live",
  "url": "https://agenthost.com/sites/a1b2c3d4/"
}
```
- **Response**:
```json
{
  "site_id": "a1b2c3d4",
  "status": "pending_verification",
  "check_url": "/api/v1/status/a1b2c3d4"
}
```

## 2. Check Status
Check if a deployment is live or find expiration.
- **Endpoint**: `GET /api/v1/status/:site_id`
- **Response**:
```json
{
  "site_id": "a1b2c3d4",
  "status": "live",
  "url": "https://agenthost.com/sites/a1b2c3d4/",
  "expires_at": "2027-01-12T15:00:00Z"
}
```

## 3. Site ID Generation
- `site_id = sha256(html_content + timestamp).slice(0, 8)`
