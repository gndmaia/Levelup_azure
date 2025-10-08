const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Set environment variables to disable telemetry
process.env.NEXT_TELEMETRY_DISABLED = "1";
process.env.DISABLE_NEXT_TELEMETRY = "1";

// Force production mode on Azure
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
  console.log("NODE_ENV was not set, forcing to production");
}

console.log("Starting Next.js server with telemetry disabled...");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);

// Check if .next directory exists, if not build it
const nextDir = path.join(__dirname, '.next');
if (!fs.existsSync(nextDir)) {
  console.log(".next directory not found. Building application...");
  try {
    execSync('npm run build', { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
    console.log("Build completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
} else {
  console.log(".next directory found, skipping build");
}

// Always use production mode on Azure
const dev = false;
console.log("Development mode:", dev);
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
