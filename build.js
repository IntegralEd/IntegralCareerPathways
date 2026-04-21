const fs = require('fs');
const path = require('path');

// Helper: recursively copy a directory
function copyRecursive(src, dest) {
  const items = fs.readdirSync(src);
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else if (stat.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Helper: recursively delete a directory
function deleteRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(file => {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        deleteRecursive(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

console.log('🏗️  Starting build...\n');

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const siteSlug = pkg.siteSlug || 'unknown';
console.log(`📊 Site slug: ${siteSlug}\n`);

// Clean dist
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  console.log('🧹 Cleaning dist directory...');
  deleteRecursive(distDir);
}
fs.mkdirSync(distDir, { recursive: true });
console.log('✓ Created dist directory\n');

// Load analytics snippet for head injection
const analyticsPath = path.join(__dirname, 'vendor', 'integralthemes', 'components', 'analytics.html');
let analyticsHtml = '';
if (fs.existsSync(analyticsPath)) {
  analyticsHtml = fs.readFileSync(analyticsPath, 'utf8');
  console.log('✓ Loaded analytics snippet for injection\n');
} else {
  console.log('⚠ Analytics snippet not found, pages will be built without it\n');
}

// Build footer HTML from shared template + site-specific config
const footerTemplatePath = path.join(__dirname, 'vendor', 'integralthemes', 'components', 'footer.html');
let footerHtml = '';
if (fs.existsSync(footerTemplatePath) && pkg.footer) {
  const footerTemplate = fs.readFileSync(footerTemplatePath, 'utf8');
  const siteName = pkg.footer.siteName || '';
  const pageLinksHtml = (pkg.footer.pageLinks || [])
    .map(({ href, label }) => `          <li><a href="${href}">${label}</a></li>`)
    .join('\n');
  footerHtml = footerTemplate
    .replace(/\{\{FOOTER_SITE_NAME\}\}/g, siteName)
    .replace(/\{\{FOOTER_PAGE_LINKS\}\}/g, pageLinksHtml);
  console.log('✓ Built footer from shared template\n');
} else {
  console.log('⚠ Footer template or config not found, pages will be built without injected footer\n');
}

// Copy HTML files and inject analytics + footer
console.log('📄 Copying HTML files...');
const htmlFiles = ['index.html', 'privacy.html'];
htmlFiles.forEach(file => {
  const srcPath = path.join(__dirname, 'src', file);
  const destPath = path.join(distDir, file);
  if (fs.existsSync(srcPath)) {
    let htmlContent = fs.readFileSync(srcPath, 'utf8');
    if (analyticsHtml) {
      const siteNameScript = `<script>window.IE_SITE_NAME = '${siteSlug}';</script>`;
      htmlContent = htmlContent.replace('</head>', `${siteNameScript}\n${analyticsHtml}\n</head>`);
    }
    if (footerHtml) {
      htmlContent = htmlContent.replace('<!-- FOOTER_INJECT -->', footerHtml);
    }
    fs.writeFileSync(destPath, htmlContent, 'utf8');
    const tags = [analyticsHtml ? 'analytics' : '', footerHtml ? 'footer' : ''].filter(Boolean);
    console.log(`  ✓ ${file}${tags.length ? ` (${tags.join(', ')})` : ''}`);
  } else {
    console.log(`  ⚠ ${file} (not found)`);
  }
});

// Copy CSS files
console.log('\n🎨 Copying CSS files...');
const cssDir = path.join(distDir, 'css');
if (!fs.existsSync(cssDir)) fs.mkdirSync(cssDir, { recursive: true });
const srcCssDir = path.join(__dirname, 'src', 'css');
if (fs.existsSync(srcCssDir)) {
  fs.readdirSync(srcCssDir).forEach(file => {
    if (file.endsWith('.backup')) return;
    fs.copyFileSync(path.join(srcCssDir, file), path.join(cssDir, file));
    console.log(`  ✓ css/${file}`);
  });
}

// Copy JS files
console.log('\n📜 Copying JS files...');
const jsDir = path.join(distDir, 'js');
if (!fs.existsSync(jsDir)) fs.mkdirSync(jsDir, { recursive: true });
const srcJsDir = path.join(__dirname, 'src', 'js');
if (fs.existsSync(srcJsDir)) {
  fs.readdirSync(srcJsDir).forEach(file => {
    fs.copyFileSync(path.join(srcJsDir, file), path.join(jsDir, file));
    console.log(`  ✓ js/${file}`);
  });
}

// Copy assets
console.log('\n📁 Copying assets...');
const assetsDir = path.join(__dirname, 'src', 'assets');
if (fs.existsSync(assetsDir)) {
  const destAssetsDir = path.join(distDir, 'assets');
  if (!fs.existsSync(destAssetsDir)) fs.mkdirSync(destAssetsDir, { recursive: true });
  copyRecursive(assetsDir, destAssetsDir);
  console.log('  ✓ Copied assets directory');
}

// Copy vendor/integralthemes
console.log('\n🎨 Copying vendored theme...');
const vendorSrcDir = path.join(__dirname, 'vendor', 'integralthemes');
if (fs.existsSync(vendorSrcDir)) {
  const vendorDestDir = path.join(distDir, 'vendor', 'integralthemes');
  fs.mkdirSync(vendorDestDir, { recursive: true });
  copyRecursive(vendorSrcDir, vendorDestDir);
  console.log('  ✓ vendor/integralthemes/theme/theme.css');
  console.log('  ✓ vendor/integralthemes/assets/brand/');
} else {
  console.error('  ❌ ERROR: vendor/integralthemes not found!');
  process.exit(1);
}

// Copy SEO files
['robots.txt', 'sitemap.xml'].forEach(file => {
  const srcPath = path.join(__dirname, 'src', file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(distDir, file));
    console.log(`\n  ✓ ${file}`);
  }
});

console.log('\n✅ Build completed successfully!');
console.log(`📦 Output directory: ${distDir}`);
console.log('\n🔗 Critical files:');
console.log('   - dist/vendor/integralthemes/theme/theme.css');
console.log('   - dist/css/site.css');
console.log('   - dist/index.html');
