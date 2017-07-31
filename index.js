const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const jsonfile = require("jsonfile");

const file = "./todoList.json";

const todoList = jsonfile.readFileSync(file);

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
  const uncompleted = todoList.filter(todo => !todo.completed);
  const completed = todoList.filter(todo => todo.completed);

  response.render("main", { completed: completed, uncompleted: uncompleted });
});

app.post("/addTodo", function(request, response) {
  // Now write the code to add a new todo to the list
  const descriptionForNewTodo = request.body.description;
  todoList.push({ id: todoList.length + 1, completed: false, description: descriptionForNewTodo });
  response.redirect("/");
});

app.post("/markComplete", function(request, response) {
  // convert the form's ID from a string to a number, so we can compare it later.
  const id = parseInt(request.body.id);

  // Find the todo in the todoList that has the same ID as the requested id
  const foundTodo = todoList.find(todo => todo.id === id);

  // If we found a todo
  if (foundTodo) {
    // Set that todo completed = true
    foundTodo.completed = true;
  }

  // Send the user's browser back to the home page
  response.redirect("/");
});

app.listen(3000, function() {
  console.log("Successfully accessed todo-list-express on port 3000!");
});
