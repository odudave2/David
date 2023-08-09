/*********************************************************************************
 *  * WEB700 – Assignment 06 * I declare that this assignment is my own work in 
 * accordance with Seneca Academic Policy. No part * of this assignment has been 
 * copied manually or electronically from any other source * (including 3rd party
 *  web sites) or distributed to other students. *
 * Name: __David Oduwole___ Student ID: __185731213__ Date: ____August 9, 2023__ *
 * Online (Cyclic) Link:__https://muddy-eel-trunks.cyclic.app__ * *
 * *******************************************************************************/



const express = require("express");
const path = require("path");
const collegeData = require("./collegeData");
const exphbs = require("express-handlebars");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Static middleware and body parser
const staticMiddleware = express.static(path.join(__dirname, "Public"));
app.use(express.urlencoded({ extended: true }));
app.use(staticMiddleware);

// Handlebars configuration
const hbs = exphbs.create({
  extname: ".hbs",
  defaultLayout: "main",
  helpers: {
    navLink: function (url, options) {
      const activeClass = url === options.data.root.activeRoute ? " active" : "";
      return `<li class="nav-item${activeClass}"><a class="nav-link" href="${url}">${options.fn(this)}</a></li>`;
    },
    equal: function (lvalue, rvalue, options) {
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    },
  },
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

// Routes
collegeData
  .initialize()
  .then(() => {
    app.get("/students", (req, res) => {
      collegeData
        .getAllStudents()
        .then((students) => {
          const simplifiedStudents = students.map((student) => ({
            studentNum: student.studentNum,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            addressStreet: student.addressStreet,
            status: student.status,
            course: student.course,
          }));

          res.render("students", {
            students: simplifiedStudents.length > 0 ? simplifiedStudents : null,
            message: simplifiedStudents.length === 0 ? "No results" : null,
          });
        })
        .catch(() => {
          res.render("students", { message: "Error fetching students data" });
        });
    });

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
            res.render("courses", { message: "No results" });
          }
        })
        .catch(() => {
          res.render("courses", { message: "Error fetching courses data" });
        });
    });

    app.get("/student/:studentNum", (req, res) => {
      const studentNum = parseInt(req.params.studentNum);
      collegeData.getStudentByNum(studentNum)
        .then(student => {
          res.render("student", { student: student });
        })
        .catch(() => {
          res.render("student", { message: "No results" });
        });
    });

    app.get("/course/:id", (req, res) => {
      const courseId = parseInt(req.params.id);

      collegeData.getCourseById(courseId)
        .then((course) => {
          if (!course) {
            res.status(404).send("Course Not Found");
          } else {
            res.render("course", { course: course });
          }
        })
        .catch((error) => {
          res.status(404).send("Course Not Found");
        });
    });

    app.get("/courses/add", (req, res) => {
      res.render("addCourse", { activeRoute: "/courses/add" });
    });

    app.post("/courses/add", (req, res) => {
      collegeData.addCourse(req.body)
        .then(() => {
          res.redirect("/courses");
        })
        .catch(() => {
          res.status(500).json({ error: "Failed to add course" });
        });
    });

    app.post("/course/update", (req, res) => {
      collegeData.updateCourse(req.body)
        .then(() => {
          res.redirect("/courses");
        })
        .catch((error) => {
          console.error("Error updating course:", error);
          res.status(500).json({ error: "Failed to update course" });
        });
    });

    app.get("/course/delete/:id", (req, res) => {
      const courseId = parseInt(req.params.id);

      collegeData.deleteCourseById(courseId)
        .then(() => {
          res.redirect("/courses");
        })
        .catch(() => {
          res.status(500).send("Unable to Remove Course / Course not found");
        });
    });

   app.get("/student/delete/:studentNum", (req, res) => {
  const studentNum = parseInt(req.params.studentNum);
  collegeData.deleteStudentByNum(studentNum)
    .then(() => {
      res.redirect("/students");
    })
    .catch(() => {
      res.status(500).send("Unable to Remove Student / Student not found");
    });
});


    app.get("/", (req, res) => {
      res.render("home", { activeRoute: "/" });
    });

    app.get("/about", (req, res) => {
      res.render("about", { activeRoute: "/about" });
    });

    app.get("/htmlDemo", (req, res) => {
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

          console.log("simplifiedStudents:", simplifiedStudents);

          if (simplifiedStudents.length > 0) {
            res.render("htmlDemo", { students: simplifiedStudents, activeRoute: "/htmlDemo" });
          } else {
            res.render("htmlDemo", { message: "No results", activeRoute: "/htmlDemo" });
          }
        })
        .catch(() => {
          res.render("htmlDemo", { message: "No results", activeRoute: "/htmlDemo" });
        });
    });

    app.get("/addStudent", (req, res) => {
      res.render("addStudent", { activeRoute: "/addStudent" });
    });

    app.post("/students/add", (req, res) => {
      collegeData.addStudent(req.body)
        .then(() => {
          res.redirect("/students");
        })
        .catch(() => {
          res.status(500).json({ error: "Failed to add student" });
        });
    });

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

    // 404 - Page Not Found
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