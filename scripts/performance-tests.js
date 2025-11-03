#!/usr/bin/env node

/**
 * Performance Test Suite
 * Database Query Performance & Load Testing
 * Quality Gates V18.3.27
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const RESULTS_DIR = './test-results/performance';
const fs = require('fs');
const path = require('path');

// Performance thresholds (milliseconds)
const THRESHOLDS = {
  DASHBOARD_STATS: 100,
  BOOKING_LIST: 200,
  GLOBAL_SEARCH: 200,
  DRIVER_LIST: 150,
  VEHICLE_LIST: 150,
  CUSTOMER_LIST: 150,
};

async function measureQuery(name, queryFn) {
  const start = Date.now();
  
  try {
    const result = await queryFn();
    const duration = Date.now() - start;
    
    const threshold = THRESHOLDS[name.toUpperCase().replace(/[^A-Z_]/g, '_')];
    const passed = duration <= (threshold || 200);
    
    console.log(`${passed ? '✅' : '❌'} ${name}: ${duration}ms ${threshold ? `(threshold: ${threshold}ms)` : ''}`);
    
    return {
      name,
      duration,
      threshold,
      passed,
      error: null,
      rowCount: result?.data?.length || 0,
    };
  } catch (error) {
    console.error(`❌ ${name}: ERROR`);
    console.error(error.message);
    
    return {
      name,
      duration: -1,
      threshold: THRESHOLDS[name.toUpperCase().replace(/[^A-Z_]/g, '_')],
      passed: false,
      error: error.message,
      rowCount: 0,
    };
  }
}

async function testDashboardStats(companyId) {
  return await measureQuery('Dashboard Stats', async () => {
    const { data, error } = await supabase
      .rpc('get_dashboard_stats_for_company', { target_company_id: companyId });
    
    if (error) throw error;
    return { data };
  });
}

async function testBookingList(companyId) {
  return await measureQuery('Booking List (50 items)', async () => {
    const { data, error } = await supabase
      .rpc('get_company_bookings', { 
        _company_id: companyId,
        _limit: 50,
        _offset: 0
      });
    
    if (error) throw error;
    return { data };
  });
}

async function testDriverList(companyId) {
  return await measureQuery('Driver List', async () => {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('company_id', companyId)
      .eq('archived', false)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    return { data };
  });
}

async function testVehicleList(companyId) {
  return await measureQuery('Vehicle List', async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('company_id', companyId)
      .eq('archived', false)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    return { data };
  });
}

async function testCustomerList(companyId) {
  return await measureQuery('Customer List', async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('company_id', companyId)
      .eq('archived', false)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    return { data };
  });
}

async function testGlobalSearch(companyId, searchTerm = 'test') {
  return await measureQuery('Global Search', async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('company_id', companyId)
      .or(`pickup_address.ilike.%${searchTerm}%,dropoff_address.ilike.%${searchTerm}%`)
      .limit(20);
    
    if (error) throw error;
    return { data };
  });
}

async function testConcurrentQueries(companyId) {
  return await measureQuery('Concurrent Dashboard Load (3 queries)', async () => {
    const queries = [
      supabase.rpc('get_dashboard_stats_for_company', { target_company_id: companyId }),
      supabase
        .from('bookings')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'pending')
        .limit(10),
      supabase
        .from('drivers')
        .select('*')
        .eq('company_id', companyId)
        .eq('shift_status', 'available')
        .limit(10),
    ];
    
    const results = await Promise.all(queries);
    
    results.forEach(({ error }) => {
      if (error) throw error;
    });
    
    return { data: results };
  });
}

async function main() {
  console.log('🚀 Starting Performance Tests\n');

  // Get first company ID for testing
  const { data: companies, error: companyError } = await supabase
    .from('companies')
    .select('id')
    .limit(1)
    .single();

  if (companyError || !companies) {
    console.error('No test company found!');
    console.error('Create a test company first.');
    process.exit(1);
  }

  const testCompanyId = companies.id;
  console.log(`Using test company: ${testCompanyId}\n`);

  const results = [];

  // Run all performance tests
  results.push(await testDashboardStats(testCompanyId));
  results.push(await testBookingList(testCompanyId));
  results.push(await testDriverList(testCompanyId));
  results.push(await testVehicleList(testCompanyId));
  results.push(await testCustomerList(testCompanyId));
  results.push(await testGlobalSearch(testCompanyId));
  results.push(await testConcurrentQueries(testCompanyId));

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    companyId: testCompanyId,
    results: results,
    summary: {
      total: results.length,
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => !r.passed).length,
      avgDuration: Math.round(
        results.reduce((sum, r) => sum + (r.duration > 0 ? r.duration : 0), 0) / results.length
      ),
    },
  };

  // Save report
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  const reportPath = path.join(RESULTS_DIR, 'query-performance.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('\n📊 Performance Test Summary:');
  console.log(`Total Tests: ${report.summary.total}`);
  console.log(`Passed: ${report.summary.passed}`);
  console.log(`Failed: ${report.summary.failed}`);
  console.log(`Average Duration: ${report.summary.avgDuration}ms`);
  console.log(`\nReport saved to: ${reportPath}`);

  // Exit with error if any test failed
  if (report.summary.failed > 0) {
    console.error('\n❌ Some performance tests failed!');
    process.exit(1);
  }

  console.log('\n✅ All performance tests passed!');
}

main().catch(error => {
  console.error('Performance Test Error:', error);
  process.exit(1);
});
