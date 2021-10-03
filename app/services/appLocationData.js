"user strict";
var sql = require("./db");

var Task = function (task) {
  this.task = task.task;
  this.status = task.status;
  this.created_at = new Date();
};

Task.createLocation = function (
  id,
  location_id,
  result
) {
  sql.query(
    "INSERT INTO location_data (display_name) values ('" + location_id + "')",
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

Task.removeLocation = function (display_name, result) {
  sql.query(
    "DELETE FROM location_data where display_name = '" + display_name + "'",
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

Task.getAllLocationData = function (result) {
  sql.query("Select * from location_data", function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

module.exports = Task;
