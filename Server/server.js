const express = require("express");
const mysql = require("mysql2");
const router = express.Router();
const json2csv = require("json2csv").parse;
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

router.use(express.json());

router.post("/addStudent", async (req, res) => {
  const { rollNo, name, age, marks, image_url } = req.body;

  try {
    const query = `
      INSERT INTO ${process.env.DB_TABLE} (name, age, marks, image_url, roll_no) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await db
      .promise()
      .query(query, [name, age, marks, image_url, rollNo]);
    res.send("Student added successfully");
  } catch (err) {
    console.error("Error adding student:", err);

    if (err.code === "ER_DUP_ENTRY") {
      res.status(400).json({
        error: "DUPLICATE_ENTRY",
        message: `Student with the Roll No ${rollNo} already exists`,
      });
    } else if (err.code === "ER_WARN_DATA_OUT_OF_RANGE") {
      res.status(400).send("Error: Out of range value for one or more fields");
    } else {
      res.status(500).send("Error adding student");
    }
  }
});

router.get("/studdetails", (req, res) => {
  const query = `SELECT * FROM ${process.env.DB_TABLE}`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error getting students:", err);
      res.status(500).send("Error getting students");
      return;
    }
    res.json(results);
  });
});

router.get("/student/:rollNo", (req, res) => {
  const { rollNo } = req.params;

  const query = `SELECT * FROM ${process.env.DB_TABLE} WHERE roll_no = ?`;
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

    res.json(results[0]);
  });
});

router.put("/editStudent/:rollNo", async (req, res) => {
  const { rollNo } = req.params;
  const { name, age, marks, image_url } = req.body;

  try {
    const selectQuery = `SELECT * FROM ${process.env.DB_TABLE} WHERE roll_no = ?`;
    const [existingResults] = await db.promise().query(selectQuery, [rollNo]);

    const updatedName = name !== undefined && name.trim() !== '' ? name : existingResults[0].name;
    const updatedAge = age !== undefined && age.trim() !== '' ? age : existingResults[0].age;
    const updatedMarks = marks !== undefined && marks.trim() !== '' ? marks : existingResults[0].marks;
    const updatedImageUrl = image_url !== undefined && image_url.trim() !== '' ? image_url : existingResults[0].image_url;

    const updateQuery =
      `UPDATE ${process.env.DB_TABLE} SET name = ?, age = ?, marks = ?, image_url = ? WHERE roll_no = ?`;
    const result = await db
      .promise()
      .query(updateQuery, [updatedName, updatedAge, updatedMarks, updatedImageUrl, rollNo]);

    res.send("Student details updated successfully");
  } catch (err) {
    console.error("Error editing student details:", err);
    res.status(500).send("Error editing student details");
  }
});


router.delete("/deleteStudent/:rollNo", async (req, res) => {
  const { rollNo } = req.params;

  try {
    const query = `DELETE FROM ${process.env.DB_TABLE} WHERE roll_no = ?`;
    const result = await db.promise().query(query, [rollNo]);
    res.send("Student deleted successfully");
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).send("Error deleting student");
  }
});
router.get("/downloadAllStudents", async (req, res) => {
  try {
    const query = `SELECT * FROM ${process.env.DB_TABLE}`;
    const [results] = await db.promise().query(query);

    const csvData = json2csv(results, {
      fields: ["name", "roll_no", "age", "marks", "image_url"],
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=all_students.csv"
    );

    res.send(csvData);
  } catch (error) {
    console.error("Error generating CSV file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router; // Export the router
