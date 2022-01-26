"user strict";
var sql = require("./db");

//Task object constructor
var Task = function (task) {
  this.task = task.task;
  this.status = task.status;
  this.created_at = new Date();
};

Task.createTimeEntry = function (
  id,
  emp_id,
  first_name,
  last_name,
  time_in,
  location_code,
  task_code,
  foreman_id,
  date,
  result
) {
  sql.query(
    "INSERT INTO active_time_sheet (emp_id, first_name, last_name,time_in,location_code,task_code,foreman_id,date)" +
      "values (" +
      emp_id +
      ",?,'" +
      last_name +
      "','" +
      time_in +
      "','" +
      location_code +
      "','" +
      task_code +
      "'," +
      foreman_id +
      ",'" +
      date +
      "')",
    first_name,
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

Task.getTimeByEmpId = function (empID, result) {
  sql.query(
    "Select * from active_time_sheet where emp_id = '" + empID + "' ",
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
Task.getTimeSheetFromID = function (id, result) {
  sql.query(
    "Select * from active_time_sheet where id = ? ",
    id,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, res[0]);
      }
    }
  );
};
Task.getTimeInFromID = function (id, result) {
  sql.query(
    "Select time_in from active_time_sheet where id = ? ",
    id,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, res[0]);
      }
    }
  );
};

Task.getSheetFromFullName = function (first_name, last_name, result) {
  sql.query(
    "select * from active_time_sheet where first_name = '" +
      first_name +
      "' && last_name = '" +
      last_name +
      "'",
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, res[0]);
      }
    }
  );
};
Task.getAllActive = function (result) {
  sql.query("Select * from active_time_sheet", function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    } else {
      console.log("time sheet: ", res);

      result(null, res);
    }
  });
};
Task.updateById = function (id, task, result) {
  sql.query(
    "UPDATE active_time_sheet SET task = ? WHERE id = ?",
    [task.task, id],
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};
Task.updateFullById = function (id, first_name,last_name,time_in,location_code,task_code,date, result) {
  sql.query(
    "UPDATE active_time_sheet SET " +
    "first_name = '"+first_name+"', "+
    "last_name = '"+last_name+"', "+
    "time_in = '"+time_in+"', "+
    "location_code = '"+location_code+"', "+
    "task_code = '"+task_code+"', "+
    "date = '"+date+"' "+
    "WHERE id = ?",
    id,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};
Task.remove = function (id, result) {
  sql.query(
    "DELETE FROM active_time_sheet WHERE id = '" + id + "'",
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = Task;
