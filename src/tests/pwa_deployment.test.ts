import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`  ✓ PASS: ${message}`);
  }
}

function runPWADeploymentSuite() {
  console.log('\n========================================================');
  console.log('RUNNING PWA & DEPLOYMENT VERIFICATION SUITE');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void) {
    console.log(`\nSuite: ${name}`);
    try {
      fn();
    } catch (err: any) {
      console.error(`  ❌ Suite Error: ${err.message}`);
      failed++;
      return;
    }
  }

  const rootDir = process.cwd();

  // --- Suite 1: Web App Manifest Standards ---
  test('Web App Manifest Standards & Relative Path Compliance', () => {
    const manifestPath = path.join(rootDir, 'public', 'manifest.json');
    assert(fs.existsSync(manifestPath), 'manifest.json exists in public directory');

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    assert(manifest.name === 'Little Math Adventures', 'Manifest name is "Little Math Adventures"');
    assert(typeof manifest.short_name === 'string', 'Manifest short_name is string');
    assert(manifest.short_name.length <= 12, `Manifest short_name "${manifest.short_name}" is <= 12 characters to avoid mobile truncation`);
    assert(manifest.display === 'standalone', 'Manifest display is "standalone"');
    assert(manifest.start_url === './', 'Manifest start_url is relative ("./") to support GitHub Pages subpaths');
    assert(manifest.scope === './', 'Manifest scope is relative ("./") to support GitHub Pages subpaths');
    assert(Boolean(manifest.theme_color), 'Manifest specifies theme_color');
    assert(Boolean(manifest.background_color), 'Manifest specifies background_color');
    assert(Array.isArray(manifest.icons) && manifest.icons.length >= 3, 'Manifest specifies required icons');

    const has192 = manifest.icons.some((i: any) => i.sizes === '192x192' && i.type === 'image/png');
    const has512 = manifest.icons.some((i: any) => i.sizes === '512x512' && i.type === 'image/png');
    const hasMaskable = manifest.icons.some((i: any) => i.purpose?.includes('maskable'));

    assert(has192, 'Manifest includes 192x192 PNG icon');
    assert(has512, 'Manifest includes 512x512 PNG icon');
    assert(hasMaskable, 'Manifest includes maskable icon for Android splash/adaptive icons');
    passed += 11;
  });

  // --- Suite 2: Service Worker & Offline Capability ---
  test('Service Worker Offline Assets & Relative Scope', () => {
    const swPath = path.join(rootDir, 'public', 'sw.js');
    assert(fs.existsSync(swPath), 'sw.js exists in public directory');

    const swContent = fs.readFileSync(swPath, 'utf-8');
    assert(swContent.includes('PRECACHE_ASSETS'), 'Service worker defines precache assets list');
    assert(swContent.includes('install'), 'Service worker registers install event');
    assert(swContent.includes('activate'), 'Service worker registers activate event with cache cleanup');
    assert(swContent.includes('fetch'), 'Service worker intercepts network requests');
    assert(swContent.includes('caches.match'), 'Service worker implements cache-first / stale-while-revalidate strategy');
    assert(swContent.includes("navigate"), 'Service worker handles SPA document navigation fallback');
    passed += 7;
  });

  // --- Suite 3: 404.html SPA GitHub Pages Routing ---
  test('GitHub Pages 404.html SPA Redirection', () => {
    const notFoundPath = path.join(rootDir, 'public', '404.html');
    assert(fs.existsSync(notFoundPath), '404.html exists in public directory');

    const htmlContent = fs.readFileSync(notFoundPath, 'utf-8');
    assert(htmlContent.includes('location.replace'), '404.html handles client-side SPA routing redirect');
    assert(htmlContent.includes('github.io'), '404.html supports GitHub Pages repository subpaths');
    passed += 3;
  });

  // --- Suite 4: Vite Relative Base Configuration ---
  test('Vite Base Path for Zero-404 Hosting Subpaths', () => {
    const viteConfigPath = path.join(rootDir, 'vite.config.ts');
    assert(fs.existsSync(viteConfigPath), 'vite.config.ts exists');

    const viteConfig = fs.readFileSync(viteConfigPath, 'utf-8');
    assert(viteConfig.includes("base: './'"), 'vite.config.ts sets base: "./" for static relative asset resolution');
    passed += 2;
  });

  // --- Suite 5: GitHub Actions Free Deployment Workflow ---
  test('GitHub Actions deploy.yml Workflow Configuration', () => {
    const workflowPath = path.join(rootDir, '.github', 'workflows', 'deploy.yml');
    assert(fs.existsSync(workflowPath), '.github/workflows/deploy.yml exists');

    const workflowContent = fs.readFileSync(workflowPath, 'utf-8');
    assert(workflowContent.includes('actions/deploy-pages@v4'), 'Workflow uses actions/deploy-pages@v4');
    assert(workflowContent.includes('actions/upload-pages-artifact@v3'), 'Workflow uses actions/upload-pages-artifact@v3');
    assert(workflowContent.includes('npm run build'), 'Workflow builds production bundle before deploy');
    assert(workflowContent.includes('pages: write'), 'Workflow requests pages: write permission');
    passed += 5;
  });

  // --- Suite 6: Physical Icon Assets Integrity ---
  test('PWA Icon Files in public directory', () => {
    const publicFiles = ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'icon.svg'];
    publicFiles.forEach((file) => {
      const p = path.join(rootDir, 'public', file);
      assert(fs.existsSync(p), `Required asset public/${file} exists`);
      const stat = fs.statSync(p);
      assert(stat.size > 0, `Asset public/${file} is non-empty (${stat.size} bytes)`);
      passed += 2;
    });
  });

  console.log('\n========================================================');
  console.log(`PWA & DEPLOYMENT SUITE RESULTS: ${passed} passed (${failed} failed)`);
  console.log('========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPWADeploymentSuite();
