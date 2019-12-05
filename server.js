const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;
const serveDir = path.join(__dirname, 'build');

app.use('/', express.static(serveDir));

(async () => {
  await app.listen(PORT);
  console.log(`server connected to port ${PORT}`);
})();
