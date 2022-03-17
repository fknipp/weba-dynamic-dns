import {
  HETZNER_DNS_API_KEY,
  HETZNER_DNS_API_ROOT,
  DOMAIN,
} from './configuration.mjs';

import express from 'express';
import path from 'path';

const app = express();
const port = 3010;

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('pages/index.html'));
});

app.get('/api/dnsname', async (req, res) => {
  console.log(req);
  res.json({
    ip: req.socket.remoteAddress,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
