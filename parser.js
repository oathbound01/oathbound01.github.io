const url = 'BACKLOG.txt'; 

fetch(url)
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    const modifiedDate = response.headers.get('Last-Modified');
    document.getElementById('lastModified').textContent = 'Last modified: ' + modifiedDate;
    return response.text();
})
.then(data => {
    const lines = data.split('\n');
    let currentSection = '';
    const sections = {
        'Currently in progress:': [],
        'In hiatus:': [],
        'Backlog:': [],
        'Other platforms:': []
    };

    lines.forEach(line => {
        if (line.startsWith('Currently in progress:')) {
            currentSection = 'Currently in progress:';
        } else if (line.startsWith('In hiatus:')) {
            currentSection = 'In hiatus:';
        } else if (line.startsWith('Backlog:')) {
            currentSection = 'Backlog:';
        } else if (line.startsWith('Other platforms:')) {
            currentSection = 'Other platforms:';
        } else if (line.startsWith('-') && currentSection) {
            sections[currentSection].push(line.substring(2).trim());
        }
    });

    const htmlContent = `
    <h1>Currently in progress:</h1>
    <ul>
        ${sections['Currently in progress:'].map(item => `<li>${item}</li>`).join('')}
    </ul>
    <h1>In hiatus:</h1>
    <ul>
        ${sections['In hiatus:'].map(item => `<li>${item}</li>`).join('')}
    </ul>
    <h1>Backlog:</h1>
    <ul>
        ${sections['Backlog:'].map(item => `<li>${item}</li>`).join('')}
    </ul>
    <h1>Other platforms:</h1>
    <ul>
        ${sections['Other platforms:'].map(item => `<li>${item}</li>`).join('')}
    </ul>
    `;

    document.querySelector('footer').insertAdjacentHTML('beforebegin', htmlContent);
})
.catch(error => {
    console.error('There was a problem with the fetch operation:', error);
});
