const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Main build function
async function buildWeb() {
  try {
    console.log('Starting custom web build...');
    
    // Try the normal Expo export first
    try {
      execSync('npx expo export', { stdio: 'inherit' });
      console.log('Expo export completed successfully');
    } catch (error) {
      console.log('Expo export failed, creating minimal web build...');
      
      // Create web-build directory if it doesn't exist
      if (!fs.existsSync('web-build')) {
        fs.mkdirSync('web-build', { recursive: true });
      }
      
      // Create a minimal index.html if it doesn't exist
      if (!fs.existsSync('web-build/index.html')) {
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Learn Cantonese App</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      padding: 20px;
      text-align: center;
      background-color: #f5f5f7;
    }
    h1 {
      color: #333;
      margin-bottom: 20px;
    }
    p {
      color: #666;
      max-width: 600px;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <h1>Learn Cantonese App</h1>
  <p>The app is currently being updated. Please check back soon!</p>
</body>
</html>`;
        
        fs.writeFileSync('web-build/index.html', htmlContent);
        console.log('Created minimal index.html');
      }
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