// project 4 server - saves accounts and form answers into json files

const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

const LIST_FILE = __dirname + "/data/accounts.json";
const ACCOUNT_FOLDER = __dirname + "/data/accounts/";

app.use(express.json());
app.use(express.static(__dirname + "/public"));

// make sure the data folder and the account list exist
if (!fs.existsSync(ACCOUNT_FOLDER)) {
   fs.mkdirSync(ACCOUNT_FOLDER, { recursive: true });
}
if (!fs.existsSync(LIST_FILE)) {
   fs.writeFileSync(LIST_FILE, "[]");
}

function readList() {
   return JSON.parse(fs.readFileSync(LIST_FILE, "utf8"));
}

function readAccount(id) {
   return JSON.parse(fs.readFileSync(ACCOUNT_FOLDER + id + ".json", "utf8"));
}

function saveAccount(account) {
   fs.writeFileSync(ACCOUNT_FOLDER + account.id + ".json", JSON.stringify(account, null, 2));
}

// make a new account
app.post("/new-account", function(req, res) {
   let list = readList();

   // accounts are never deleted, so this id is always new
   let id = list.length + 1;

   // make the account file
   saveAccount({ id: id, username: req.body.username, password: req.body.password, form: null });

   // add to the account list without losing the old entries
   list.push({ id: id, username: req.body.username, password: req.body.password, file: id + ".json" });
   fs.writeFileSync(LIST_FILE, JSON.stringify(list, null, 2));

   res.json({ ok: true });
});

// check the username and password against the account list
app.post("/login", function(req, res) {
   let list = readList();

   for (let i = 0; i < list.length; i++) {
      if (list[i].username === req.body.username && list[i].password === req.body.password) {
         res.json({ ok: true, id: list[i].id });
         return;
      }
   }
   res.json({ ok: false });
});

// send every account id (for the records page drop-down)
app.get("/ids", function(req, res) {
   let list = readList();
   let ids = [];
   for (let i = 0; i < list.length; i++) {
      ids.push(list[i].id);
   }
   res.json(ids);
});

// send back one account's saved form answers
app.get("/form-data", function(req, res) {
   let account = readAccount(Number(req.query.id));
   res.json(account.form);
});

// save the form answers into the logged in account's file
app.post("/form-data", function(req, res) {
   let account = readAccount(Number(req.body.id));
   account.form = req.body.form;
   saveAccount(account);
   res.json({ ok: true });
});

app.listen(PORT, function() {
   console.log("Server running on port " + PORT);
});
