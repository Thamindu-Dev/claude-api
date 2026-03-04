# 🚀 Claude API Server

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-brightgreen?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey?logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A simple Express.js API server that wraps the Claude Code CLI tool, providing a RESTful interface to interact with Claude AI.

---

## 📖 Overview

This project creates a local HTTP API that forwards prompts to the Claude Code CLI and returns the AI responses. It's containerized with Docker for easy deployment and can be used to integrate Claude's capabilities into your own applications.

### ✨ Use Case

**Bypass GLM 4.7 API Limitations in n8n** — This setup was specifically created to work around GLM 4.7 API limitations when using n8n workflows, providing a local API endpoint that can be used as a drop-in replacement.

---

## 🌟 Features

- 🔄 **RESTful API** — Simple HTTP endpoint for generating text with Claude
- 🐳 **Docker Support** — Fully containerized with Docker and Docker Compose
- 📦 **Simple JSON Format** — Easy request/response structure
- ⚙️ **Configurable** — Customizable base URL for different API endpoints
- 🔌 **n8n Integration** — Works seamlessly with n8n workflows

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://www.docker.com/get-started) — Docker Engine and Docker Compose
- [Node.js](https://nodejs.org/) 20+ (if running locally without Docker)
- An Anthropic API key configured for Claude Code CLI

---

## 🏗️ Project Structure

```
claude-api/
├── server.js            # Express server with API endpoint
├── Dockerfile           # Container definition
├── docker-compose.yml   # Docker Compose configuration
└── README.md            # This file
```

---

## ⚡ Quick Start

### Option 1: Docker Compose (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Thamindu-Dev/claude-api.git
   cd claude-api
   ```

2. **Start the container:**
   ```bash
   docker-compose up -d
   ```

3. **Verify it's running:**
   ```bash
   curl http://localhost:3000
   ```

That's it! 🎉 The server is now running on port 3000.

### Option 2: Docker CLI

```bash
docker build -t claude-api .
docker run -p 3000:3000 -e ANTHROPIC_BASE_URL=https://api.z.ai/api/paas/v4/ claude-api
```

---

## 🔌 n8n Setup Guide

This setup is specifically designed to work with n8n workflows, allowing you to bypass GLM 4.7 API limitations by using a local Claude API endpoint.

### Step-by-Step Instructions

#### Step 1: Start the Docker API Server

```bash
docker-compose up -d
```

#### Step 2: Access the Container Terminal

You need to run the coding helper setup inside the container. Choose one of these methods:

**Using Docker Desktop:**
1. Open Docker Desktop
2. Go to the "Containers" tab
3. Find the `claude_local_api` container
4. Click the terminal/console icon to open a shell inside the container

**Using Docker CLI:**
```bash
docker exec -it claude_local_api sh
```

#### Step 3: Run the Coding Helper Setup

Once inside the container terminal, run:

```bash
npx @z_ai/coding-helper
```

Follow the interactive prompts to complete the setup. This will configure the coding helper and prepare it for use.

#### Step 4: Verify the Setup

Test the API with a simple request:

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, can you hear me?"}'
```

**Expected Response:**
```json
{
  "output": "Claude's response here..."
}
```

#### Step 5: Configure in n8n

In your n8n workflow:

1. Add an **HTTP Request** node
2. Configure it to point to your local API:

   | Setting | Value |
   |---------|-------|
   | **Method** | POST |
   | **URL** | `http://localhost:3000/api/generate` |
   | **Authentication** | None |
   | **Body Content Type** | JSON |
   | **Body** | `{"prompt": "{{$json.prompt}}"}` |

3. Use the output in subsequent nodes via `{{$json.output}}`

> **💡 Pro Tip:** If n8n is running in Docker, use `http://claude_local_api:3000` instead of `localhost:3000` to access the API.

### Troubleshooting

| Problem | Solution |
|---------|----------|
| Container won't start | Ensure port 3000 is not already in use |
| Setup fails | Make sure the container has internet access to download the coding helper package |
| API returns empty response | Check that the coding helper setup was completed successfully |

---

## 📡 API Documentation

### Endpoint

```
POST /api/generate
```

### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "prompt": "Your prompt here"
}
```

### Response

```json
{
  "output": "Claude's response here"
}
```

### Example: Using cURL

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain quantum computing in simple terms"}'
```

### Example: Using JavaScript

```javascript
const response = await fetch('http://localhost:3000/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'Write a haiku about programming'
  })
});

const data = await response.json();
console.log(data.output);
```

### Example: Using Python

```python
import requests

url = 'http://localhost:3000/api/generate'
payload = {'prompt': 'Explain quantum computing in simple terms'}

response = requests.post(url, json=payload)
print(response.json()['output'])
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ANTHROPIC_BASE_URL` | Custom base URL for the Anthropic API | `https://api.z.ai/api/paas/v4/` |

Modify these in `docker-compose.yml` or pass them as environment variables.

### Port Configuration

The default port is `3000`. To change it, modify the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"  # Maps container port 3000 to host port 8080
```

---

## 🛠️ Development

To modify the server behavior:

1. Edit `server.js`
2. Rebuild the container:
   ```bash
   docker-compose down && docker-compose up -d --build
   ```

---

## 🛑 Stopping the Server

```bash
docker-compose down
```

To remove volumes as well:
```bash
docker-compose down -v
```

---

## 📊 Technical Details

| Component | Version/Info |
|-----------|--------------|
| **Node.js** | 20-alpine |
| **Framework** | Express.js |
| **CLI Tool** | @anthropic-ai/claude-code |
| **Container OS** | Alpine Linux |
| **Default Port** | 3000 |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is provided as-is for personal and educational use.

---

## 💡 Notes

- This server runs Claude Code CLI in a subprocess for each request
- Ensure your Anthropic API credentials are properly configured for Claude Code CLI to function
- The server logs all requests and responses to the console for debugging
- **For n8n users**: Remember to run `npx @z_ai/coding-helper` inside the container after startup for initial setup
- If n8n is containerized, use the container name (`claude_local_api:3000`) instead of `localhost:3000`

---

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

<p align="center">
  <sub>Built with ❤️ for the n8n community</sub>
</p>
