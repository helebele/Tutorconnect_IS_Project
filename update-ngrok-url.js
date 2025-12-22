#!/usr/bin/env node

/**
 * Helper script to update ngrok URL in Vercel
 * Run this whenever your ngrok URL changes
 * 
 * Usage: node update-ngrok-url.js https://your-new-ngrok-url.ngrok-free.app
 */

const https = require('https');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Get ngrok URL from command line argument
const ngrokUrl = process.argv[2];

if (!ngrokUrl) {
    log('\n❌ Error: Please provide your ngrok URL as an argument\n', 'red');
    log('Usage:', 'yellow');
    log('  node update-ngrok-url.js https://your-ngrok-url.ngrok-free.app\n', 'cyan');
    log('Example:', 'yellow');
    log('  node update-ngrok-url.js https://abc123xyz.ngrok-free.app\n', 'cyan');
    process.exit(1);
}

// Validate URL format
if (!ngrokUrl.startsWith('https://') || !ngrokUrl.includes('.ngrok')) {
    log('\n❌ Error: Invalid ngrok URL format\n', 'red');
    log('URL should start with https:// and contain .ngrok', 'yellow');
    log('Example: https://abc123xyz.ngrok-free.app\n', 'cyan');
    process.exit(1);
}

log('\n🔄 Updating ngrok URL in Vercel...\n', 'blue');
log(`New URL: ${ngrokUrl}`, 'cyan');

try {
    // Update environment variable using Vercel CLI
    log('\n📝 Step 1: Updating VITE_BACKEND_URL environment variable...', 'yellow');

    const command = `vercel env rm VITE_BACKEND_URL production -y && vercel env add VITE_BACKEND_URL production`;

    log('\n⚠️  Manual Steps Required:', 'yellow');
    log('1. Go to https://vercel.com/dashboard', 'cyan');
    log('2. Select your TutorConnect project', 'cyan');
    log('3. Go to Settings → Environment Variables', 'cyan');
    log(`4. Edit VITE_BACKEND_URL and set value to: ${ngrokUrl}`, 'cyan');
    log('5. Go to Deployments tab', 'cyan');
    log('6. Click ⋮ on latest deployment → Redeploy', 'cyan');
    log('\n✅ Or use Vercel CLI:', 'green');
    log('   Run: vercel env add VITE_BACKEND_URL', 'cyan');
    log(`   Enter value: ${ngrokUrl}`, 'cyan');
    log('   Select: Production', 'cyan');
    log('   Then run: vercel --prod\n', 'cyan');

    log('📋 Your ngrok URL has been copied to clipboard (if supported)', 'green');

    // Try to copy to clipboard (Windows)
    try {
        execSync(`echo ${ngrokUrl} | clip`, { stdio: 'ignore' });
        log('✓ URL copied to clipboard!', 'green');
    } catch (e) {
        log('⚠️  Could not copy to clipboard automatically', 'yellow');
    }

    log('\n🎉 Done! Remember to redeploy on Vercel.\n', 'green');

} catch (error) {
    log('\n❌ Error occurred:', 'red');
    log(error.message, 'red');
    log('\nPlease update manually in Vercel dashboard.\n', 'yellow');
}
