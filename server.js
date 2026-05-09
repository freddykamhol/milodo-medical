/* eslint-disable @typescript-eslint/no-require-imports */
const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs");

// In many hosts (e.g. Plesk) env vars are configured in the UI.
// For local usage, load .env if present and if dotenv is installed.
try {
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    require("dotenv").config({ path: envPath });
  }
} catch {
  // ignore
}

const next = require("next");

const port = Number.parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "0.0.0.0";
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    http
      .createServer((req, res) => handle(req, res))
      .listen(port, hostname, () => {
        console.log(`Server ready on http://${hostname}:${port} (dev=${dev})`);
      });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
