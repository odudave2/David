/********************************************************************************
 * * * WEB700 – Assignment 03 * I declare that this assignment is my own work in 
 * accordance with Seneca Academic Policy. No part * of this assignment has been 
 * copied manually or electronically from any other source * 
 * (including 3rd party web sites) or distributed to other students. *
 * Name: _David Oduwole_ Student ID: _185731213__ Date: _June 14, 2023___ *
 * *****************************************************************************/

const express = require("express");
const path = require("path");
const fs = require("fs")
const collegeData = require("./collegeData");
const exphbs = require("express-handlebars"); // Require express-handlebars module

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// To import the express.static middleware
const staticMiddleware = express.static(path.join(__dirname, "public"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(staticMiddleware);

// Set up handlebars custom helpers
const navLinkHelper = function (url, options) {
  return (
    '<li' +
    ((url == options.data.root.activeRoute) // Use options.data.root.activeRoute instead of app.locals.activeRoute
      ? ' class="nav-item active" '
      : ' class="nav-item" ') +
    '><a class="nav-link" href="' +
    url +
    '">' +
    options.fn(this) +
    "</a></li>"
  );
};

const equalHelper = function (lvalue, rvalue, options) {
  if (arguments.length < 3)
    throw new Error("Handlebars Helper equal needs 2 parameters");
  if (lvalue != rvalue) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
};

// Set up express-handlebars as the template engine
const hbs = exphbs.create({
  extname: ".hbs",
  defaultLayout: "main" // Specify the default layout template
});

// Register handlebars custom helpers
hbs.handlebars.registerHelper("navLink", navLinkHelper);
hbs.handlebars.registerHelper("equal", equalHelper);

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs"); // Set "hbs" as the view engine

// Initialize collegeData before starting the server
collegeData.initialize()
  .then(() => {
    // Routes

// GET /students
app.get("/students", (req, res) => {
  collegeData.getAllStudents()
    .then(students => {
      const simplifiedStudents = students.map(student => ({
        studentNum: student.studentNum,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        addressStreet: student.addressStreet,
        status: student.status,
        course: student.course,
      }));

      if (simplifiedStudents.length > 0) {
        res.render("students", { students: simplifiedStudents });
      } else {
        res.render("students", { message: "no results" });
      }
    })
    .catch(() => {
      res.render("students", { message: "no results" });
    });
});

    // GET /courses
app.get("/courses", (req, res) => {
  collegeData.getCourses()
    .then(courses => {
      const simplifiedCourses = courses.map(course => ({
        courseId: course.courseId,
        courseCode: course.courseCode,
        courseDescription: course.courseDescription,
      }));
      if (simplifiedCourses.length > 0) {
        res.render("courses", { courses: simplifiedCourses });
      } else {
        res.render("courses", { message: "no results" });
      }
    })
    .catch(() => {
      res.render("courses", { message: "no results" });
    });
});

  // GET /student/num
app.get("/student/:studentNum", (req, res) => {
  const studentNum = parseInt(req.params.studentNum);
  collegeData.getStudentByNum(studentNum)
    .then(student => {
      res.render("student", { student: student });
    })
    .catch(() => {
      res.render("student", { message: "no results" });
    });
});


    // GET /course/:id
    app.get("/course/:id", (req, res) => {
      const courseId = parseInt(req.params.id);

      collegeData.getCourseById(courseId)
        .then((course) => {
          res.render("course", { course: course });
        })
        .catch((error) => {
          res.status(404).send("Course not found.");
        });
    });

    // GET /
    app.get("/", (req, res) => {
      res.render("home", { activeRoute: "/" }); // Pass the activeRoute parameter
    });

    // GET /about
    app.get("/about", (req, res) => {
      res.render("about", { activeRoute: "/about" }); // Pass the activeRoute parameter
    });

    // GET /htmlDemo
    app.get("/htmlDemo", (req, res) => {
      res.render("htmlDemo", { activeRoute: "/htmlDemo" }); // Pass the activeRoute parameter
    });

    // GET /addStudent
    app.get("/addStudent", (req, res) => {
      res.render("addStudent", { activeRoute: "/addStudent" }); // Pass the activeRoute parameter
    });

    // POST /students/add
    app.post("/students/add", (req, res) => {
      collegeData.addStudent(req.body)
        .then(() => {
          res.redirect("/students");
        })
        .catch(() => {
          res.status(500).json({ error: "Failed to add student" });
        });
    });

    // POST /student/update
app.post("/student/update", (req, res) => {
  collegeData.updateStudent(req.body)
    .then(() => {
      res.redirect("/students");
    })
    .catch((error) => {
      console.error("Error updating student:", error);
      res.status(500).json({ error: "Failed to update student" });
    });
});


    // 404 route
    app.use((req, res) => {
      res.status(404).send("Page Not Found");
    });

    // Start the server
    app.listen(HTTP_PORT, () => {
      console.log("Server listening on port:", HTTP_PORT);
    });
  })
  .catch((err) => {
    console.error(err);
  });
