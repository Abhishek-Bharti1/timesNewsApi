# Time.com Latest Stories API

This project is a Node.js application that fetches and parses the latest 6 stories from Time.com's homepage and serves them as a JSON API response. The application uses built-in Node.js modules (`http` and `https`) and avoids relying on external libraries.

## Features

- **Fetch Latest Stories:** Retrieves HTML content from Time.com's homepage using an HTTP GET request.
- **Extract Story Information:** Processes the HTML content to extract the story titles and URLs.
- **Serve Stories as API:** Serves the extracted information as a JSON response to API requests on the `/latest-stories` endpoint.
- **Error Handling:** Handles potential errors during fetching and parsing of HTML content.

## Getting Started

### Prerequisites

- **Node.js:** Make sure you have Node.js installed on your machine.

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Abhishek-Bharti1/timesNewsApi.git
    ```

2. Navigate to the project directory:
    ```bash
    cd timesNewsApi
    ```

### Usage

1. Start the application:
    ```bash
    node app.js
    ```

2. Access the API endpoint:
    - Once the server is running, you can access the API endpoint at [http://localhost:3000/latest-stories](http://localhost:3000/latest-stories).
    - The API returns a JSON response containing the latest 6 stories from Time.com's homepage.

### Example API Response

```json
[
    {
        "title": "The U.K. to Vote on World's Only Generational Smoking Ban",
        "url": "https://time.com/6967337/uk-generational-smoking-ban/"
    },
    {
        "title": "Tech Firms Fall Short on Election Security",
        "url": "https://time.com/6967334/ai-elections-disinformation-meta-tiktok/"
    },
    {
        "title": "Patrick Mahomes Is Rewriting the Playbook",
        "url": "https://time.com/6966732/patrick-mahomes-interview-time100-2024/"
    },
    {
        "title": "Patrick Mahomes Is on the 2024 TIME100",
        "url": "https://time.com/6964929/patrick-mahomes-time100-2024/"
    },
    {
        "title": "Ozempic Hurts the Fight Against Eating Disorders",
        "url": "https://time.com/6966957/ozempic-eating-disorders-essay/"
    },
    {
        "title": "How VR Could Transform Architecture",
        "url": "https://time.com/6964951/vr-virtual-reality-architecture-meta-quest/"
    }
]
