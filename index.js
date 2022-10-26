const express = require("express");
let routeRouter = require("./routes/route.router");
let stockRouter = require("./routes/stock.router");
let branchStockRouter = require("./routes/branchStock.router");
let storeRouter = require("./routes/store.router");

const app = express();
const port = 3000;

app.use(express.json({limit: '50mb'}));

app.use('/apiRoute',routeRouter);
app.use('/apiStock',stockRouter);
app.use('/apiBranchStock',branchStockRouter);
app.use('/apiStore',storeRouter);

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
  });