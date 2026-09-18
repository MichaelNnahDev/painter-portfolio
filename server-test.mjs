// server-test.mjs
import os from 'node:os';
import http from 'node:http';

const server = http.createServer((req, res) => {
  // Set HTTP response headers
  res.writeHead(200, { 'Content-Type': 'application/json' });

  // Send a JSON response with server metadata
  const systemInfo = {
    message: "Hello from Node.js backend!",
    platform: os.platform(),
    uptimeSeconds: Math.floor(os.uptime()),
    cpus: os.cpus().length,
    timestamp: new Date().toISOString(),
  };

  res.end(JSON.stringify(systemInfo, null, 2));
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Backend service listening at http://localhost:${PORT}`);
});