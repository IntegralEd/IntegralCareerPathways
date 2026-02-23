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

// Clean dist
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  console.log('🧹 Cleaning dist directory...');
  deleteRecursive(distDir);
}
fs.mkdirSync(distDir, { recursive: true });
console.log('✓ Created dist directory\n');

// Copy HTML files
console.log('📄 Copying HTML files...');
const htmlFiles = ['index.html', 'privacy.html'];
htmlFiles.forEach(file => {
  const srcPath = path.join(__dirname, 'src', file);
  const destPath = path.join(distDir, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`  ✓ ${file}`);
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
