$(document).ready(function () {
  // Function to display messages
  function displayMessage(message, messageType) {
    var messageDiv = $("#studentError");
    messageDiv
      .removeClass("success error")
      .addClass(messageType)
      .text(message)
      .show()
      .delay(5000)
      .fadeOut();
  }

  window.addStudent = function () {
    var rollNo = $("#rollNo").val();
    var name = $("#name").val();
    var age = $("#age").val();
    var marks = $("#marks").val();
    var imageUrl = $("#imageUrl").val();

    $.ajax({
      type: "POST",
      url: "http://localhost:5000/api/addStudent",
      contentType: "application/json",
      data: JSON.stringify({
        rollNo: rollNo,
        name: name,
        age: age,
        marks: marks,
        image_url: imageUrl,
      }),
      success: function (response) {
        getStudents();
        displayMessage(
          `Student with name ${name} has been added successfully`,
          "success"
        );
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("XHR Status:", xhr.status);
        console.error("Response Text:", xhr.responseText);
        console.error("Error Thrown:", errorThrown);

        var errorMessage;

        if (xhr.responseJSON && xhr.responseJSON.error) {
          if (xhr.responseJSON.error === "DUPLICATE_ENTRY") {
            errorMessage = xhr.responseJSON.message;
          } else {
            errorMessage = "An error occurred while adding the student";
          }
        } else {
          errorMessage = "An error occurred while adding the student";
        }

        displayMessage(errorMessage, "error");
      },
    });
  };

  window.getStudents = function () {
    $.ajax({
      type: "GET",
      url: "http://localhost:5000/api/studdetails",
      success: function (response) {
        displayStudents(response);
      },
    });
  };

  function displayStudents(students) {
    $("#studentList").html("");
    students.forEach(function (student) {
      $("#studentList").append(
        `<li>${student.name} (Roll No: ${student.rollNo}, Age: ${student.age} years, Marks: ${student.marks})</li>`
      );
    });
  }
});

$(document).ready(function () {
  $("#navbar-container").load("navbar.html");
});

$(document).ready(function () {
  function getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  $(".edit-btn").click(function () {
    const newName = prompt("Enter the new name:");
    const newAge = prompt("Enter the new age:");
    const newMarks = prompt("Enter the new marks:");
    const newImageUrl = prompt("Enter the new image URL:");

    if (
      newName === null ||
      newAge === null ||
      newMarks === null ||
      newImageUrl === null
    ) {
      alert("Edit canceled");
      return;
    }

    const rollNo = getParameterByName("rollNo");

    $("#prof-username").text("Name: " + newName);
    $("#prof-age").text("Age: " + newAge);
    $("#prof-marks").text("Marks: " + newMarks);
    $("#profilePicture img").attr("src", newImageUrl);

    $.ajax({
      type: "PUT",
      url: `http://localhost:5000/api/editStudent/${rollNo}`,
      contentType: "application/json",
      data: JSON.stringify({
        name: newName,
        age: newAge,
        marks: newMarks,
        image_url: newImageUrl,
      }),
      success: function (response) {
        alert("Profile updated successfully!");
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error updating profile:", errorThrown);
        alert("Error updating profile");
      },
    });
  });

  $(".delete-btn").click(function () {
    const confirmDelete = confirm(
      "Are you sure you want to delete this profile?"
    );

    if (!confirmDelete) {
      alert("Delete canceled");
      return;
    }

    const rollNo = getParameterByName("rollNo");

    $.ajax({
      type: "DELETE",
      url: `http://localhost:5000/api/deleteStudent/${rollNo}`,
      success: function (response) {
        $(".profile-container").hide();
        alert("Profile deleted successfully!");
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error deleting profile:", errorThrown);
        alert("Error deleting profile");
      },
    });
  });

  function loadStudentDetails() {
    const rollNo = getParameterByName("rollNo");

    $.ajax({
      type: "GET",
      url: `http://localhost:5000/api/student/${rollNo}`,
      success: function (studentDetails) {
        $("#prof-username").text("Name: " + studentDetails.name);
        $("#prof-rollno").text("Roll no: " + studentDetails.roll_no);
        $("#prof-age").text("Age: " + studentDetails.age);
        $("#prof-marks").text("Marks: " + studentDetails.marks);
        $("#profilePicture img").attr(
          "src",
          studentDetails.image_url ||
            "https://icon-library.com/images/profile-icon-images/profile-icon-images-14.jpg"
        );
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("XHR Status:", xhr.status);
        console.error("Error Thrown:", errorThrown);
      },
    });
  }

  if (window.location.pathname.includes("student.html")) {
    loadStudentDetails();
  }

  $("#studentList").on("click", "li", function () {
    const rollNo = $(this).data("rollNo");
    window.location.href = `student.html?rollNo=${rollNo}`;
  });
});
