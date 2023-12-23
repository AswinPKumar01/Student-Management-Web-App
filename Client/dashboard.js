function calculateMarkDistribution(students) {
  const distribution = {
    above90: 0,
    above80: 0,
    above70: 0,
    above60: 0,
    above50: 0,
    below50: 0,
  };

  students.forEach((student) => {
    const marks = student.marks;
    if (marks >= 90) distribution.above90++;
    else if (marks >= 80) distribution.above80++;
    else if (marks >= 70) distribution.above70++;
    else if (marks >= 60) distribution.above60++;
    else if (marks >= 50) distribution.above50++;
    else distribution.below50++;
  });

  return Object.values(distribution).reverse();
}

function findTopLowestMarks(students) {
  const sortedStudents = [...students].sort((a, b) => b.marks - a.marks);
  const topMark = sortedStudents[0];
  const lowestMark = sortedStudents[sortedStudents.length - 1];
  return { topMark, lowestMark };
}

function fetchStudentData() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "http://localhost:5000/api/studdetails",
      success: function (response) {
        resolve(response);
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error fetching student data:", errorThrown);
        reject("Error fetching student data");
      },
    });
  });
}

async function displayMarkDistributionChart() {
  try {
    const students = await fetchStudentData();
    const ctx = document
      .getElementById("markDistributionChart")
      .getContext("2d");

    const data = {
      labels: [
        "Below 50",
        "50 - 59",
        "60 - 69",
        "70 - 79",
        "80 - 89",
        "Above 90",
      ],
      datasets: [
        {
          label: "Mark Distribution",
          data: calculateMarkDistribution(students),
          backgroundColor: [
            "rgba(255, 159, 64, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(75, 192, 192, 0.2)",
          ],
          borderColor: [
            "rgba(255, 159, 64, 1)",
            "rgba(153, 102, 255,1)",
            "rgba(255, 206, 86, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    new Chart(ctx, {
      type: "bar",
      data: data,
      options: options,
    });
  } catch (error) {
    console.error(error);
  }
}

async function displayAllStudentsMarksTable() {
  try {
    const students = await fetchStudentData();
    const sortedStudents = students.slice().sort((a, b) => b.marks - a.marks);

    const tableBody = document.getElementById("topLowestMarksTableBody");
    tableBody.innerHTML = "";

    sortedStudents.forEach((student, index) => {
      tableBody.innerHTML += `
          <tr>
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.roll_no}</td>
            <td>${student.marks}</td>
          </tr>
        `;
    });
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  displayMarkDistributionChart();
  displayAllStudentsMarksTable();
});
