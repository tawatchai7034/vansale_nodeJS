require("dotenv").config();
let express = require("express");
let stockRouter = express.Router();
const crypto = require("crypto");
const { Client } = require("pg");
const bodyParser = require("body-parser");
const fs = require("fs");
const date = require("date-and-time");

let dateTime = new Date().toJSON();
var uuid = `${crypto.randomUUID()}`;

// +++++++++++++++++++ add Stock Balance +++++++++++++++++++
stockRouter.post("/addStockBalance", async (req, res) => {
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
    var cPRODCD = req.body.cPRODCD;
    var cUOMCD = req.body.cUOMCD;
    var cWH = req.body.cWH;
    var cPRODNM = req.body.cPRODNM;
    var cTYPE = req.body.cTYPE;
    var cCATECD = req.body.cCATECD;
    var cSUBCATECD = req.body.cSUBCATECD;
    var cBRNDCD = req.body.cBRNDCD;
    var iWEIGHT = req.body.iWEIGHT;
    var cSTATUS = req.body.cSTATUS;
    var iQTY = req.body.iQTY;
    var cCREABY = req.body.cCREABY;

    const oldResult = await client.query(
      `SELECT *
        FROM "TBR_INVENTORY_BALANCE" 
        WHERE "cBRANCD" = $1 AND "cPRODCD" = $2 AND "cUOMCD" = $3 AND "cWH" = $4`,
      [cBRANCD, cPRODCD, cUOMCD, cWH]
    );

    if (oldResult.rows.length > 0) {
      const result = await client.query(
        `UPDATE "TBR_INVENTORY_BALANCE" 
          SET "cPRODNM" = $5,"cTYPE"= $6,
          "cCATECD"= $7,"cSUBCATECD"= $8,
          "cBRNDCD"= $9,"iQTY"= $10,
          "iWEIGHT"= $11,"cSTATUS"= $12,
          "cUPDABY" = $13,"dUPDADT" =$14
          WHERE "cBRANCD" = $1 AND "cPRODCD" = $2 AND "cUOMCD" = $3 AND "cWH" = $4`,
        [
          cBRANCD,
          cPRODCD,
          cUOMCD,
          cWH,
          cPRODNM,
          cTYPE,
          cCATECD,
          cSUBCATECD,
          cBRNDCD,
          iQTY,
          iWEIGHT,
          cSTATUS,
          cCREABY,
          dateTime,
        ]
      );

      await client.end();

      const message = {
        success: true,
        message: "success",
        result: null,
      };
      res.json(message);
    } else {
      const result = await client.query(
        `INSERT INTO "TBR_INVENTORY_BALANCE" 
        ("cGUID","cBRANCD","cWH","cPRODCD","cUOMCD","cPRODNM","cTYPE",
        "cCATECD","cSUBCATECD","cBRNDCD","iQTY","iWEIGHT","cSTATUS","dCREADT","cCREABY","dUPDADT","cUPDABY")
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
        [
          uuid,
          cBRANCD,
          cWH,
          cPRODCD,
          cUOMCD,
          cPRODNM,
          cTYPE,
          cCATECD,
          cSUBCATECD,
          cBRNDCD,
          iQTY,
          iWEIGHT,
          cSTATUS,
          dateTime,
          cCREABY,
          dateTime,
          cCREABY,
        ]
      );

      await client.end();

      const message = {
        success: true,
        message: "success",
        result: null,
      };
      res.json(message);
    }
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

// +++++++++++++++++++ add Stock Card +++++++++++++++++++
stockRouter.post("/addStockCard", async (req, res) => {
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
    var cPRODCD = req.body.cPRODCD;
    var cUOMCD = req.body.cUOMCD;
    var cWH = req.body.cWH;
    var cREF_DOC = req.body.cREF_DOC;
    var iRECEIVE_QTY = req.body.iRECEIVE_QTY;
    var iISSUE_QTY = req.body.iISSUE_QTY;
    var cREMARK = req.body.cREMARK;
    var cLOT_NO = req.body.cLOT_NO;
    var cCREABY = req.body.cCREABY;

    const oldResult = await client.query(
      `SELECT *
        FROM "TBR_INVENTORY_BALANCE" 
        WHERE "cBRANCD" = $1 AND "cPRODCD" = $2 AND "cUOMCD" = $3 AND "cWH" = $4`,
      [cBRANCD, cPRODCD, cUOMCD, cWH]
    );

    if (oldResult.rows.length > 0) {
      // console.log(oldResult.rows.length)
      var stock = oldResult.rows[0];
      var qty =
        parseFloat(stock.iQTY) +
        parseFloat(iRECEIVE_QTY) -
        parseFloat(iISSUE_QTY);

      const result = await client.query(
        `INSERT INTO "TBR_INVENTORY_STOCKCARD" 
        ("cGUID","cBRANCD","cWH","cPRODCD","cUOMCD","dINVENT_DT","cREF_DOC",
        "iBEGIN_QTY","iRECEIVE_QTY","iISSUE_QTY","iEND_QTY","cREMARK","dCREADT",
        "cCREABY","dUPDADT","cUPDABY","cLOT_NO")
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
        [
          uuid,
          cBRANCD,
          cWH,
          cPRODCD,
          cUOMCD,
          dateTime,
          cREF_DOC,
          stock.iQTY,
          iRECEIVE_QTY,
          iISSUE_QTY,
          qty,
          cREMARK,
          dateTime,
          cCREABY,
          dateTime,
          cCREABY,
          cLOT_NO,
        ]
      );

      await client.query(
        `UPDATE "TBR_INVENTORY_BALANCE" 
      SET "iQTY" = $1,
      "cUPDABY" = $2,
      "dUPDADT" =$3
      WHERE "cBRANCD" = $4 AND "cPRODCD" = $5 AND "cUOMCD" = $6 AND "cWH" = $7`,
        [qty, cCREABY, dateTime, cBRANCD, cPRODCD, cUOMCD, cWH]
      );
      await client.end();

      const message = {
        success: true,
        message: "success",
        result: null,
      };
      res.json(message);
    } else {
      const proResult = await client.query(
        `SELECT *
          FROM "TBM_PRODUCT" 
          WHERE "cPRODCD" = $1 `,
        [cPRODCD]
      );

      await client.query(
        `INSERT INTO "TBR_INVENTORY_BALANCE" 
        ("cGUID","cBRANCD","cWH","cPRODCD","cUOMCD","cPRODNM","cTYPE",
        "cCATECD","cSUBCATECD","cBRNDCD","iQTY","iWEIGHT","cSTATUS","dCREADT","cCREABY","dUPDADT","cUPDABY")
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
        [
          uuid,
          cBRANCD,
          cWH,
          cPRODCD,
          cUOMCD,
          proResult.rows[0].cPRODNM,
          proResult.rows[0].cTYPE,
          proResult.rows[0].cCATECD,
          proResult.rows[0].cSUBCATECD,
          proResult.rows[0].cBRNDCD,
          parseFloat(iRECEIVE_QTY) - parseFloat(iISSUE_QTY),
          0.0,
          "Y",
          dateTime,
          cCREABY,
          dateTime,
          cCREABY,
        ]
      );

      var stock = oldResult.rows[0];
      var qty = parseFloat(iRECEIVE_QTY) - parseFloat(iISSUE_QTY);

      const result = await client.query(
        `INSERT INTO "TBR_INVENTORY_STOCKCARD" 
        ("cGUID","cBRANCD","cWH","cPRODCD","cUOMCD","dINVENT_DT","cREF_DOC",
        "iBEGIN_QTY","iRECEIVE_QTY","iISSUE_QTY","iEND_QTY","cREMARK","dCREADT",
        "cCREABY","dUPDADT","cUPDABY","cLOT_NO")
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
        [
          uuid,
          cBRANCD,
          cWH,
          cPRODCD,
          cUOMCD,
          dateTime,
          cREF_DOC,
          0,
          iRECEIVE_QTY,
          iISSUE_QTY,
          qty,
          cREMARK,
          dateTime,
          cCREABY,
          dateTime,
          cCREABY,
          cLOT_NO,
        ]
      );

      await client.end();

      const message = {
        success: true,
        message: "success",
        result: null,
      };
      res.json(message);
    }
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

module.exports = stockRouter;
