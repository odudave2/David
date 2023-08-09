
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('hdaecgoa', 'hdaecgoa', 'Hkc4Y90O5RjvyFHX3y9FpnJDemIYIGMo', {
  host: 'peanut.db.elephantsql.com',
  dialect: 'postgres',
});

const Student = sequelize.define('Student', {
  studentNum: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  addressStreet: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  addressCity: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  addressProvince: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active',
  },
  course: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  TA: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

// Define the Course model
const Course = sequelize.define('Course', {
  courseId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  courseCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  courseDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Sync the models with the database and handle any errors
async function initialize() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync();
    console.log('Database synced successfully.');
  } catch (error) {
    throw new Error('Unable to connect and sync the database: ' + error.message);
  }
}


function initialize() {
  return sequelize.sync()
    .then(() => {
      console.log('Database synced successfully');
    })
    .catch((err) => {
      throw new Error("Unable to sync the database");
    });
}

function getAllStudents() {
  return Student.findAll()
    .then((students) => {
      if (students && students.length > 0) {
        return students;
      } else {
        throw new Error("No students found.");
      }
    })
    .catch((err) => {
      throw new Error("No students found.");
    });
}

function getTAs() {
  return Student.findAll({
    where: { TA: true }
  })
    .then((tas) => {
      if (tas && tas.length > 0) {
        return tas;
      } else {
        throw new Error("No TAs found.");
      }
    })
    .catch((err) => {
      throw new Error("No TAs found.");
    });
}

function getCourses() {
  return Course.findAll()
    .then((courses) => {
      if (courses && courses.length > 0) {
        return courses;
      } else {
        throw new Error("No courses found.");
      }
    })
    .catch((err) => {
      throw new Error("No courses found.");
    });
}

function getStudentsByCourse(course) {
  return Student.findAll({
    where: { course: course }
  })
    .then((students) => {
      if (students && students.length > 0) {
        return students;
      } else {
        throw new Error("No students found.");
      }
    })
    .catch((err) => {
      throw new Error("No students found.");
    });
}

function getStudentByNum(num) {
  return Student.findOne({
    where: { studentNum: num }
  })
    .then((student) => {
      if (student) {
        return student;
      } else {
        throw new Error("No results returned.");
      }
    })
    .catch((err) => {
      throw new Error("No results returned.");
    });
}

function addStudent(studentData) {
  studentData.TA = (studentData.TA) ? true : false;

  for (const prop in studentData) {
    if (studentData[prop] === '') {
      studentData[prop] = null;
    }
  }

  return Student.create(studentData)
    .then((newStudent) => {
      console.log('Student created successfully');
      return newStudent;
    })
    .catch((err) => {
      throw new Error("Unable to create student.");
    });
}

function getCourseById(id) {
  return Course.findOne({
    where: { courseId: id }
  })
    .then((course) => {
      if (course) {
        return course;
      } else {
        throw new Error("Query returned 0 results");
      }
    })
    .catch((err) => {
      throw new Error("Query returned 0 results");
    });
}

function updateStudent(studentData) {
  studentData.TA = (studentData.TA) ? true : false;

  for (const prop in studentData) {
    if (studentData[prop] === '') {
      studentData[prop] = null;
    }
  }

  return Student.update(studentData, {
    where: { studentNum: studentData.studentNum }
  })
    .then(() => {
      console.log('Student updated successfully');
    })
    .catch((err) => {
      throw new Error("Unable to update student");
    });
}

function addCourse(courseData) {
  return Course.create(courseData)
    .then((course) => {
      console.log('Course created successfully');
      return course;
    })
    .catch((error) => {
      throw new Error("Unable to create course.");
    });
}

function updateCourse(courseData) {
  return Course.update(courseData, {
    where: { courseId: courseData.courseId }
  })
    .then((result) => {
      if (result[0] === 1) {
        console.log('Course updated successfully');
      } else {
        throw new Error("No course found for the given id.");
      }
    })
    .catch((error) => {
      throw new Error("Unable to update course.");
    });
}

function deleteCourseById(id) {
  return Course.destroy({
    where: { courseId: id }
  })
    .then((rowsDeleted) => {
      if (rowsDeleted === 0) {
        throw new Error("No course found for the given id.");
      } else {
        console.log('Course deleted successfully');
      }
    })
    .catch((error) => {
      throw new Error("Unable to delete course.");
    });
}

function deleteStudentByNum(studentNum) {
  return Student.destroy({
    where: { studentNum: studentNum }
  })
    .then((deletedStudent) => {
      if (deletedStudent === 1) {
        console.log('Student deleted successfully');
      } else {
        throw new Error("Student not found");
      }
    })
    .catch((err) => {
      throw new Error("Unable to remove student");
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
  updateStudent,
  addCourse,
  updateCourse,
  deleteCourseById,
  deleteStudentByNum,
};
