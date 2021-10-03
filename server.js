if (process.env.NODE_ENV !== 'production'){
  require("dotenv").config()
}



const express = require("express"),
  app = express(),
  bodyParser = require("body-parser");
port = process.env.PORT || 80;
const bcrypt = require("bcrypt");
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
 

const users = []

const mysql = require("mysql");
// connection configurations
const mc = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "harderhats",
});
app.set("view engine", "ejs");
//connect to database
mc.connect();

app.listen(port);

console.log("API server started on: " + port);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie:{_expires : 900000}
}))
app.use(passport.initialize())
app.use(passport.session())

var routes = require("./app/routes/approutes"); //importing route
routes(app); //register the route
