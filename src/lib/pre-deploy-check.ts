/* ==================================================================================
   PRE-DEPLOYMENT HEALTH CHECKS
   ==================================================================================
   Verhindert fehlerhafte Deployments durch automatische Validierung
   ================================================================================== */

import { logger } from './logger';

interface HealthCheckResult {
  passed: boolean;
  category: string;
  check: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
}

interface DeploymentHealthReport {
  overallStatus: 'passed' | 'failed' | 'warning';
  timestamp: string;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warningChecks: number;
  results: HealthCheckResult[];
  canDeploy: boolean;
}

class PreDeploymentHealthCheck {
  private results: HealthCheckResult[] = [];

  /**
   * Run all pre-deployment health checks
   */
  async runAllChecks(): Promise<DeploymentHealthReport> {
    this.results = [];
    
    logger.info('[Pre-Deploy] Starting health checks...', {
      component: 'PreDeployCheck'
    });

    // Run all check categories
    await this.checkEnvironmentVariables();
    await this.checkAPIEndpoints();
    await this.checkDatabaseConnection();
    await this.checkMobileOptimization();
    await this.checkSecurityHeaders();
    await this.checkPerformanceMetrics();
    await this.checkLoadTestConfiguration();
    await this.checkSentryConfiguration();
    
    return this.generateReport();
  }

  /**
   * Check environment variables
   */
  private async checkEnvironmentVariables(): Promise<void> {
    const requiredVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY',
      'VITE_SUPABASE_PROJECT_ID',
    ];

    for (const varName of requiredVars) {
      const value = import.meta.env[varName];
      
      if (!value) {
        this.addResult({
          passed: false,
          category: 'Environment',
          check: `Required var: ${varName}`,
          message: `Missing required environment variable: ${varName}`,
          severity: 'critical',
        });
      } else {
        this.addResult({
          passed: true,
          category: 'Environment',
          check: `Required var: ${varName}`,
          message: `Environment variable present: ${varName}`,
          severity: 'info',
        });
      }
    }

    // Check for deprecated variables
    if (import.meta.env.VITE_SUPABASE_ANON_KEY) {
      this.addResult({
        passed: true,
        category: 'Environment',
        check: 'Deprecated vars',
        message: 'VITE_SUPABASE_ANON_KEY is deprecated, use VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY',
        severity: 'warning',
      });
    }
  }

  /**
   * Check API endpoint health
   */
  private async checkAPIEndpoints(): Promise<void> {
    const criticalEndpoints = [
      'health-check',
      'get-here-api-key',
    ];

    for (const endpoint of criticalEndpoints) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${endpoint}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          }
        );

        if (response.ok || response.status === 404) {
          this.addResult({
            passed: true,
            category: 'API',
            check: `Endpoint: ${endpoint}`,
            message: `Endpoint accessible: ${endpoint}`,
            severity: 'info',
          });
        } else {
          this.addResult({
            passed: false,
            category: 'API',
            check: `Endpoint: ${endpoint}`,
            message: `Endpoint returned ${response.status}: ${endpoint}`,
            severity: 'warning',
          });
        }
      } catch (error) {
        this.addResult({
          passed: false,
          category: 'API',
          check: `Endpoint: ${endpoint}`,
          message: `Failed to reach endpoint: ${endpoint}`,
          severity: 'critical',
        });
      }
    }
  }

  /**
   * Check database connection
   */
  private async checkDatabaseConnection(): Promise<void> {
    try {
      // Simple check if we can import the client
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Try to ping the database
      const { error } = await supabase.from('companies').select('count').limit(1);
      
      if (error) {
        this.addResult({
          passed: false,
          category: 'Database',
          check: 'Connection test',
          message: `Database connection failed: ${error.message}`,
          severity: 'critical',
        });
      } else {
        this.addResult({
          passed: true,
          category: 'Database',
          check: 'Connection test',
          message: 'Database connection successful',
          severity: 'info',
        });
      }
    } catch (error) {
      this.addResult({
        passed: false,
        category: 'Database',
        check: 'Connection test',
        message: 'Failed to initialize database client',
        severity: 'critical',
      });
    }
  }

  /**
   * Check mobile optimization
   */
  private async checkMobileOptimization(): Promise<void> {
    // Check if mobile components exist
    const mobileComponents = [
      'MobileDashboard',
      'MobileBottomNav',
      'MobileHeader',
    ];

    let allPresent = true;
    for (const component of mobileComponents) {
      try {
        await import(`@/components/mobile/${component}`);
      } catch {
        allPresent = false;
        this.addResult({
          passed: false,
          category: 'Mobile',
          check: `Component: ${component}`,
          message: `Missing mobile component: ${component}`,
          severity: 'warning',
        });
      }
    }

    if (allPresent) {
      this.addResult({
        passed: true,
        category: 'Mobile',
        check: 'Core components',
        message: 'All mobile components present',
        severity: 'info',
      });
    }

    // Check viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      this.addResult({
        passed: true,
        category: 'Mobile',
        check: 'Viewport meta',
        message: 'Viewport meta tag present',
        severity: 'info',
      });
    } else {
      this.addResult({
        passed: false,
        category: 'Mobile',
        check: 'Viewport meta',
        message: 'Missing viewport meta tag',
        severity: 'critical',
      });
    }
  }

  /**
   * Check security headers
   */
  private async checkSecurityHeaders(): Promise<void> {
    // Check if HTTPS is enforced in production
    if (import.meta.env.PROD && window.location.protocol !== 'https:') {
      this.addResult({
        passed: false,
        category: 'Security',
        check: 'HTTPS',
        message: 'Application not served over HTTPS in production',
        severity: 'critical',
      });
    } else {
      this.addResult({
        passed: true,
        category: 'Security',
        check: 'HTTPS',
        message: 'HTTPS correctly configured',
        severity: 'info',
      });
    }

    // Check if sensitive data is logged
    const hasConsoleOverride = typeof console.log !== 'function';
    this.addResult({
      passed: true,
      category: 'Security',
      check: 'Console logging',
      message: hasConsoleOverride 
        ? 'Console logging is overridden (good for production)'
        : 'Console logging is active (check for sensitive data)',
      severity: hasConsoleOverride ? 'info' : 'warning',
    });
  }

  /**
   * Check performance metrics
   */
  private async checkPerformanceMetrics(): Promise<void> {
    // Check if performance API is available
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        
        if (loadTime < 3000) {
          this.addResult({
            passed: true,
            category: 'Performance',
            check: 'Page load time',
            message: `Page load time: ${Math.round(loadTime)}ms (excellent)`,
            severity: 'info',
          });
        } else if (loadTime < 5000) {
          this.addResult({
            passed: true,
            category: 'Performance',
            check: 'Page load time',
            message: `Page load time: ${Math.round(loadTime)}ms (acceptable)`,
            severity: 'warning',
          });
        } else {
          this.addResult({
            passed: false,
            category: 'Performance',
            check: 'Page load time',
            message: `Page load time: ${Math.round(loadTime)}ms (too slow)`,
            severity: 'warning',
          });
        }
      }
    }

    // Check bundle size (rough estimate)
    const scripts = document.querySelectorAll('script[src]');
    let estimatedSize = 0;
    
    for (const script of Array.from(scripts)) {
      const src = (script as HTMLScriptElement).src;
      if (src && !src.includes('node_modules')) {
        estimatedSize += 1; // Just count scripts
      }
    }

    this.addResult({
      passed: true,
      category: 'Performance',
      check: 'Script count',
      message: `${estimatedSize} application scripts loaded`,
      severity: 'info',
    });
  }

  /**
   * Check Load-Testing configuration
   */
  private async checkLoadTestConfiguration(): Promise<void> {
    try {
      // Check if load-test.yml exists (via fetch)
      const response = await fetch('/load-test.yml');
      
      if (response.ok) {
        this.addResult({
          passed: true,
          category: 'Load Testing',
          check: 'Configuration file',
          message: 'load-test.yml configuration present and accessible',
          severity: 'info',
        });
      } else {
        this.addResult({
          passed: false,
          category: 'Load Testing',
          check: 'Configuration file',
          message: 'load-test.yml not found - load testing not configured',
          severity: 'warning',
        });
      }
    } catch (error) {
      this.addResult({
        passed: false,
        category: 'Load Testing',
        check: 'Configuration file',
        message: 'Failed to check load-test.yml configuration',
        severity: 'warning',
      });
    }
  }

  /**
   * Check Sentry configuration
   */
  private async checkSentryConfiguration(): Promise<void> {
    const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
    
    if (!sentryDsn) {
      this.addResult({
        passed: import.meta.env.DEV, // OK in dev, warning in prod
        category: 'Monitoring',
        check: 'Sentry DSN',
        message: 'VITE_SENTRY_DSN not configured - error tracking disabled',
        severity: import.meta.env.PROD ? 'warning' : 'info',
      });
    } else if (sentryDsn.includes('example') || sentryDsn.includes('o123')) {
      this.addResult({
        passed: false,
        category: 'Monitoring',
        check: 'Sentry DSN',
        message: 'VITE_SENTRY_DSN uses placeholder value - update with real Sentry DSN',
        severity: 'warning',
      });
    } else {
      this.addResult({
        passed: true,
        category: 'Monitoring',
        check: 'Sentry DSN',
        message: 'Sentry DSN configured correctly',
        severity: 'info',
      });
    }
  }

  /**
   * Add a check result
   */
  private addResult(result: HealthCheckResult): void {
    this.results.push(result);
    
    if (!result.passed) {
      if (result.severity === 'critical') {
        logger.error(`[Pre-Deploy] ${result.check}: ${result.message}`, new Error('Check failed'), {
          component: 'PreDeployCheck',
          category: result.category,
          check: result.check
        });
      } else {
        logger.warn(`[Pre-Deploy] ${result.check}: ${result.message}`, {
          component: 'PreDeployCheck',
          category: result.category,
          check: result.check
        });
      }
    }
  }

  /**
   * Generate final report
   */
  private generateReport(): DeploymentHealthReport {
    const passedChecks = this.results.filter(r => r.passed).length;
    const failedChecks = this.results.filter(r => !r.passed && r.severity === 'critical').length;
    const warningChecks = this.results.filter(r => !r.passed && r.severity === 'warning').length;
    
    const canDeploy = failedChecks === 0;
    const overallStatus = failedChecks > 0 ? 'failed' : warningChecks > 0 ? 'warning' : 'passed';
    
    const report: DeploymentHealthReport = {
      overallStatus,
      timestamp: new Date().toISOString(),
      totalChecks: this.results.length,
      passedChecks,
      failedChecks,
      warningChecks,
      results: this.results,
      canDeploy,
    };

    logger.info('[Pre-Deploy] Health check completed', {
      component: 'PreDeployCheck',
      status: overallStatus,
      canDeploy,
      passed: passedChecks,
      failed: failedChecks,
      warnings: warningChecks,
    });

    return report;
  }
}

// Singleton instance
export const preDeploymentHealthCheck = new PreDeploymentHealthCheck();

// Convenience export
export const runPreDeploymentChecks = () => preDeploymentHealthCheck.runAllChecks();
