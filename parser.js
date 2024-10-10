const fs = require('fs');
const path = require('path');

const backlogFile = path.join(__dirname, 'BACKLOG.TXT');
const indexFilePath = path.join(__dirname, 'index.html');

fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    const lines = data.split('\n');
    let currentSection = '';
    const sections = {
        'Currently In progress:': [],
        'In hiatus:': [],
        'Backlog:': []
    };

    lines.forEach(line => {
        if (line.startsWith('Currently In progress:')) {
            currentSection = 'Currently In progress:';
        } else if (line.startsWith('In hiatus:')) {
            currentSection = 'In hiatus:';
        } else if (line.startsWith('Backlog:')) {
            currentSection = 'Backlog:';
        } else if (line.startsWith('-') && currentSection) {
            sections[currentSection].push(line);
        }
    });

    const htmlContent = `
    <h1>Currently In progress:</h1>
    <ul>
        ${sections['Currently In progress:'].map(item => `<li>${item}</li>`).join('')}
    </ul>
    <h1>In hiatus:</h1>
    <ul>
        ${sections['In hiatus:'].map(item => `<li>${item}</li>`).join('')}
    </ul>
    <h1>Backlog:</h1>
    <ul>
        ${sections['Backlog:'].map(item => `<li>${item}</li>`).join('')}
    </ul>
    `;

    fs.readFile(indexFilePath, 'utf8', (err, indexData) => {
        if (err) {
            console.error('Error reading the index.html file:', err);
            return;
        }

        const updatedIndexData = indexData.replace('</body>', `${htmlContent}</body>`);

        fs.writeFile(indexFilePath, updatedIndexData, 'utf8', err => {
            if (err) {
                console.error('Error writing the index.html file:', err);
                return;
            }
            console.log('HTML content has been added to index.html successfully.');
        });
    });
});
