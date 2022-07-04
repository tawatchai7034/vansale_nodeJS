require("dotenv").config();
let express = require("express");
let router = express.Router();
const crypto = require('crypto');
const { Client } = require("pg");

router.post("/getRoute", async (req, res) => {
  try {
    const client = new Client();

    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var name = req.body.name;

    const result = await client.query(
      `SELECT * FROM "TBM_ROUTE" 
        WHERE "TBM_ROUTE"."cRTENM" LIKE $1`,
      [name]
    );

    await client.end();

    res.json(result.rows);
  } catch (err) {
    const result = {
      success: false,
      message: err,
    };
    res.json(result);
  }
});

router.post("/getRouteTransfers", async (req, res) => {
  try {
    const client = new Client();

    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var id = req.body.id;

    const result = await client.query(
      `SELECT * FROM "TBM_CUSTOMER_HD" 
          INNER JOIN "TBM_CUSTOMER_ROUTE" 
          ON "TBM_CUSTOMER_HD"."cCUSTCD" = "TBM_CUSTOMER_ROUTE"."cCUSTCD"
          INNER JOIN "TBM_CUSTOMER_DT" 
          ON "TBM_CUSTOMER_DT"."cCUSTCD" = "TBM_CUSTOMER_ROUTE"."cCUSTCD"
          WHERE "TBM_CUSTOMER_ROUTE"."cRTECD" = $1`,
      [id]
    );

    await client.end();

    res.json(result.rows);
  } catch (err) {
    const result = {
      success: false,
      message: err,
    };
    res.json(result);
  }
});

router.post("/getPoHDAndPoDT", async (req, res) => {
  try {
    const client = new Client();

    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var CUSTCD = req.body.CUSTCD;
    var POCD = req.body.POCD;

    const result = await client.query(
      `SELECT HD."cCUSTCD",HD."cPOCD",count(DT.*) AS iItems ,
      count(DT."cBASKCD")AS iBasket,
      DT."iTOTAL"   
      FROM "TBT_POHD" HD
      INNER JOIN "TBT_PODT" DT ON HD."cPOCD" = DT."cPOCD"
      WHERE HD."cCUSTCD" = $1 AND HD."cPOCD" = $2
      GROUP BY  HD."cCUSTCD",HD."cPOCD",DT."cBASKCD",DT."iTOTAL"`,
      [CUSTCD,POCD]
    );

    await client.end();

    res.json(result.rows);
  } catch (err) {
    const result = {
      success: false,
      message: err,
    };
    res.json(result);
  }
});

router.post("/getPOCD", async (req, res) => {
  try {
    const client = new Client();

    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var CUSTCD = req.body.CUSTCD;

    const result = await client.query(
      `SELECT HD."cCUSTCD",HD."cPOCD",HD."dPODATE"  
      FROM "TBT_POHD" HD
      INNER JOIN "TBT_PODT" DT ON HD."cPOCD" = DT."cPOCD"
      WHERE HD."cCUSTCD" = $1
      GROUP BY  HD."cCUSTCD",HD."cPOCD",DT."cBASKCD",DT."iTOTAL"
      ORDER BY HD."dPODATE" DESC
      LIMIT 1`,
      [CUSTCD]
    );

    await client.end();

    res.json(result.rows);
  } catch (err) {
    const result = {
      success: false,
      message: err,
    };
    res.json(result);
  }
});

module.exports = router;
