# "phadle ladle" Email Reminder 💀

## What I Built
Daily email reminder at 8 PM if you have pending revisions.

## Files Created
1. **`app/api/send-reminder/route.ts`** - API endpoint to send emails
2. **`.env.local.example`** - Template for environment variables
3. **`.agent/EMAIL_REMINDER_SETUP.md`** - Full setup guide

## Quick Setup (5 minutes)

### 1. Get Resend API Key
- Go to https://resend.com/signup
- Sign up (free)
- Get API key

### 2. Add to `.env.local`
```bash
RESEND_API_KEY=re_your_key_here
USER_EMAIL=your-email@gmail.com
```

### 3. Test It
```bash
# Visit in browser or curl
http://localhost:3000/api/send-reminder
```

### 4. Set Up 8 PM Cron
**Easiest**: Use Vercel Cron (if deployed on Vercel)
```json
// vercel.json
{
  "crons": [{
    "path": "/api/send-reminder",
    "schedule": "0 20 * * *"
  }]
}
```

**Or**: GitHub Actions, EasyCron, or local cron (see setup guide)

## Email Example
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

## Smart Features
- ✅ Only sends if you have pending problems
- ✅ Shows overdue problems with extra sass
- ✅ Works with all platforms (LeetCode, TUF, GFG, NeetCode)
- ✅ Casual tone (not annoying)
- ✅ Free (100 emails/day on Resend)

## Cost
**$0/month** (Resend free tier)

## Next Steps
1. Sign up for Resend
2. Add API key to `.env.local`
3. Test the endpoint
4. Set up cron job for 8 PM

See **EMAIL_REMINDER_SETUP.md** for detailed instructions.
