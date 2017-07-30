const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");

// make sample todo list
const todos = [
  "wash the car",
  "do the laundry",
  "make the bed",
  "mow the lawn",
  "drive the kids to school",
  "play with the niece and nephew",
  "feed the cat",
  "water the garden"
];

const app = express();

app.use(express.static("public"));

// this will attach the bodyParser to the pipeline and attach
// the data to the req as JSON
app.use(bodyParser.json());
// this will take the url encoded data and
//only accept the primitive types of data (strings, numbers, NOT arrays, NOT objects)
app.use(bodyParser.urlencoded({ extended: false }));
// This is registered after the bodyParser so that
// there is something to validate
app.use(expressValidator());

// these three lines are necessary for mustache-express to work
app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

// define a home page
app.get("/", function(request, response) {
  response.render("main", { todos: todos });
});

app.listen(3000, function() {
  console.log("Successfully accessed todo-list-express on port 3000!");
});
