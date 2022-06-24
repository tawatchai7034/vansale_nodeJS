require("dotenv").config();
let express = require("express");
let router = express.Router();
const { Client } = require("pg");

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

  router.post("/getCustomer", async (req, res) => {
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
          WHERE "TBM_CUSTOMER_HD"."cCUSTCD" = $1`,
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


module.exports = router;