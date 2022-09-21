require("dotenv").config();
let express = require("express");
let routeRouter = express.Router();
const crypto = require("crypto");
const { Client } = require("pg");

let dateTime = new Date().toJSON();
var uuid = `${crypto.randomUUID()}`;

// +++++++++++++++++++ TBM_ROUTE +++++++++++++++++++
routeRouter.post("/getRoute", async (req, res) => {
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
      result: null,
    };
    res.json(result);
  }
});

// +++++++++++++++++++ TBM_CUSTOMER_HD +++++++++++++++++++
routeRouter.post("/getRouteTransfers", async (req, res) => {
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
    var shippingDate = req.body.dSHIPDATE;

    const result = await client.query(
      `SELECT CHD."cGUID",CHD."cCUSTCD",CHD."cCUSTNM",CHD."cCUSTBNM",CHD."cTAXNO",
      CHD."cTEL",CHD."cCONTACT",CHD."cCONTACT_TEL",CHD."cLINEID",CHD."cBRANCD",
      CHD."cCUSTTYPE",CHD."cPAYTYPE",CHD."iCREDTERM",CHD."iCREDLIM",CHD."cTSELLCD",
      CHD."cISBASKET",CHD."cSTATUS",CHD."dCREADT",CHD."cCREABY",CHD."dUPDADT",
      CHD."cUPDABY",DT."cDISTANCS",RD."cGRPCD",RD."cRTECD",DT."cISPHOTO",DT."cPHOTO_SERV",
      DT."cPHOTO_PATH",DT."cPHOTO_NM",DT."cADDRESS",DT."cSHIPTO",HD."cADDRESS",DT."cLOCATION",
      DT."cPROVINCE",DT."cDISTRICT",DT."cSUBDIST",DT."cPOSTCD",DT."cASSET",
      DT."cLATITUDE",DT."cLONGTITUDE",
      HD."cPREPAIRCFSTATUS",HD."cPOSTATUS"
      FROM "TBM_CUSTOMER_HD" AS CHD
          INNER JOIN "TBM_CUSTOMER_ROUTE" AS RD
          ON CHD."cCUSTCD" = RD."cCUSTCD"
          INNER JOIN "TBM_CUSTOMER_DT" AS DT
          ON DT."cCUSTCD" = RD."cCUSTCD"
          LEFT JOIN "TBT_POHD" AS HD
          ON CHD."cCUSTCD" = HD."cCUSTCD"
          WHERE RD."cRTECD" = $1 AND HD."dSHIPDATE"::date = $2`,
      [id, shippingDate]
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

// +++++++++++++++++++ TBT_POHD && TBT_PODT +++++++++++++++++++
routeRouter.post("/getPoHDAndPoDT", async (req, res) => {
  try {
    const client = new Client();

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
      `SELECT HD."cCUSTCD",HD."cPOCD",DT."cPRODCD",DT."cPRODNM",count(DT.*) AS iItems ,
      count(DT."cBASKCD")AS iBasket,
      DT."iTOTAL"   
      FROM "TBT_POHD" HD
      INNER JOIN "TBT_PODT" DT ON HD."cPOCD" = DT."cPOCD"
      WHERE HD."cCUSTCD" = $1 AND HD."cPOCD" = $2 AND  DT."cPRODNM" LIKE $3 AND  DT."cPRODCD" LIKE $4
      GROUP BY  HD."cCUSTCD",HD."cPOCD",DT."cPRODCD",DT."cPRODNM",DT."cBASKCD",DT."iTOTAL"
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
      `SELECT DT."cGUID",DT."cPOCD",DT."iSEQ",DT."cPRODCD",DT."cPRODNM",DT."cBRNDCD",
      DT."cBRNDNM",DT."iSSIZEQTY",DT."iMSIZEQTY",DT."iLSIZEQTY",DT."cSUOMNM",DT."cMUOMNM",DT."cLUOMNM"
      ,DT."cPROMO",DT."iDISCOUNT",
      DT."cDISCOUNT",DT."iFREE",DT."iTOTAL",DT."cBASKCD",DT."cBASKNM",DT."cSTATUS",
      DT."dCREADT",DT."cCREABY",DT."dUPDADT",DT."cUPDABY",DT."cINSERTYPE",DT."iSUNITPRICE",
      DT."iMUNITPRICE",DT."iLUNITPRICE",DT."cPREPAIRSTATUS",DT."iPREPAIRAMOUT",
      PRO."cPHOTO_SERV",PRO."cPHOTO_PATH",DT."iNETTOTAL",DT."iINCOMPRO",DT."iCANCLEPRO",DT."iLOSSPRO"
      FROM "TBT_PODT" AS DT 
      LEFT JOIN "TBM_PRODUCT" AS PRO ON DT."cPRODCD" = PRO."cPRODCD"
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

    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    var cVEHINM = req.body.cVEHINM;
    var cPLATE = req.body.cPLATE;
    var cRTENM = req.body.cRTENM;

    const result = await client.query(
      `SELECT RO."cRTECD","cRTENM" FROM "TBM_VEHICLE" AS VE
      INNER JOIN "TBM_MAP_ROUTE" AS MR
       ON MR."cVEHICD" = VE."cVEHICD"
      INNER  JOIN "TBM_ROUTE" AS RO
       ON RO."cRTECD" = MR."cRTECD"
       WHERE VE."cVEHINM" = $1 AND 
       VE."cPLATE" = $2AND 
       RO."cRTENM" LIKE $3`,
      [cVEHINM, cPLATE, cRTENM]
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
    var cIB64 = req.body.cIB64;

    const oldResult = await client.query(
      `SELECT *
      FROM "TBT_PO_LOSSPRO" 
      WHERE "cCUSTCD" = $1 AND "cPOCD"= $2`,
      [cCUSTCD, cPOCD]
    );

    if (oldResult.rows.length > 0) {
      const result = await client.query(
        `UPDATE "TBT_PO_LOSSPRO" 
    SET "iQTY"= $3,
    "iTOTAL" = $4,
    "cIB64" = $5,
    "cUPDABY" = $6,
    "dUPDADT"=$7
    WHERE "cCUSTCD" = $1 AND "cPOCD" = $2`,
        [cCUSTCD, cPOCD, iQTY, iTOTAL, cIB64, cCREABY, dateTime]
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
        ("cGUID","cPOCD","cCUSTCD","iQTY","iTOTAL","cIB64","cCREABY","cUPDABY","dCREADT","dUPDADT")
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          uuid,
          cPOCD,
          cCUSTCD,
          iQTY,
          iTOTAL,
          cIB64,
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
      }else{
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
module.exports = routeRouter;
