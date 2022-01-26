"use strict";
const passport = require("passport");
const path = require("path");



module.exports = function (app) {
  var todoList = require("../appController");
  app.set("view engine", "ejs");

  //Webpages//////////////////////////////////////////////////
  app.route("/").get(todoList.indexRedirect)
  app.route("/login").get(todoList.show_login_page).post(todoList.postLogin);
  app.route("/register").get(todoList.show_register_page).post(todoList.postRegister);
  app.route("/dashboard").get(todoList.show_dash_page);
  app.route("/employees").get(todoList.show_employee_page);
  app.route("/foreman").get(todoList.show_foreman_page);
  app.route("/locations").get(todoList.show_location_page);
  app.route("/tasks").get(todoList.show_task_page);
  app.route("/testingground").get(todoList.show_dash_page_test);
  ///////////////////////////////////////////////////////////

  //API Time Sheet Calls///////////////////////////////////
  app
    .route("/api/active")
    .get(todoList.list_all_active_time_sheet)
    .post(todoList.create_active_time_entry);
  app
    .route("/api/active/time")
    .post(todoList.create_active_time_entry_with_time)
  app 
    .route("/api/active/manual")
    .post(todoList.create_manual_active_time_entry)
  app
    .route("/api/active/remove")
    .post(todoList.remove_active_time_sheet)
  app
    .route("/api/active/time_sheet")
    .get(todoList.list_all_active_time_sheet)
  app
    .route("/api/active/emp_time_sheet")
    .post(todoList.create_active_from_emp_id);
  app.route("/api/active/update")
    .post(todoList.updateActiveTimeSheet)
  //////////////////////////////////////////////////////////

  //API Final Sheet Calls//////////////////////////
    app
    .route("/api/final")
    .get(todoList.list_all_final_time_sheet)
    .post(todoList.create_final_time_entry); 
    app
    .route("/api/final/time")
    .post(todoList.create_final_time_entry_with_time);
    app.route("/api/final/update")
    .post(todoList.updateFinalTimeSheet)
  app
    .route("/api/final/remove")
    .post(todoList.remove_final_time_sheet)
  //////////////////////////////////////////////////

  //Foreman Calls/////////////////
  app
    .route("/api/foreman")
    .get(todoList.list_all_foreman_data)
    .post(todoList.create_foreman);
  app.route("/api/foreman/remove").post(todoList.removeForeman);
  app.route("/api/foreman/update").post(todoList.updateForeman);
  /////////////////////////////

  //Employee Calls//////////
  app
    .route("/api/employee_data")
    .get(todoList.listAllEmployeeData)
    .post(todoList.create_employee);
  app
    .route("api/employee_data/location")
    .get(todoList.get_employee_from_location);
  app.route("/api/employee_data/remove").post(todoList.removeEmployee);
  app.route("/api/employee_data/update").post(todoList.updateEmployee);
  app.route("/api/employee_data/update/status").post(todoList.update_employee_status);

  app
    .route("/api/employee/get")
    .get(todoList.getEmployeeByFirstLast)
    .post(todoList.create_employee);
  app
    .route("/api/empmloyee/id")
    .get(todoList.getEmployeeFromEmpId);
  ////////////////////////////

  //Location Calls//////////
  app
    .route("/api/location_data")
    .get(todoList.listAllLocationData)
    .post(todoList.create_location);
  app.route("/api/location_data/remove").post(todoList.removeLocation);
  ////////////////////////////

  //Task Calls//////////
  app
    .route("/api/task_data")
    .get(todoList.listAllTaskData)
    .post(todoList.create_task);
  app.route("/api/task_data/remove").post(todoList.removeTask);
  ////////////////////////////



  //Public Style Sheets////////////////////////////////////
  app.route("/style/main.css").get(todoList.show_main_css);
  app
    .route("/images/dark-triangles.png")
    .get(todoList.show_reapeating_background);
    app.route("/style/testing.css").get(todoList.show_testing_css);
    app.route("/js/sort-table.js").get(todoList.show_sort_js);
  //////////////////////////////////////////////////////
};
