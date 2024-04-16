const http = require('http'); 
const https = require('https'); 

// Function to fetch HTML content from a URL
function fetchNews(url) {
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
    
    // Fetch the HTML content of Time.com's homepage
    const html = await fetchNews(url);

    // Find the start of the "latest stories" section
    const startIndex = html.indexOf('<div class="partial latest-stories"');
    if (startIndex === -1) {
        throw new Error('Latest stories section not found in the HTML.');
    }

    // Find the end of the section
    const endIndex = html.indexOf('</div>', startIndex);
    if (endIndex === -1) {
        throw new Error('End of latest stories section not found in the HTML.');
    }

    // Extract the HTML for the latest stories section
    const latestStoriesSection = html.slice(startIndex, endIndex + 6); // +6 to include '</div>'

    // List to store the latest stories
    const latestStories = [];

    // Find each list item (story)
    let currentIndex = 0;
    let storyCount = 0;
    const listItemStart = '<li class="latest-stories__item">';

    while (storyCount < 6) {
        // Find the start of the next list item
        const listItemIndex = latestStoriesSection.indexOf(listItemStart, currentIndex);
        if (listItemIndex === -1) {
            break;
        }

        // Find the end of the current list item
        const listItemEnd = latestStoriesSection.indexOf('</li>', listItemIndex);
        if (listItemEnd === -1) {
            break;
        }

        // Extract the current list item HTML
        const listItemHtml = latestStoriesSection.slice(listItemIndex, listItemEnd + 5); // +5 to include '</li>'

        // Extract the URL
        const hrefStart = listItemHtml.indexOf('href="') + 6; // +6 to account for the length of 'href="'
        const hrefEnd = listItemHtml.indexOf('"', hrefStart);
        const storyUrl = listItemHtml.slice(hrefStart, hrefEnd);

        // Extract the title
        const headlineStart = listItemHtml.indexOf('<h3 class="latest-stories__item-headline">') + '<h3 class="latest-stories__item-headline">'.length;
        const headlineEnd = listItemHtml.indexOf('</h3>', headlineStart);
        const storyTitle = listItemHtml.slice(headlineStart, headlineEnd).trim();

        // Add the story to the list
        latestStories.push({ title: storyTitle, url: 'https://time.com' + storyUrl });
        storyCount++;

        // Move the currentIndex forward
        currentIndex = listItemEnd + 5; // +5 to skip '</li>'
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
        res.end('Not Found OR add /latest-stories to URL');
    }
});

server.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
