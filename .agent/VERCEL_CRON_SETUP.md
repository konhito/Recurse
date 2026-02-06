# Vercel Cron Setup ✅

## What's Configured

The `vercel.json` file is set up to automatically send daily email reminders at **8 PM IST**.

```json
{
  "crons": [{
    "path": "/api/send-reminder",
    "schedule": "30 14 * * *"
  }]
}
```

## Schedule Breakdown

- **`30 14 * * *`** = 2:30 PM UTC = **8:00 PM IST**
- Runs **every day**
- Calls `/api/send-reminder` endpoint

## What Happens at 8 PM

### If you have pending problems:
```
Subject: phadle ladle 💀

yo,

you got 3 problems rotting in your queue rn:
• Two Sum (Rev #2) - this one's been waiting fr fr
• Valid Parentheses (Rev #1)
• Merge Intervals (Rev #3)

stop procrastinating and lock in before midnight or you're cooked 🔥
```

### If all caught up:
```
Subject: ✨ all caught up bestie

yo,

you finished everything for today! here's some motivation:

"Without the rain there would be no rainbow."
— Unknown

keep this energy tomorrow too 🔥
```

## Deployment

1. **Commit and push** (already done)
2. **Vercel will auto-deploy** with cron enabled
3. **Check Vercel dashboard** → Settings → Cron Jobs to verify

## Environment Variables on Vercel

Make sure these are set in Vercel dashboard:
- `RESEND_API_KEY` = `re_J5rM4CD5_FzhUbntK2b3ukSuzbXG1Yi3Q`
- `USER_EMAIL` = `konhito02@gmail.com`
- `POSTGRES_URL` = (your database URL)

## Testing

### Manual test anytime:
```bash
npm run test:email
```

### Or visit:
https://recurse.konhito.me/api/send-reminder

## Monitoring

Check cron execution logs in Vercel:
1. Go to Vercel dashboard
2. Select your project
3. Settings → Cron Jobs
4. View execution history

## Changing the Time

Edit `vercel.json` schedule:
- `0 20 * * *` = 8:00 PM IST (2:30 PM UTC)
- `30 19 * * *` = 7:30 PM IST (2:00 PM UTC)
- `0 21 * * *` = 9:00 PM IST (3:30 PM UTC)

Remember: IST is UTC+5:30, so subtract 5.5 hours for UTC time.

## Status

✅ Configured  
✅ Committed  
✅ Ready to deploy

Next push will activate the cron job!
