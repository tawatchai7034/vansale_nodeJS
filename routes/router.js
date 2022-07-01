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

router.post("/getBooks", async (req, res) => {
  try {
    const client = new Client();

    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    const result = await client.query(`SELECT * FROM "books"`);

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

router.post("/insertBook", async (req, res) => {
  try {
    const client = new Client();
    const uuid = crypto.randomUUID();
    const title = req.body.title;
    const author = req.body.primary_author;

    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    await client.query(`INSERT INTO books(id, title, primary_author) VALUES ($1, $2, $3)`,[uuid,title,author]);

    await client.end();
    res.send('insert completed');
    // console.log(crypto.randomUUID());
  } catch (err) {
    const result = {
      success: false,
      message: err,
    };
    res.json(result);
  }
});

router.post("/updateBook", async (req, res) => {
  try {
    const client = new Client();
    const uuid = req.body.id;
    const title = req.body.title;
    const author = req.body.primary_author;

    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    await client.query(`UPDATE books SET title = $1 , primary_author = $2 WHERE id  IN ( $3 )`,[title,author,uuid]);

    await client.end();
    res.send(`update ${uuid} completed`);
    // console.log(crypto.randomUUID());
  } catch (err) {
    const result = {
      success: false,
      message: err,
    };
    res.json(result);
  }
});

router.post("/deleteBook", async (req, res) => {
  try {
    const client = new Client();
    const uuid = req.body.id;


    await client.connect(function (err) {
      if (!err) {
        console.log("Connected to Vansale successfully");
      } else {
        console.log(err.message);
      }
    });

    await client.query(`DELETE FROM books WHERE id = $1`,[uuid]);

    await client.end();
    res.send(`delete ${uuid} completed`);
    // console.log(crypto.randomUUID());
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

router.post("/getCustomer/Header", async (req, res) => {
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

router.post("/getCustomer/Detail", async (req, res) => {
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
      `SELECT * FROM "TBM_CUSTOMER_DT" 
          WHERE "TBM_CUSTOMER_DT"."cCUSTCD" = $1`,
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
