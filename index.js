const express = require("express");
let routeRouter = require("./routes/route.router");

const app = express();
const port = 3000;

app.use(express.json({limit: '50mb'}));

app.use('/apiRoute',routeRouter);

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
  });