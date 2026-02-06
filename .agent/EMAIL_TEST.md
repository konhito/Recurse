# Email Test Script

## Quick Test

```bash
npm run test:email
```

## What It Does
- Calls the `/api/send-reminder` endpoint
- Shows the response (success or error)
- Displays email ID and pending count if successful

## Example Output

### Success (with pending problems):
```
🧪 Testing email reminder...

📡 Sending request to: http://localhost:3000/api/send-reminder

📬 Response:
{
  "success": true,
  "emailId": "abc123...",
  "pendingCount": 3
}

✅ Email sent successfully!
📧 Email ID: abc123...
📊 Pending problems: 3
```

### Success (no pending problems):
```
🧪 Testing email reminder...

📡 Sending request to: http://localhost:3000/api/send-reminder

📬 Response:
{
  "message": "No pending problems, no email sent"
}

✅ Success: No pending problems, no email sent
```

### Error:
```
🧪 Testing email reminder...

📡 Sending request to: http://localhost:3000/api/send-reminder

📬 Response:
{
  "error": "Failed to send email",
  "details": { ... }
}

❌ Error: Failed to send email
```

## Requirements
1. Dev server running (`npm run dev`)
2. `.env.local` configured with:
   - `RESEND_API_KEY`
   - `USER_EMAIL`
3. At least one pending problem (optional - script works either way)

## Test on Production
```bash
SERVER_URL=https://recurse.konhito.me npm run test:email
```

## Manual Test (Browser)
Just visit: http://localhost:3000/api/send-reminder

Or on production: https://recurse.konhito.me/api/send-reminder
