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
    let storyCount = 0;

    const regex = /<li class="latest-stories__item">[\s\S]*?<a href="([^"]+)">[\s\S]*?<h3 class="latest-stories__item-headline">([\s\S]*?)<\/h3>/g;
    let match;

    while ((match = regex.exec(html)) !== null && storyCount < 6) {
        const storyUrl = match[1];
        const title = match[2].trim();

        latestStories.push({ title, url: 'https://time.com' + storyUrl });
        storyCount++;
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
