const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const TINYMCE_VERSION = '6.8.3';
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const TINYMCE_DIR = path.join(PUBLIC_DIR, 'tinymce');

// Create directories if they don't exist
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR);
}
if (!fs.existsSync(TINYMCE_DIR)) {
  fs.mkdirSync(TINYMCE_DIR);
}

// Download TinyMCE
console.log('Downloading TinyMCE...');
const downloadUrl = `https://download.tiny.cloud/tinymce/community/tinymce_${TINYMCE_VERSION}.zip`;
const zipPath = path.join(TINYMCE_DIR, 'tinymce.zip');

https.get(downloadUrl, (response) => {
  const file = fs.createWriteStream(zipPath);
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Download complete. Extracting...');
    
    // Extract the zip file
    try {
      execSync(`unzip -o "${zipPath}" -d "${TINYMCE_DIR}"`);
      console.log('Extraction complete.');
      
      // Clean up
      fs.unlinkSync(zipPath);
      console.log('Setup complete!');
    } catch (error) {
      console.error('Error extracting files:', error);
    }
  });
}).on('error', (err) => {
  console.error('Error downloading TinyMCE:', err);
}); 