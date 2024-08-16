const Fontmin = require('fontmin');
const fs = require('fs-extra');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Parse command-line arguments
const argv = yargs(hideBin(process.argv)).argv;

// Directory with input fonts
const inputDir = argv.input || 'input';
const outputDir = argv.output || 'output';
const cssFilePath = path.join(outputDir, 'fonts.css');

// Unicode ranges
const unicodeRanges = {
    'latin': 'U+0020-007F',
    'accents': 'U+00C0-00FF',
    'punctuation': 'U+0020-002F, U+003A-003F, U+005B-005F, U+007B-007E'
};

// Create output directory if it doesn't exist
fs.ensureDirSync(outputDir);

// Function to process fonts
async function processFonts() {
    const files = fs.readdirSync(inputDir);
    let cssContent = '';

    for (const file of files) {
        const filePath = path.join(inputDir, file);

        if (path.extname(filePath).match(/\.(ttf|otf)$/)) {
            for (const [rangeName, unicodeRange] of Object.entries(unicodeRanges)) {
                const fontmin = new Fontmin()
                    .src(filePath)
                    .use(Fontmin.glyph({ text: extractTextFromUnicodeRange(unicodeRange) }))
                    .use(Fontmin.ttf2woff2());

                const tempFilePath = path.join(outputDir, `${path.basename(filePath, path.extname(filePath))}_subset_${rangeName}.woff2`);
                const cssFileName = `${path.basename(filePath, path.extname(filePath))}_subset_${rangeName}.woff2`;

                await new Promise((resolve, reject) => {
                    fontmin.run((err, files) => {
                        if (err) reject(err);
                        else {
                            fs.writeFileSync(tempFilePath, files[0].contents);
                            resolve();
                        }
                    });
                });

                console.log(`Generated file: ${tempFilePath}`);

                // Generate CSS for the font subset
                cssContent += `
/* ${rangeName} */
@font-face {
    font-family: '${path.basename(filePath, path.extname(filePath))}';
    src: url('${cssFileName}') format('woff2');
    font-weight: normal;
    font-style: normal;
    unicode-range: ${unicodeRange};
}

`;
            }
        }
    }

    // Write CSS file
    fs.writeFileSync(cssFilePath, cssContent.trim(), 'utf8');
    console.log(`CSS file created: ${cssFilePath}`);
}

// Function to extract text for a given Unicode range
function extractTextFromUnicodeRange(range) {
    // Convert Unicode range to text
    const text = [];
    range.split(',').forEach(rangePart => {
        const [start, end] = rangePart.split('-').map(cp => parseInt(cp.replace('U+', ''), 16));
        for (let codepoint = start; codepoint <= end; codepoint++) {
            text.push(String.fromCodePoint(codepoint));
        }
    });
    return text.join('');
}

// Start processing
processFonts().then(() => {
    console.log('Processing complete.');
}).catch((err) => {
    console.error('An error occurred:', err);
});
