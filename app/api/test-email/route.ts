import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
    try {
        console.log('Testing email with:');
        console.log('- API Key:', process.env.RESEND_API_KEY ? 'Set ✓' : 'Missing ✗');
        console.log('- To Email:', process.env.USER_EMAIL);

        const { data, error } = await resend.emails.send({
            from: 'Spaced Revision <onboarding@resend.dev>',
            to: [process.env.USER_EMAIL || 'your-email@example.com'],
            subject: '🧪 Test - phadle ladle 💀',
            html: '<p>Test email works! 🎉</p>',
        });

        if (error) {
            console.error('❌ Resend error:', error);
            return NextResponse.json({
                success: false,
                error: error.message || 'Unknown error',
                details: error,
                apiKeySet: !!process.env.RESEND_API_KEY,
                emailTo: process.env.USER_EMAIL
            }, { status: 500 });
        }

        console.log('✅ Email sent successfully!', data);

        return NextResponse.json({
            success: true,
            message: 'Email sent! Check your inbox at ' + process.env.USER_EMAIL,
            emailId: data?.id,
            sentTo: process.env.USER_EMAIL
        });

    } catch (error: any) {
        console.error('❌ Caught error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
