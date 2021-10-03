"user strict";
var sql = require("./db");

var Task = function (task) {
  this.task = task.task;
  this.status = task.status;
  this.created_at = new Date();
};

Task.createEmployee = function (
  id,
  emp_id,
  first_name,
  last_name,
  location_code,
  task_code,
  current_location,
  result
) {
  sql.query(
    "INSERT INTO employee_data (emp_id,first_name,last_name,previous_locations,previous_tasks,current_location)" +
      "values (" +
      emp_id +
      ",'" +
      first_name +
      "','" +
      last_name +
      "','','','" +
      current_location +
      "')",
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

Task.getGetEmployeeByFirstLast = function (first_name, last_name, result) {
  sql.query(
    "Select * from employee_data where first_name = '" +
      first_name +
      "' AND last_name = '" +
      last_name +
      "'",
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
Task.getAllEmployeeData = function (result) {
  sql.query("Select * from employee_data", function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

Task.getEmployeeFromEmpId = function (empID, result) {
  sql.query(
    "Select * from employee_data where emp_id = '" + empID + "' ",
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

Task.removeEmployee = function (first_name, last_name, result) {
  sql.query(
    "DELETE FROM employee_data where first_name = '" +
      first_name +
      "' and last_name = '" +
      last_name +
      "'",
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

Task.updateEmployee = function (first_name, last_name, update, result) {
  sql.query(
    "UPDATE employee_data SET current_location = '" +
      update +
      "' where first_name = '" +
      first_name +
      "' and last_name = '" +
      last_name +
      "'",
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

//Select * from active_time_sheet where first_name = "ty" AND last_name = "ordway";

module.exports = Task;
