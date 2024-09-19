// Load the student data from localStorage or use default values if no data exists
function loadStudentData() {
    const storedData = localStorage.getItem("studentData");
    if (storedData) {
        return JSON.parse(storedData);
    } else {
        return [
            { name: "Arun", grades: ["A - Math", "B - Science"], totalGPA: 7.4, numProjects: 5, numAwards: 2 },
            { name: "Bobby", grades: ["B - Math", "A - Science"], totalGPA: 7.0, numProjects: 4, numAwards: 1 },
            { name: "Chandru", grades: ["A - Math", "A - Science"], totalGPA: 7.8, numProjects: 6, numAwards: 3 },
            { name: "Dinesh", grades: ["C - Math", "B - Science"], totalGPA: 6.4, numProjects: 3, numAwards: 0 },
            { name: "Evana", grades: ["B - Math", "B - Science"], totalGPA: 6.6, numProjects: 4, numAwards: 1 }
        ];
    }
}

// Save student data to localStorage
function saveStudentData(data) {
    localStorage.setItem("studentData", JSON.stringify(data));
}

// Load student data
const studentData = loadStudentData();

// Upload student details entered by the admin
function uploadDetails() {
    const studentName = document.getElementById("studentNameAdmin").value;
    const academicRecord = document.getElementById("academicRecord").value;
    const numProjects = document.getElementById("numProjects").value;
    const numAwards = document.getElementById("numAwards").value;

    if (studentName && academicRecord && numProjects && numAwards) {
        // Extract GPA from academicRecord
        const totalGPA = parseFloat(academicRecord.split(' - ')[1]) || 0;

        const newStudent = {
            name: studentName,
            grades: [academicRecord],
            totalGPA: totalGPA,
            numProjects: parseInt(numProjects),
            numAwards: parseInt(numAwards)
        };

        studentData.push(newStudent); // Add new student to the data array
        saveStudentData(studentData); // Save the updated data array to localStorage

        alert("Student details uploaded successfully!");
        displayStudentList(); // Update the student list
    } else {
        alert("Please fill out all fields.");
    }
}

// Remove a student by name
function removeStudent() {
    const studentName = document.getElementById("removeStudentName").value;
    const studentIndex = studentData.findIndex(s => s.name.toLowerCase() === studentName.toLowerCase());

    if (studentIndex !== -1) {
        studentData.splice(studentIndex, 1); // Remove student from the array
        saveStudentData(studentData); // Save the updated array to localStorage
        displayStudentList(); // Update the student list
        alert("Student removed successfully!");
    } else {
        alert("Student not found. Please enter a valid name.");
    }
}

// Display student list on the admin home page
function displayStudentList() {
    const studentListDiv = document.getElementById("student-list");
    if (studentListDiv) {
        studentListDiv.innerHTML = "<h3>Student List:</h3>";
        studentData.forEach(student => {
            studentListDiv.innerHTML += `<p>${student.name} - GPA: ${student.totalGPA}, Projects: ${student.numProjects}, Awards: ${student.numAwards}</p>`;
        });
    }
}

// Logout function
function logout() {
    window.location.href = "index.html";
}


window.onload = function() {
    displayStudentList(); // Display the student list on page load
};

function displayStudentDetails() {
    const studentName = document.getElementById("studentName").value;
    const student = studentData.find(s => s.name.toLowerCase() === studentName.toLowerCase());

    if (student) {
        const studentRecordsDiv = document.getElementById("student-records");
        studentRecordsDiv.innerHTML = `<h3>${student.name}'s Academic Records:</h3>`;
        student.grades.forEach(grade => {
            studentRecordsDiv.innerHTML += `<p>${grade}</p>`;
        });
        studentRecordsDiv.innerHTML += `<p>Total GPA: ${student.totalGPA}</p>`;
        studentRecordsDiv.innerHTML += `<p>Number of Projects: ${student.numProjects}</p>`;
        studentRecordsDiv.innerHTML += `<p>Number of Awards: ${student.numAwards}</p>`;
    } else {
        alert("Student not found. Please enter a valid name.");
    }
}

// Display faculty section based on the selected ranking criteria
function displayFacultySection() {
    const criteria = document.getElementById("rankingCriteria").value;
    let sortedData = [...studentData];

    if (criteria === "topGrades") {
        sortedData.sort((a, b) => b.totalGPA - a.totalGPA);
    } else if (criteria === "mostProjects") {
        sortedData.sort((a, b) => b.numProjects - a.numProjects);
    } else if (criteria === "numberOfAwards") {
        sortedData.sort((a, b) => b.numAwards - a.numAwards);
    }

    const rankingList = document.getElementById("ranking-list");
    rankingList.innerHTML = "";
    sortedData.forEach(student => {
        rankingList.innerHTML += `<li>${student.name} - ${criteria === 'topGrades' ? 'GPA: ' + student.totalGPA :
                                    criteria === 'mostProjects' ? 'Projects: ' + student.numProjects :
                                    criteria === 'numberOfAwards' ? 'Awards: ' + student.numAwards : ''}</li>`;
    });
}

// Generate pie chart for student GPA distribution
function generatePieChart() {
    const ctx = document.getElementById('studentPieChart').getContext('2d');
    const data = loadStudentData();

    const labels = data.map(student => student.name);
    const gpaData = data.map(student => student.totalGPA); 

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'GPA Distribution',
                data: gpaData,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: GPA ${tooltipItem.raw}`;
                        }
                    }
                }
            }
        }
    });
}

// Initialize the pie chart on the faculty home page
if (document.getElementById("studentPieChart")) {
    generatePieChart();
}
