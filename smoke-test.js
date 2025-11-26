const http = require('http');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;
const path = '/health';
const timeout = 3000;

const options = {
  hostname: host,
  port: port,
  path: path,
  method: 'GET',
  timeout: timeout
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (res.statusCode === 200 && json.status === 'ok') {
        console.log('SMOKE: PASSED');
        process.exit(0);
      } else {
        console.error('SMOKE: FAILED - unexpected response', data);
        process.exit(2);
      }
    } catch (e) {
      console.error('SMOKE: FAILED - invalid json', e.message);
      process.exit(2);
    }
  });
});

req.on('error', (e) => {
  console.error('SMOKE: FAILED - request error', e.message);
  process.exit(2);
});

req.on('timeout', () => {
  console.error('SMOKE: FAILED - timeout');
  req.destroy();
});
req.end();
