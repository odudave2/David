const fs = require('fs');

class Data {
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}

let dataCollection = null;

function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/students.json', 'utf8', (err, studentDataFromFile) => {
      if (err) {
        reject("Unable to read students.json");
        return;
      }

      fs.readFile('./data/courses.json', 'utf8', (err, courseDataFromFile) => {
        if (err) {
          reject("Unable to read courses.json");
          return;
        }

        const studentData = JSON.parse(studentDataFromFile);
        const courseData = JSON.parse(courseDataFromFile);

        dataCollection = new Data(studentData, courseData);

        resolve();
      });
    });
  });
}

function getAllStudents() {
  return new Promise((resolve, reject) => {
    if (dataCollection && dataCollection.students && dataCollection.students.length > 0) {
      resolve(dataCollection.students);
    } else {
      reject("No students found.");
    }
  });
}

function getTAs() {
  return new Promise((resolve, reject) => {
    if (dataCollection && dataCollection.students && dataCollection.students.length > 0) {
      const tas = dataCollection.students.filter(student => student.TA);
      if (tas.length > 0) {
        resolve(tas);
      } else {
        reject("No TAs found.");
      }
    } else {
      reject("No students found.");
    }
  });
}

function getCourses() {
  return new Promise((resolve, reject) => {
    if (dataCollection && dataCollection.courses && dataCollection.courses.length > 0) {
      resolve(dataCollection.courses);
    } else {
      reject("No courses found.");
    }
  });
}

function getStudentsByCourse(course) {
  return new Promise((resolve, reject) => {
    if (dataCollection && dataCollection.students && dataCollection.students.length > 0) {
      const students = dataCollection.students.filter(student => student.course === course);
      if (students.length > 0) {
        resolve(students);
      } else {
        reject("No results returned.");
      }
    } else {
      reject("No students found.");
    }
  });
}

function getStudentByNum(num) {
  return new Promise((resolve, reject) => {
    if (dataCollection && dataCollection.students && dataCollection.students.length > 0) {
      const student = dataCollection.students.find(student => student.studentNum === num);
      if (student) {
        resolve(student);
      } else {
        reject("No results returned.");
      }
    } else {
      reject("No students found.");
    }
  });
}

function addStudent(studentData) {
  return new Promise((resolve, reject) => {
    if (dataCollection && dataCollection.students) {
      const newStudentNum = dataCollection.students.length + 1;
      const newStudent = {
        studentNum: newStudentNum,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email,
        course: studentData.course,
        TA: studentData.TA || false
      };
      dataCollection.students.push(newStudent);
      fs.writeFile('./data/students.json', JSON.stringify(dataCollection.students), (err) => {
        if (err) {
          reject("Unable to add student.");
        } else {
          resolve(newStudent);
        }
      });
    } else {
      reject("No students found.");
    }
  });
}

function getCourseById(id) {
  return new Promise((resolve, reject) => {
    if (!id || typeof id !== "number") {
      reject(new Error("Invalid course id"));
      return;
    }

    const course = dataCollection.courses.find((course) => course.courseId === id);

    if (!course) {
      reject(new Error("Query returned 0 results"));
    } else {
      resolve(course);
    }
  });
}
function updateStudent(studentData) {
  return new Promise((resolve, reject) => {
    if (!dataCollection || !dataCollection.students) {
      reject("No students found.");
      return;
    }

    const index = dataCollection.students.findIndex((student) => student.studentNum === studentData.studentNum);
    if (index === -1) {
      reject("Student not found.");
      return;
    }

    dataCollection.students[index].firstName = studentData.firstName;
    dataCollection.students[index].lastName = studentData.lastName;
    dataCollection.students[index].email = studentData.email;
    dataCollection.students[index].addressStreet = studentData.addressStreet;
    dataCollection.students[index].addressCity = studentData.addressCity;
    dataCollection.students[index].addressProvince = studentData.addressProvince;
    dataCollection.students[index].TA = !!studentData.TA;
    dataCollection.students[index].status = studentData.status;
    dataCollection.students[index].course = parseInt(studentData.course);

    fs.writeFile('./data/students.json', JSON.stringify(dataCollection.students), (err) => {
      if (err) {
        reject("Unable to update student.");
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  initialize,
  getAllStudents,
  getTAs,
  getCourses,
  getStudentsByCourse,
  getStudentByNum,
  addStudent,
  getCourseById,
  updateStudent
};
