const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;
const fs = require('fs');

app.use(cors()); //allow CORS from any origin

//serve JSON file
app.get('/files', (req, res) => {
  fs.readFile('files.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading JSON file.');
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
