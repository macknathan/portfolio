const fs = require('fs');
const path = require('path');

hexo.extend.filter.register('after_generate', function() {
    const sourceDir = path.join(hexo.public_dir, 'webfonts');
    const targetDir = path.join(hexo.public_dir, 'fontawesome', 'webfonts');

    if (fs.existsSync(sourceDir)) {
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        
        const files = fs.readdirSync(sourceDir);
        for (const file of files) {
            fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file));
        }
    }
});
