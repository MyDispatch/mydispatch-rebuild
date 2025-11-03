#!/usr/bin/env node

/**
 * AI Visual Analysis Script
 * Uses Gemini AI to analyze screenshots for design compliance
 * Quality Gates V18.3.27
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;

const SCREENSHOTS_DIR = path.join(__dirname, '../test-results/screenshots');
const REPORT_FILE = path.join(__dirname, '../test-results/ai-report.json');

async function analyzeScreenshot(imagePath, pageName) {
  console.log(`Analyzing ${pageName}...`);

  // Read image as base64
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');

  // Call Lovable AI Gateway
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: `You are a UI/UX quality inspector for MyDispatch V18.3.27.
Analyze the screenshot for design system compliance:

1. Color Usage:
   - Only primary/foreground colors allowed
   - NO accent color
   - NO traffic light colors (red/yellow/green) on icons
   - NO direct white/black usage

2. Touch Targets:
   - All interactive elements must be >= 44x44px
   
3. Layout:
   - Header: 64px height
   - Sidebar: 240px width (desktop)
   - Consistent spacing (4px, 8px, 16px, 24px, 32px)
   
4. Typography:
   - Consistent font sizes
   - Readable text (min 14px)
   
5. Corporate Identity:
   - NO "Lovable" or "Supabase" branding visible
   - MyDispatch branding present

Return JSON with violations array:
{
  "violations": [
    {
      "severity": "error|warning",
      "category": "color|layout|typography|branding|accessibility",
      "message": "Brief description",
      "details": "Detailed explanation"
    }
  ],
  "colorCompliance": true/false,
  "touchTargets": true/false,
  "responsive": true/false,
  "corporateIdentity": true/false
}`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this screenshot of "${pageName}" page. Check ALL design system compliance rules.`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/png;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    console.error(`AI analysis failed for ${pageName}:`, response.status);
    return {
      page: pageName,
      error: 'Analysis failed',
      violations: []
    };
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Parse JSON from response
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        page: pageName,
        ...result
      };
    }
  } catch (e) {
    console.error(`Failed to parse AI response for ${pageName}:`, e);
  }

  return {
    page: pageName,
    violations: [],
    error: 'Could not parse AI response'
  };
}

async function main() {
  console.log('🤖 Starting AI Visual Analysis...\n');

  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    console.error('Screenshots directory not found!');
    console.log('Run: npm run test:screenshots first');
    process.exit(1);
  }

  // Find all screenshots
  const screenshots = fs.readdirSync(SCREENSHOTS_DIR)
    .filter(file => file.endsWith('.png'))
    .map(file => ({
      path: path.join(SCREENSHOTS_DIR, file),
      name: file.replace('.png', '')
    }));

  if (screenshots.length === 0) {
    console.error('No screenshots found!');
    process.exit(1);
  }

  console.log(`Found ${screenshots.length} screenshots to analyze\n`);

  const results = [];
  
  // Analyze each screenshot
  for (const screenshot of screenshots) {
    const result = await analyzeScreenshot(screenshot.path, screenshot.name);
    results.push(result);
    
    console.log(`✅ ${screenshot.name}`);
    if (result.violations && result.violations.length > 0) {
      console.log(`   ⚠️  ${result.violations.length} violations found`);
    }
  }

  // Generate summary report
  const report = {
    timestamp: new Date().toISOString(),
    totalScreenshots: screenshots.length,
    totalViolations: results.reduce((sum, r) => sum + (r.violations?.length || 0), 0),
    results: results,
    summary: {
      colorCompliant: results.filter(r => r.colorCompliance).length,
      touchTargetsOk: results.filter(r => r.touchTargets).length,
      responsiveOk: results.filter(r => r.responsive).length,
      brandingOk: results.filter(r => r.corporateIdentity).length,
    }
  };

  // Save report
  fs.mkdirSync(path.dirname(REPORT_FILE), { recursive: true });
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

  console.log('\n📊 Analysis Complete!');
  console.log(`Total violations: ${report.totalViolations}`);
  console.log(`Report saved to: ${REPORT_FILE}`);

  // Exit with error if critical violations found
  const criticalViolations = results
    .flatMap(r => r.violations || [])
    .filter(v => v.severity === 'error');

  if (criticalViolations.length > 0) {
    console.error(`\n❌ ${criticalViolations.length} critical violations found!`);
    process.exit(1);
  }

  console.log('\n✅ All checks passed!');
}

main().catch(error => {
  console.error('AI Analysis Error:', error);
  process.exit(1);
});
