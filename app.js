const http = require('http');
const https = require('https');

// Function to fetch HTML content from a URL
function fetchHTML(url) {
    return new Promise((resolve, reject) => {
        const clientModule = url.startsWith('https') ? https : http;

        const options = {
            timeout: 10000,
        };

        const req = clientModule.get(url, options, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                resolve(data);
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timed out'));
        });
    });
}

// Function to fetch and parse the latest 6 stories from Time.com
async function getLatestStories() {
    const url = 'https://time.com/';
    const html = await fetchHTML(url);

    const latestStories = [];
    let startIndex = 0;
    let storyCount = 0;

    while (storyCount < 6) {
        startIndex = html.indexOf('<li class="latest-stories__item">', startIndex);
        if (startIndex === -1) break;

        const endIndex = html.indexOf('</li>', startIndex);
        if (endIndex === -1) break;

        const listItemContent = html.slice(startIndex, endIndex);

        const hrefIndex = listItemContent.indexOf('href="');
        if (hrefIndex !== -1) {
            const urlStart = hrefIndex + 6;
            const urlEnd = listItemContent.indexOf('"', urlStart);
            const storyUrl = listItemContent.slice(urlStart, urlEnd);

            const titleStart = listItemContent.indexOf('<h3 class="latest-stories__item-headline">');
            const titleEnd = listItemContent.indexOf('</h3>', titleStart);
            const title = listItemContent.slice(titleStart + 36, titleEnd).trim();

            latestStories.push({ title, url: 'https://time.com' + storyUrl });
            storyCount++;
        }

        startIndex = endIndex + 5;
    }

    return latestStories;
}

// Create an HTTP server
const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/latest-stories') {
        try {
            const stories = await getLatestStories();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(stories));
        } catch (error) {
            console.error('Error fetching latest stories:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to fetch the latest stories.' }));
        }
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
