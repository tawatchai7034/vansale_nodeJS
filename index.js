const express = require("express");
let router = require("./routes/router");

const app = express();
const port = 3000;

app.use(express.json({limit: '50mb'}));

app.use(router);

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
  });