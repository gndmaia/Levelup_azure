const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Set environment variables to disable telemetry
process.env.NEXT_TELEMETRY_DISABLED = "1";
process.env.DISABLE_NEXT_TELEMETRY = "1";

console.log("=== Azure Oryx Build Configuration Active ===");
console.log("Build Service: App Service Build Service (Oryx)");

// Force production mode on Azure
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
  console.log("NODE_ENV was not set, forcing to production");
}

console.log("Starting Next.js server with telemetry disabled...");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);

// Check if a valid production build exists
const nextDir = path.join(__dirname, '.next');
const buildIdPath = path.join(nextDir, 'BUILD_ID');

if (!fs.existsSync(nextDir) || !fs.existsSync(buildIdPath)) {
  console.error("ERROR: .next build directory not found!");
  console.error("The application must be built before starting.");
  console.error("Please ensure the build runs during deployment.");
  console.error("Check Azure App Service logs for build errors.");
  process.exit(1);
}

const buildId = fs.readFileSync(buildIdPath, 'utf8').trim();
console.log("✓ Production build found, BUILD_ID:", buildId);

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
