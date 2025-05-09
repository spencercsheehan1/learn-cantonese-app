const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Main build function
async function buildWeb() {
  try {
    console.log('Starting custom web build...');
    
    // Run the Expo build process but catch errors
    try {
      execSync('npx expo export', { stdio: 'inherit' });
    } catch (error) {
      console.log('Expo export had issues, but we will continue with web-build if it exists');
    }
    
    // Check if web-build exists
    if (!fs.existsSync('web-build')) {
      console.error('Failed to create web-build directory');
      process.exit(1);
    }
    
    // Ensure index.html exists
    if (!fs.existsSync('web-build/index.html')) {
      console.error('Missing index.html in web-build');
      process.exit(1);
    }
    
    console.log('Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Run the build
buildWeb(); 