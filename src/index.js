const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Dobrý den.");
});

app.get("/crypto", (req, res) => {
  let cryptos = new Set();
  let change = new Set();
  request(
    "https://apiv2.bitcoinaverage.com/symbols/indices/ticker",
    (error, repsonse, body) => {
      let data = JSON.parse(body);
      data.global.symbols.forEach(crypto => {
        cryptos.add(crypto.substring(0, 3));
        change.add(crypto.substring(3, 6));
      });
      let formular = "<form action='/crypto' method='post'>";
      formular += "<input type='text' name='amount' />";
      formular += "<select name= 'crypto'>";

      cryptos.forEach(crypto => {
        formular += "<option value='" + crypto + "'>" + crypto + "</option>";
      });
      formular += "</select>";
      formular += "<select name= 'flat'>";
      change.forEach(change => {
        formular += "<option value='" + change + "'>" + change + "</option>";
      });
      formular += "</select>";
      formular += "<button type='submit' name='submit'>Fesh</button>";
      res.send(formular);
    }
  );
});

app.post("/crypto", (req, res) => {
  let crypto = req.body.crypto;
  let flat = req.body.flat;
  let amount = req.body.amount;

  var options = {
    url: "https://apiv2.bitcoinaverage.com/convert/global",
    method: "GET",
    qs: {
      from: crypto,
      to: flat,
      amount: amount
    }
  };

  request(options, (error, repsonse, body) => {
    let data = JSON.parse(body);
    res.send(
      "<h1> Cena za " +
        amount +
        " " +
        crypto +
        " je " +
        data.price +
        " " +
        flat +
        "</h1>"
    );
  });
});

app.get("/calc", (req, res) => {
  let formular = "<form action='/calc' method='post'>";
  formular += "<input type='text' name='num1' placeholder='První číslo'/>";
  formular += "<input type='text' name='num2' placeholder='Druhé číslo'/>";
  formular += "<button type='submit' name='submit'>Budiž</button>";
  formular += "</form>";
  res.send(formular);
});
app.post("/calc", (req, res) => {
  let num1 = Number(req.body.num1);
  let num2 = Number(req.body.num2);
  let result = num1 + num2;
  res.send("Součet je: " + result);
});

app.listen(8080, () => {
  console.log("Server běží na portu 8080");
});
