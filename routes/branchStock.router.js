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
      [cBRANCD, dPODATE]
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
      `SELECT PDT."cGUID",PDT."cPOCD",PDT."iSEQ",PDT."cPRODCD",PDT."cPRODNM",PDT."iSSTOCK",PDT."iMSTOCK",PDT."iLSTOCK",PDT."cSUOMCD",
        PDT."cSUOMNM",PDT."cMUOMCD",PDT."cMUOMNM",PDT."cLUOMCD",PDT."cLUOMNM",PDT."iMARKET",PDT."iPLUSQTY",PDT."iENOUGHQTY",PDT."iTOTAL",
        PDT."iPURCHASE",PDT."iLUNITPRICE",PDT."iNETPRICE",PDT."iMONQTY",PDT."iTUEQTY",PDT."iWEDQTY",PDT."iTHUQTY",PDT."iFRIQTY",PDT."iSATQTY",
        PDT."iSUNQTY",PDT."cSTATUS",PR."cPHOTO_SERV",PR."cPHOTO_PATH",PR."cPHOTO_NM",PR."cBASKCD",BK."cBASKNM",BK."iPRICE",PR."cTYPE",PR."cCATECD",
        PR."cSUBCATECD",PR."cBRNDCD",PDT."dCREADT",PDT."cCREABY",PDT."dUPDADT",PDT."cUPDABY" 
        FROM "TBT_APPODT" AS PDT
        INNER  JOIN "TBM_PRODUCT" AS PR
        ON PDT."cPRODCD" = PR."cPRODCD"
        INNER  JOIN "TBM_BASKET" AS BK
        ON BK."cBASKCD" = PR."cBASKCD"
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

// +++++++++++++++++++ insert TBT_APPO_INCOMHD +++++++++++++++++++
branchStockRouter.post("/addSupplierIncomHD", async (req, res) => {
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
    var dPODATE = req.body.dPODATE;
    var cSTATUS = req.body.cSTATUS;
    var cBRANCD = req.body.cBRANCD;
    var cBRANNM = req.body.cBRANNM;
    var cSUPPCD = req.body.cSUPPCD;
    var cSUPPNM = req.body.cSUPPNM;
    var cPROVINCE = req.body.cPROVINCE;
    var cVEHICD = req.body.cVEHICD;
    var cDRIVER = req.body.cDRIVER;
    var cPLATE = req.body.cPLATE;
    var cPPROVINCE = req.body.cPPROVINCE;
    var iBKINCOMQTY = req.body.iBKINCOMQTY;
    var iBKPLUSQTY = req.body.iBKPLUSQTY;
    var iBKINCOMTOTAL = req.body.iBKINCOMTOTAL;
    var iBKPLUSTOTAL = req.body.iBKPLUSTOTAL;
    var iPROINCOMQTY = req.body.iPROINCOMQTY;
    var iPROPLUSQTY = req.body.iPROPLUSQTY;
    var iPROINCOMTOTAL = req.body.iPROINCOMTOTAL;
    var iPROPLUSTOTAL = req.body.iPROPLUSTOTAL;
    var cCREABY = req.body.cCREABY;

    const result = await client.query(
      `INSERT INTO "TBT_APPO_INCOMHD"("cGUID","cPOCD","dINVENT_DT","dPODATE","cSTATUS","cBRANCD",
      "cBRANNM","cSUPPCD","cSUPPNM","cPROVINCE","cVEHICD","cDRIVER","cPLATE","cPPROVINCE","iBKINCOMQTY",
      "iBKPLUSQTY","iBKINCOMTOTAL","iBKPLUSTOTAL","iPROINCOMQTY","iPROPLUSQTY","iPROINCOMTOTAL","iPROPLUSTOTAL",
      "cCREABY","cUPDABY","dCREADT","dUPDADT")
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,
        $18,$19,$20,$21,$22,$23,$24,$25,$26)`,
      [
        uuid,
        cPOCD,
        dateTime,
        dPODATE,
        cSTATUS,
        cBRANCD,
        cBRANNM,
        cSUPPCD,
        cSUPPNM,
        cPROVINCE,
        cVEHICD,
        cDRIVER,
        cPLATE,
        cPPROVINCE,
        iBKINCOMQTY,
        iBKPLUSQTY,
        iBKINCOMTOTAL,
        iBKPLUSTOTAL,
        iPROINCOMQTY,
        iPROPLUSQTY,
        iPROINCOMTOTAL,
        iPROPLUSTOTAL,
        cCREABY,
        cCREABY,
        dateTime,
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
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

// +++++++++++++++++++ insert TBT_APPO_INCOMDT +++++++++++++++++++
branchStockRouter.post("/addSupplierIncomDT", async (req, res) => {
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
    var iSEQ = req.body.iSEQ;
    var cPRODCD = req.body.cPRODCD;
    var cPRODNM = req.body.cPRODNM;
    var cBASKCD = req.body.cBASKCD;
    var cBASKNM = req.body.cBASKNM;
    var iSSTOCK = req.body.iSSTOCK;
    var iMSTOCK = req.body.iMSTOCK;
    var iLSTOCK = req.body.iLSTOCK;
    var cSUOMCD = req.body.cSUOMCD;
    var cSUOMNM = req.body.cSUOMNM;
    var cMUOMCD = req.body.cMUOMCD;
    var cMUOMNM = req.body.cMUOMNM;
    var cLUOMCD = req.body.cLUOMCD;
    var cLUOMNM = req.body.cLUOMNM;
    var iBKINCOMQTY = req.body.iBKINCOMQTY;
    var iBKPLUSQTY = req.body.iBKPLUSQTY;
    var iBKINCOMTOTAL = req.body.iBKINCOMTOTAL;
    var iBKPLUSTOTAL = req.body.iBKPLUSTOTAL;
    var iPROINCOMQTY = req.body.iPROINCOMQTY;
    var iPROPLUSQTY = req.body.iPROPLUSQTY;
    var iPROINCOMTOTAL = req.body.iPROINCOMTOTAL;
    var iPROPLUSTOTAL = req.body.iPROPLUSTOTAL;
    var iTOTAL = req.body.iTOTAL;
    var iNETPRICE = req.body.iNETPRICE;
    var cCREABY = req.body.cCREABY;

    const result = await client.query(
      `INSERT INTO "TBT_APPO_INCOMDT"("cGUID","cPOCD","iSEQ","cPRODCD","cPRODNM",
      "cBASKCD","cBASKNM","iSSTOCK","iMSTOCK","iLSTOCK","cSUOMCD","cSUOMNM","cMUOMCD",
      "cMUOMNM","cLUOMCD","cLUOMNM","iBKINCOMQTY","iBKPLUSQTY","iBKINCOMTOTAL ","iBKPLUSTOTAL",
      "iPROINCOMQTY","iPROPLUSQTY","iPROINCOMTOTAL ","iPROPLUSTOTAL","iTOTAL","iNETPRICE",
      "cCREABY","cUPDABY","dCREADT","dUPDADT","dINVENT_DT")
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,
        $18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31)`,
      [
        uuid,
        cPOCD,
        iSEQ,
        cPRODCD,
        cPRODNM,
        cBASKCD,
        cBASKNM,
        iSSTOCK,
        iMSTOCK,
        iLSTOCK,
        cSUOMCD,
        cSUOMNM,
        cMUOMCD,
        cMUOMNM,
        cLUOMCD,
        cLUOMNM,
        iBKINCOMQTY,
        iBKPLUSQTY,
        iBKINCOMTOTAL,
        iBKPLUSTOTAL,
        iPROINCOMQTY,
        iPROPLUSQTY,
        iPROINCOMTOTAL,
        iPROPLUSTOTAL,
        iTOTAL,
        iNETPRICE,
        cCREABY,
        cCREABY,
        dateTime,
        dateTime,
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
