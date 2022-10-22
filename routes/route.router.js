require("dotenv").config();
let express = require("express");
let routeRouter = express.Router();
const crypto = require("crypto");
const { Client } = require("pg");
const bodyParser = require("body-parser");
const fs = require("fs");
const date = require("date-and-time");




// +++++++++++++++++++ TBM_ROUTE +++++++++++++++++++
routeRouter.post("/getRoute", async (req, res) => {
  try {
    const client = new Client();
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var cRTENM = req.body.cRTENM;
    var cBRANCD = req.body.cBRANCD;

    const result = await client.query(
      `SELECT * FROM "TBM_ROUTE" 
        WHERE "TBM_ROUTE"."cRTENM" LIKE $1 AND "cBRANCD" = $2`,
      [cRTENM, cBRANCD]
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

// +++++++++++++++++++ TBM_CUSTOMER_HD +++++++++++++++++++
routeRouter.post("/getRouteTransfers", async (req, res) => {
  try {
    const client = new Client();
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var cRTECD = req.body.cRTECD;
    var shippingDate = req.body.dSHIPDATE;
    var cGRPCD = req.body.cGRPCD;
    var cBRANCD = req.body.cBRANCD;
    var cUSEDT = req.body.cUSEDT;

    if (cUSEDT === true) {
      const result = await client.query(
        `SELECT CHD."cGUID",CHD."cCUSTCD",CHD."cCUSTNM",CHD."cCUSTBNM",CHD."cTAXNO",
        CHD."cTEL",CHD."cCONTACT",CHD."cCONTACT_TEL",CHD."cLINEID",CHD."cBRANCD",
        CHD."cCUSTTYPE",CHD."cPAYTYPE",CHD."iCREDTERM",CHD."iCREDLIM",CHD."cTSELLCD",
        CHD."cISBASKET",CHD."cSTATUS",RD."cGRPCD",RD."cRTECD",RD."iSEQROUTE",DT."cISPHOTO",DT."cPHOTO_SERV",
            DT."cPHOTO_PATH",DT."cPHOTO_NM",DT."cADDRESS",DT."cDISTRICT",DT."cSHIPTO",HD."cADDRESS",DT."cLOCATION",
        DT."cPROVINCE",DT."cDISTRICT",DT."cSUBDIST",DT."cPOSTCD",DT."cDISTANCS",DT."cASSET",
        DT."cLATITUDE",DT."cLONGTITUDE",
        HD."cPREPAIRCFSTATUS",HD."cPOSTATUS",CHD."dCREADT",CHD."cCREABY",CHD."dUPDADT",
        CHD."cUPDABY"
        FROM "TBM_CUSTOMER_HD" AS CHD
            INNER JOIN "TBM_CUSTOMER_ROUTE" AS RD
            ON CHD."cCUSTCD" = RD."cCUSTCD"
            INNER JOIN "TBM_CUSTOMER_DT" AS DT
            ON DT."cCUSTCD" = RD."cCUSTCD"
            LEFT JOIN "TBT_POHD" AS HD
            ON CHD."cCUSTCD" = HD."cCUSTCD"
            WHERE RD."cRTECD" = $1 AND HD."dSHIPDATE"::date = $2 AND RD."cGRPCD" = $3 AND CHD."cBRANCD" = $4`,
        [cRTECD, shippingDate, cGRPCD, cBRANCD]
      );

      await client.end();

      res.json(result.rows);
    } else {
      const result = await client.query(
        `SELECT CHD."cGUID",CHD."cCUSTCD",CHD."cCUSTNM",CHD."cCUSTBNM",CHD."cTAXNO",
        CHD."cTEL",CHD."cCONTACT",CHD."cCONTACT_TEL",CHD."cLINEID",CHD."cBRANCD",
        CHD."cCUSTTYPE",CHD."cPAYTYPE",CHD."iCREDTERM",CHD."iCREDLIM",CHD."cTSELLCD",
        CHD."cISBASKET",CHD."cSTATUS",RD."cGRPCD",RD."cRTECD",RD."iSEQROUTE",DT."cISPHOTO",DT."cPHOTO_SERV",
            DT."cPHOTO_PATH",DT."cPHOTO_NM",DT."cADDRESS",DT."cDISTRICT",DT."cSHIPTO",HD."cADDRESS",DT."cLOCATION",
        DT."cPROVINCE",DT."cDISTRICT",DT."cSUBDIST",DT."cPOSTCD",DT."cDISTANCS",DT."cASSET",
        DT."cLATITUDE",DT."cLONGTITUDE",
        HD."cPREPAIRCFSTATUS",HD."cPOSTATUS",CHD."dCREADT",CHD."cCREABY",CHD."dUPDADT",
        CHD."cUPDABY"
        FROM "TBM_CUSTOMER_HD" AS CHD
            INNER JOIN "TBM_CUSTOMER_ROUTE" AS RD
            ON CHD."cCUSTCD" = RD."cCUSTCD"
            INNER JOIN "TBM_CUSTOMER_DT" AS DT
            ON DT."cCUSTCD" = RD."cCUSTCD"
            LEFT JOIN "TBT_POHD" AS HD
            ON CHD."cCUSTCD" = HD."cCUSTCD"
            WHERE RD."cRTECD" = $1  AND RD."cGRPCD" = $2 AND HD."cBRANCD" = $3 AND HD."cPOSTATUS"!='3'
            AND HD."cPOSTATUS"!='4'AND HD."cPOSTATUS"!='5'AND HD."cPOSTATUS"!='6'`,
        [cRTECD, cGRPCD, cBRANCD]
      );

      await client.end();

      res.json(result.rows);
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

// +++++++++++++++++++ TBT_POHD && TBT_PODT +++++++++++++++++++
routeRouter.post("/getPoHDAndPoDT", async (req, res) => {
  try {
    const client = new Client();
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var custcd = req.body.custcd;
    var pocd = req.body.pocd;
    var cPRODNM = req.body.cPRODNM;
    var cPRODCD = req.body.cPRODCD;

    const result = await client.query(
      `SELECT HD."cCUSTCD",PR."cTYPE",HD."cPOCD",DT."cPRODCD",DT."cPRODNM",DT."cBASKCD",DT."cBASKNM",count(DT.*) AS iItems ,
      count(DT."cBASKCD")AS iBasket,
      DT."iTOTAL"   
      FROM "TBT_POHD" HD
      INNER JOIN "TBT_PODT" DT ON HD."cPOCD" = DT."cPOCD"
      INNER JOIN "TBM_PRODUCT" PR ON PR."cPRODCD" = DT."cPRODCD"
      WHERE HD."cCUSTCD" = $1 AND HD."cPOCD" = $2 AND  DT."cPRODNM" LIKE $3 AND  DT."cPRODCD" LIKE $4
      GROUP BY  HD."cCUSTCD",PR."cTYPE",HD."cPOCD",DT."cPRODCD",DT."cPRODNM",DT."cBASKCD",DT."cBASKNM",DT."cBASKCD",DT."iTOTAL"
      ORDER BY  DT."iTOTAL" DESC`,
      [custcd, pocd, cPRODNM, cPRODCD]
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

routeRouter.post("/getPOCD", async (req, res) => {
  try {
    const client = new Client();
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var cCUSTCD = req.body.cCUSTCD;
    var dSHIPDATE = req.body.dSHIPDATE;

    const result = await client.query(
      `SELECT HD."cCUSTCD",HD."cPOCD",HD."dPODATE",HD."dSHIPDATE"   
      FROM "TBT_POHD" HD
      INNER JOIN "TBT_PODT" DT ON HD."cPOCD" = DT."cPOCD"
      WHERE HD."cCUSTCD" = $1  AND HD."dSHIPDATE"::date = $2
      GROUP BY  HD."cCUSTCD",HD."cPOCD",DT."cBASKCD",DT."iTOTAL"
      ORDER BY HD."dPODATE" DESC
      LIMIT 1`,
      [cCUSTCD, dSHIPDATE]
    );

    await client.end();

    res.json(result.rows[0]);
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

// +++++++++++++++++++ TBT_PODT +++++++++++++++++++
routeRouter.post("/queryPODTwithPOCD", async (req, res) => {
  try {
    const client = new Client();
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });
    var cPOCD = req.body.cPOCD;
    var cPRODNM = req.body.cPRODNM;
    var cPRODCD = req.body.cPRODCD;

    const result = await client.query(
      `SELECT DT."cGUID",DT."cPOCD",DT."iSEQ",DT."cPRODCD",DT."cPRODNM",PRO."cTYPE",TY."cTYPENM",PRO."cCATECD",
      CA."cCATENM",PRO."cSUBCATECD",SCA."cSUBCATENM",DT."cBRNDCD",DT."cBRNDNM",DT."iSSIZEQTY",DT."iMSIZEQTY",
		DT."iLSIZEQTY",DT."cSUOMNM",DT."cMUOMNM",DT."cLUOMNM",DT."cPROMO",DT."iDISCOUNT",
      DT."cDISCOUNT",DT."iFREE",DT."iTOTAL",DT."cBASKCD",DT."cBASKNM",DT."cSTATUS",
      DT."dCREADT",DT."cCREABY",DT."dUPDADT",DT."cUPDABY",DT."cINSERTYPE",DT."iSUNITPRICE",
      DT."iMUNITPRICE",DT."iLUNITPRICE",DT."cPREPAIRSTATUS",DT."iPREPAIRAMOUT",
      PRO."cPHOTO_SERV",PRO."cPHOTO_PATH",DT."iNETTOTAL",DT."iINCOMPRO",DT."iCANCLEPRO",DT."iLOSSPRO",
      DT."cSUOMCD",DT."cMUOMCD",DT."cLUOMCD"
      FROM "TBT_PODT" AS DT 
      LEFT JOIN "TBM_PRODUCT" AS PRO ON DT."cPRODCD" = PRO."cPRODCD"
      INNER JOIN "TBM_PRODUCT_TYPE" AS TY ON TY."cTYPECD" = PRO."cTYPE"   
      INNER JOIN "TBM_CATEGORY" AS CA ON CA."cCATECD" = PRO."cCATECD"
      INNER JOIN "TBM_CATEGORY_SUB" AS SCA ON SCA."cSUBCATECD" = PRO."cSUBCATECD"
      INNER JOIN "TBM_BRAND" AS BR ON BR."cBRNCD" = PRO."cBRNDCD"
      WHERE DT."cPOCD"= $1 AND  DT."cPRODNM" LIKE $2 AND  DT."cPRODCD" LIKE $3`,
      [cPOCD, cPRODNM, cPRODCD]
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

routeRouter.post("/updatePODT-PREPAIRSTATUS", async (req, res) => {
  try {
    const client = new Client();
    var uuid = `${crypto.randomUUID()}`;
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var cPREPAIRSTATUS = req.body.cPREPAIRSTATUS;
    var iPREPAIRAMOUT = req.body.iPREPAIRAMOUT;
    var cPOCD = req.body.cPOCD;
    var iSEQ = req.body.iSEQ;

    await client.query(
      `UPDATE "TBT_PODT" 
      SET 
      "cPREPAIRSTATUS" = $1,
      "iPREPAIRAMOUT" = $2
      WHERE "cPOCD" IN ( $3 ) AND  "iSEQ" IN($4)`,
      [cPREPAIRSTATUS, iPREPAIRAMOUT, cPOCD, iSEQ]
    );

    await client.end();
    const result = {
      success: true,
      message: "update successfully",
      result: null,
    };
    res.json(result);
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

// +++++++++++++++++++ TBT_POHD +++++++++++++++++++
routeRouter.post("/updatePOHD-PREPAIRCFSTATUS", async (req, res) => {
  try {
    const client = new Client();
    var uuid = `${crypto.randomUUID()}`;
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var cPREPAIRCFSTATUS = req.body.cPREPAIRCFSTATUS;
    var iBASKETTOTAL = req.body.iBASKETTOTAL;
    var cPOCD = req.body.cPOCD;

    await client.query(
      `UPDATE "TBT_POHD" 
      SET 
      "cPREPAIRCFSTATUS" = $1,
      "iBASKETTOTAL" = $2
      WHERE "cPOCD" IN ( $3 )`,
      [cPREPAIRCFSTATUS, iBASKETTOTAL, cPOCD]
    );

    await client.end();
    const result = {
      success: true,
      message: "update successfully",
      result: null,
    };
    res.json(result);
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});
// ++++++++++++++ TBT_POPREPAIRHD ++++++++++++++
// insert
routeRouter.post("/addPOPREPAIRHD", async (req, res) => {
  try {
    const client = new Client();
    var uuid = `${crypto.randomUUID()}`;
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });
    let dateNow = new Date();
    var createBy = req.body.cCREABY;
    let dateInput = req.body.dDATE;
    let dateSplit = dateInput.split("/");
    let newDateFormat = dateSplit[2] + "-" + dateSplit[1] + "-" + dateSplit[0];
    let dateData = new Date(newDateFormat);

    var cGUID = `${crypto.randomUUID()}`;
    var cPOCD = req.body.cPOCD;
    var dDATE = dateData;
    var cSTATUS = req.body.cSTATUS;
    var cBRANCD = req.body.cBRANCD;
    var cGRPCD = req.body.cGRPCD;
    var cRTECD = req.body.cRTECD;
    var cVEHICD = req.body.cVEHICD;
    var cDRIVER = req.body.cDRIVER;
    var cPLATE = req.body.cPLATE;
    var cPROVINCE = req.body.cPROVINCE;
    var iCAP = req.body.iCAP;
    var iWEIGHT = req.body.iWEIGHT;
    var cCUSTCD = req.body.cCUSTCD;
    var iDPBASKET = req.body.iDPBASKET;
    var iSUMTOTAL = req.body.iSUMTOTAL;
    var iPAID = req.body.iPAID;
    var dCREADT = dateNow;
    var cCREABY = createBy;
    var dUPDADT = dateNow;
    var cUPDABY = createBy;

    // TBT_POPREPAIRDT
    var iSEQ = 1;
    var cSTATUSDT = "Y";
    var cPRODCD = "";
    var cPRODNM = "";
    var cBRNDCD = "";
    var cBRNDNM = "";
    var iSSIZEQTY = 0;
    var iMSIZEQTY = 0;
    var iLSIZEQTY = 0;
    var cPROMO = "";
    var iDISCOUNT = 0;
    var cDISCOUNT = "";
    var iFREE = 0;
    var iTOTAL = iSUMTOTAL;
    var cBASKCD = "";
    var cBASKNM = "";
    var cINSERTYPE = "A";
    var iSUNITPRICET = 0;
    var iMUNITPRICE = 0;
    var iLUNITPRICE = 0;

    await client.query(
      `INSERT INTO "TBT_POPREPAIRHD"
      ("cGUID", "cPOCD", "dDATE", "cSTATUS", 
      "cBRANCD", "cGRPCD", "cRTECD", "cVEHICD","cDRIVER",
      "cPLATE", "cPROVINCE","iCAP","iWEIGHT","cCUSTCD",
      "iDPBASKET","iSUMTOTAL","iPAID","dCREADT","cCREABY",
      "dUPDADT","cUPDABY"
      ) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
      [
        cGUID,
        cPOCD,
        dDATE,
        cSTATUS,
        cBRANCD,
        cGRPCD,
        cRTECD,
        cVEHICD,
        cDRIVER,
        cPLATE,
        cPROVINCE,
        iCAP,
        iWEIGHT,
        cCUSTCD,
        iDPBASKET,
        iSUMTOTAL,
        iPAID,
        dCREADT,
        cCREABY,
        dUPDADT,
        cUPDABY,
      ]
    );

    await client.query(
      `INSERT INTO "TBT_POPREPAIRDT"
      ("cGUID","cPOCD","iSEQ","cPRODCD","cPRODNM","cBRNDCD","cBRNDNM",
      "iSSIZEQTY","iMSIZEQTY","iLSIZEQTY","cPROMO","iDISCOUNT",
      "cDISCOUNT","iFREE","iTOTAL","cBASKCD","cBASKNM","cSTATUS","dCREADT",
      "cCREABY","dUPDADT","cUPDABY","cINSERTYPE","iSUNITPRICE","iMUNITPRICE",
      "iLUNITPRICE"
      ) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
      $21,$22,$23,$24,$25,$26)`,
      [
        cGUID,
        cPOCD,
        iSEQ,
        cPRODCD,
        cPRODNM,
        cBRNDCD,
        cBRNDNM,
        iSSIZEQTY,
        iMSIZEQTY,
        iLSIZEQTY,
        cPROMO,
        iDISCOUNT,
        cDISCOUNT,
        iFREE,
        iTOTAL,
        cBASKCD,
        cBASKNM,
        cSTATUSDT,
        dCREADT,
        cCREABY,
        dUPDADT,
        cUPDABY,
        cINSERTYPE,
        iSUNITPRICET,
        iMUNITPRICE,
        iLUNITPRICE,
      ]
    );

    await client.end();

    const result = {
      success: true,
      message: "insert successfully",
      result: null,
    };

    res.json(result);
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

// update
routeRouter.post("/updatePOPREPAIRHD", async (req, res) => {
  try {
    const client = new Client();
    var uuid = `${crypto.randomUUID()}`;
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });
    let dateNow = new Date();
    var updateBy = req.body.cUPDABY;
    let dateInput = req.body.dDATE;
    let dateSplit = dateInput.split("/");
    let newDateFormat = dateSplit[2] + "-" + dateSplit[1] + "-" + dateSplit[0];
    let dateData = new Date(newDateFormat);

    var cPOCD = req.body.cPOCD;
    var dDATE = dateData;
    var cSTATUS = req.body.cSTATUS;
    var cBRANCD = req.body.cBRANCD;
    var cGRPCD = req.body.cGRPCD;
    var cRTECD = req.body.cRTECD;
    var cVEHICD = req.body.cVEHICD;
    var cDRIVER = req.body.cDRIVER;
    var cPLATE = req.body.cPLATE;
    var cPROVINCE = req.body.cPROVINCE;
    var iCAP = req.body.iCAP;
    var iWEIGHT = req.body.iWEIGHT;
    var cCUSTCD = req.body.cCUSTCD;
    var iDPBASKET = req.body.iDPBASKET;
    var iSUMTOTAL = req.body.iSUMTOTAL;
    var iPAID = req.body.iPAID;
    var dUPDADT = dateNow;
    var cUPDABY = updateBy;

    await client.query(
      `UPDATE "TBT_POPREPAIRHD" 
      SET 
      "dDATE" = $1, 
      "cSTATUS" = $2, 
      "cBRANCD"= $3, 
      "cGRPCD"= $4, 
      "cRTECD"= $5, 
      "cVEHICD"= $6,
      "cDRIVER"= $7,
      "cPLATE"= $8, 
      "cPROVINCE"= $9,
      "iCAP"= $10,
      "iWEIGHT"= $11,
      "cCUSTCD"= $12,
      "iDPBASKET"= $13,
      "iSUMTOTAL"= $14,
      "iPAID"= $15,
      "dUPDADT"= $16,
      "cUPDABY"= $17
      WHERE "cPOCD"  IN ( $18 )`,
      [
        dDATE,
        cSTATUS,
        cBRANCD,
        cGRPCD,
        cRTECD,
        cVEHICD,
        cDRIVER,
        cPLATE,
        cPROVINCE,
        iCAP,
        iWEIGHT,
        cCUSTCD,
        iDPBASKET,
        iSUMTOTAL,
        iPAID,
        dUPDADT,
        cUPDABY,
        cPOCD,
      ]
    );

    await client.end();

    const result = {
      success: true,
      message: "update successfully",
      result: null,
    };

    res.json(result);
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

// delete
routeRouter.post("/deletePOPREPAIR", async (req, res) => {
  try {
    const client = new Client();
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var cPOCD = req.body.cPOCD;

    await client.query(`DELETE FROM "TBT_POPREPAIRHD" WHERE "cPOCD" = $1 ;`, [
      cPOCD,
    ]);

    await client.query(`DELETE FROM "TBT_POPREPAIRDT" WHERE "cPOCD" = $1 ;`, [
      cPOCD,
    ]);

    await client.end();

    const result = {
      success: true,
      message: `delete ${cPOCD} successfully `,
      result: null,
    };

    res.json(result);
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

// ++++++++++++++ TBT_POPREPAIRDT ++++++++++++++
// add
routeRouter.post("/addPOPREPAIRDT", async (req, res) => {
  try {
    const client = new Client();
    var uuid = `${crypto.randomUUID()}`;
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });
    let dateNow = new Date();
    var createBy = req.body.cCREABY;

    var cGUID = `${crypto.randomUUID()}`;
    var cPOCD = req.body.cPOCD;
    var iSEQ = req.body.iSEQ;
    var cPRODCD = req.body.cPRODCD;
    var cPRODNM = req.body.cPRODNM;
    var cBRNDCD = req.body.cBRNDCD;
    var cBRNDNM = req.body.cBRNDNM;
    var iSSIZEQTY = req.body.iSSIZEQTY;
    var iMSIZEQTY = req.body.iMSIZEQTY;
    var iLSIZEQTY = req.body.iLSIZEQTY;
    var cPROMO = req.body.cPROMO;
    var iDISCOUNT = req.body.iDISCOUNT;
    var cDISCOUNT = req.body.cDISCOUNT;
    var iFREE = req.body.iFREE;
    var iTOTAL = req.body.iTOTAL;
    var cBASKCD = req.body.cBASKCD;
    var cBASKNM = req.body.cBASKNM;
    var cSTATUS = req.body.cSTATUS;
    var dCREADT = dateNow;
    var cCREABY = createBy;
    var dUPDADT = dateNow;
    var cUPDABY = createBy;
    var cINSERTYPE = "M";
    var iSUNITPRICET = req.body.iSUNITPRICET;
    var iMUNITPRICE = req.body.iMUNITPRICE;
    var iLUNITPRICE = req.body.iLUNITPRICE;

    // TBT_POPREPAIRHD
    var dDATE = dateNow;
    var cSTATUSHD = "2";
    var cBRANCD = "";
    var cGRPCD = "";
    var cRTECD = "";
    var cVEHICD = "";
    var cDRIVER = "";
    var cPLATE = "";
    var cPROVINCE = "";
    var iCAP = 0;
    var iWEIGHT = 0;
    var cCUSTCD = "";
    var iDPBASKET = 0;
    var iPAID = 0;

    await client.query(
      `INSERT INTO "TBT_POPREPAIRDT"
      ("cGUID","cPOCD","iSEQ","cPRODCD","cPRODNM","cBRNDCD","cBRNDNM",
      "iSSIZEQTY","iMSIZEQTY","iLSIZEQTY","cPROMO","iDISCOUNT",
      "cDISCOUNT","iFREE","iTOTAL","cBASKCD","cBASKNM","cSTATUS","dCREADT",
      "cCREABY","dUPDADT","cUPDABY","cINSERTYPE","iSUNITPRICE","iMUNITPRICE",
      "iLUNITPRICE"
      ) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
      $21,$22,$23,$24,$25,$26)`,
      [
        cGUID,
        cPOCD,
        iSEQ,
        cPRODCD,
        cPRODNM,
        cBRNDCD,
        cBRNDNM,
        iSSIZEQTY,
        iMSIZEQTY,
        iLSIZEQTY,
        cPROMO,
        iDISCOUNT,
        cDISCOUNT,
        iFREE,
        iTOTAL,
        cBASKCD,
        cBASKNM,
        cSTATUS,
        dCREADT,
        cCREABY,
        dUPDADT,
        cUPDABY,
        cINSERTYPE,
        iSUNITPRICET,
        iMUNITPRICE,
        iLUNITPRICE,
      ]
    );

    await client.query(
      `INSERT INTO "TBT_POPREPAIRHD"
      ("cGUID", "cPOCD", "dDATE", "cSTATUS", 
      "cBRANCD", "cGRPCD", "cRTECD", "cVEHICD","cDRIVER",
      "cPLATE", "cPROVINCE","iCAP","iWEIGHT","cCUSTCD",
      "iDPBASKET","iTOTAL","iPAID","dCREADT","cCREABY",
      "dUPDADT","cUPDABY"
      ) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
      [
        cGUID,
        cPOCD,
        dDATE,
        cSTATUSHD,
        cBRANCD,
        cGRPCD,
        cRTECD,
        cVEHICD,
        cDRIVER,
        cPLATE,
        cPROVINCE,
        iCAP,
        iWEIGHT,
        cCUSTCD,
        iDPBASKET,
        iTOTAL,
        iPAID,
        dCREADT,
        cCREABY,
        dUPDADT,
        cUPDABY,
      ]
    );

    await client.end();
    const result = {
      success: true,
      message: `insert successfully `,
      result: null,
    };
    res.json(result);
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

// update
routeRouter.post("/updatePOPREPAIRDT", async (req, res) => {
  try {
    const client = new Client();
    var uuid = `${crypto.randomUUID()}`;
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });
    let dateNow = new Date();
    var updateBy = req.body.cUPDABY;

    var cPOCD = req.body.cPOCD;
    var cPRODCD = req.body.cPRODCD;
    var cPRODNM = req.body.cPRODNM;
    var cBRNDCD = req.body.cBRNDCD;
    var cBRNDNM = req.body.cBRNDNM;
    var iSSIZEQTY = req.body.iSSIZEQTY;
    var iMSIZEQTY = req.body.iMSIZEQTY;
    var iLSIZEQTY = req.body.iLSIZEQTY;
    var cPROMO = req.body.cPROMO;
    var iDISCOUNT = req.body.iDISCOUNT;
    var cDISCOUNT = req.body.cDISCOUNT;
    var iFREE = req.body.iFREE;
    var iTOTAL = req.body.iTOTAL;
    var cBASKCD = req.body.cBASKCD;
    var cBASKNM = req.body.cBASKNM;
    var cSTATUS = req.body.cSTATUS;
    var dUPDADT = dateNow;
    var cUPDABY = updateBy;
    var iSUNITPRICET = req.body.iSUNITPRICET;
    var iMUNITPRICE = req.body.iMUNITPRICE;
    var iLUNITPRICE = req.body.iLUNITPRICE;

    await client.query(
      `UPDATE "TBT_POPREPAIRDT" 
      SET 
      "cPRODCD"= $1,
      "cPRODNM"= $2,
      "cBRNDCD"= $3,
      "cBRNDNM"= $4,
      "iSSIZEQTY"= $5,
      "iMSIZEQTY"= $6,
      "iLSIZEQTY"= $7,
      "cPROMO"= $8,
      "iDISCOUNT"= $9,
      "cDISCOUNT"= $10,
      "iFREE"= $11,
      "iTOTAL"= $12,
      "cBASKCD"= $13,
      "cBASKNM"= $14,
      "cSTATUS"= $15,
      "dUPDADT"= $16,
      "cUPDABY"= $17,
      "iSUNITPRICE"= $18,
      "iMUNITPRICE"= $19,
      "iLUNITPRICE"= $20
      WHERE "cPOCD"  IN ( $21 )`,
      [
        cPRODCD,
        cPRODNM,
        cBRNDCD,
        cBRNDNM,
        iSSIZEQTY,
        iMSIZEQTY,
        iLSIZEQTY,
        cPROMO,
        iDISCOUNT,
        cDISCOUNT,
        iFREE,
        iTOTAL,
        cBASKCD,
        cBASKNM,
        cSTATUS,
        dUPDADT,
        cUPDABY,
        iSUNITPRICET,
        iMUNITPRICE,
        iLUNITPRICE,
        cPOCD,
      ]
    );

    await client.end();
    const result = {
      success: true,
      message: `update successfully `,
      result: null,
    };
    res.json(result);
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

// +++++++++++++++++++ TBM_CUSTOMER_DT +++++++++++++++++++
routeRouter.post("/getLocationOfStore", async (req, res) => {
  try {
    const client = new Client();
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var cCUSTCD = req.body.cCUSTCD;

    const result = await client.query(
      `SELECT "cGUID","cCUSTCD","cLATITUDE","cLONGTITUDE","dUPDADT","cUPDABY" 
      FROM "TBM_CUSTOMER_DT" 
      WHERE "cCUSTCD" = $1`,
      [cCUSTCD]
    );

    await client.end();

    res.json(result.rows[0]);
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

// +++++++++++++++++++ route of driver in today +++++++++++++++++++
routeRouter.post("/getRouteToday", async (req, res) => {
  try {
    const client = new Client();
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var cVEHICD = req.body.cVEHICD;
    var cBRANCD = req.body.cBRANCD;
    var cRTENM = req.body.cRTENM;

    const result = await client.query(
      `SELECT  MR."cBRANCD",MR."cGRPCD", RO."cRTECD","cRTENM" FROM "TBM_VEHICLE" AS VE
      INNER JOIN "TBM_MAP_ROUTE" AS MR
       ON MR."cVEHICD" = VE."cVEHICD"
      INNER  JOIN "TBM_ROUTE" AS RO
       ON RO."cRTECD" = MR."cRTECD"
       WHERE VE."cVEHICD" = $1 AND VE."cBRANCD" = $2 AND RO."cRTENM" LIKE $3`,
      [cVEHICD, cBRANCD, cRTENM]
    );

    await client.end();

    res.json(result.rows[0]);
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

// +++++++++++++++++++ PO check in +++++++++++++++++++
routeRouter.post("/addPOCheckIn", async (req, res) => {
  try {
    const client = new Client();
    var uuid = `${crypto.randomUUID()}`;
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var cPOCD = req.body.cPOCD;
    var iCHELAT = req.body.iCHELAT;
    var iCHELNG = req.body.iCHELNG;
    var cCREABY = req.body.cCREABY;

    var poRepeat = false;

    const checkInList = await client.query(
      `SELECT "cPOCD" FROM "TBT_PO_CHECKIN"`
    );
    for (var i = 0; i < checkInList.rows.length; i++) {
      if (checkInList.rows[i].cPOCD == cPOCD) {
        poRepeat = true;
      }
    }

    if (poRepeat == false) {
      const result = await client.query(
        `INSERT INTO "TBT_PO_CHECKIN" 
        ("cGUID","cPOCD","iCHELAT","iCHELNG","cCREABY","cUPDABY","dCREADT","dUPDADT")
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [uuid, cPOCD, iCHELAT, iCHELNG, cCREABY, cCREABY, dateTime, dateTime]
      );

      await client.end();

      const message = {
        success: true,
        message: "check in success",
        result: null,
      };
      res.json(message);
    } else {
      const result = await client.query(
        `UPDATE "TBT_PO_CHECKIN" 
        SET "iCHELAT" = $1,"iCHELNG" = $2,"cUPDABY" = $3,"dUPDADT"= $4
        WHERE "cPOCD" = $5`,
        [iCHELAT, iCHELNG, cCREABY, dateTime, cPOCD]
      );

      await client.end();

      const message = {
        success: true,
        message: "check in success",
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

// +++++++++++++++++++ update PO Incomplete Cancle Loss product +++++++++++++++++++
routeRouter.post("/updateICLPro", async (req, res) => {
  try {
    const client = new Client();
    var uuid = `${crypto.randomUUID()}`;
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var cPOCD = req.body.cPOCD;
    var iSEQ = req.body.iSEQ;
    var iINCOMPRO = req.body.iINCOMPRO;
    var iCANCLEPRO = req.body.iCANCLEPRO;
    var iLOSSPRO = req.body.iLOSSPRO;
    var cUPDABY = req.body.cUPDABY;
    var price = 0.0;

    const oldResult = await client.query(
      `SELECT *
      FROM "TBT_PODT"  
      WHERE "cPOCD" = $1 AND "iSEQ"= $2 `,
      [cPOCD, iSEQ]
    );

    if (oldResult.rows[0].iSSIZEQTY != 0.0) {
      price = oldResult.rows[0].iSUNITPRICE;
    } else if (oldResult.rows[0].iMSIZEQTY != 0.0) {
      price = oldResult.rows[0].iMUNITPRICE;
    } else if (oldResult.rows[0].iLSIZEQTY != 0.0) {
      price = oldResult.rows[0].iLUNITPRICE;
    }

    var iNETTOTAL =
      oldResult.rows[0].iTOTAL -
      iLOSSPRO * price -
      iINCOMPRO * price -
      iCANCLEPRO * price;

    if (iINCOMPRO == 0 && iCANCLEPRO == 0 && iLOSSPRO == 0) {
      iNETTOTAL = oldResult.rows[0].iTOTAL;
    }

    const result = await client.query(
      `UPDATE "TBT_PODT" SET "iNETTOTAL" = $4 ,"iLOSSPRO" = $1 ,
      "dUPDADT"= $5 ,"cUPDABY"= $6, "iINCOMPRO"= $7, "iCANCLEPRO"= $8
      WHERE "cPOCD" = $2 AND "iSEQ"= $3`,
      [
        iLOSSPRO,
        cPOCD,
        iSEQ,
        iNETTOTAL,
        dateTime,
        cUPDABY,
        iINCOMPRO,
        iCANCLEPRO,
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

// +++++++++++++++++++ update PO return product +++++++++++++++++++
routeRouter.post("/addRTPRO", async (req, res) => {
  try {
    const client = new Client();
    var uuid = `${crypto.randomUUID()}`;
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var cCUSTCD = req.body.cCUSTCD;
    var cPOCD = req.body.cPOCD;
    var iQTY = req.body.iQTY;
    var iTOTAL = req.body.iTOTAL;
    var cSTATUS = req.body.cSTATUS;
    var cCREABY = req.body.cCREABY;
    var cPRODCD = req.body.cPRODCD;

    const oldResult = await client.query(
      `SELECT *
      FROM "TBT_PO_RTPRO"  
      WHERE "cCUSTCD" = $1 AND "cPRODCD"= $2 `,
      [cCUSTCD, cPRODCD]
    );

    if (oldResult.rows.length > 0) {
      let rts;
      if (
        parseInt(oldResult.rows[0].cRTS) > 0 &&
        parseInt(oldResult.rows[0].cRTS) < 5
      ) {
        rts = parseInt(oldResult.rows[0].cRTS) + 1;
      } else {
        rts = parseInt(oldResult.rows[0].cRTS);
      }

      const result = await client.query(
        `UPDATE "TBT_PO_RTPRO" 
    SET "iQTY"= $3,"iTOTAL" = $4,"cSTATUS" = $5,"cRTS" = $6 ,"cUPDABY" = $7,"dUPDADT"=$8
    WHERE "cCUSTCD" = $1 AND "cPRODCD" = $2`,
        [
          cCUSTCD,
          cPRODCD,
          iQTY,
          iTOTAL,
          cSTATUS,
          rts.toString(),
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
        `INSERT INTO "TBT_PO_RTPRO" ("cGUID","cPOCD","cCUSTCD","cPRODCD","iQTY","iTOTAL","cSTATUS","cRTS","cCREABY","cUPDABY","dCREADT","dUPDADT")
        VALUEs ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [
          uuid,
          cPOCD,
          cCUSTCD,
          cPRODCD,
          iQTY,
          iTOTAL,
          "N",
          "1",
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

// +++++++++++++++++++ update PO return product +++++++++++++++++++
routeRouter.post("/unbanRTPRO", async (req, res) => {
  try {
    const client = new Client();
    var uuid = `${crypto.randomUUID()}`;
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var cCUSTCD = req.body.cCUSTCD;
    var cCREABY = req.body.cCREABY;
    var cPRODCD = req.body.cPRODCD;

    const result = await client.query(
      `UPDATE "TBT_PO_RTPRO" 
    SET "iQTY"= $3,"iTOTAL" = $4,"cSTATUS" = $5,"cRTS" = $6 ,"cUPDABY" = $7,"dUPDADT"=$8
    WHERE "cCUSTCD" = $1 AND "cPRODCD" = $2`,
      [cCUSTCD, cPRODCD, 0, 0.0, "Y", "3", cCREABY, dateTime]
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

// +++++++++++++++++++ update PO loss product +++++++++++++++++++
routeRouter.post("/addLOSSPRO", async (req, res) => {
  try {
    const client = new Client();
    var uuid = `${crypto.randomUUID()}`;
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var cCUSTCD = req.body.cCUSTCD;
    var cPOCD = req.body.cPOCD;
    var iQTY = req.body.iQTY;
    var iTOTAL = req.body.iTOTAL;
    var cSERVER = req.body.cSERVER;
    var cCREABY = req.body.cCREABY;
    var cIB64 = req.body.cIB64;

    const now = new Date();
    const dateValue = date.format(now, "YYMMDDHHmmss");
    var path =
      "C:/NETCoreWeb/Vansale/Web/wwwroot/upload/LOSSPRO/LOSSPRO_" +
      dateValue +
      ".jpg";

    var PHSEV = "";
    var PHPATH = "";
    var PHNM = "";

    if (cIB64 != "") {
      const billBuffer = Buffer.from(cIB64, "base64");
      fs.writeFileSync(path, billBuffer);
      let list = path.split("/");
      PHSEV = cSERVER;
      PHPATH = list[5] + "/" + list[6] + "/" + list[7];
      PHNM = list[7];
      // console.log(cBILLSEV);
      // console.log(cBILLPATH);
      // console.log(cBILLNM);
    }

    const oldResult = await client.query(
      `SELECT *
      FROM "TBT_PO_LOSSPRO" 
      WHERE "cCUSTCD" = $1 AND "cPOCD"= $2`,
      [cCUSTCD, cPOCD]
    );

    // res.json(oldResult.rows)

    if (oldResult.rows.length > 0) {
      const result = await client.query(
        `UPDATE "TBT_PO_LOSSPRO" 
      SET "iQTY"= $3,
      "iTOTAL" = $4,
      "cPHSEV"= $5,
      "cPHPATH"= $6,
      "cPHNM"= $7 ,
      "cUPDABY" = $8,
      "dUPDADT"=$9
      WHERE "cCUSTCD" = $1 AND "cPOCD" = $2`,
        [cCUSTCD, cPOCD, iQTY, iTOTAL, PHSEV, PHPATH, PHNM, cCREABY, dateTime]
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
        `INSERT INTO "TBT_PO_LOSSPRO" 
        ("cGUID","cPOCD","cCUSTCD","iQTY","iTOTAL","cPHSEV","cPHPATH","cPHNM",
        "cCREABY","cUPDABY","dCREADT","dUPDADT")
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [
          uuid,
          cPOCD,
          cCUSTCD,
          iQTY,
          iTOTAL,
          PHSEV,
          PHPATH,
          PHNM,
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

// +++++++++++++++++++ add basket return +++++++++++++++++++
routeRouter.post("/addBKR", async (req, res) => {
  try {
    const client = new Client();
    var uuid = `${crypto.randomUUID()}`;
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var cCUSTCD = req.body.cCUSTCD;
    var cPOCD = req.body.cPOCD;
    var iQTY = req.body.iQTY;
    var iTOTAL = req.body.iTOTAL;
    var cCREABY = req.body.cCREABY;
    var cBASKCD = req.body.cBASKCD;

    const oldResult = await client.query(
      `SELECT *
      FROM "TBT_BASKET_RETURN" 
      WHERE "cCUSTCD" = $1 AND "cPOCD" = $2 AND "cBASKCD" = $3`,
      [cCUSTCD, cPOCD, cBASKCD]
    );

    if (oldResult.rows.length > 0) {
      const result = await client.query(
        `UPDATE "TBT_BASKET_RETURN" 
    SET "iQTY"= $4,
    "iTOTAL" = $5,
    "cUPDABY" = $6,
    "dUPDADT"=$7,
    "dREDATE"=$8
    WHERE "cCUSTCD" = $1 AND "cPOCD" = $2 AND "cBASKCD" = $3`,
        [cCUSTCD, cPOCD, cBASKCD, iQTY, iTOTAL, cCREABY, dateTime, dateTime]
      );

      await client.end();

      const message = {
        success: true,
        message: "success",
        result: null,
      };
      res.json(message);
    } else {
      if (iQTY != 0) {
        const result = await client.query(
          `INSERT INTO "TBT_BASKET_RETURN" 
          ("cGUID","cPOCD","cCUSTCD","cBASKCD","dREDATE","iQTY","iTOTAL","cCREABY","cUPDABY","dCREADT","dUPDADT") 
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
          [
            uuid,
            cPOCD,
            cCUSTCD,
            cBASKCD,
            dateTime,
            iQTY,
            iTOTAL,
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
      } else {
        const message = {
          success: true,
          message: "QTY is 0",
          result: null,
        };
        res.json(message);
      }
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

// +++++++++++++++++++ basket search  +++++++++++++++++++
routeRouter.post("/searchBasket", async (req, res) => {
  try {
    const client = new Client();
    var uuid = `${crypto.randomUUID()}`;
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var cBASKNM = req.body.cBASKNM;
    var cBASKCD = req.body.cBASKCD;

    const oldResult = await client.query(
      `SELECT * FROM "TBM_BASKET" WHERE "cBASKNM" LIKE $1 AND "cBASKCD" LIKE $2`,
      [cBASKNM, cBASKCD]
    );

    await client.end();

    res.json(oldResult.rows);
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

// +++++++++++++++++++ mobile payment  +++++++++++++++++++
routeRouter.post("/mobilePayment", async (req, res) => {
  try {
    const client = new Client();
    var uuid = `${crypto.randomUUID()}`;
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var cDOCREF = req.body.cDOCREF;
    var dDOCDATE = req.body.dDOCDATE;
    var cTRANSCD = req.body.cTRANSCD;
    var cCONTACTCD = req.body.cCONTACTCD;
    var iDEBIT = req.body.iDEBIT;
    var iCREDIT = req.body.iCREDIT;
    var cCREABY = req.body.cCREABY;
    var cRECTYPE = req.body.cRECTYPE;
    var cBANK = req.body.cBANK;
    var cCQTYPE = req.body.cCQTYPE;
    var cCQCD = req.body.cCQCD;
    var cCQDT = req.body.cCQDT;

    const date = new Date();

    var dateSplit = date.toLocaleDateString("en-US").split("/");

    const checkResult = await client.query(
      `SELECT  * FROM "TBT_BALANCE" WHERE "cDOCREF" = $1 `,
      [cDOCREF]
    );

    if (checkResult.rows.length > 0) {
      const oldResult = await client.query(
        `UPDATE "TBT_BALANCE" 
        SET "dDOCDATE" = $2,"cTRANSCD" = $3,"cCONTACTCD"= $4,"iDEBIT" = $5,
        "iCREDIT"= $6,"dRECDATE"= $7,"iRECMONTH"= $8,"dUPDADT"= $9,
        "cUPDABY"= $10,"cRECTYPE"= $11,"cBANK"= $12,"cCQTYPE"= $13,"cCQCD"= $14,"cCQDT"= $15 
        WHERE "cDOCREF" = $1`,
        [
          cDOCREF,
          dDOCDATE,
          cTRANSCD,
          cCONTACTCD,
          iDEBIT,
          iCREDIT,
          dateTime,
          parseInt(dateSplit[1]),
          dateTime,
          cCREABY,
          cRECTYPE,
          cBANK,
          cCQTYPE,
          cCQCD,
          cCQDT,
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
      const oldResult = await client.query(
        `INSERT INTO "TBT_BALANCE" 
        ("cGUID","cDOCREF","dDOCDATE","cTRANSCD","cCONTACTCD","iDEBIT",
        "iCREDIT","dRECDATE","iRECMONTH","dCREADT","cCREABY","dUPDADT",
        "cUPDABY","cRECTYPE","cBANK","cCQTYPE","cCQCD","cCQDT")
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
        [
          uuid,
          cDOCREF,
          dDOCDATE,
          cTRANSCD,
          cCONTACTCD,
          iDEBIT,
          iCREDIT,
          dateTime,
          parseInt(dateSplit[1]),
          dateTime,
          cCREABY,
          dateTime,
          cCREABY,
          cRECTYPE,
          cBANK,
          cCQTYPE,
          cCQCD,
          cCQDT,
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

// +++++++++++++++++++ get product type  +++++++++++++++++++
routeRouter.get("/getProType", async (req, res) => {
  try {
    const client = new Client();
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    const typeResult = await client.query(`SELECT * FROM "TBM_PRODUCT_TYPE"`);
    const catResult = await client.query(`SELECT * FROM "TBM_CATEGORY"`);
    const subCatResult = await client.query(`SELECT * FROM "TBM_CATEGORY_SUB"`);
    const brandResult = await client.query(`SELECT * FROM "TBM_BRAND"`);

    let type = typeResult.rows;
    let category = catResult.rows;
    let subCategory = subCatResult.rows;
    let brand = brandResult.rows;
    let tpyeList = [];
    for (var i = 0; i < type.length; i++) {
      var data = {
        onClick: false,
        typeName: type[i].cTYPENM,
        typeCD: type[i].cTYPECD,
        category: [],
      };
      for (var j = 0; j < category.length; j++) {
        if (type[i].cTYPECD === category[j].cTYPECD) {
          var cat = {
            catNM: category[j].cCATENM,
            catCD: category[j].cCATECD,
            onSelect: false,
            hight: 0.0,
            subCategory: [],
          };
          for (var k = 0; k < subCategory.length; k++) {
            if (subCategory[k].cCATECD === category[j].cCATECD) {
              var subCat = {
                click: false,
                subCatNM: subCategory[k].cSUBCATENM,
                subCatCD: subCategory[k].cSUBCATECD,
                brand: [],
              };
              for (var l = 0; l < brand.length; l++) {
                if (brand[l].cSUPCD === subCategory[k].cSUBCATECD) {
                  var brandItem = {
                    click: false,
                    brandNM: brand[l].cBRNNM,
                    brandCD: brand[l].cBRNCD,
                  };
                  subCat.brand.push(brandItem);
                }
              }
              cat.subCategory.push(subCat);
            }
          }
          data.category.push(cat);
        }
      }
      tpyeList.push(data);
    }

    await client.end();

    res.json(tpyeList);
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

// +++++++++++++++++++ iSEQ route  +++++++++++++++++++
routeRouter.post("/updateiSEQROUTE", async (req, res) => {
  try {
    const client = new Client();
    var uuid = `${crypto.randomUUID()}`;
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });
    var cCUSTCD = req.body.cCUSTCD;
    var iSEQROUTE = req.body.iSEQROUTE;
    var cUPDABY = req.body.cUPDABY;
    var cGRPCD = req.body.cGRPCD;
    var cRTECD = req.body.cRTECD;

    var num;
    if (iSEQROUTE == "") {
      num = 0;
    } else {
      num = iSEQROUTE;
    }
    const oldResult = await client.query(
      `
    UPDATE "TBM_CUSTOMER_ROUTE" 
    SET "iSEQROUTE" = $3,"cUPDABY"=$4 ,"dUPDADT"=$2
    WHERE "cCUSTCD" = $1 AND "cGRPCD" = $5 AND "cRTECD" = $6`,
      [cCUSTCD, dateTime, num, cUPDABY, cGRPCD, cRTECD]
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

// +++++++++++++++++++ PO start delivery  +++++++++++++++++++
routeRouter.post("/deliveryPO", async (req, res) => {
  try {
    const client = new Client();
    var uuid = `${crypto.randomUUID()}`;
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });
    var cPOCD = req.body.cPOCD;
    var cUPDABY = req.body.cUPDABY;

    const oldResult = await client.query(
      `
      UPDATE "TBT_POHD" SET "cPOSTATUS" = '3',"cUPDABY"=$2,"dUPDADT"=$3 WHERE "cPOCD" = $1`,
      [cPOCD, cUPDABY, dateTime]
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

// +++++++++++++++++++ get arrange product +++++++++++++++++++
routeRouter.post("/getArrangePro", async (req, res) => {
  try {
    const client = new Client();
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });
    var cGRPCD = req.body.cGRPCD;
    var cRTECD = req.body.cRTECD;
    var cBRANCD = req.body.cBRANCD;

    const oldResult = await client.query(
      `
      SELECT CHD."cGUID",CHD."cCUSTCD",CHD."cCUSTNM",CHD."cCUSTBNM",CHD."cTAXNO",
		CHD."cTEL",CHD."cCONTACT",CHD."cCONTACT_TEL",CHD."cLINEID",CHD."cBRANCD",
		CHD."cCUSTTYPE",CHD."cPAYTYPE",CHD."iCREDTERM",CHD."iCREDLIM",CHD."cTSELLCD",
		CHD."cISBASKET",CHD."cSTATUS",RD."cGRPCD",RD."cRTECD",RD."iSEQROUTE",DT."cISPHOTO",DT."cPHOTO_SERV",
        DT."cPHOTO_PATH",DT."cPHOTO_NM",DT."cADDRESS",DT."cDISTRICT",DT."cSHIPTO",HD."cADDRESS",DT."cLOCATION",
		DT."cPROVINCE",DT."cDISTRICT",DT."cSUBDIST",DT."cPOSTCD",DT."cDISTANCS",DT."cASSET",
		DT."cLATITUDE",DT."cLONGTITUDE",
		HD."cPREPAIRCFSTATUS",HD."cPOSTATUS",CHD."dCREADT",CHD."cCREABY",CHD."dUPDADT",
		CHD."cUPDABY"
		FROM "TBM_CUSTOMER_HD" AS CHD
        INNER JOIN "TBM_CUSTOMER_ROUTE" AS RD
        ON CHD."cCUSTCD" = RD."cCUSTCD"
        INNER JOIN "TBM_CUSTOMER_DT" AS DT
        ON DT."cCUSTCD" = RD."cCUSTCD"
        LEFT JOIN "TBT_POHD" AS HD
        ON CHD."cCUSTCD" = HD."cCUSTCD"
        WHERE RD."cRTECD" = $1  AND  RD."cGRPCD" = $2 AND HD."cBRANCD" = $3
		  AND HD."cPOSTATUS" != '3' AND HD."cPOSTATUS" != '4'  AND HD."cPOSTATUS" != '5'
		  AND HD."cPREPAIRCFSTATUS" != 'Y'`,
      [cRTECD, cGRPCD, cBRANCD]
    );

    await client.end();

    const message = {
      success: true,
      message: "success",
      result: null,
    };
    res.json(oldResult.rows);
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

// +++++++++++++++++++ add send money +++++++++++++++++++
routeRouter.post("/addSendMoney", async (req, res) => {
  try {
    const client = new Client();
    var uuid = `${crypto.randomUUID()}`;
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var cGUID = req.body.cGUID;
    var cBRANCD = req.body.cBRANCD;
    var cGRPCD = req.body.cGRPCD;
    var cRTECD = req.body.cRTECD;
    var cVEHICD = req.body.cVEHICD;
    var iTOTAL = req.body.iTOTAL;
    var cDRIVER = req.body.cDRIVER;
    var iCOST = req.body.iCOST;
    var cBILLPH = req.body.cBILLPH;
    var cCOSTPH = req.body.cCOSTPH;
    var cCREABY = req.body.cCREABY;
    var cCOSNM = req.body.cCOSNM;
    var cREMARK = req.body.cREMARK;
    var cSERVER = req.body.cSERVER;
    var money = 0;

    // C:\NETCoreWeb\Vansale\Web\wwwroot\upload\SendMoney
    const now = new Date();
    const dateValue = date.format(now, "YYMMDDHHmmss");
    var billPath =
      "C:/NETCoreWeb/Vansale/Web/wwwroot/upload/SendMoney/Bill_" +
      dateValue +
      ".jpg";
    var costPath =
      "C:/NETCoreWeb/Vansale/Web/wwwroot/upload/SendMoney/Cost_" +
      dateValue +
      ".jpg";
    const path = cSERVER + "/" + billPath;
    var cBILLSEV = "";
    var cBILLPATH = "";
    var cBILLNM = "";
    var cCOSTSEV = "";
    var cCOSTPATH = "";
    var cCOSTNM = "";

    if (cBILLPH != "") {
      const billBuffer = Buffer.from(cBILLPH, "base64");
      fs.writeFileSync(billPath, billBuffer);
      let list = billPath.split("/");
      cBILLSEV = cSERVER;
      cBILLPATH = list[5] + "/" + list[6] + "/" + list[7];
      cBILLNM = list[7];
      // console.log(cBILLSEV);
      // console.log(cBILLPATH);
      // console.log(cBILLNM);
    }

    if (cCOSTPH != "") {
      const costBuffer = Buffer.from(cCOSTPH, "base64");
      fs.writeFileSync(costPath, costBuffer);
      let list = costPath.split("/");
      cCOSTSEV = cSERVER;
      cCOSTPATH = list[5] + "/" + list[6] + "/" + list[7];
      cCOSTNM = list[7];
    }

    // res.json(billPath);

    if (iCOST == 0) {
      money = iTOTAL;
    } else {
      money = iTOTAL - iCOST;
    }

    // const oldResult = await client.query(
    //   `SELECT *
    //   FROM "TBT_SEND_MONEY"
    //   WHERE "cBRANCD"= $1 AND "cGRPCD"=$2 AND "cRTECD"=$3 AND "cVEHICD"=$4`,
    //   [cGUID]
    // );

    // if (oldResult.rows.length > 0) {
    //   const result = await client.query(
    //     `UPDATE "TBT_SEND_MONEY"
    //     SET "cDRIVER"= $2,"iTOTAL"= $3,"iCOST"=$4,"iNETTOTAL"=$5,"cUPDABY"=$6,"dUPDADT" = $7, "cCOSNM" =$8, "cREMARK" = $9,
    //     "cBILLSEV" = $10,"cBILLPATH" = $11,"cBILLNM" = $12,"cCOSTSEV" = $13,"cCOSTPATH" = $14,"cCOSTNM" = $15
    //     WHERE "cGUID"= $1 `,
    //     [
    //       cGUID,
    //       cDRIVER,
    //       iTOTAL,
    //       iCOST,
    //       money,
    //       cCREABY,
    //       dateTime,
    //       cCOSNM,
    //       cREMARK,
    //       cBILLSEV,
    //       cBILLPATH,
    //       cBILLNM,
    //       cCOSTSEV,
    //       cCOSTPATH,
    //       cCOSTNM,
    //     ]
    //   );

    //   await client.end();

    //   const message = {
    //     success: true,
    //     message: "success",
    //     result: null,
    //   };
    //   res.json(message);
    // } else {
    const result = await client.query(
      `INSERT INTO "TBT_SEND_MONEY"
        ("cGUID","cBRANCD","cGRPCD","cRTECD","cVEHICD","cDRIVER","iTOTAL","iCOST",
        "iNETTOTAL","cBILLSEV","cBILLPATH","cBILLNM","cCOSTSEV","cCOSTPATH","cCOSTNM",
        "cCREABY","cUPDABY","dCREADT","dUPDADT","cCOSNM", "cREMARK")
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
      [
        uuid,
        cBRANCD,
        cGRPCD,
        cRTECD,
        cVEHICD,
        cDRIVER,
        iTOTAL,
        iCOST,
        money,
        cBILLSEV,
        cBILLPATH,
        cBILLNM,
        cCOSTSEV,
        cCOSTPATH,
        cCOSTNM,
        cCREABY,
        cCREABY,
        dateTime,
        dateTime,
        cCOSNM,
        cREMARK,
      ]
    );

    await client.end();

    const message = {
      success: true,
      message: `success`,
      result: null,
    };
    res.json(message);
    // }
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

// +++++++++++++++++++ get total money in route  +++++++++++++++++++
routeRouter.post("/getSumMoney", async (req, res) => {
  try {
    const client = new Client();
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var cRTECD = req.body.cRTECD;
    var shippingDate = req.body.dSHIPDATE;
    var cGRPCD = req.body.cGRPCD;
    var cBRANCD = req.body.cBRANCD;

    const oldResult = await client.query(
      `
    SELECT  SUM(a.TOTAL) FROM (
      SELECT  SUM(PODT."iNETTOTAL") AS TOTAL , RD."cRTECD" AS cRTECD,RD."cGRPCD" AS cGRPCD, HD."cBRANCD" AS cBRANCD, HD."dSHIPDATE" AS dSHIPDATE
          FROM "TBM_CUSTOMER_HD" AS CHD
              INNER JOIN "TBM_CUSTOMER_ROUTE" AS RD
              ON CHD."cCUSTCD" = RD."cCUSTCD"
              INNER JOIN "TBM_CUSTOMER_DT" AS DT
              ON DT."cCUSTCD" = RD."cCUSTCD"
              LEFT JOIN "TBT_POHD" AS HD
              ON CHD."cCUSTCD" = HD."cCUSTCD"
              INNER JOIN "TBT_PODT" AS PODT
              ON PODT."cPOCD" = HD."cPOCD"
              WHERE RD."cRTECD" = $1 AND HD."dSHIPDATE"::date = $2 AND RD."cGRPCD" = $3 AND HD."cBRANCD" = $4
               GROUP BY PODT."iNETTOTAL",cRTECD,cGRPCD,cBRANCD,dSHIPDATE
      ) a
    `,
      [cRTECD, shippingDate, cGRPCD, cBRANCD]
    );

    await client.end();
    var data = {
      cBRANCD: cBRANCD,
      cGRPCD: cGRPCD,
      cRTECD: cRTECD,
      dSHIPDATE: shippingDate,
      iTOTAL: oldResult.rows[0].sum,
    };

    const message = {
      success: true,
      message: "success",
      result: null,
    };
    res.json(data);
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

// +++++++++++++++++++ get customer detail in route  +++++++++++++++++++
routeRouter.post("/getStoreDetail", async (req, res) => {
  try {
    const client = new Client();
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var cCUSTCD = req.body.cCUSTCD;

    const oldResult = await client.query(
      `SELECT * FROM "TBT_POHD" WHERE "cCUSTCD" = $1 ORDER BY "dSHIPDATE" DESC LIMIT 1
    `,
      [cCUSTCD]
    );

    const cancleResult = await client.query(
      `SELECT * FROM "TBT_POHD" WHERE "cCUSTCD" = $1 and "cPOSTATUS" = '5' ORDER BY "dSHIPDATE" DESC LIMIT 1
    `,
      [cCUSTCD]
    );

    const creditResult = await client.query(
      `SELECT * FROM "TBM_CUSTOMER_HD" WHERE "cCUSTCD" = $1 
    `,
      [cCUSTCD]
    );

    const moneyResult = await client.query(
      `SELECT * FROM "TBT_POHD" WHERE "cCUSTCD" = $1  
    `,
      [cCUSTCD]
    );

    const PoTotalResult = await client.query(
      `SELECT * FROM "TBT_POHD" WHERE "cPOCD" = $1  
    `,
      [oldResult.rows[0].cPOCD]
    );

    const basketResult = await client.query(
      `SELECT HD."cCUSTCD",PR."cTYPE", HD."cPOCD",DT."cPRODCD",DT."cPRODNM",DT."cBASKCD",DT."cBASKNM",B."iPRICE" AS iBPU,count(DT.*) AS iItems ,
      count(DT."cBASKCD")AS iBasket,
      DT."iTOTAL"   
      FROM "TBT_POHD" HD
      INNER JOIN "TBT_PODT" DT ON HD."cPOCD" = DT."cPOCD"
      INNER JOIN "TBM_PRODUCT" PR ON PR."cPRODCD" = DT."cPRODCD"
      INNER JOIN "TBM_BASKET" B ON DT."cBASKCD" = B."cBASKCD"
      WHERE HD."cCUSTCD" = $1
      GROUP BY  HD."cCUSTCD",PR."cTYPE",HD."cPOCD",DT."cPRODCD",DT."cPRODNM",DT."cBASKCD",DT."cBASKNM",B."iPRICE",DT."iTOTAL"
      ORDER BY  DT."iTOTAL" DESC
    `,
      [cCUSTCD]
    );

    for (var i = 0; i < basketResult.length; i++) {
      iTOTAL += Number(moneyResult.rows[i].iTOTAL);
      iPAID += Number(moneyResult.rows[i].iPAID);
    }

    var cancleDate = "";
    var succDate = "";
    if (cancleResult.rows.length > 0) {
      var date = new Date(cancleResult.rows[0].dSHIPDATE);

      var year = date.toLocaleString("default", { year: "numeric" });
      var month = date.toLocaleString("default", { month: "2-digit" });
      var day = date.toLocaleString("default", { day: "2-digit" });

      cancleDate = day + "-" + month + "-" + year;
    }

    if (oldResult.rows.length > 0) {
      var date = new Date(oldResult.rows[0].dSHIPDATE);

      var year = date.toLocaleString("default", { year: "numeric" });
      var month = date.toLocaleString("default", { month: "2-digit" });
      var day = date.toLocaleString("default", { day: "2-digit" });

      succDate = day + "-" + month + "-" + year;
    }
    var iTOTAL = 0;
    var iPAID = 0;
    for (var i = 0; i < moneyResult.rows.length; i++) {
      iTOTAL += Number(moneyResult.rows[i].iTOTAL);
      iPAID += Number(moneyResult.rows[i].iPAID);
    }

    await client.end();

    var data = {
      cCUSTCD: oldResult.rows[0].cCUSTCD,
      cPOCD: oldResult.rows[0].cPOCD,
      iTOTAL: oldResult.rows[0].iTOTAL,
      dSUCCDT: succDate,
      dCANDT: cancleDate,
      iCREDTERM: creditResult.rows[0].iCREDTERM.toString(),
      iCREDLIM: creditResult.rows[0].iCREDLIM,
      iTOTAL: `${iTOTAL}`,
      iPAID: `${iPAID}`,
      iPOTOTAL: PoTotalResult.rows[0].iTOTAL,
    };

    const message = {
      success: true,
      message: "success",
      result: null,
    };
    res.json(data);
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

// +++++++++++++++++++ get history basket of customer +++++++++++++++++++
routeRouter.post("/getHisBasket", async (req, res) => {
  try {
    const client = new Client();
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var cCUSTCD = req.body.cCUSTCD;

    const basketResult = await client.query(
      `SELECT HD."cCUSTCD",PR."cTYPE", HD."cPOCD",DT."cPRODCD",DT."cPRODNM",DT."cBASKCD",DT."cBASKNM",B."iPRICE" AS iBPU,count(DT.*) AS iItems ,
      count(DT."cBASKCD")AS iBasket,
      DT."iTOTAL"   
      FROM "TBT_POHD" HD
      INNER JOIN "TBT_PODT" DT ON HD."cPOCD" = DT."cPOCD"
      INNER JOIN "TBM_PRODUCT" PR ON PR."cPRODCD" = DT."cPRODCD"
      INNER JOIN "TBM_BASKET" B ON DT."cBASKCD" = B."cBASKCD"
      WHERE HD."cCUSTCD" = $1
      GROUP BY  HD."cCUSTCD",PR."cTYPE",HD."cPOCD",DT."cPRODCD",DT."cPRODNM",DT."cBASKCD",DT."cBASKNM",B."iPRICE",DT."iTOTAL"
      ORDER BY  DT."iTOTAL" DESC
    `,
      [cCUSTCD]
    );

    const ReturnBasket = await client.query(
      `SELECT * FROM "TBT_BASKET_RETURN" WHERE "cCUSTCD" = $1
    `,
      [cCUSTCD]
    );

    var basketList = [
      ...new Set(basketResult.rows.map((item) => item.cBASKCD)),
    ];

    var ReBasketList = [
      ...new Set(ReturnBasket.rows.map((item) => item.cBASKCD)),
    ];
    var basketData = [];
    var ReBasketData = [];
    var allBasketData = [];

    for (var j = 0; j < basketList.length; j++) {
      var item = 0;
      var bpu = 0;
      var name;
      for (var i = 0; i < basketResult.rows.length; i++) {
        if (basketList[j] === basketResult.rows[i].cBASKCD) {
          item += Number(basketResult.rows[i].ibasket);
          bpu = basketResult.rows[i].ibpu;
          name = basketResult.rows[i].cBASKNM;
          // console.log(basketResult.rows[i])
        }
      }
      var data = {
        cBASKCD: basketList[j],
        cBASKNM: name,
        iBPU: bpu,
        iTOTAL: item,
      };
      basketData.push(data);
    }

    for (var i = 0; i < ReBasketList.length; i++) {
      var item = 0;
      for (var j = 0; j < ReturnBasket.rows.length; j++) {
        if (ReBasketList[i] === ReturnBasket.rows[j].cBASKCD) {
          item += Number(ReturnBasket.rows[j].iQTY);
          // console.log(basketResult.rows[i])
        }
      }

      var data = {
        cBASKCD: ReBasketList[i],
        iTOTAL: item,
      };
      ReBasketData.push(data);
    }

    for (var i = 0; i < basketData.length; i++) {
      var total = 0;
      for (var j = 0; j < ReBasketData.length; j++) {
        if (basketData[i].cBASKCD === ReBasketData[j].cBASKCD) {
          total = ReBasketData[j].iTOTAL;
        }
      }
      var data = {
        cBASKCD: basketData[i].cBASKCD,
        cBASKNM: basketData[i].cBASKNM,
        iBPU: basketData[i].iBPU,
        iTOTAL: basketData[i].iTOTAL,
        iRETURN: total,
      };

      allBasketData.push(data);
    }

    const message = {
      success: true,
      message: "success",
      result: null,
    };
    res.json(allBasketData);
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

// +++++++++++++++++++ get history product of customer +++++++++++++++++++
routeRouter.post("/getHisProduct", async (req, res) => {
  try {
    const client = new Client();
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });
    var cCUSTCD = req.body.cCUSTCD;
    var cPRODNM = req.body.cPRODNM;
    var cPRODCD = req.body.cPRODCD;

    const oldResult = await client.query(
      `SELECT DISTINCT ON (DT."cPRODCD") PRO."cPRODCD",PRO."cPRODNM",PRO."cTYPE",DT."iSSIZEQTY",DT."iMSIZEQTY",DT."iLSIZEQTY",DT."cSUOMCD",
      DT."cSUOMNM",DT."cMUOMCD",DT."cMUOMNM",DT."cLUOMCD",DT."cLUOMNM" ,DT."iSUNITPRICE",DT."iMUNITPRICE",DT."iLUNITPRICE",
      PRO."cTYPE",TY."cTYPENM",PRO."cCATECD",CA."cCATENM",PRO."cSUBCATECD",SCA."cSUBCATENM",DT."cBRNDCD",DT."cBRNDNM",
      PRO."cPHOTO_SERV",PRO."cPHOTO_PATH",PRO."cPHOTO_NM",DT."iINCOMPRO",DT."iCANCLEPRO",DT."iLOSSPRO",DT."cSTATUS"
      FROM   "TBT_PODT" AS DT
      INNER JOIN "TBT_POHD" AS HD ON HD."cPOCD" = DT."cPOCD"
      INNER JOIN "TBM_PRODUCT" AS PRO ON DT."cPRODCD"= PRO."cPRODCD"
      INNER JOIN "TBM_PRODUCT_TYPE" AS TY ON TY."cTYPECD" = PRO."cTYPE"   
      INNER JOIN "TBM_CATEGORY" AS CA ON CA."cCATECD" = PRO."cCATECD"
      INNER JOIN "TBM_CATEGORY_SUB" AS SCA ON SCA."cSUBCATECD" = PRO."cSUBCATECD"
      INNER JOIN "TBM_BRAND" AS BR ON BR."cBRNCD" = PRO."cBRNDCD"
      WHERE HD."cCUSTCD" = $1 AND PRO."cPRODNM" LIKE $2 AND PRO."cPRODCD" LIKE $3`,
      [cCUSTCD, cPRODNM, cPRODCD]
    );

    await client.end();

    const message = {
      success: true,
      message: "success",
      result: null,
    };
    res.json(oldResult.rows);
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

// +++++++++++++++++++ insert TBT_APPOHD +++++++++++++++++++
routeRouter.post("/addSupplierPOHD", async (req, res) => {
  try {
    const client = new Client();
    var uuid = `${crypto.randomUUID()}`;
    let dateTime = new Date().toJSON();
    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });
    var cPOCD = req.body.cPOCD;
    var cPOSTATUS = req.body.cPOSTATUS;
    var cBRANCD = req.body.cBRANCD;
    var cBRANNM = req.body.cBRANNM;
    var cSUPPCD = req.body.cSUPPCD;
    var cSUPPNM = req.body.cSUPPNM;
    var cPROVINCE = req.body.cPROVINCE;
    var cVEHICD = req.body.cVEHICD;
    var cDRIVER = req.body.cDRIVER;
    var cPLATE = req.body.cPLATE;
    var cPPROVINCE = req.body.cPPROVINCE;
    var iCAP_VEH = req.body.iCAP_VEH;
    var iCAP_PROD = req.body.iCAP_PROD;
    var iCAP_DIFF = req.body.iCAP_DIFF;
    var iWEIGHT_VEH = req.body.iWEIGHT_VEH;
    var iWEIGHT_PROD = req.body.iWEIGHT_PROD;
    var iWEIGHT_DIFF = req.body.iWEIGHT_DIFF;
    var iBEFORE_VAT = req.body.iBEFORE_VAT;
    var iVAT_VAL = req.body.iVAT_VAL;
    var iSKIP_VAT = req.body.iSKIP_VAT;
    var iDPBASKET = req.body.iDPBASKET;
    var iTOTAL = req.body.iTOTAL;
    var iPAID = req.body.iPAID;
    var cREMARK = req.body.cREMARK;
    var iBASKETTOTAL = req.body.iBASKETTOTAL;
    var cDELFLAG = req.body.cDELFLAG;
    var cCREATYPE = req.body.cCREATYPE;
    var dREF_DATE = new Date(req.body.dREF_DATE).toJSON();
    var cCREABY = req.body.cCREABY;
    var checkList = await client.query(
      `SELECT * FROM "TBT_APPOHD" WHERE "cPOCD" = $1`,
      [cPOCD]
    );

    if (checkList.rows.length > 0) {
      await client.query(
        `UPDATE "TBT_APPOHD" 
        SET "dPODATE" = $1,"cPOSTATUS"= $2,
        "cBRANCD"= $3,"cBRANNM"= $4,
        "cSUPPCD"= $5,"cSUPPNM"= $6,
        "cPROVINCE"= $7,"cVEHICD"= $8,
        "cDRIVER"= $9,"cPLATE"= $10,
        "cPPROVINCE"= $11,"iCAP_VEH"= $12,
        "iCAP_PROD"= $13,"iCAP_DIFF"= $14,
        "iWEIGHT_VEH"= $15,"iWEIGHT_PROD"= $16,
        "iWEIGHT_DIFF"= $17,"iBEFORE_VAT"= $18,
        "iVAT_VAL"= $19,"iSKIP_VAT"= $20,
        "iDPBASKET"= $21,"iTOTAL"= $22,
        "iPAID"= $23,"cREMARK"= $24,
        "iBASKETTOTAL"= $25,"cDELFLAG"= $26,
        "cCREATYPE"= $27,"dUPDADT"= $28,
        "cUPDABY"= $29,"dREF_DATE"= $30
        WHERE "cPOCD" = $31`,
        [
          dateTime,
          cPOSTATUS,
          cBRANCD,
          cBRANNM,
          cSUPPCD,
          cSUPPNM,
          cPROVINCE,
          cVEHICD,
          cDRIVER,
          cPLATE,
          cPPROVINCE,
          iCAP_VEH,
          iCAP_PROD,
          iCAP_DIFF,
          iWEIGHT_VEH,
          iWEIGHT_PROD,
          iWEIGHT_DIFF,
          iBEFORE_VAT,
          iVAT_VAL,
          iSKIP_VAT,
          iDPBASKET,
          iTOTAL,
          iPAID,
          cREMARK,
          iBASKETTOTAL,
          cDELFLAG,
          cCREATYPE,
          dateTime,
          cCREABY,
          dREF_DATE,
          cPOCD,
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
      await client.query(
        `INSERT INTO "TBT_APPOHD"("cGUID","cPOCD","dPODATE","cPOSTATUS","cBRANCD","cBRANNM","cSUPPCD","cSUPPNM","cPROVINCE",
        "cVEHICD","cDRIVER","cPLATE","cPPROVINCE","iCAP_VEH","iCAP_PROD","iCAP_DIFF","iWEIGHT_VEH","iWEIGHT_PROD","iWEIGHT_DIFF",
        "iBEFORE_VAT","iVAT_VAL","iSKIP_VAT","iDPBASKET","iTOTAL","iPAID","cREMARK","iBASKETTOTAL","cDELFLAG","cCREATYPE",
        "dCREADT","cCREABY","dUPDADT","cUPDABY","dREF_DATE")
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,
          $18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34)
        `,
        [
          uuid,
          cPOCD,
          dateTime,
          cPOSTATUS,
          cBRANCD,
          cBRANNM,
          cSUPPCD,
          cSUPPNM,
          cPROVINCE,
          cVEHICD,
          cDRIVER,
          cPLATE,
          cPPROVINCE,
          iCAP_VEH,
          iCAP_PROD,
          iCAP_DIFF,
          iWEIGHT_VEH,
          iWEIGHT_PROD,
          iWEIGHT_DIFF,
          iBEFORE_VAT,
          iVAT_VAL,
          iSKIP_VAT,
          iDPBASKET,
          iTOTAL,
          iPAID,
          cREMARK,
          iBASKETTOTAL,
          cDELFLAG,
          cCREATYPE,
          dateTime,
          cCREABY,
          dateTime,
          cCREABY,
          dREF_DATE,
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

// +++++++++++++++++++ insert TBT_APPODT +++++++++++++++++++
routeRouter.post("/addSupplierPODT", async (req, res) => {
  try {
    const client = new Client();
    var uuid = `${crypto.randomUUID()}`;
    let dateTime = new Date().toJSON();
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
    var iSSTOCK = req.body.iSSTOCK;
    var iMSTOCK = req.body.iMSTOCK;
    var iLSTOCK = req.body.iLSTOCK;
    var cSUOMCD = req.body.cSUOMCD;
    var cSUOMNM = req.body.cSUOMNM;
    var cMUOMCD = req.body.cMUOMCD;
    var cMUOMNM = req.body.cMUOMNM;
    var cLUOMCD = req.body.cLUOMCD;
    var cLUOMNM = req.body.cLUOMNM;
    var iMARKET = req.body.iMARKET;
    var iPLUSQTY = req.body.iPLUSQTY;
    var iENOUGHQTY = req.body.iENOUGHQTY;
    var iTOTAL = req.body.iTOTAL;
    var iPURCHASE = req.body.iPURCHASE;
    var iLUNITPRICE = req.body.iLUNITPRICE;
    var iNETPRICE = req.body.iNETPRICE;
    var iMONQTY = req.body.iMONQTY;
    var iTUEQTY = req.body.iTUEQTY;
    var iWEDQTY = req.body.iWEDQTY;
    var iTHUQTY = req.body.iTHUQTY;
    var iFRIQTY = req.body.iFRIQTY;
    var iSATQTY = req.body.iSATQTY;
    var iSUNQTY = req.body.iSUNQTY;
    var cSTATUS = req.body.cSTATUS;
    var cCREABY = req.body.cCREABY;

    var checkList = await client.query(
      `SELECT * FROM "TBT_APPODT" WHERE "cPOCD" = $1 AND "iSEQ" = $2`,
      [cPOCD,iSEQ]
    );

    if (checkList.rows.length > 0) {
      await client.query(
        `UPDATE "TBT_APPODT" 
        SET "cPRODCD" = $3,"cPRODNM" = $4,
        "iSSTOCK" = $5,"iMSTOCK" = $6,
        "iLSTOCK" = $7,"cSUOMCD" = $8,
        "cSUOMNM" = $9,"cMUOMCD" = $10,
        "cMUOMNM" = $11,"cLUOMCD" = $12,
        "cLUOMNM" = $13,"iMARKET" = $14,
        "iPLUSQTY" = $15,"iENOUGHQTY" = $16,
        "iTOTAL" = $17,"iPURCHASE" = $18,
        "iLUNITPRICE" = $19,"iNETPRICE" = $20,
        "iMONQTY" = $21,"iTUEQTY" = $22,
        "iWEDQTY" = $23,"iTHUQTY" = $24,
        "iFRIQTY" = $25,"iSATQTY" = $26,
        "iSUNQTY" = $27,"cSTATUS" = $28,
        "dUPDADT" = $29,"cUPDABY" = $30
        WHERE "cPOCD" = $1 AND "iSEQ" = $2`,
        [
          cPOCD,
          iSEQ,
          cPRODCD,
          cPRODNM ,
          iSSTOCK,
          iMSTOCK,
          iLSTOCK,
          cSUOMCD,
          cSUOMNM,
          cMUOMCD,
          cMUOMNM,
          cLUOMCD,
          cLUOMNM,
          iMARKET,
          iPLUSQTY,
          iENOUGHQTY,
          iTOTAL,
          iPURCHASE,
          iLUNITPRICE,
          iNETPRICE,
          iMONQTY,
          iTUEQTY,
          iWEDQTY,
          iTHUQTY,
          iFRIQTY,
          iSATQTY,
          iSUNQTY,
          cSTATUS,
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
    } else {
      await client.query(
        `INSERT INTO "TBT_APPODT" ("cGUID","cPOCD","iSEQ","cPRODCD","cPRODNM","iSSTOCK",
        "iMSTOCK","iLSTOCK","cSUOMCD","cSUOMNM","cMUOMCD","cMUOMNM","cLUOMCD","cLUOMNM",
        "iMARKET","iPLUSQTY","iENOUGHQTY","iTOTAL","iPURCHASE","iLUNITPRICE","iNETPRICE",
        "iMONQTY","iTUEQTY","iWEDQTY","iTHUQTY","iFRIQTY","iSATQTY","iSUNQTY","cSTATUS",
        "dCREADT","cCREABY","dUPDADT","cUPDABY")
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,
          $18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33)`,
        [
          uuid,
          cPOCD,
          iSEQ,
          cPRODCD,
          cPRODNM ,
          iSSTOCK,
          iMSTOCK,
          iLSTOCK,
          cSUOMCD,
          cSUOMNM,
          cMUOMCD,
          cMUOMNM,
          cLUOMCD,
          cLUOMNM,
          iMARKET,
          iPLUSQTY,
          iENOUGHQTY,
          iTOTAL,
          iPURCHASE,
          iLUNITPRICE,
          iNETPRICE,
          iMONQTY,
          iTUEQTY,
          iWEDQTY,
          iTHUQTY,
          iFRIQTY,
          iSATQTY,
          iSUNQTY,
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

module.exports = routeRouter;
