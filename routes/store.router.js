require("dotenv").config();
let express = require("express");
let storeRouter = express.Router();
const crypto = require("crypto");
const { Client } = require("pg");
const bodyParser = require("body-parser");
const fs = require("fs");
const date = require("date-and-time");

// +++++++++++++++++++ get customer po history +++++++++++++++++++
storeRouter.post("/getCustomerPOHis", async (req, res) => {
    try {
      const client = new Client();
  
      await client.connect(function (err) {
        if (!err) {
          console.log("Connected to Vansale successfully");
        } else {
          console.log(err.message);
        }
      });
  
      var cCUSTCD = req.body.cCUSTCD;
  
      const result = await client.query(
        `SELECT * FROM "TBT_POHD" WHERE "cCUSTCD" = $1 ORDER BY "dPODATE" DESC`,
        [cCUSTCD]
      );
  
      await client.end();
  
      res.json(result.rows);
    } catch (err) {
      const result = {
        success: false,
        message: err,
        result: null,
      };
      res.json(result);
    }
  });

  module.exports = storeRouter;