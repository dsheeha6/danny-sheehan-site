const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'images', 'golf');
const previewDir = path.join(__dirname, 'images', 'golf', 'previews');

// Create previews directory if it doesn't exist
if (!fs.existsSync(previewDir)) {
    fs.mkdirSync(previewDir, { recursive: true });
}

// Process each image
fs.readdirSync(sourceDir).forEach(file => {
    if (file.endsWith('.png') && !file.includes('preview')) {
        const sourcePath = path.join(sourceDir, file);
        const previewPath = path.join(previewDir, file.replace('.png', '-preview.jpg'));
        
        sharp(sourcePath)
            .resize(20) // Tiny size for blur-up effect
            .jpeg({
                quality: 40,
                progressive: true
            })
            .toFile(previewPath)
            .then(() => console.log(`Created preview for ${file}`))
            .catch(err => console.error(`Error processing ${file}:`, err));
    }
}); 