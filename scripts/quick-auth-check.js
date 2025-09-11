#!/usr/bin/env node

const { execSync } = require('child_process')

console.log('🔐 Quick Authentication Check')
console.log('============================')

// Test 1: Check if server is running
console.log('\n1. Checking if server is running...')
try {
    const response = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000', { encoding: 'utf8' })
    if (response.trim() === '200') {
        console.log('✅ Server is running on port 3000')
    } else {
        console.log('❌ Server returned status:', response.trim())
    }
} catch (error) {
    console.log('❌ Server is not running or not accessible')
}

// Test 2: Check authentication components exist
console.log('\n2. Checking authentication components...')
try {
    const authModalExists = execSync('find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "AuthModal\|SignIn\|SignUp" | head -5', { encoding: 'utf8' })
    if (authModalExists.trim()) {
        console.log('✅ Authentication components found:')
        console.log(authModalExists.trim().split('\n').map(f => `   - ${f}`).join('\n'))
    } else {
        console.log('⚠️  No authentication components found')
    }
} catch (error) {
    console.log('⚠️  Could not check authentication components')
}

// Test 3: Check Firebase configuration
console.log('\n3. Checking Firebase configuration...')
try {
    const firebaseConfig = execSync('grep -r "firebaseConfig\|projectId" src/lib/firebase/ | head -3', { encoding: 'utf8' })
    if (firebaseConfig.trim()) {
        console.log('✅ Firebase configuration found')
    } else {
        console.log('⚠️  Firebase configuration not found')
    }
} catch (error) {
    console.log('⚠️  Could not check Firebase configuration')
}

// Test 4: Check authentication context
console.log('\n4. Checking authentication context...')
try {
    const authContext = execSync('find src -name "*Auth*" -type f', { encoding: 'utf8' })
    if (authContext.trim()) {
        console.log('✅ Authentication context files found:')
        console.log(authContext.trim().split('\n').map(f => `   - ${f}`).join('\n'))
    } else {
        console.log('⚠️  No authentication context files found')
    }
} catch (error) {
    console.log('⚠️  Could not check authentication context')
}

// Test 5: Check for Google Auth setup
console.log('\n5. Checking Google Authentication setup...')
try {
    const googleAuth = execSync('grep -r "GoogleAuthProvider\|signInWithPopup" src/ | head -3', { encoding: 'utf8' })
    if (googleAuth.trim()) {
        console.log('✅ Google Authentication setup found')
    } else {
        console.log('⚠️  Google Authentication setup not found')
    }
} catch (error) {
    console.log('⚠️  Could not check Google Authentication setup')
}

// Test 6: Check for email/password auth
console.log('\n6. Checking Email/Password Authentication...')
try {
    const emailAuth = execSync('grep -r "createUserWithEmailAndPassword\|signInWithEmailAndPassword" src/ | head -3', { encoding: 'utf8' })
    if (emailAuth.trim()) {
        console.log('✅ Email/Password Authentication setup found')
    } else {
        console.log('⚠️  Email/Password Authentication setup not found')
    }
} catch (error) {
    console.log('⚠️  Could not check Email/Password Authentication setup')
}

console.log('\n🎯 Quick Authentication Summary:')
console.log('================================')
console.log('✅ Server Status: Check above')
console.log('✅ Components: Check above')
console.log('✅ Firebase: Check above')
console.log('✅ Context: Check above')
console.log('✅ Google Auth: Check above')
console.log('✅ Email Auth: Check above')

console.log('\n📋 Next Steps:')
console.log('1. Open http://localhost:3000 in your browser')
console.log('2. Look for Sign In/Sign Up buttons')
console.log('3. Try clicking them to test the authentication modal')
console.log('4. Check browser console for any errors')
console.log('5. Test both Google and email/password authentication')

console.log('\n🚀 Quick test completed in seconds!')
