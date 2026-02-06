# Email Reminder Setup

## What It Does
Sends you a "phadle ladle 💀" email at 8 PM if you have pending revisions.

## Setup Steps

### 1. Get Resend API Key (Free)
1. Go to https://resend.com/signup
2. Sign up (free tier = 100 emails/day, more than enough)
3. Verify your email
4. Go to API Keys → Create API Key
5. Copy the key (starts with `re_`)

### 2. Add Environment Variables
Create/update `.env.local` in the project root:

```bash
# Resend API Key
RESEND_API_KEY=re_your_api_key_here

# Your email address
USER_EMAIL=your-email@gmail.com
```

### 3. Set Up Cron Job (8 PM Daily)

#### Option A: Vercel Cron (Easiest if deployed on Vercel)
Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/send-reminder",
    "schedule": "0 20 * * *"
  }]
}
```

#### Option B: GitHub Actions (Free, works anywhere)
Create `.github/workflows/daily-reminder.yml`:
```yaml
name: Daily Reminder
on:
  schedule:
    - cron: '30 14 * * *'  # 8 PM IST = 2:30 PM UTC
  workflow_dispatch:  # Manual trigger

jobs:
  send-reminder:
    runs-on: ubuntu-latest
    steps:
      - name: Send Reminder
        run: |
          curl -X GET https://your-app.vercel.app/api/send-reminder
```

#### Option C: Local Cron (If self-hosting)
Add to crontab (`crontab -e`):
```bash
0 20 * * * curl http://localhost:3000/api/send-reminder
```

#### Option D: EasyCron (Free web service)
1. Go to https://www.easycron.com/
2. Create free account
3. Add cron job:
   - URL: `https://your-app.vercel.app/api/send-reminder`
   - Time: `0 20 * * *` (8 PM daily)

### 4. Test It
```bash
# Manual test (while dev server is running)
curl http://localhost:3000/api/send-reminder

# Or visit in browser
http://localhost:3000/api/send-reminder
```

You should get an email if you have pending problems!

## Email Preview

```
Subject: phadle ladle 💀

yo,

you got 3 problems rotting in your queue rn:
• Two Sum (Rev #2) - this one's been waiting fr fr
• Valid Parentheses (Rev #1)
• Merge Intervals (Rev #3)

stop procrastinating and lock in before midnight or you're cooked 🔥

- your revision app (not mad, just disappointed)
```

## Customization

### Change Email Time
Edit the cron schedule:
- `0 20 * * *` = 8 PM
- `0 21 * * *` = 9 PM
- `30 19 * * *` = 7:30 PM

### Change Email Content
Edit `app/api/send-reminder/route.ts`

### Add More Conditions
Only send on weekdays:
```typescript
const today = new Date().getDay();
if (today === 0 || today === 6) {
    return NextResponse.json({ message: 'Weekend, no reminder' });
}
```

## Troubleshooting

### Email not sending?
1. Check `.env.local` has correct API key
2. Check Resend dashboard for errors
3. Verify email address is correct
4. Check spam folder

### Cron not running?
1. Verify cron syntax
2. Check timezone (IST vs UTC)
3. Test manually first

### Want to disable?
Just remove the cron job or comment it out.

## Cost
- **Resend**: Free (100 emails/day)
- **Vercel Cron**: Free
- **GitHub Actions**: Free
- **Total**: $0/month

## Notes
- Only sends if you have pending problems
- Won't spam you on days you're caught up
- Casual tone to keep it fun, not stressful
- Works with all platforms (LeetCode, TUF, GFG, NeetCode, etc.)
