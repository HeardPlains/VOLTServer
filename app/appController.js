"use strict";
const bcrypt = require("bcrypt");
const passport = require("passport");
const { getTimeInFromID } = require("./services/appActiveTimeSheet");
var ActiveTimeSheet = require("./services/appActiveTimeSheet");
var FinalTimeSheet = require("./services/appFinalTimeSheet");
var EmployeeData = require("./services/appEmployeeData");
var LocationData = require("./services/appLocationData");
var ForemanData = require("./services/appForemanData");
var TaskData = require("./services/appTaskData");

const initializePassport = require("./passport-config");
const approutes = require("./routes/approutes");
initializePassport(
  passport,
  (username) => users.find((user) => user.username === username),
  (id) => users.find((user) => user.id === id)
);

const users = [];

async function createTempUser() {
  const temppass = await bcrypt.hash("CDETempPassword!", 10);

  users.push(
    {
      id: 123456,
      username: "Admin",
      password: temppass,
    },
    {
      id: 627858,
      username: "Rosy",
      password: temppass,
    }
  );
}

createTempUser();

function isAuthentiicated(req, res) {
  if (!req.isAuthenticated()) {
    res.redirect("/login");
  }
}

function isNotAuthentiicated(req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  }
}

exports.indexRedirect = function (req, res) {
  res.redirect("/dashboard");
};

exports.show_main_css = function (req, res) {
  res.sendFile(__dirname + "/views/style/main.css");
};

exports.show_testing_css = function (req, res) {
  res.sendFile(__dirname + "/views/style/testingground.css");
};
exports.show_reapeating_background = function (req, res) {
  res.sendFile(__dirname + "/views/images/dark-triangles.png");
};

exports.show_sort_js = function (req, res) {
  res.sendFile(__dirname + "/views/js/sort-table.js");
};

exports.show_login_page = function (req, res) {
  isNotAuthentiicated(req, res);
  res.render(__dirname + "/views/pages/login.ejs", {});
};
exports.postLogin = function (req, res, next) {
  console.log("hello");
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};

exports.show_register_page = function (req, res) {
  isNotAuthentiicated(req, res);
  res.render(__dirname + "/views/pages/register.ejs", {});
};

exports.postRegister = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    var time = Date.now().toString();
    users.push({
      id: time,
      username: req.body.username,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.redirect("/register");
  }
  console.log(users);
};

exports.show_task_page = function (req, res) {
  isAuthentiicated(req, res);

  TaskData.getAllTaskData(function (err, task) {
    if (err) res.send(err);
    var taskArray = Object.values(JSON.parse(JSON.stringify(task)));
    res.render(__dirname + "/views/pages/task.ejs", {
      tasks: taskArray,
    });
  });
};

exports.show_location_page = function (req, res) {
  isAuthentiicated(req, res);

  LocationData.getAllLocationData(function (err, location) {
    if (err) res.send(err);
    var locationArray = Object.values(JSON.parse(JSON.stringify(location)));
    res.render(__dirname + "/views/pages/location.ejs", {
      locations: locationArray,
    });
  });
};

exports.show_foreman_page = function (req, res) {
  isAuthentiicated(req, res);

  LocationData.getAllLocationData(function (err, location) {
    if (err) res.send(err);
    var locationArray = Object.values(JSON.parse(JSON.stringify(location)));
    ForemanData.getAllForman(function (err, foreman) {
      if (err) res.send(err);
      var foremanArray = Object.values(JSON.parse(JSON.stringify(foreman)));
      res.render(__dirname + "/views/pages/foreman.ejs", {
        locations: locationArray,
        foreman: foremanArray,
      });
    });
  });
};

exports.show_employee_page = function (req, res) {
  isAuthentiicated(req, res);

  LocationData.getAllLocationData(function (err, location) {
    if (err) res.send(err);
    var locationArray = Object.values(JSON.parse(JSON.stringify(location)));
    EmployeeData.getAllEmployeeData(function (err, employee) {
      if (err) res.send(err);
      var employeeArray = Object.values(JSON.parse(JSON.stringify(employee)));
      res.render(__dirname + "/views/pages/employees.ejs", {
        locations: locationArray,
        employees: employeeArray,
      });
    });
  });
};

exports.show_dash_page = function (req, res) {
  isAuthentiicated(req, res);

  var locationArray, taskArray;
  LocationData.getAllLocationData(function (err, res) {
    locationArray = Object.values(JSON.parse(JSON.stringify(res)));
  });
  TaskData.getAllTaskData(function (err, res) {
    taskArray = Object.values(JSON.parse(JSON.stringify(res)));
  });
  ActiveTimeSheet.getAllActive(function (err, active) {
    console.log("controller");
    if (err) res.send(err);
    var activeArray = Object.values(JSON.parse(JSON.stringify(active)));
    FinalTimeSheet.getAllActive(function (err, final) {
      console.log("controller");
      if (err) res.send(err);
      var finalArray = Object.values(JSON.parse(JSON.stringify(final)));
      res.render(__dirname + "/views/pages/dashboard.ejs", {
        user: req.user,
        sheet: activeArray,
        finalSheet: finalArray,
        locations: locationArray,
        tasks: taskArray,
      });
    });
  });
};

exports.show_dash_page_test = function (req, res) {
  var locationArray, taskArray;
  LocationData.getAllLocationData(function (err, res) {
    locationArray = Object.values(JSON.parse(JSON.stringify(res)));
  });
  TaskData.getAllTaskData(function (err, res) {
    taskArray = Object.values(JSON.parse(JSON.stringify(res)));
  });
  ActiveTimeSheet.getAllActive(function (err, active) {
    console.log("controller");
    if (err) res.send(err);
    var activeArray = Object.values(JSON.parse(JSON.stringify(active)));
    FinalTimeSheet.getAllActive(function (err, final) {
      console.log("controller");
      if (err) res.send(err);
      var finalArray = Object.values(JSON.parse(JSON.stringify(final)));
      res.render(__dirname + "/views/pages/dashboard_testing.ejs", {
        sheet: activeArray,
        finalSheet: finalArray,
        locations: locationArray,
        tasks: taskArray,
      });
    });
  });
};

exports.list_all_active_time_sheet = function (req, res) {
  ActiveTimeSheet.getAllActive(function (err, task) {
    console.log("controller");
    if (err) res.send(err);
    console.log("res", task);
    res.send(task);
  });
};

exports.list_all_final_time_sheet = function (req, res) {
  FinalTimeSheet.getAllActive(function (err, task) {
    console.log("controller");
    if (err) res.send(err);
    console.log("res", task);
    res.send(task);
  });
};

exports.get_time_sheet_from_id = function (req, res) {
  ActiveTimeSheet.getTimeSheetFromID(1, function (err, task) {
    console.log("controller");
    if (err) res.send(err);
    console.log("res", task);
    res.send(task);
  });
};

exports.get_time_in_from_id = function (req, res) {
  ActiveTimeSheet.getTimeInFromID(1, function (err, task) {
    console.log("controller");
    if (err) res.send(err);
    console.log("res", task);
    res.send(task);
  });
};

/* ---------------------------------------------------
    Employee Api Calls
----------------------------------------------------- */

exports.get_employee_from_location = function (req, res) {
  EmployeeData.getEmployeeFromLocation(req.body.location, function (err, task) {
    console.log("controller");
    if (err) res.send(err);
    console.log("res", task);
    res.send(task);
  });
};

exports.update_employee_status = function (req, res) {
  EmployeeData.updateEmployeeStatus(
    req.body.emp_id,
    req.body.status,
    function (err, task) {
      console.log("controller");
      if (err) res.send(err);
      console.log("res", task);
      res.redirect("back");
    }
  );
};

exports.remove_active_time_sheet = function (req, res) {
  ActiveTimeSheet.remove(req.body.id, function (err, task) {
    console.log("controller");
    if (err) res.send(err);
    console.log("res", task);
    res.redirect("back");
  });
};

exports.remove_final_time_sheet = function (req, res) {
  FinalTimeSheet.remove(req.body.id, function (err, task) {
    console.log("controller");
    if (err) res.send(err);
    console.log("res", task);
    res.redirect("back");
  });
};

function timeToDouble(time) {
  var hours = parseInt(time.split(":")[0]);
  var minutes = parseInt(time.split(":")[1]);
  return hours + minutes / 60;
}

exports.create_final_time_entry = function (req, res) {
  var d = new Date();
  var day = parseInt(d.getDate()) < 10 ? 0 + "" + d.getDate() : d.getDate();
  var month =
    parseInt(d.getMonth() + 1) < 10
      ? 0 + "" + (d.getMonth() + 1)
      : d.getMonth + 1;
  var year = d.getFullYear();
  var date = month + "/" + day + "/" + year;
  console.log(req.body.emp_id)
  ActiveTimeSheet.getTimeByEmpId(
    req.body.emp_id,
    function (err, task) {
      console.log("Signing Out");
      if (err) res.send(err);
      console.log("App Data", task)
      console.log("App Data", task[0].time_in)
      if (task != null) {
        console.log(task[0].time_in)
        var time_in = timeToDouble(task[0].time_in);
        var d = new Date();
        var time_out = timeToDouble(d.toTimeString().split(" ")[0]);
        var hour = time_out - time_in;
        if (hour < 0) {
          hour = 24 + hour;
        }
        FinalTimeSheet.createTimeEntry(
          1,
          task[0].emp_id,
          task[0].first_name,
          task[0].last_name,
          hour.toFixed(2),
          task[0].location_code,
          task[0].task_code,
          117,
          date,
          task[0].time_in,
          d.toTimeString().split(" ")[0],
          function (err, task) {
            if (err) res.send(err);
            
          }
        );
        ActiveTimeSheet.remove(task[0].id, function (err, removed) {
          console.log("controller");
          if (err) res.send(err);
          console.log("Remove User", removed);
        });
        EmployeeData.updateEmployeeStatus(
          task[0].emp_id,
          0,
          function (err, task) {
            if (err) res.send(err);
            res.redirect("back");
          }
        );
      }
    }
  );
};

exports.create_final_time_entry_with_time = function (req, res) {
  var d = new Date();
  var day = parseInt(d.getDate()) < 10 ? 0 + "" + d.getDate() : d.getDate();
  var month =
    parseInt(d.getMonth() + 1) < 10
      ? 0 + "" + (d.getMonth() + 1)
      : d.getMonth + 1;
  var year = d.getFullYear();
  var date = month + "/" + day + "/" + year;
  console.log(req.body.emp_id)
  ActiveTimeSheet.getTimeByEmpId(
    req.body.emp_id,
    function (err, task) {
      console.log("Signing Out");
      if (err) res.send(err);
      console.log("App Data", task)
      console.log("App Data", task[0].time_in)
      if (task != null) {
        console.log(task[0].time_in)
        var time_in = timeToDouble(task[0].time_in);
        var d = new Date();
        var time_out = timeToDouble(d.toTimeString().split(" ")[0]);
        var hour = time_out - time_in;
        if (hour < 0) {
          hour = 24 + hour;
        }
        FinalTimeSheet.createTimeEntry(
          1,
          task[0].emp_id,
          task[0].first_name,
          task[0].last_name,
          hour.toFixed(2),
          task[0].location_code,
          task[0].task_code,
          117,
          req.body.date,
          task[0].time_in,
          req.body.time_out,
          function (err, task) {
            if (err) res.send(err);
            
          }
        );
        ActiveTimeSheet.remove(task[0].id, function (err, removed) {
          console.log("controller");
          if (err) res.send(err);
          console.log("Remove User", removed);
        });
        EmployeeData.updateEmployeeStatus(
          task[0].emp_id,
          0,
          function (err, task) {
            if (err) res.send(err);
            res.redirect("back");
          }
        );
      }
    }
  );
};

exports.create_active_time_entry = function (req, res) {
  var d = new Date();
  var day = parseInt(d.getDate()) < 10 ? 0 + "" + d.getDate() : d.getDate();
  var month =
    parseInt(d.getMonth() + 1) < 10
      ? 0 + "" + (d.getMonth() + 1)
      : d.getMonth + 1;
  var year = d.getFullYear();
  var date = month + "/" + day + "/" + year;
  EmployeeData.getEmployeeByFirstLast(
    req.body.first_name,
    req.body.last_name,
    function (err, emp) {
      console.log("controller");
      if (err) res.send(err);
      if (emp[0] == null) {
        EmployeeData.createEmployee(
          1,
          req.body.emp_id,
          req.body.first_name,
          req.body.last_name,
          "",
          "",
          req.body.location_code,
          function (err, task) {
            console.log("Making new Employee");
            if (err) res.send(err);
            res.json(task);
          }
        );
        ActiveTimeSheet.createTimeEntry(
          1,
          req.body.emp_id,
          req.body.first_name,
          req.body.last_name,
          d.toTimeString().split(" ")[0],
          req.body.location_code,
          req.body.task_code,
          117,
          date,
          function (err, task) {
            console.log("Making new Creating Time Entry");
            if (err) res.send(err);
          }
        );
        EmployeeData.updateEmployeeStatus(
          req.body.emp_id,
          1,
          function (err, task) {
            if (err) res.send(err);
            res.json(task);
          }
        );
      } else {
        ActiveTimeSheet.getTimeByEmpId(emp[0].emp_id, function (err, isActive) {
          if (err) res.send(err);
          if (isActive[0] == null) {
            ActiveTimeSheet.createTimeEntry(
              1,
              emp[0].emp_id,
              req.body.first_name,
              req.body.last_name,
              d.toTimeString().split(" ")[0],
              emp[0].current_location,
              emp[0].current_task,
              117,
              date,
              function (err, task) {
                if (err) res.send(err);
              }
            );
            EmployeeData.updateEmployeeStatus(
              req.body.emp_id,
              1,
              function (err, task) {
                if (err) res.send(err);
              }
            );
          }
        });
      }
    }
  );
};

exports.create_manual_active_time_entry = function (req, res) {
  EmployeeData.getEmployeeByEmpId(req.body.emp_id, function (err, emp) {
    console.log("controller");
    if (err) res.send(err);
    if (emp[0] == null) {
      EmployeeData.createEmployee(
        1,
        req.body.emp_id,
        req.body.first_name,
        req.body.last_name,
        "",
        "",
        req.body.location_code,
        function (err, task) {
          console.log("Making new Employee");
          if (err) res.send(err);
          res.json(task);
        }
      );
      ActiveTimeSheet.createTimeEntry(
        1,
        req.body.emp_id,
        req.body.first_name,
        req.body.last_name,
        d.toTimeString().split(" ")[0],
        req.body.location_code,
        req.body.task_code,
        117,
        req.body.date,
        function (err, task) {
          console.log("Making new Creating Time Entry");
          if (err) res.send(err);
        }
      );
      EmployeeData.updateEmployeeStatus(
        req.body.emp_id,
        1,
        function (err, task) {
          if (err) res.send(err);
          res.json(task);
        }
      );
    } else {
      ActiveTimeSheet.getTimeByEmpId(emp[0].emp_id, function (err, isActive) {
        if (err) res.send(err);
        if (isActive[0] == null) {
          ActiveTimeSheet.createTimeEntry(
            1,
            emp[0].emp_id,
            req.body.first_name,
            req.body.last_name,
            d.toTimeString().split(" ")[0],
            emp[0].current_location,
            req.body.task_code,
            117,
            req.body.date,
            function (err, task) {
              if (err) res.send(err);
              res.json(task);
            }
          );
          EmployeeData.updateEmployeeStatus(
            emp[0].emp_id,
            1,
            function (err, task) {
              if (err) res.send(err);
              res.json(task);
            }
          );
        }
      });
    }
  });
};

exports.create_active_time_entry_with_time = function (req, res) {
  var d = new Date();
  var day = parseInt(d.getDate()) < 10 ? 0 + "" + d.getDate() : d.getDate();
  var month =
    parseInt(d.getMonth() + 1) < 10
      ? 0 + "" + (d.getMonth() + 1)
      : d.getMonth + 1;
  var year = d.getFullYear();
  var date = month + "/" + day + "/" + year;
  EmployeeData.getEmployeeFromEmpId(
    req.body.emp_id,
    function (err, emp) {
      console.log("controller");
      if (err) res.send(err);
        ActiveTimeSheet.getTimeByEmpId(emp[0].emp_id, function (err, isActive) {
          if (err) res.send(err);
          if (isActive[0] == null) {
            ActiveTimeSheet.createTimeEntry(
              1,
              emp[0].emp_id,
              emp[0].first_name,
              emp[0].last_name,
              req.body.time_in,
              emp[0].current_location,
              emp[0].current_task,
              117,
              req.body.date,
              function (err, task) {
                if (err) res.send(err);
                //res.json(task);
              }
            );
            EmployeeData.updateEmployeeStatus(
              req.body.emp_id,
              1,
              function (err, task) {
                if (err) res.send(err);
                res.json(task);
              }
            );
          }
        });
      }
    
  );
};

exports.updateActiveTimeSheet = function (req, res) {
  ActiveTimeSheet.updateFullById(
    req.body.id,
    req.body.first_name,
    req.body.last_name,
    req.body.time_in,
    req.body.location,
    req.body.task,
    req.body.date,
    function (err, task) {
      console.log("controller");
      if (err) res.send(err);
      console.log("res", task);
      res.redirect("back");
    }
  );
};

exports.updateFinalTimeSheet = function (req, res) {
  FinalTimeSheet.updateFullById(
    req.body.id,
    req.body.first_name,
    req.body.last_name,
    req.body.hours,
    req.body.location,
    req.body.task,
    req.body.date,
    function (err, task) {
      console.log("controller");
      if (err) res.send(err);
      console.log("res", task);
      res.redirect("back");
    }
  );
};

exports.create_active_from_emp_id = function (req, res) {
  var d = new Date();
  var day = parseInt(d.getDate()) < 10 ? 0 + "" + d.getDate() : d.getDate();
  var month =
    parseInt(d.getMonth() + 1) < 10
      ? 0 + "" + (d.getMonth() + 1)
      : d.getMonth + 1;
  var year = d.getFullYear();
  var date = month + "/" + day + "/" + year;
  EmployeeData.getEmployeeFromEmpId(req.body.emp_id, function (err, emp) {
    if (err) res.send(err);
    if (emp[0] == null) res.send(err);
    ActiveTimeSheet.getTimeByEmpId(req.body.emp_id, function (err, isActive) {
      if (err) res.send(err);
      if (isActive[0] == null) {
        ActiveTimeSheet.createTimeEntry(
          1,
          req.body.emp_id,
          emp.body.first_name,
          emp.body.last_name,
          d.toTimeString().split(" ")[0],
          emp.body.location_code,
          emp.body.task_code,
          117,
          date,
          function (err, task) {
            if (err) res.send(err);
            res.json(task);
          }
        );
      }
    });
  });
};

exports.create_employee = function (req, res) {
  var d = new Date();
  var returning = false;
  EmployeeData.getEmployeeByFirstLast(
    req.body.first_name,
    req.body.last_name,
    function (err, task) {
      console.log("controller");
      if (err) res.send(err);
      console.log("res", task);
      if (task.emp_id == null || task.emp_id == "") {
        EmployeeData.createEmployee(
          1,
          Math.floor(Math.random() * (9999999 - 1000000)) + 1000000,
          req.body.first_name,
          req.body.last_name,
          "",
          "",
          req.body.location_code,
          function (err, task) {
            if (err) res.send(err);
            res.redirect("back");
          }
        );
      }
    }
  );
};

exports.listAllEmployeeData = function (req, res) {
  EmployeeData.getAllEmployeeData(function (err, task) {
    console.log("controller");
    if (err) res.send(err);
    console.log("res", task);
    res.send(task);
  });
};

exports.getEmployeeByFirstLast = function (req, res) {
  EmployeeData.getEmployeeByFirstLast(
    req.body.first_name,
    req.body.last_name,
    function (err, task) {
      console.log("controller");
      if (err) res.send(err);
      console.log("res", task);
      res.send(task);
    }
  );
};

exports.getEmployeeFromEmpId = function (req, res) {
  EmployeeData.getEmployeeFromEmpId(id, function (err, task) {
    console.log("controller");
    if (err) res.send(err);
    console.log("res", task);
    res.send(task);
  });
};

exports.removeEmployee = function (req, res) {
  var name = req.body.employee.toString();
  var names = name.split(" ");
  console.log("Names: " + req.body.employee.toString());
  EmployeeData.removeEmployee(names[0], names[1], function (err, task) {
    console.log("controller");
    if (err) res.send(err);
    console.log("res", task);
    res.redirect("back");
  });
};

exports.updateEmployee = function (req, res) {
  var name = req.body.employee.toString();
  var names = name.split(" ");
  console.log("Names: " + req.body.employee.toString());
  EmployeeData.updateEmployee(
    names[0],
    names[1],
    req.body.location_code,
    function (err, task) {
      console.log("controller");
      if (err) res.send(err);
      console.log("res", task);
      res.redirect("back");
    }
  );
};

//Foreman Exports//////////////////
exports.create_foreman = function (req, res) {
  ForemanData.createForeman(
    1,
    req.body.foreman_id == 0
      ? req.body.foreman_id
      : Math.floor(Math.random() * (99999999 - 10000000)) + 10000000,
    req.body.first_name,
    req.body.last_name,
    "",
    "",
    req.body.location_code,
    function (err, task) {
      console.log("Creating Foreman");
      if (err) res.send(err);
      res.redirect("back");
    }
  );
};

exports.list_all_foreman_data = function (req, res) {
  ForemanData.getAllForman(function (err, task) {
    console.log("controller");
    if (err) res.send(err);
    console.log("res", task);
    res.send(task);
  });
};

exports.removeForeman = function (req, res) {
  var name = req.body.foreman.toString();
  var names = name.split(" ");
  console.log("Names: " + req.body.foreman.toString());
  ForemanData.removeForeman(names[0], names[1], function (err, task) {
    console.log("controller");
    if (err) res.send(err);
    console.log("res", task);
    res.redirect("back");
  });
};

exports.updateForeman = function (req, res) {
  var name = req.body.foreman.toString();
  var names = name.split(" ");
  console.log("Names: " + req.body.foreman.toString());
  ForemanData.updateForeman(
    names[0],
    names[1],
    req.body.location_code,
    function (err, task) {
      console.log("controller");
      if (err) res.send(err);
      console.log("res", task);
      res.redirect("back");
    }
  );
};
/////////////////////////////////////////

//Location Exports//////////////////
exports.create_location = function (req, res) {
  LocationData.createLocation(0, req.body.display_name, function (err, task) {
    console.log("Creating Location");
    if (err) res.send(err);
    res.redirect("back");
  });
};

exports.listAllLocationData = function (req, res) {
  LocationData.getAllLocationData(function (err, task) {
    console.log("controller");
    if (err) res.send(err);
    console.log("res", task);
    res.send(task);
  });
};

exports.removeLocation = function (req, res) {
  LocationData.removeLocation(req.body.location, function (err, task) {
    console.log("controller");
    if (err) res.send(err);
    console.log("res", task);
    res.redirect("back");
  });
};
/////////////////////////////////////////

//Task Exports//////////////////
exports.create_task = function (req, res) {
  TaskData.createTask(0, req.body.display_name, function (err, task) {
    console.log("Creating Task");
    if (err) res.send(err);
    res.redirect("back");
  });
};

exports.listAllTaskData = function (req, res) {
  TaskData.getAllTaskData(function (err, task) {
    console.log("controller");
    if (err) res.send(err);
    console.log("res", task);
    res.send(task);
  });
};

exports.removeTask = function (req, res) {
  TaskData.removeTask(req.body.task, function (err, task) {
    console.log("controller");
    if (err) res.send(err);
    console.log("res", task);
    res.redirect("back");
  });
};
/////////////////////////////////////////
