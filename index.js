const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const studentRouter = require("./Server/server");

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, "client")));

// Set up a simple route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "reg.html"));
});

// Use your server routes (replace with your actual server logic)
app.use("/api", studentRouter);

app.get("/studdetails", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "studdetails.html")); // Update the path accordingly
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
