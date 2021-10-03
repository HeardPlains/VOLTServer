"user strict";
var sql = require("./db");

//Task object constructor
var Task = function (task) {
  this.task = task.task;
  this.status = task.status;
  this.created_at = new Date();
};

Task.createForeman = function (
  id,
  foreman_id,
  first_name,
  last_name,
  username,
  password,
  current_location,
  result
) {
  //id,Number(emp_id),first_name,last_name,time_in,location_code,task_code,foreman_id,
  sql.query(
    "INSERT INTO foreman_data (foreman_id, first_name, last_name,username,password, current_location)" +
      "values (" +
      foreman_id +
      ",'" +
      first_name +
      "','" +
      last_name +
      "','" +
      username +
      "','" +
      password +
      "','" +
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

Task.getAllForman = function (result) {
  sql.query("Select * from foreman_data", function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

Task.removeForeman = function (first_name, last_name, result) {
  sql.query(
    "DELETE FROM foreman_data where first_name = '" +
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

Task.updateForeman = function (first_name, last_name, update, result) {
  sql.query(
    "UPDATE foreman_data SET current_location = '" +
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

module.exports = Task;
