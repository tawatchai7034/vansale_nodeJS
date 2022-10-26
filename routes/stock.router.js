require("dotenv").config();
let express = require("express");
let stockRouter = express.Router();
const crypto = require("crypto");
const { Client } = require("pg");
const bodyParser = require("body-parser");
const fs = require("fs");
const date = require("date-and-time");

// +++++++++++++++++++ add Stock Balance +++++++++++++++++++
stockRouter.post("/addStockBalance", async (req, res) => {
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
    var uuid = `${crypto.randomUUID()}`;
    let dateTime = new Date().toJSON();
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

// +++++++++++++++++++ add return product header +++++++++++++++++++
stockRouter.post("/addReturnHD", async (req, res) => {
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

    var cBRANCD = req.body.cBRANCD;
    var cGRPCD = req.body.cGRPCD;
    var cRTECD = req.body.cRTECD;
    var cCUSTCD = req.body.cCUSTCD;
    var cCUSTNM = req.body.cCUSTNM;
    var cVEHICD = req.body.cVEHICD;
    var cDRIVER = req.body.cDRIVER;
    var cREMARK = req.body.cREMARK;
    var iTOTAL = req.body.iTOTAL;
    var cREFDOC = req.body.cREFDOC;
    var cRETYP = req.body.cRETYP;
    var cPAYST = req.body.cPAYST;
    var cCREABY = req.body.cCREABY;

    const now = new Date();
    const dateValue = date.format(now, "YYMMDD");
    var code = `%${cRETYP}-${dateValue}%`;
    const proResult = await client.query(
      `SELECT *
        FROM "TBT_RETURN_HD" 
        WHERE "cRETYP" = $1 AND "cRETCD" LIKE $2`,
      [cRETYP, code]
    );
    var cRETCD = `${cRETYP}-${dateValue}-0001`;

    var returnList = proResult.rows;
    if (returnList.length > 0) {
      let roleCodeCheck = [];
      let codeEntityList = [];
      for (var i = 0; i < returnList.length; i++) {
        roleCodeCheck.push(returnList[i].cRETCD);
      }

      for (var i = 1; i < 10000; i++) {
        let str = `${i}`;
        let roleCode = str.padStart(4, "0");
        let RoleCode = `${cRETYP}-${dateValue}-${roleCode}`;
        if (roleCodeCheck.includes(RoleCode) == false) {
          codeEntityList.push(RoleCode);
        }
      }
      cRETCD = codeEntityList[0];
    }

    const result = await client.query(
      `INSERT INTO "TBT_RETURN_HD" 
      ("cGUID","cBRANCD","cRETCD","cGRPCD","cRTECD","cCUSTCD",
      "cCUSTNM","cVEHICD","cDRIVER","cREMARK","cCREABY","cUPDABY","dCREADT",
      "dUPDADT","cPAYST","iTOTAL","cREFDOC","dRETDT","cRETYP")
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
      [
        uuid,
        cBRANCD,
        cRETCD,
        cGRPCD,
        cRTECD,
        cCUSTCD,
        cCUSTNM,
        cVEHICD,
        cDRIVER,
        cREMARK,
        cCREABY,
        cCREABY,
        dateTime,
        dateTime,
        cPAYST,
        iTOTAL,
        cREFDOC,
        dateTime,
        cRETYP,
      ]
    );

    await client.end();

    const message = {
      success: true,
      message: "success",
      result: cRETCD,
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

// +++++++++++++++++++ update return product header +++++++++++++++++++
stockRouter.post("/updateReturnHD", async (req, res) => {
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

    var cBRANCD = req.body.cBRANCD;
    var cGRPCD = req.body.cGRPCD;
    var cRTECD = req.body.cRTECD;
    var cCUSTCD = req.body.cCUSTCD;
    var cCUSTNM = req.body.cCUSTNM;
    var cVEHICD = req.body.cVEHICD;
    var cDRIVER = req.body.cDRIVER;
    var cREMARK = req.body.cREMARK;
    var iTOTAL = req.body.iTOTAL;
    var cREFDOC = req.body.cREFDOC;
    var cRETYP = req.body.cRETYP;
    var cPAYST = req.body.cPAYST;
    var cCREABY = req.body.cCREABY;
    var cRETCD = req.body.cRETCD;

    const result = await client.query(
      `UPDATE "TBT_RETURN_HD" 
      SET "cBRANCD" = $2,"cGRPCD" = $3,
      "cRTECD" = $4,"cCUSTCD" = $5,
      "cCUSTNM" = $6,"cVEHICD" = $7,
      "cDRIVER" = $8,"cREMARK" = $9,
      "cPAYST" = $10,"iTOTAL" = $11,
      "cREFDOC" = $12,"cRETYP" = $13,
      "cUPDABY" = $14,"dUPDADT" = $15
      WHERE "cRETCD" = $1`,
      [
        cRETCD,
        cBRANCD,
        cGRPCD,
        cRTECD,
        cCUSTCD,
        cCUSTNM,
        cVEHICD,
        cDRIVER,
        cREMARK,
        cPAYST,
        iTOTAL,
        cREFDOC,
        cRETYP,
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
  } catch (err) {
    const result = {
      success: false,
      message: err,
      result: null,
    };
    res.json(result);
  }
});

// +++++++++++++++++++ add return product detail +++++++++++++++++++
stockRouter.post("/addReturnDT", async (req, res) => {
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

    var cRETCD = req.body.cRETCD;
    var iSEQ = req.body.iSEQ;
    var cPRODCD = req.body.cPRODCD;
    var cPRODNM = req.body.cPRODNM;
    var cBRNDCD = req.body.cBRNDCD;
    var cBRNDNM = req.body.cBRNDNM;
    var iSSIZEQTY = req.body.iSSIZEQTY;
    var iMSIZEQTY = req.body.iMSIZEQTY;
    var iLSIZEQTY = req.body.iLSIZEQTY;
    var cSUOMCD = req.body.cSUOMCD;
    var cSUOMNM = req.body.cSUOMNM;
    var cMUOMCD = req.body.cMUOMCD;
    var cMUOMNM = req.body.cMUOMNM;
    var cLUOMCD = req.body.cLUOMCD;
    var cLUOMNM = req.body.cLUOMNM;
    var iSUNITPRICE = req.body.iSUNITPRICE;
    var iMUNITPRICE = req.body.iMUNITPRICE;
    var iLUNITPRICE = req.body.iLUNITPRICE;
    var cCREABY = req.body.cCREABY;
    var sQty = 0;
    var mQty = 0;
    var lQty = 0;
    var sPrice = 0;
    var mPrice = 0;
    var lPrice = 0;
    var sTotal = 0;
    var mTotal = 0;
    var lTotal = 0;

    if (parseInt(iSSIZEQTY) > 0) {
      sQty = parseInt(iSSIZEQTY);
      sPrice = parseFloat(iSUNITPRICE);
      sTotal = sQty * sPrice;
    }

    if (parseInt(iMSIZEQTY) > 0) {
      mQty = parseInt(iMSIZEQTY);
      mPrice = parseFloat(iMUNITPRICE);
      mTotal = mQty * mPrice;
    }

    if (parseInt(iLSIZEQTY) > 0) {
      lQty = parseInt(iLSIZEQTY);
      lPrice = parseFloat(iLUNITPRICE);
      lTotal = lQty * lPrice;
    }

    const checkResult = await client.query(
      `SELECT *
        FROM "TBT_RETURN_DT"  
        WHERE "cRETCD" = $1 AND "iSEQ" = $2`,
      [cRETCD, iSEQ]
    );

    if (checkResult.rows.length > 0) {
      const result = await client.query(
        `UPDATE "TBT_RETURN_DT" 
        SET "cPRODCD" = $3,"cPRODNM" = $4,
        "cBRNDCD" = $5,"cBRNDNM" = $6,
        "iSSIZEQTY" = $7,"iMSIZEQTY" = $8,
        "iLSIZEQTY" = $9,"cSUOMCD" = $10,
        "cSUOMNM" = $11,"cMUOMCD" = $12,
        "cMUOMNM" = $13,"cLUOMCD" = $14,
        "cLUOMNM" = $15,"iSUNITPRICE" = $16,
        "iMUNITPRICE" = $17,"iLUNITPRICE" = $18,
        "iTOTAL" = $19,"cUPDABY" = $20,
        "dUPDADT" = $21 
        WHERE "cRETCD" = $1 AND "iSEQ" = $2`,
        [
          cRETCD,
          iSEQ,
          cPRODCD,
          cPRODNM,
          cBRNDCD,
          cBRNDNM,
          iSSIZEQTY,
          iMSIZEQTY,
          iLSIZEQTY,
          cSUOMCD,
          cSUOMNM,
          cMUOMCD,
          cMUOMNM,
          cLUOMCD,
          cLUOMNM,
          iSUNITPRICE,
          iMUNITPRICE,
          iLUNITPRICE,
          sTotal + mTotal + lTotal,
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
        `INSERT INTO "TBT_RETURN_DT" 
        ("cGUID","cRETCD","iSEQ","cPRODCD","cPRODNM","cBRNDCD","cBRNDNM","iSSIZEQTY","iMSIZEQTY","iLSIZEQTY",
        "cSUOMCD","cSUOMNM","cMUOMCD","cMUOMNM","cLUOMCD","cLUOMNM","iSUNITPRICE","iMUNITPRICE","iLUNITPRICE",
        "iTOTAL","cCREABY","cUPDABY","dCREADT","dUPDADT")
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)`,
        [
          uuid,
          cRETCD,
          iSEQ,
          cPRODCD,
          cPRODNM,
          cBRNDCD,
          cBRNDNM,
          iSSIZEQTY,
          iMSIZEQTY,
          iLSIZEQTY,
          cSUOMCD,
          cSUOMNM,
          cMUOMCD,
          cMUOMNM,
          cLUOMCD,
          cLUOMNM,
          iSUNITPRICE,
          iMUNITPRICE,
          iLUNITPRICE,
          sTotal + mTotal + lTotal,
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

// +++++++++++++++++++ add TBR_BASKET_BALANCE +++++++++++++++++++
stockRouter.post("/addBasketBalanch", async (req, res) => {
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

    var cBRANCD = req.body.cBRANCD;
    var cBASKCD = req.body.cBASKCD;
    var cUOMCD = req.body.cUOMCD;
    var cWH = req.body.cWH;
    var iQTY = req.body.iQTY;
    var cBASKNM = req.body.cBASKNM;
    var cCREABY = req.body.cCREABY;

    const proResult = await client.query(
      `SELECT *
        FROM "TBR_BASKET_BALANCE" 
        WHERE "cBRANCD" = $1 AND "cBASKCD" = $2 AND "cUOMCD" = $3 AND "cWH" = $4`,
      [cBRANCD, cBASKCD, cUOMCD, cWH]
    );

    var returnList = proResult.rows;
    if (returnList.length > 0) {
      await client.end();

      const message = {
        success: false,
        message: "Data is repeat",
        result: null,
      };
      res.json(message);
    } else {
      const result = await client.query(
        `INSERT INTO "TBR_BASKET_BALANCE"
        ("cGUID","cBRANCD","cWH","cBASKCD","cBASKNM",
        "cUOMCD","iQTY","cCREABY","cUPDABY","dCREADT","dUPDADT")
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          uuid,
          cBRANCD,
          cWH,
          cBASKCD,
          cBASKNM,
          cUOMCD,
          iQTY,
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

// +++++++++++++++++++ add TBR_BASKET_STOCKCARD +++++++++++++++++++
stockRouter.post("/addBasketStockCard", async (req, res) => {
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

    var cBRANCD = req.body.cBRANCD;
    var cBASKCD = req.body.cBASKCD;
    var cBASKNM = req.body.cBASKNM;
    var cUOMCD = req.body.cUOMCD;
    var cWH = req.body.cWH;
    var cREFDOC = req.body.cREFDOC;
    var iRECEIVE_QTY = req.body.iRECEIVE_QTY;
    var iISSUE_QTY = req.body.iISSUE_QTY;
    var cREMARK = req.body.cREMARK;
    var cCREABY = req.body.cCREABY;

    const proResult = await client.query(
      `SELECT *
        FROM "TBR_BASKET_BALANCE" 
        WHERE "cBRANCD" = $1 AND "cBASKCD" = $2 AND "cUOMCD" = $3 AND "cWH" = $4`,
      [cBRANCD, cBASKCD, cUOMCD, cWH]
    );
    // res.json(proResult.rows);

    // var returnList = proResult.rows;

    var stock = proResult.rows[0];
    var qty = 0;
    var qtyBegin = 0;

    // console.log(proResult.rows.length);
    // res.json(proResult.rows);
    if (iRECEIVE_QTY === "") {
      iRECEIVE_QTY = "0";
    }
    if (iISSUE_QTY === "") {
      iISSUE_QTY = "0";
    }

    if (proResult.rows.length === 0) {
      qtyBegin = 0;
      qty = parseInt(iRECEIVE_QTY) - parseInt(iISSUE_QTY);
    } else {
      qtyBegin = parseInt(stock.iQTY);

      qty =
        parseInt(stock.iQTY) + parseInt(iRECEIVE_QTY) - parseInt(iISSUE_QTY);
    }

    await client.query(
      `INSERT INTO "TBR_BASKET_STOCKCARD"
              ("cGUID","cBRANCD","cWH","cBASKCD","cBASKNM",
              "cUOMCD","dINVENT_DT","cREFDOC","iBEGIN_QTY",
              "iRECEIVE_QTY","iISSUE_QTY","iEND_QTY","cREMARK",
              "cCREABY","cUPDABY","dCREADT","dUPDADT")
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
      [
        uuid,
        cBRANCD,
        cWH,
        cBASKCD,
        cBASKNM,
        cUOMCD,
        dateTime,
        cREFDOC,
        qtyBegin,
        iRECEIVE_QTY,
        iISSUE_QTY,
        qty,
        cREMARK,
        cCREABY,
        cCREABY,
        dateTime,
        dateTime,
      ]
    );

    if (proResult.rows.length > 0) {
      await client.query(
        `UPDATE "TBR_BASKET_BALANCE" 
          SET "iQTY" = $5 ,"cUPDABY"= $6 ,"dUPDADT"= $7
          WHERE "cBRANCD" = $1 AND "cBASKCD" = $2 AND "cUOMCD" = $3 AND "cWH" = $4`,
        [cBRANCD, cBASKCD, cUOMCD, cWH, qty, cCREABY, dateTime]
      );
    } else {
      await client.query(
        `INSERT INTO "TBR_BASKET_BALANCE"
        ("cGUID","cBRANCD","cWH","cBASKCD","cBASKNM",
        "cUOMCD","iQTY","cCREABY","cUPDABY","dCREADT","dUPDADT")
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          uuid,
          cBRANCD,
          cWH,
          cBASKCD,
          cBASKNM,
          cUOMCD,
          qty,
          cCREABY,
          cCREABY,
          dateTime,
          dateTime,
        ]
      );
    }

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

// +++++++++++++++++++ get Stock Balance +++++++++++++++++++
stockRouter.post("/getStockBalance", async (req, res) => {
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

    var cBRANCD = req.body.cBRANCD;
    var cWH = req.body.cWH;

    const proResult = await client.query(
      `SELECT * FROM "TBR_INVENTORY_BALANCE" WHERE "cBRANCD" = $1 AND  "cWH" = $2`,
      [cBRANCD, cWH]
    );

    await client.end();

    const message = {
      success: true,
      message: "success",
      result: null,
    };
    res.json(proResult.rows);
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
