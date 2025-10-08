const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')
const path = require('path')

// Set environment variables to disable telemetry BEFORE Next.js initialization
process.env.NEXT_TELEMETRY_DISABLED = "1";
process.env.DISABLE_NEXT_TELEMETRY = "1";
process.env.NEXT_TELEMETRY_DEBUG = "0";

// Ensure .next directory exists and create trace file if needed
const nextDir = path.join(process.cwd(), '.next');
if (!fs.existsSync(nextDir)) {
  fs.mkdirSync(nextDir, { recursive: true });
}

// Create empty trace file to prevent ENOENT errors
const traceFile = path.join(nextDir, 'trace');
if (!fs.existsSync(traceFile)) {
  try {
    fs.writeFileSync(traceFile, '', 'utf8');
  } catch (err) {
    console.warn('Could not create trace file:', err.message);
  }
}

console.log("Starting Next.js server with telemetry disabled...");

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.WEBSITE_HOSTNAME || 'localhost'
const port = process.env.PORT || 3000

// Initialize Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error('Server error:', err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
}).catch((err) => {
  console.error('Failed to start Next.js:', err)
  process.exit(1)
})
