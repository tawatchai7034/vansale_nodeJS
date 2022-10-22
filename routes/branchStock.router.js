require("dotenv").config();
let express = require("express");
let branchStockRouter = express.Router();
const crypto = require("crypto");
const { Client } = require("pg");
const bodyParser = require("body-parser");
const fs = require("fs");
const date = require("date-and-time");



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
    var cPRODCD = req.body.cPRODCD;
    var cPRODNM = req.body.cPRODNM;

    const result = await client.query(
      `SELECT PDT."cGUID",PDT."cPOCD",PDT."iSEQ",PDT."cPRODCD",PDT."cPRODNM",PDT."iSSTOCK",PDT."iMSTOCK",PDT."iLSTOCK",PDT."cSUOMCD",
      PDT."cSUOMNM",PDT."cMUOMCD",PDT."cMUOMNM",PDT."cLUOMCD",PDT."cLUOMNM",PDT."iMARKET",PDT."iPLUSQTY",PDT."iENOUGHQTY",PDT."iTOTAL",
      PDT."iPURCHASE",PDT."iLUNITPRICE",PDT."iNETPRICE",PDT."iMONQTY",PDT."iTUEQTY",PDT."iWEDQTY",PDT."iTHUQTY",PDT."iFRIQTY",PDT."iSATQTY",
      PDT."iSUNQTY",PDT."cSTATUS",PR."cPHOTO_SERV",PR."cPHOTO_PATH",PR."cPHOTO_NM",PR."cBASKCD",BK."cBASKNM",BK."iPRICE",PR."cTYPE",PTY."cTYPENM",
      PR."cCATECD",PCG."cCATENM",PR."cSUBCATECD",PSC."cSUBCATENM",PR."cBRNDCD",BND."cBRNNM",PDT."dCREADT",PDT."cCREABY",PDT."dUPDADT",PDT."cUPDABY" 
      FROM "TBT_APPODT" AS PDT
      INNER  JOIN "TBM_PRODUCT" AS PR
      ON PDT."cPRODCD" = PR."cPRODCD"
      INNER  JOIN "TBM_BASKET" AS BK
      ON BK."cBASKCD" = PR."cBASKCD"
      INNER  JOIN "TBM_PRODUCT_TYPE" AS PTY
      ON PTY."cTYPECD" = PR."cTYPE"
      INNER  JOIN "TBM_CATEGORY" AS PCG
      ON PCG."cCATECD" = PR."cCATECD"
      INNER  JOIN "TBM_CATEGORY_SUB" AS PSC
      ON PSC."cSUBCATECD" = PR."cSUBCATECD"
      INNER  JOIN "TBM_BRAND" AS BND
      ON BND."cBRNCD" = PR."cBRNDCD"
        WHERE "cPOCD" = $1 AND PDT."cPRODCD" LIKE $2 AND PDT."cPRODNM" LIKE $3`,
      [cPOCD,cPRODCD,cPRODNM]
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

// +++++++++++++++++++ insert TBT_SUPPLIER_DEDTOR +++++++++++++++++++
branchStockRouter.post("/addSupplierCredit", async (req, res) => {
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

    var cSUPPCD = req.body.cSUPPCD;
    var cSUPPNM = req.body.cSUPPNM;

    var cREFDOC = req.body.cREFDOC;
    var cBRANCD = req.body.cBRANCD;
    var cBRANNM = req.body.cBRANNM;
    var cPRODCD = req.body.cPRODCD;
    var cPRODNM = req.body.cPRODNM;
    var cSUOMCD = req.body.cSUOMCD;
    var cSUOMNM = req.body.cSUOMNM;
    var cMUOMCD = req.body.cMUOMCD;
    var cMUOMNM = req.body.cMUOMNM;
    var cLUOMCD = req.body.cLUOMCD;
    var cLUOMNM = req.body.cLUOMNM;
    var iSUNITPRICE = req.body.iSUNITPRICE;
    var iMUNITPRICE = req.body.iMUNITPRICE;
    var iLUNITPRICE = req.body.iLUNITPRICE;
    var iORQTY = req.body.iORQTY;
    var iDEBIT = req.body.iDEBIT;
    var iCREDIT = req.body.iCREDIT;
    var iRCQTY = req.body.iRCQTY;
    var cCREABY = req.body.cCREABY;
    const now = new Date();
    const dateValue = date.format(now, "YYMM");

    const checkResult = await client.query(
      `SELECT * FROM "TBT_SUPPLIER_CREDIT"`
    );
    var cDOCCD = `CR${dateValue}-000001`;
    var returnList = checkResult.rows;
    if (returnList.length > 0) {
      let roleCodeCheck = [];
      let codeEntityList = [];
      for (var i = 0; i < returnList.length; i++) {
        roleCodeCheck.push(returnList[i].cDOCCD);
      }

      for (var i = 1; i < 1000000; i++) {
        let str = `${i}`;
        let roleCode = str.padStart(6, "0");
        let RoleCode = `CR${dateValue}-${roleCode}`;
        if (roleCodeCheck.includes(RoleCode) == false) {
          codeEntityList.push(RoleCode);
        }
      }
      cDOCCD = codeEntityList[0];
    }

    const result = await client.query(
      `INSERT INTO "TBT_SUPPLIER_CREDIT" ("cGUID","cSUPPCD","cSUPPNM","cDOCCD","cREFDOC","cBRANCD",
      "cBRANNM","cPRODCD","cPRODNM","cSUOMCD","cSUOMNM","cMUOMCD","cMUOMNM","cLUOMCD","cLUOMNM",
      "iSUNITPRICE","iMUNITPRICE","iLUNITPRICE","iORQTY","iDEBIT","iCREDIT","iRCQTY",
      "cCREABY","cUPDABY","dCREADT","dUPDADT")
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,
        $18,$19,$20,$21,$22,$23,$24,$25,$26)`,
      [
        uuid,
        cSUPPCD,
        cSUPPNM,
        cDOCCD,
        cREFDOC,
        cBRANCD,
        cBRANNM,
        cPRODCD,
        cPRODNM,
        cSUOMCD,
        cSUOMNM,
        cMUOMCD,
        cMUOMNM,
        cLUOMCD,
        cLUOMNM,
        iSUNITPRICE,
        iMUNITPRICE,
        iLUNITPRICE,
        iORQTY,
        iDEBIT,
        iCREDIT,
        iRCQTY,
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

// +++++++++++++++++++ insert TBT_SUPPLIER_DEDTOR +++++++++++++++++++
branchStockRouter.post("/supplierCreditPay", async (req, res) => {
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

    var cSUPPCD = req.body.cSUPPCD;
    var cBRANCD = req.body.cBRANCD;
    var cPRODCD = req.body.cPRODCD;
    var cCREABY = req.body.cCREABY;

    const checkResult = await client.query(
      `SELECT  * FROM "TBT_SUPPLIER_CREDIT" 
      WHERE "cSUPPCD" = $1 AND "cBRANCD"= $2 AND 
      "cPRODCD"= $3 AND "iDEBIT" != "iCREDIT"`,
      [cSUPPCD, cBRANCD, cPRODCD]
    );

    if (checkResult.rows.length > 0) {
      const dateValue = date.format(new Date(), "YYYY-MM-DD");
      const createDate = date.format(
        new Date(`${checkResult.rows[0].dCREADT}`),
        "YYYY-MM-DD"
      );
      if (dateValue !== createDate) {
        var cUOMCD = checkResult.rows[0].cLUOMCD;
        var cWH = "FG";
        var cREF_DOC = checkResult.rows[0].cDOCCD;
        var iRECEIVE_QTY = "0.0";
        var iISSUE_QTY = `${checkResult.rows[0].iCREDIT}`;
        var cREMARK = "";
        var cLOT_NO = "";

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
          // await client.end();

          // const message = {
          //   success: true,
          //   message: "success",
          //   result: null,
          // };
          // res.json(message);
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

          // await client.end();

          // const message = {
          //   success: true,
          //   message: "success",
          //   result: null,
          // };
          // res.json(message);
        }

        await client.query(
          `UPDATE "TBT_SUPPLIER_CREDIT" 
        SET "iDEBIT" = "iCREDIT","iRCQTY" = "iORQTY"
        WHERE "cSUPPCD" = $1 AND "cBRANCD"= $2 AND 
        "cPRODCD"= $3 AND "cDOCCD" = $4`,
          [cSUPPCD, cBRANCD, cPRODCD, checkResult.rows[0].cDOCCD]
        );
      }
    }

    await client.end();
    const message = {
      success: true,
      message: "success",
      result: checkResult.rows,
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

// +++++++++++++++++++ insert TBT_RECEIVE_HD +++++++++++++++++++
branchStockRouter.post("/addSupplierReceiveHD", async (req, res) => {
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

    var cREF_DOC = req.body.cREF_DOC;
    var cRECEIVE_BY = req.body.cRECEIVE_BY;
    var iBEFORE_VAT = req.body.iBEFORE_VAT;
    var iVAT_VAL = req.body.iVAT_VAL;
    var iSKIP_VAT = req.body.iSKIP_VAT;
    var iTOTAL = req.body.iTOTAL;
    var cREMARK = req.body.cREMARK;
    var cCREABY = req.body.cCREABY;

    const now = new Date();
    const dateValue = date.format(now, "YYMM");

    const checkResult = await client.query(`SELECT * FROM "TBT_RECEIVE_HD"`);

    var cRECEIVE_NO = `RE${dateValue}-000001`;
    var returnList = checkResult.rows;
    if (returnList.length > 0) {
      let roleCodeCheck = [];
      let codeEntityList = [];
      for (var i = 0; i < returnList.length; i++) {
        roleCodeCheck.push(returnList[i].cDOCCD);
      }

      for (var i = 1; i < 1000000; i++) {
        let str = `${i}`;
        let roleCode = str.padStart(6, "0");
        let RoleCode = `CR${dateValue}-${roleCode}`;
        if (roleCodeCheck.includes(RoleCode) == false) {
          codeEntityList.push(RoleCode);
        }
      }
      cRECEIVE_NO = codeEntityList[0];
    }

    const result = await client.query(
      `INSERT INTO "TBT_RECEIVE_HD" ("cGUID","cRECEIVE_NO","cREF_DOC","dRECEIVE_DT",
      "cRECEIVE_BY","cRECEIVE_NM","iBEFORE_VAT","iVAT_VAL","iSKIP_VAT","iTOTAL",
      "cREMARK","dCREADT","cCREABY","dUPDADT","cUPDABY")
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [
        uuid,
        cRECEIVE_NO,
        cREF_DOC,
        dateTime,
        cRECEIVE_BY,
        cCREABY,
        iBEFORE_VAT,
        iVAT_VAL,
        iSKIP_VAT,
        iTOTAL,
        cREMARK,
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
      result: cRECEIVE_NO,
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

// +++++++++++++++++++ insert TBT_RECEIVE_DT +++++++++++++++++++
branchStockRouter.post("/addSupplierReceiveDT", async (req, res) => {
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

    var cRECEIVE_NO = req.body.cRECEIVE_NO;
    var iSEQ = req.body.iSEQ;
    var cPRODCD = req.body.cPRODCD;
    var cPRODNM = req.body.cPRODNM;
    var cBRNDCD = req.body.cBRNDCD;
    var cBRNDNM = req.body.cBRNDNM;
    var cSUOMCD = req.body.cSUOMCD;
    var cSUOMNM = req.body.cSUOMNM;
    var cMUOMCD = req.body.cMUOMCD;
    var cMUOMNM = req.body.cMUOMNM;
    var cLUOMCD = req.body.cLUOMCD;
    var cLUOMNM = req.body.cLUOMNM;
    var iSORDERQTY = req.body.iSORDERQTY;
    var iMORDERQTY = req.body.iMORDERQTY;
    var iLORDERQTY = req.body.iLORDERQTY;
    var iPLUSQTY = req.body.iPLUSQTY;
    var iLOSSQTY = req.body.iLOSSQTY;
    var iRECEQTY =
      parseInt(iLORDERQTY) + parseInt(iPLUSQTY) - parseInt(iLOSSQTY);
    var cREMARK = req.body.cREMARK;
    var cCREABY = req.body.cCREABY;

    const result = await client.query(
      `INSERT INTO "TBT_RECEIVE_DT" ("cGUID","cRECEIVE_NO","iSEQ","cPRODCD",
      "cPRODNM","cBRNDCD","cBRNDNM","cSUOMCD","cSUOMNM","cMUOMCD","cMUOMNM",
      "cLUOMCD","cLUOMNM","iSORDERQTY","iMORDERQTY","iLORDERQTY","iPLUSQTY",
      "iLOSSQTY","iRECEQTY","cREMARK","dCREADT","cCREABY","dUPDADT","cUPDABY")
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,
        $18,$19,$20,$21,$22,$23,$24)`,
      [
        uuid,
        cRECEIVE_NO,
        iSEQ,
        cPRODCD,
        cPRODNM,
        cBRNDCD,
        cBRNDNM,
        cSUOMCD,
        cSUOMNM,
        cMUOMCD,
        cMUOMNM,
        cLUOMCD,
        cLUOMNM,
        iSORDERQTY,
        iMORDERQTY,
        iLORDERQTY,
        iPLUSQTY,
        iLOSSQTY,
        iRECEQTY,
        cREMARK,
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
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

// +++++++++++++++++++ add TBT_RECEIVE_BILL +++++++++++++++++++
branchStockRouter.post("/addSupplierReceivBill", async (req, res) => {
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

    var cRECEIVE_NO = req.body.cRECEIVE_NO;
    var cREF_DOC = req.body.cREF_DOC;
    var iSEQ = req.body.iSEQ;
    var cSERVER = req.body.cSERVER;
    var cCREABY = req.body.cCREABY;
    var cIB64 = req.body.cIB64;

    const now = new Date();
    const dateValue = date.format(now, "YYMMDDHHmmss");
    var path =
      "C:/NETCoreWeb/Vansale/Web/wwwroot/upload/SUPPLIER_RECEIVE/RC_" +
      dateValue +
      "_" +
      iSEQ +
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
      FROM "TBT_RECEIVE_BILL" 
      WHERE "cRECEIVE_NO" = $1 AND "iSEQ"= $2`,
      [cRECEIVE_NO, iSEQ]
    );

    // res.json(oldResult.rows)

    if (oldResult.rows.length > 0) {
      const result = await client.query(
        `UPDATE "TBT_RECEIVE_BILL" 
      SET 
      "cPHOTO_SERV"= $3,
      "cPHOTO_PATH"= $4,
      "cPHOTO_NM"= $5 ,
      "cUPDABY" = $6,
      "dUPDADT"=$7
      WHERE "cRECEIVE_NO" = $1 AND "iSEQ" = $2`,
        [cRECEIVE_NO, iSEQ, PHSEV, PHPATH, PHNM, cCREABY, dateTime]
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
        `INSERT INTO "TBT_RECEIVE_BILL" ("cGUID","cRECEIVE_NO","cREF_DOC","iSEQ",
        "cPHOTO_SERV","cPHOTO_PATH","cPHOTO_NM","cCREABY",
        "cUPDABY","dCREADT","dUPDADT")
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          uuid,
          cRECEIVE_NO,
          cREF_DOC,
          iSEQ,
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

// +++++++++++++++++++ update cPOSTATUS of TBT_APPOHD +++++++++++++++++++
branchStockRouter.post("/updateStatusAPPOHD", async (req, res) => {
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

    var cCREABY = req.body.cCREABY;

    const RC_hdResult = await client.query(
      `SELECT * FROM "TBT_RECEIVE_HD" WHERE "cREF_DOC" = $1`,
      [cPOCD]
    );
    if (RC_hdResult.rows.length > 0) {
      const RC_dtResult = await client.query(
        `SELECT * FROM "TBT_RECEIVE_DT" WHERE "cRECEIVE_NO" = $1`,
        [RC_hdResult.rows[0].cRECEIVE_NO]
      );

      var creditPro = 0.0;

      for (var i = 0; i < RC_dtResult.rows.length; i++) {
        creditPro += parseFloat(RC_dtResult.rows[i].iLOSSQTY);
      }

      if (creditPro > 0) {
        var credit = 0;
        var debit = 0;
        const creditResult = await client.query(
          `SELECT * FROM "TBT_SUPPLIER_CREDIT" WHERE "cREFDOC" = $1`,
          [cPOCD]
        );

        for (var i = 0; i < creditResult.rows.length; i++) {
          credit += creditResult.rows[i].iCREDIT;
          debit += creditResult.rows[i].iDEBIT;
        }
        if (credit != debit) {
          await client.query(
            `UPDATE "TBT_APPOHD" SET "cPOSTATUS" = $1 ,"cUPDABY" = $3,"dUPDADT" = $4 WHERE "cPOCD" = $2`,
            ["4", cPOCD, cCREABY, dateTime]
          );
          await client.end();
          const message = {
            success: true,
            message: "Credit of product is not 0",
            result: null,
          };
          res.json(message);
        } else {
          await client.query(
            `UPDATE "TBT_APPOHD" SET "cPOSTATUS" = $1 ,"cUPDABY" = $3,"dUPDADT" = $4 WHERE "cPOCD" = $2`,
            ["5", cPOCD, cCREABY, dateTime]
          );
          await client.end();
          const message = {
            success: true,
            message: "success",
            result: null,
          };
          res.json(message);
        }
      } else {
        await client.query(
          `UPDATE "TBT_APPOHD" SET "cPOSTATUS" = $1 ,"cUPDABY" = $3,"dUPDADT" = $4 WHERE "cPOCD" = $2`,
          ["3", cPOCD, cCREABY, dateTime]
        );
        await client.end();
        const message = {
          success: true,
          message: "Credit of product is 0",
          result: null,
        };
        res.json(message);
      }
    } else {
      await client.end();
      const message = {
        success: false,
        message: "PO is not receive",
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
module.exports = branchStockRouter;
