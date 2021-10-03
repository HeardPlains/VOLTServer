"user strict";
var sql = require("./db");

var Task = function (task) {
  this.task = task.task;
  this.status = task.status;
  this.created_at = new Date();
};

Task.createTask = function (
  id,
  display_name,
  result
) {
  sql.query(
    "INSERT INTO task_data (display_name) values ('" + display_name + "')",
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log(res);
        result(null, res);
      }
    }
  );
};

Task.removeTask = function (display_name, result) {
  sql.query(
    "DELETE FROM task_data where display_name = '" + display_name + "'",
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

Task.getAllTaskData = function (result) {
  sql.query("Select * from task_data", function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

module.exports = Task;
