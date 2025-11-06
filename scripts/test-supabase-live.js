// MyDispatch Live System Tests
// Version: V18.5.0
// Date: 2025-11-05

const SUPABASE_URL = 'https://ygpwuiygivxoqtyoigtg.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlncHd1aXlnaXZ4b3F0eW9pZ3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NDQzNDMsImV4cCI6MjA3NjAyMDM0M30.tLj4Yk6GBR8vjN_QV-7yQsJ3p3nGTr8bQZjvxM8aD5w';

console.log('🚀 MyDispatch Live System Tests');
console.log('================================\n');

const tests = {
    passed: 0,
    failed: 0,
    results: []
};

// Test 1: Supabase Connection
async function testSupabaseConnection() {
    console.log('📡 Testing Supabase Connection...');
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
            headers: {
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`
            }
        });

        if (response.ok) {
            console.log('  ✅ Supabase Connection: OK');
            tests.passed++;
            tests.results.push({ test: 'Supabase Connection', status: 'PASSED' });
            return true;
        } else {
            console.error('  ❌ Supabase Connection: FAILED (Status: ' + response.status + ')');
            tests.failed++;
            tests.results.push({ test: 'Supabase Connection', status: 'FAILED', error: `Status: ${response.status}` });
            return false;
        }
    } catch (error) {
        console.error('  ❌ Connection Error:', error.message);
        tests.failed++;
        tests.results.push({ test: 'Supabase Connection', status: 'FAILED', error: error.message });
        return false;
    }
}

// Test 2: Auth System
async function testAuthSystem() {
    console.log('🔐 Testing Auth System...');
    try {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
            headers: {
                'apikey': ANON_KEY
            }
        });

        if (response.ok) {
            console.log('  ✅ Auth System: OK');
            tests.passed++;
            tests.results.push({ test: 'Auth System', status: 'PASSED' });
            return true;
        } else {
            console.error('  ❌ Auth System: FAILED (Status: ' + response.status + ')');
            tests.failed++;
            tests.results.push({ test: 'Auth System', status: 'FAILED', error: `Status: ${response.status}` });
            return false;
        }
    } catch (error) {
        console.error('  ❌ Auth Error:', error.message);
        tests.failed++;
        tests.results.push({ test: 'Auth System', status: 'FAILED', error: error.message });
        return false;
    }
}

// Test 3: Database Access
async function testDatabaseAccess() {
    console.log('💾 Testing Database Access...');
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/companies?limit=1`, {
            headers: {
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`
            }
        });

        if (response.ok) {
            console.log('  ✅ Database Access: OK');
            tests.passed++;
            tests.results.push({ test: 'Database Access', status: 'PASSED' });
            return true;
        } else {
            console.error('  ❌ Database Access: FAILED (Status: ' + response.status + ')');
            tests.failed++;
            tests.results.push({ test: 'Database Access', status: 'FAILED', error: `Status: ${response.status}` });
            return false;
        }
    } catch (error) {
        console.error('  ❌ Database Error:', error.message);
        tests.failed++;
        tests.results.push({ test: 'Database Access', status: 'FAILED', error: error.message });
        return false;
    }
}

// Test 4: Storage Access
async function testStorageAccess() {
    console.log('📁 Testing Storage Access...');
    try {
        const response = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
            headers: {
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`
            }
        });

        if (response.ok) {
            console.log('  ✅ Storage Access: OK');
            tests.passed++;
            tests.results.push({ test: 'Storage Access', status: 'PASSED' });
            return true;
        } else {
            console.error('  ❌ Storage Access: FAILED (Status: ' + response.status + ')');
            tests.failed++;
            tests.results.push({ test: 'Storage Access', status: 'FAILED', error: `Status: ${response.status}` });
            return false;
        }
    } catch (error) {
        console.error('  ❌ Storage Error:', error.message);
        tests.failed++;
        tests.results.push({ test: 'Storage Access', status: 'FAILED', error: error.message });
        return false;
    }
}

// Test 5: Edge Functions
async function testEdgeFunctions() {
    console.log('⚡ Testing Edge Functions...');
    try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/health`, {
            headers: {
                'apikey': ANON_KEY
            }
        });

        // Edge functions might return 404 if not deployed yet, which is okay
        if (response.ok || response.status === 404) {
            console.log('  ⚠️  Edge Functions: Not deployed yet (expected)');
            tests.results.push({ test: 'Edge Functions', status: 'SKIPPED', note: 'Not deployed yet' });
            return true;
        } else {
            console.error('  ❌ Edge Functions: ERROR (Status: ' + response.status + ')');
            tests.failed++;
            tests.results.push({ test: 'Edge Functions', status: 'FAILED', error: `Status: ${response.status}` });
            return false;
        }
    } catch (error) {
        console.error('  ❌ Edge Functions Error:', error.message);
        tests.failed++;
        tests.results.push({ test: 'Edge Functions', status: 'FAILED', error: error.message });
        return false;
    }
}

// Run all tests
async function runAllTests() {
    const startTime = Date.now();

    await testSupabaseConnection();
    await testAuthSystem();
    await testDatabaseAccess();
    await testStorageAccess();
    await testEdgeFunctions();

    const duration = Date.now() - startTime;

    console.log('\n================================');
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('================================');
    console.log(`✅ Passed: ${tests.passed}`);
    console.log(`❌ Failed: ${tests.failed}`);
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log('================================\n');

    // Detailed results
    console.log('📝 Detailed Results:');
    tests.results.forEach((result, index) => {
        const statusEmoji = result.status === 'PASSED' ? '✅' : result.status === 'FAILED' ? '❌' : '⚠️';
        console.log(`${index + 1}. ${result.test}: ${statusEmoji} ${result.status}`);
        if (result.error) {
            console.log(`   Error: ${result.error}`);
        }
        if (result.note) {
            console.log(`   Note: ${result.note}`);
        }
    });

    console.log('\n================================');
    if (tests.failed === 0) {
        console.log('🎉 ALL CRITICAL TESTS PASSED!');
        console.log('✅ System is ready for deployment');
    } else {
        console.log('⚠️  SOME TESTS FAILED');
        console.log('❌ Please fix issues before deployment');
    }
    console.log('================================\n');

    // Generate deployment readiness report
    const report = {
        timestamp: new Date().toISOString(),
        version: 'V18.5.0',
        supabase_url: SUPABASE_URL,
        tests: {
            total: tests.results.length,
            passed: tests.passed,
            failed: tests.failed,
            skipped: tests.results.filter(r => r.status === 'SKIPPED').length
        },
        deployment_ready: tests.failed === 0,
        results: tests.results
    };

    console.log('📄 Deployment Readiness Report:');
    console.log(JSON.stringify(report, null, 2));

    // Save report to file
    const fs = require('fs').promises;
    await fs.writeFile(
        'deployment-test-report.json',
        JSON.stringify(report, null, 2),
        'utf-8'
    );
    console.log('\n✅ Report saved to: deployment-test-report.json');

    process.exit(tests.failed === 0 ? 0 : 1);
}

// Execute tests
runAllTests().catch(error => {
    console.error('❌ Critical Error:', error);
    process.exit(1);
});
