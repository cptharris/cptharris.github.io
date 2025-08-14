const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const root = path.join(__dirname, 'public');

app.use((req, res, next) => {
  let filePath = path.join(root, decodeURIComponent(req.path));

  if (
    (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) ||
    (fs.existsSync(filePath + "index.html") && fs.lstatSync(filePath + "index.html").isFile())
  ) {
    console.log("🛜 serving " + filePath.replace(root, ""));
    return res.sendFile(filePath);
  } else if (fs.existsSync(filePath + '.html')) {
    console.log("🛜 serving " + filePath.replace(root, ""));
    return res.sendFile(filePath + '.html');
  } else {
    console.log("⚠️  404 could not find " + filePath.replace(root, ""));
  }

  next();
});

app.use(express.static(root));

app.listen(8000, () => {
  console.log('🚀 Local server running at http://localhost:8000');
});