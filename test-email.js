#!/usr/bin/env node

/**
 * Test script for email reminder
 * Usage: node test-email.js
 */

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';

async function testEmail() {
    console.log('🧪 Testing email reminder...\n');

    try {
        console.log(`📡 Sending request to: ${SERVER_URL}/api/send-reminder`);

        const response = await fetch(`${SERVER_URL}/api/send-reminder`);
        const data = await response.json();

        console.log('\n📬 Response:');
        console.log(JSON.stringify(data, null, 2));

        if (response.ok) {
            if (data.message) {
                console.log('\n✅ Success:', data.message);
            } else if (data.success) {
                console.log('\n✅ Email sent successfully!');
                console.log(`📧 Email ID: ${data.emailId}`);
                console.log(`📊 Pending problems: ${data.pendingCount}`);
            }
        } else {
            console.log('\n❌ Error:', data.error);
            if (data.details) {
                console.log('Details:', data.details);
            }
        }

    } catch (error) {
        console.error('\n❌ Failed to send request:', error.message);
        console.error('\nMake sure:');
        console.error('1. Dev server is running (npm run dev)');
        console.error('2. .env.local has RESEND_API_KEY and USER_EMAIL');
        console.error('3. You have pending problems in your queue');
    }
}

// Run the test
testEmail();
