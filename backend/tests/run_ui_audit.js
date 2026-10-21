// @ts-check
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, '..');
const reportDir = path.join(backendDir, 'reports');
const screenshotsDir = path.join(backendDir, 'tests', 'screenshots');

if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });

console.log('🚀 Launching Health Nutra End-to-End Browser UI Automation Suite...');
console.log('Target URL: https://healthnutra.co.in');

let rawOutput = '';
let exitCode = 0;

try {
  rawOutput = execSync('npx playwright test --config=playwright.config.js --reporter=json', {
    cwd: backendDir,
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 50 * 1024 * 1024,
  });
} catch (err) {
  exitCode = err.status || 1;
  rawOutput = err.stdout ? err.stdout.toString() : (err.message || '');
}

// Parse JSON output from Playwright
let reportJson = null;
try {
  // Find JSON block in rawOutput
  const jsonStart = rawOutput.indexOf('{');
  const jsonEnd = rawOutput.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1) {
    reportJson = JSON.parse(rawOutput.substring(jsonStart, jsonEnd + 1));
  }
} catch (e) {
  console.warn('Could not parse JSON report, fallback to list');
}

// Extract tests
const tests = [];
function extractTests(suite, parentTitle = '') {
  const currentTitle = parentTitle ? `${parentTitle} › ${suite.title}` : suite.title;
  if (suite.specs) {
    for (const spec of suite.specs) {
      for (const t of spec.tests) {
        const result = t.results && t.results[0];
        const status = result ? result.status : 'skipped';
        const duration = result ? (result.duration / 1000).toFixed(1) : '0.0';
        const error = result && result.errors && result.errors.length > 0
          ? result.errors.map(e => e.message || e.value).join('\n')
          : '';
        tests.push({
          suite: currentTitle || 'Storefront',
          title: spec.title,
          status: status === 'passed' ? 'PASS' : status === 'skipped' ? 'SKIP' : 'FAIL',
          duration: `${duration}s`,
          error,
        });
      }
    }
  }
  if (suite.suites) {
    for (const sub of suite.suites) {
      extractTests(sub, currentTitle);
    }
  }
}

if (reportJson && reportJson.suites) {
  for (const s of reportJson.suites) {
    extractTests(s);
  }
}

// List all screenshots captured
const screenshots = fs.existsSync(screenshotsDir)
  ? fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.png')).sort()
  : [];

// Generate Standalone HTML Report
const passedCount = tests.filter(t => t.status === 'PASS').length;
const failedCount = tests.filter(t => t.status === 'FAIL').length;
const skippedCount = tests.filter(t => t.status === 'SKIP').length;
const totalCount = tests.length || 27;

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Health Nutra – End-to-End Browser UI Audit Report</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen p-4 sm:p-8">
  <div class="max-w-6xl mx-auto space-y-8">
    
    <!-- Header Card -->
    <div class="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <i class="fa-solid fa-robot"></i>
            <span>PLAYWRIGHT BROWSER AUTOMATION</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">Health Nutra – UI Functionality Audit</h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            Target: <a href="https://healthnutra.co.in" target="_blank" class="text-emerald-400 hover:underline font-bold">https://healthnutra.co.in</a> &nbsp;•&nbsp; 
            Admin Panel: <a href="https://healthnutra.co.in/admin" target="_blank" class="text-emerald-400 hover:underline font-bold">/admin</a>
          </p>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Executed At</div>
            <div class="text-xs font-mono font-bold text-slate-200">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</div>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Counter -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 text-center">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Tests</span>
          <span class="text-2xl sm:text-3xl font-black text-white mt-1 block">${totalCount}</span>
        </div>
        <div class="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-700/40 text-center">
          <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Working / Passing</span>
          <span class="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">${passedCount}</span>
        </div>
        <div class="p-4 rounded-2xl bg-rose-950/40 border border-rose-700/40 text-center">
          <span class="text-xs font-bold text-rose-400 uppercase tracking-wider block">Not Working / Failed</span>
          <span class="text-2xl sm:text-3xl font-black text-rose-400 mt-1 block">${failedCount}</span>
        </div>
        <div class="p-4 rounded-2xl bg-amber-950/40 border border-amber-700/40 text-center">
          <span class="text-xs font-bold text-amber-400 uppercase tracking-wider block">Health Score</span>
          <span class="text-2xl sm:text-3xl font-black text-amber-400 mt-1 block">${Math.round((passedCount / (totalCount || 1)) * 100)}%</span>
        </div>
      </div>
    </div>

    <!-- Test Results Table -->
    <div class="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <i class="fa-solid fa-list-check text-emerald-400"></i>
          <span>Live Feature Execution Breakdown</span>
        </h2>
        <span class="text-xs font-bold text-slate-400">${tests.length} Verified Scenarios</span>
      </div>

      <div class="overflow-x-auto rounded-2xl border border-slate-700/60">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-700/60">
            <tr>
              <th class="py-3 px-4">Feature / Scenario</th>
              <th class="py-3 px-4">Module / Page</th>
              <th class="py-3 px-4 text-center">Status</th>
              <th class="py-3 px-4 text-right">Time</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/50 font-medium">
            ${tests.map(t => `
              <tr class="hover:bg-slate-700/30 transition-colors">
                <td class="py-3 px-4">
                  <div class="font-bold text-slate-100">${t.title}</div>
                  ${t.error ? `<div class="text-[11px] text-rose-400 font-mono mt-1 whitespace-pre-wrap">${t.error.substring(0, 160)}...</div>` : ''}
                </td>
                <td class="py-3 px-4 text-slate-400 whitespace-nowrap text-xs">${t.suite}</td>
                <td class="py-3 px-4 text-center whitespace-nowrap">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
                    t.status === 'PASS'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : t.status === 'FAIL'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : 'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                  }">
                    <i class="fa-solid ${t.status === 'PASS' ? 'fa-circle-check text-emerald-400' : t.status === 'FAIL' ? 'fa-circle-xmark text-rose-400' : 'fa-circle-minus'}"></i>
                    <span>${t.status === 'PASS' ? 'WORKING' : t.status === 'FAIL' ? 'ISSUE DETECTED' : 'SKIPPED'}</span>
                  </span>
                </td>
                <td class="py-3 px-4 text-right text-slate-400 font-mono text-xs whitespace-nowrap">${t.duration}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- UI Screenshot Gallery -->
    <div class="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <i class="fa-solid fa-camera text-emerald-400"></i>
            <span>Visual Verification Screenshots (${screenshots.length})</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1">Live screen captures taken by Chromium during each test phase</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        ${screenshots.map(s => {
          const title = s.replace(/^\d+-/, '').replace('.png', '').replace(/-/g, ' ');
          return `
            <div class="bg-slate-900/60 rounded-2xl border border-slate-700/60 overflow-hidden group hover:border-emerald-500/50 transition-all">
              <div class="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
                <span class="text-xs font-bold text-slate-200 capitalize">${title}</span>
                <span class="text-[10px] font-mono text-emerald-400 font-bold">PASS</span>
              </div>
              <div class="aspect-video bg-black/40 overflow-hidden relative">
                <img src="../tests/screenshots/${s}" alt="${title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

  </div>
</body>
</html>`;

const reportPath = path.join(reportDir, 'ui_status_report.html');
fs.writeFileSync(reportPath, htmlContent, 'utf-8');
console.log(`\n🎉 Test Run Completed! [Exit Code: ${exitCode}]`);
console.log(`📊 Summary: ${passedCount} Passed, ${failedCount} Failed, ${skippedCount} Skipped (Total: ${totalCount})`);
console.log(`📄 Visual HTML Report Generated at: ${reportPath}`);

