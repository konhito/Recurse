import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { fetchProblems } from '@/app/actions';
import { getNextRevision, getRevisionStatus } from '@/lib/scheduler';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
    try {
        // Get all problems
        const problems = await fetchProblems();

        // Find problems that are due or overdue
        const pendingProblems = problems
            .map(p => {
                const nextRev = getNextRevision(p);
                if (!nextRev) return null;
                const status = getRevisionStatus(nextRev);
                if (status === 'due' || status === 'overdue') {
                    return {
                        title: p.title,
                        revisionNumber: nextRev.number,
                        status
                    };
                }
                return null;
            })
            .filter(Boolean);

        // If no pending problems, send motivational quote instead
        if (pendingProblems.length === 0) {
            // Fetch real motivational quote from API
            let quote = "you're crushing it! 🔥 all caught up, keep going!";
            let author = "your revision app";

            try {
                const quoteResponse = await fetch('https://zenquotes.io/api/random');
                const quoteData = await quoteResponse.json();
                if (quoteData && quoteData[0]) {
                    quote = quoteData[0].q;
                    author = quoteData[0].a;
                }
            } catch (error) {
                console.log('Failed to fetch quote, using fallback');
            }

            const motivationHtml = `
                <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #10b981; margin-bottom: 20px;">✨ all caught up! ✨</h2>
                    
                    <p style="color: #555; line-height: 1.6;">yo,</p>
                    
                    <p style="color: #555; line-height: 1.6;">
                        you finished everything for today! here's some motivation to keep the streak going:
                    </p>
                    
                    <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 4px;">
                        <p style="color: #333; font-size: 18px; font-style: italic; margin: 0; line-height: 1.6;">
                            "${quote}"
                        </p>
                        <p style="color: #666; font-size: 14px; margin-top: 10px; text-align: right;">
                            — ${author}
                        </p>
                    </div>
                    
                    <p style="color: #555; line-height: 1.6;">
                        keep this energy tomorrow too 🔥
                    </p>
                    
                    <p style="color: #888; font-size: 14px; margin-top: 30px;">
                        - your revision app (proud of you fr)
                    </p>
                </div>
            `;

            const motivationText = `
✨ all caught up! ✨

yo,

you finished everything for today! here's some motivation to keep the streak going:

"${quote}"
— ${author}

keep this energy tomorrow too 🔥

- your revision app (proud of you fr)
            `.trim();

            const { data, error } = await resend.emails.send({
                from: 'Spaced Revision <onboarding@resend.dev>',
                to: [process.env.USER_EMAIL || 'your-email@example.com'],
                subject: '✨ all caught up bestie',
                html: motivationHtml,
                text: motivationText,
            });

            if (error) {
                console.error('Resend error:', error);
                return NextResponse.json(
                    { error: 'Failed to send email', details: error },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                type: 'motivation',
                message: 'Sent motivational email - all caught up!',
                emailId: data?.id,
                quote: quote
            });
        }

        // Build email content
        const problemList = pendingProblems
            .map(p => `• ${p!.title} (Rev #${p!.revisionNumber})${p!.status === 'overdue' ? ' - this one\'s been waiting fr fr' : ''}`)
            .join('\n');

        const emailHtml = `
            <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333; margin-bottom: 20px;">phadle ladle 💀</h2>
                
                <p style="color: #555; line-height: 1.6;">yo,</p>
                
                <p style="color: #555; line-height: 1.6;">
                    you got ${pendingProblems.length} problem${pendingProblems.length > 1 ? 's' : ''} rotting in your queue rn:
                </p>
                
                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <pre style="margin: 0; font-family: monospace; color: #333; white-space: pre-wrap;">${problemList}</pre>
                </div>
                
                <p style="color: #555; line-height: 1.6;">
                    stop procrastinating and lock in before midnight or you're cooked 🔥
                </p>
                
                <p style="color: #888; font-size: 14px; margin-top: 30px;">
                    - your revision app (not mad, just disappointed)
                </p>
            </div>
        `;

        const emailText = `
phadle ladle 💀

yo,

you got ${pendingProblems.length} problem${pendingProblems.length > 1 ? 's' : ''} rotting in your queue rn:

${problemList}

stop procrastinating and lock in before midnight or you're cooked 🔥

- your revision app (not mad, just disappointed)
        `.trim();

        // Send email
        const { data, error } = await resend.emails.send({
            from: 'Spaced Revision <onboarding@resend.dev>', // Change this to your verified domain
            to: [process.env.USER_EMAIL || 'your-email@example.com'],
            subject: 'phadle ladle 💀',
            html: emailHtml,
            text: emailText,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json(
                { error: 'Failed to send email', details: error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            emailId: data?.id,
            pendingCount: pendingProblems.length
        });

    } catch (error) {
        console.error('Error sending reminder email:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
}
