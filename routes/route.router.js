require("dotenv").config();
let express = require("express");
let routeRouter = express.Router();
const crypto = require("crypto");
const { Client } = require("pg");


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

    const result = await client.query(
      `SELECT CHD."cGUID",CHD."cCUSTCD",CHD."cCUSTNM",CHD."cCUSTBNM",CHD."cTAXNO",
		CHD."cTEL",CHD."cCONTACT",CHD."cCONTACT_TEL",CHD."cLINEID",CHD."cBRANCD",
		CHD."cCUSTTYPE",CHD."cPAYTYPE",CHD."iCREDTERM",CHD."iCREDLIM",CHD."cTSELLCD",
		CHD."cISBASKET",CHD."cSTATUS",CHD."dCREADT",CHD."cCREABY",CHD."dUPDADT",
		CHD."cUPDABY",RD."cGRPCD",RD."cRTECD",DT."cISPHOTO",DT."cPHOTO_SERV",
        DT."cPHOTO_PATH",DT."cPHOTO_NM",DT."cADDRESS",DT."cSHIPTO",DT."cLOCATION",
		DT."cPROVINCE",DT."cDISTRICT",DT."cSUBDIST",DT."cPOSTCD",DT."cASSET",
		DT."cLATITUDE",DT."cLONGTITUDE",
		HD."cPREPAIRCFSTATUS" 
		FROM "TBM_CUSTOMER_HD" AS CHD
        INNER JOIN "TBM_CUSTOMER_ROUTE" AS RD
        ON CHD."cCUSTCD" = RD."cCUSTCD"
        INNER JOIN "TBM_CUSTOMER_DT" AS DT
        ON DT."cCUSTCD" = RD."cCUSTCD"
        LEFT JOIN "TBT_POHD" AS HD
        ON CHD."cCUSTCD" = HD."cCUSTCD"
        WHERE RD."cRTECD" = $1`,
      [id]
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

    const result = await client.query(
      `SELECT HD."cCUSTCD",HD."cPOCD",count(DT.*) AS iItems ,
      count(DT."cBASKCD")AS iBasket,
      DT."iTOTAL"   
      FROM "TBT_POHD" HD
      INNER JOIN "TBT_PODT" DT ON HD."cPOCD" = DT."cPOCD"
      WHERE HD."cCUSTCD" = $1 AND HD."cPOCD" = $2
      GROUP BY  HD."cCUSTCD",HD."cPOCD",DT."cBASKCD",DT."iTOTAL"
      ORDER BY  DT."iTOTAL" DESC`,
      [custcd, pocd]
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

    var custcd = req.body.custcd;

    const result = await client.query(
      `SELECT HD."cCUSTCD",HD."cPOCD",HD."dPODATE"  
      FROM "TBT_POHD" HD
      INNER JOIN "TBT_PODT" DT ON HD."cPOCD" = DT."cPOCD"
      WHERE HD."cCUSTCD" = $1
      GROUP BY  HD."cCUSTCD",HD."cPOCD",DT."cBASKCD",DT."iTOTAL"
      ORDER BY HD."dPODATE" DESC
      LIMIT 1`,
      [custcd]
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

    const result = await client.query(
      `SELECT DT."cGUID",DT."cPOCD",DT."iSEQ",DT."cPRODCD",DT."cPRODNM",DT."cBRNDCD",
      DT."cBRNDNM",DT."iSSIZEQTY",DT."iMSIZEQTY",DT."iLSIZEQTY",DT."cPROMO",DT."iDISCOUNT",
      DT."cDISCOUNT",DT."iFREE",DT."iTOTAL",DT."cBASKCD",DT."cBASKNM",DT."cSTATUS",
      DT."dCREADT",DT."cCREABY",DT."dUPDADT",DT."cUPDABY",DT."cINSERTYPE",DT."iSUNITPRICE",
      DT."iMUNITPRICE",DT."iLUNITPRICE",DT."cPREPAIRSTATUS",DT."iPREPAIRAMOUT",
      PRO."cPHOTO_SERV",PRO."cPHOTO_PATH",PRO."cPHOTO_NM"
      FROM "TBT_PODT" AS DT 
      LEFT JOIN "TBM_PRODUCT" AS PRO ON DT."cPRODCD" = PRO."cPRODCD"
      WHERE DT."cPOCD"= $1`,
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
      [cPREPAIRSTATUS,iPREPAIRAMOUT,cPOCD,iSEQ]
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
      [cPREPAIRCFSTATUS,iBASKETTOTAL,cPOCD]
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
    var cSTATUSDT = 'Y';
    var cPRODCD = '';
    var cPRODNM = '';
    var cBRNDCD = '';
    var cBRNDNM = '';
    var iSSIZEQTY = 0;
    var iMSIZEQTY = 0;
    var iLSIZEQTY = 0;
    var cPROMO = '';
    var iDISCOUNT = 0;
    var cDISCOUNT = '';
    var iFREE = 0;
    var iTOTAL = iSUMTOTAL;
    var cBASKCD = '';
    var cBASKNM = '';
    var cINSERTYPE = 'A';
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
    var cINSERTYPE = 'M';
    var iSUNITPRICET = req.body.iSUNITPRICET;
    var iMUNITPRICE = req.body.iMUNITPRICE;
    var iLUNITPRICE = req.body.iLUNITPRICE;

    // TBT_POPREPAIRHD
    var dDATE = dateNow;
    var cSTATUSHD = '2';
    var cBRANCD = '';
    var cGRPCD = '';
    var cRTECD = '';
    var cVEHICD = '';
    var cDRIVER = '';
    var cPLATE = '';
    var cPROVINCE = '';
    var iCAP = 0;
    var iWEIGHT = 0;
    var cCUSTCD = '';
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
        cPOCD
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

    var CUSTCD = req.body.CUSTCD;

    const result = await client.query(
      `SELECT "cGUID","cCUSTCD","cLATITUDE","cLONGTITUDE","dUPDADT","cUPDABY" 
      FROM "TBM_CUSTOMER_DT" 
      WHERE "cCUSTCD" = $1`,
      [CUSTCD]
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
module.exports = routeRouter;
