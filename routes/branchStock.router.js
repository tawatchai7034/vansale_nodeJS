require("dotenv").config();
let express = require("express");
let branchStockRouter = express.Router();
const crypto = require("crypto");
const { Client } = require("pg");
const bodyParser = require("body-parser");
const fs = require("fs");
const date = require("date-and-time");

let dateTime = new Date().toJSON();
var uuid = `${crypto.randomUUID()}`;

// +++++++++++++++++++ get TBT_APPOHD +++++++++++++++++++
branchStockRouter.post("/getSupplierOrder", async (req, res) => {
    try {
      const client = new Client();
  
      await client.connect(function (err) {
        if (!err) {
          console.log("Connected to Vansale successfully");
        } else {
          console.log(err.message);
        }
      });
  
      var cBRANCD = req.body.cBRANCD;
      var dPODATE = req.body.dPODATE;
  
      const result = await client.query(
        `SELECT * FROM "TBT_APPOHD" 
        WHERE "cBRANCD" = $1 AND  "dPODATE"::DATE > $2
        ORDER BY "dPODATE"`,
        [cBRANCD,dPODATE]
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

  // +++++++++++++++++++ get TBT_APPODT +++++++++++++++++++
branchStockRouter.post("/getSPOrderDT", async (req, res) => {
    try {
      const client = new Client();
  
      await client.connect(function (err) {
        if (!err) {
          console.log("Connected to Vansale successfully");
        } else {
          console.log(err.message);
        }
      });
  
      var cPOCD = req.body.cPOCD;
  
      const result = await client.query(
        `SELECT * FROM "TBT_APPODT" 
        WHERE "cPOCD" = $1 `,
        [cPOCD]
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

  module.exports = branchStockRouter;
