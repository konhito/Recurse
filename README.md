# Spaced Revision

> Master coding problems through spaced repetition — for LeetCode, TakeUForward, GeeksforGeeks, NeetCode, and more

<div align="center">
  <img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjltYWNtYWxqemE0OHRsZXM5c2p2andyYXMyOXF2d203cnB1NTNxNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fhAwk4DnqNgw8/giphy.gif" alt="Spaced Revision" width="600">
</div>

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql)](https://neon.tech/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

## ✨ Features

### Core
- 📅 **Daily Focus** — Smart scheduling with day-wise revision tracking
- 📚 **Problem Library** — Excel-style table with sorting, search, and filtering
- 📊 **Progress Heatmap** — GitHub-style activity visualization
- 🔄 **Platform Agnostic** — Works with LeetCode, TakeUForward, GeeksforGeeks, NeetCode, etc.
- 🎨 **Minimal UI** — Clean, distraction-free interface with smooth animations

### Smart Features
- ⏰ **Email Reminders** — Daily "phadle ladle 💀" emails at 8 PM if you have pending revisions
- 🚫 **No Page Reloads** — Smooth state updates without jarring refreshes
- 📱 **Mobile Responsive** — Works great on all devices
- 🌙 **Day-Wise Scheduling** — All revisions at midnight (no hour confusion)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your database URL and email settings

# Run development server
npm run dev
```

Open [recurse.konhito.me](https://recurse.konhito.me)

## 📧 Email Reminders Setup

Get daily reminders at 8 PM if you have pending problems:

### 1. Sign up for Resend (Free)
- Go to https://resend.com/signup
- Get your API key

### 2. Configure `.env.local`
```bash
RESEND_API_KEY=re_your_api_key_here
USER_EMAIL=your-email@gmail.com
```

### 3. Set up Cron Job (8 PM daily)

**Option A: Vercel Cron** (Easiest)
```json
// vercel.json
{
  "crons": [{
    "path": "/api/send-reminder",
    "schedule": "0 20 * * *"
  }]
}
```

**Option B: GitHub Actions**
```yaml
# .github/workflows/daily-reminder.yml
name: Daily Reminder
on:
  schedule:
    - cron: '30 14 * * *'  # 8 PM IST
jobs:
  send-reminder:
    runs-on: ubuntu-latest
    steps:
      - run: curl https://your-app.vercel.app/api/send-reminder
```

See `.agent/EMAIL_REMINDER_SETUP.md` for more options.

### Email Preview
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

## 🏗️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL (Neon)
- **Styling:** TailwindCSS 4
- **Language:** TypeScript
- **Email:** Resend
- **Date Handling:** date-fns

## 📁 Project Structure

```
spacedrevision/
├── app/
│   ├── api/send-reminder/    # Email reminder endpoint
│   ├── actions.ts             # Server actions (DB operations)
│   ├── page.tsx               # Main app page
│   └── globals.css            # Global styles + animations
├── components/
│   ├── DailyFocus.tsx         # Today's due problems
│   ├── ProblemLibrary.tsx     # Excel-style problem table
│   ├── ProgressHeatmap.tsx    # Activity visualization
│   ├── ProblemsTable.tsx      # All problems overview
│   └── AddProblem.tsx         # Add new problem modal
├── lib/
│   ├── scheduler.ts           # Spaced repetition logic
│   ├── storage.ts             # State management
│   ├── db.ts                  # Database connection
│   └── types.ts               # TypeScript types
└── .agent/                    # Documentation
    ├── HONEST_SUMMARY.md      # What actually changed
    ├── EMAIL_REMINDER_SETUP.md # Email setup guide
    └── TESTING_PLAN.md        # Testing scenarios
```

## 🎯 How It Works

### Spaced Repetition Schedule
When you add a problem, it creates 5 revisions:
1. **Next Day** — Initial retention check
2. **Next Sunday** — Weekly consolidation
3. **Following Sunday** — Reinforcement
4. **End of Month** — Monthly retention
5. **Next Month End** — Long-term memory

All scheduled at **midnight** for clear day boundaries.

### Day-Wise Tracking
- Problems added at any time → scheduled for next day at 00:00
- Completions recorded at 00:00 of current day
- No hour-based confusion (11 PM completion ≠ 11 PM next day)

## 🧪 Testing

```bash
# Type check
npx tsc --noEmit

# Run dev server
npm run dev

# Test email reminder
curl http://localhost:3000/api/send-reminder
```

See `.agent/TESTING_PLAN.md` for detailed test scenarios.

## 🔧 Configuration

### Environment Variables
```bash
# Database
POSTGRES_URL=postgresql://...

# Email (optional)
RESEND_API_KEY=re_...
USER_EMAIL=your-email@gmail.com
```

### Customization
- **Email time**: Edit cron schedule (`0 20 * * *` = 8 PM)
- **Email content**: Edit `app/api/send-reminder/route.ts`
- **Revision schedule**: Edit `lib/scheduler.ts`

## 📝 Recent Updates

### v1.1 (Feb 2026)
- ✅ Day-wise scheduling (no hour confusion)
- ✅ No page reload on sync
- ✅ Toast notifications for feedback
- ✅ "Next Due" column in progress view
- ✅ Better skeleton loader
- ✅ Email reminders with GenZ slang

## 🤝 Contributing

This is a personal tool, but feel free to fork and customize for your needs!

## 📄 License

MIT

---

**Made with ☕ by [konhito](https://github.com/konhito)**

*Stop procrastinating and lock in* 🔥
