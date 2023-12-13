const express = require("express");
const mysql = require("mysql2");
const router = express.Router(); // Create an Express router
const json2csv = require("json2csv").parse;
const fs = require("fs");
const path = require("path"); // Add this line

// Create a MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "APKroot&123",
  database: "Student_Management",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Middleware to parse JSON data
router.use(express.json());

router.post("/addStudent", async (req, res) => {
  const { rollNo, name, age, marks, image_url } = req.body;

  try {
    const query = `
      INSERT INTO students (name, age, marks, image_url, roll_no) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await db
      .promise()
      .query(query, [name, age, marks, image_url, rollNo]);
    res.send("Student added successfully");
  } catch (err) {
    console.error("Error adding student:", err);

    if (err.code === "ER_DUP_ENTRY") {
      // Return a specific error code for duplicate entry
      res.status(400).json({
        error: "DUPLICATE_ENTRY",
        message: `Student with the Roll No ${rollNo} already exists`,
      });
    } else if (err.code === "ER_WARN_DATA_OUT_OF_RANGE") {
      // Display a specific message for out-of-range value error
      res.status(400).send("Error: Out of range value for one or more fields");
    } else {
      // Display a generic error message for other errors
      res.status(500).send("Error adding student");
    }
  }
});

router.get("/studdetails", (req, res) => {
  const query = "SELECT * FROM students";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error getting students:", err);
      res.status(500).send("Error getting students");
      return;
    }

    // Send the list of students as JSON
    res.json(results); // Assuming results is an array of student objects
  });
});

// Add this route to your server code
router.get("/student/:rollNo", (req, res) => {
  const { rollNo } = req.params;

  const query = "SELECT * FROM students WHERE roll_no = ?";
  db.query(query, [rollNo], (err, results) => {
    if (err) {
      console.error("Error getting student details:", err);
      res.status(500).send("Error getting student details");
      return;
    }

    if (results.length === 0) {
      res.status(404).send("Student not found");
      return;
    }

    // Send the student details as JSON
    res.json(results[0]);
  });
});

// Update your existing server-side route for editing
router.put("/editStudent/:rollNo", async (req, res) => {
  const { rollNo } = req.params;
  const { name, age, marks, image_url } = req.body;

  try {
    const query =
      "UPDATE students SET name = ?, age = ?, marks = ?, image_url = ? WHERE roll_no = ?";
    const result = await db
      .promise()
      .query(query, [name, age, marks, image_url, rollNo]);
    res.send("Student details updated successfully");
  } catch (err) {
    console.error("Error editing student details:", err);
    res.status(500).send("Error editing student details");
  }
});

// Update your existing server-side route for deleting
router.delete("/deleteStudent/:rollNo", async (req, res) => {
  const { rollNo } = req.params;

  try {
    const query = "DELETE FROM students WHERE roll_no = ?";
    const result = await db.promise().query(query, [rollNo]);
    res.send("Student deleted successfully");
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).send("Error deleting student");
  }
});
router.get("/downloadAllStudents", async (req, res) => {
  try {
    // Fetch data from the database
    const query = "SELECT * FROM students";
    const [results] = await db.promise().query(query);

    // Convert data to CSV format
    const csvData = json2csv(results, {
      fields: ["name", "roll_no", "age", "marks", "image_url"],
    });

    // Set headers for the response
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=all_students.csv"
    );

    // Send the CSV data as the response
    res.send(csvData);
  } catch (error) {
    console.error("Error generating CSV file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router; // Export the router
