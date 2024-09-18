const bodyParser = require("body-parser");
const cons = require("consolidate");
const dust = require("dustjs-helpers");
const pg = require("pg");
const path = require("path");
const express = require("express");

var app = express();

// Assign Dust Engine To .dust Files
app.engine("dust", cons.dust);

// Set Default Ext .dust
app.set("view engine", "dust");
app.set("views", __dirname + "/views");

// Set Public Folder
app.use(express.static(path.join(__dirname, "public")));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
    // connect to postgres
    const client = new pg.Client({
        host: "localhost",
        user: "notebook1",
        port: 5432,
        password: "123456",
        database: "notebook1db",
    });
    client.connect();
    client.query("SELECT * FROM notes", function (err, result) {
        if (err) {
            return console.error("error running query", err);
        }
        console.log("Rendering index");
        res.render("index", { notes: result.rows });

        client.end();
    });
});

app.post("/add", function (req, res) {
    // connect to postgres
    const client = new pg.Client({
        host: "localhost",
        user: "notebook1",
        port: 5432,
        password: "123456",
        database: "notebook1db",
    });
    client.connect();
    client.query(
        "INSERT INTO notes(title, content, date) VALUES($1, $2, $3)",
        [
            req.body.formTitle,
            req.body.formContent,
            new Date().toString().split(" ").splice(1, 4).join(" "),
        ],
        function (err, result) {
            if (err) {
                return console.error("error running query", err);
            }
            console.log("Added a new note to db");
            client.end();
            res.redirect("/");
        }
    );
});

app.delete("/delete/:id", function (req, res) {
    // connect to postgres
    const client = new pg.Client({
        host: "localhost",
        user: "notebook1",
        port: 5432,
        password: "123456",
        database: "notebook1db",
    });
    client.connect();
    client.query(
        "DELETE FROM notes WHERE id = $1",
        [
            req.params.id
        ],
        function (err, result) {
            if (err) {
                return console.error("error running query", err);
            }
            console.log("Deleted a note from db");
            client.end();
            res.send(200);
        }
    );
});

// Server
app.listen(3000, function () {
    console.log("Server Started On Port 3000");
});
