# EDUPULSE - Student Management System

The Student Management System is a web application that facilitates the management of student details. 
Users can perform various operations such as adding, viewing, editing, and deleting student records. 
Additionally, the system offers the functionality to download all student details in CSV format.

## Features

1. **Add Student:** Add a new student to the database with roll number, name, age, marks, and an optional image URL.

2. **View Students:** View a list of all students with basic details.

3. **View Student Details:** Click on a student to view detailed information, including a profile picture.

4. **Edit Student Details:** Modify student details such as name, age, marks, and image URL.

5. **Delete Student:** Remove a student from the system.

6. **Student Dashboard:** Comprehensive dashboard for a visual representation of student data including marks distribution and marks hierarchy.

7. **Download All Students:** Download a CSV file containing details of all students.

## Tech Stacks Used
- Frontend: HTML, CSS, JavaScript, jQuery, AJAX
- Backend: Node.js, Express.js
- Database: MySQL

## Demo

Watch a demo of the project [here](https://drive.google.com/file/d/1kXa1G9PWCe9DJgXG_0OpbTzZCt11IBFQ/view?usp=sharing)

## Setup Instructions

To run the project locally, follow these steps:

1. **Clone the repository to your local machine:**
   
```bash

  git clone https://github.com/AswinPKumar01/Student-Management-Web-App.git

```

2. **Navigate to project directory:**

```bash

  cd Student-Management-Web-App

```

3. **Add your MySQL database details in the .env file in the root directory**

```bash

    DB_HOST=your_database_host
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_DATABASE=your_database_name
    DB_TABLE=your_table_name

```
4. **Make sure that your MySQL table follows this schema:**

Columns: 

- **roll_no:** Integer, Primary key, representing the roll number of the student.
- **name:** String (255 characters), representing the name of the student.
- **age:** Integer, representing the age of the student.
- **marks:** Integer, representing the marks obtained by the student.
- **image_url:** String (255 characters), representing the URL of the student's image.

Sample command to create this table:

```bash

CREATE TABLE your_table_name (
  roll_no INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  marks INT NOT NULL,
  image_url VARCHAR(255)
);

```

5. Start the server

```bash

  npm start

```

5. Open your browser and go to http://localhost:5000 to access the application.


## API Endpoints

- **POST /api/addStudent:** Add a new student to the database.
- **GET /api/studdetails:** Get details of all students.
- **GET /api/student/:rollNo:** Get details of a specific student.
- **PUT /api/editStudent/:rollNo:** Edit details of a specific student.
- **DELETE /api/deleteStudent/:rollNo:** Delete a specific student.
- **GET /api/downloadAllStudents:** Download details of all students in CSV format.

## Contributing
Feel free to contribute to this project by opening issues or submitting pull requests.
If there are any issues regarding the project, [contact me](mailto:aswinpkumar03@gmail.com).

## Author
Created by [Aswin P Kumar](https://linktr.ee/aswinpkumar)
