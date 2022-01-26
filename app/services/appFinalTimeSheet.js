'user strict';
var sql = require('./db');

var Task = function (task) {
    this.task = task.task;
    this.status = task.status;
    this.created_at = new Date();
};


Task.createTimeEntry = function (id,emp_id,first_name,last_name,hours,location_code,task_code,foreman_id,date, time_in, time_out, result) {
        sql.query("INSERT INTO final_time_sheet (emp_id, first_name, last_name,hours,location_code,task_code,foreman_id,date,time_in,time_out)" + 
        "values ("+emp_id+",?,'"+last_name+"','"+hours+"','"+location_code+"','"+task_code+"',"+foreman_id+",'"+date+"','"+time_in+"','"+time_out+"')", first_name,  function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            console.log(res);
            result(null, res);
        }
    });
};

Task.getAllActive = function (result) {
    sql.query("Select * from final_time_sheet", function (err, res) {

        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            console.log('time sheet: ', res);

            result(null, res);
        }
    });
};


Task.updateFullById = function (id, first_name,last_name,hours,location_code,task_code,date, result) {
  sql.query(
    "UPDATE final_time_sheet SET " +
    "first_name = '"+first_name+"', "+
    "last_name = '"+last_name+"', "+
    "hours = '"+hours+"', "+
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
      "DELETE FROM final_time_sheet WHERE id = '" + id + "'",
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



