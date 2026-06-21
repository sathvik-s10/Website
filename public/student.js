// Student Dashboard Functions

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'student') {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('studentName').textContent = currentUser.name;
    loadStudentGrades();
});

// Convert numeric grade to letter grade
function getLetterGrade(average) {
    if (average >= 90) return 'A';
    if (average >= 80) return 'B';
    if (average >= 70) return 'C';
    if (average >= 60) return 'D';
    return 'F';
}

// Get color for letter grade
function getGradeColor(letter) {
    switch(letter) {
        case 'A': return '#48bb78';
        case 'B': return '#4299e1';
        case 'C': return '#ed8936';
        case 'D': return '#f6ad55';
        case 'F': return '#f56565';
        default: return '#667eea';
    }
}

function loadStudentGrades() {
    const currentUser = getCurrentUser();
    const grades = JSON.parse(localStorage.getItem('grades') || '[]');
    const classes = JSON.parse(localStorage.getItem('classes') || '[]');
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    
    // Get all grades for current student
    const studentGrades = grades.filter(g => g.studentId === currentUser.id);
    
    if (studentGrades.length === 0) {
        document.querySelector('.classes-container').style.display = 'none';
        document.getElementById('noClasses').style.display = 'block';
        return;
    }

    // Group grades by class
    const gradesByClass = {};
    studentGrades.forEach(grade => {
        if (!gradesByClass[grade.classId]) {
            gradesByClass[grade.classId] = [];
        }
        gradesByClass[grade.classId].push(grade);
    });

    // Create class list
    const classList = document.getElementById('classesListContainer');
    classList.innerHTML = '';

    const classArray = Object.entries(gradesByClass).map(([classId, classGrades]) => {
        const cls = classes.find(c => c.id === classId);
        const classCategories = categories.filter(c => c.classId === classId);
        
        // Calculate weighted average
        let weightedSum = 0;
        let totalWeight = 0;

        classCategories.forEach(category => {
            const categoryGrades = classGrades.filter(g => g.categoryId === category.id);
            if (categoryGrades.length > 0) {
                const categoryAverage = categoryGrades.reduce((sum, g) => sum + (g.percentage), 0) / categoryGrades.length;
                const weight = parseFloat(category.weight);
                weightedSum += (categoryAverage * weight);
                totalWeight += weight;
            }
        });

        const average = totalWeight > 0 ? (weightedSum / totalWeight) : 0;
        const letterGrade = getLetterGrade(average);

        return {
            classId,
            className: cls ? cls.name : 'Unknown',
            average: average.toFixed(2),
            letterGrade,
            grades: classGrades,
            categories: classCategories
        };
    });

    classArray.forEach((item, index) => {
        const classItem = document.createElement('div');
        classItem.className = 'class-item' + (index === 0 ? ' active' : '');
        classItem.innerHTML = `
            <div class="class-name">${item.className}</div>
            <div class="letter-grade" style="color: ${getGradeColor(item.letterGrade)}">${item.letterGrade}</div>
        `;
        classItem.onclick = () => selectClass(item, classArray);
        classList.appendChild(classItem);
    });

    // Show first class by default
    if (classArray.length > 0) {
        selectClass(classArray[0], classArray);
    }

    document.querySelector('.classes-container').style.display = 'grid';
    document.getElementById('noClasses').style.display = 'none';
}

function selectClass(classData, allClasses) {
    // Update active class item
    document.querySelectorAll('.class-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.class-item').classList.add('active');

    // Display assignments for this class
    const panel = document.getElementById('assignmentsPanel');
    
    let html = `
        <h3>${classData.className}</h3>
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: #f0f4ff; border-radius: 5px;">
            <strong>Class Average: <span style="color: ${getGradeColor(classData.letterGrade)}; font-size: 1.2rem;">${classData.average}%</span></strong>
            <span style="margin-left: 1rem; font-size: 1.1rem; color: ${getGradeColor(classData.letterGrade)}; font-weight: bold;">Grade: ${classData.letterGrade}</span>
        </div>
    `;

    // Group by category
    if (classData.categories && classData.categories.length > 0) {
        classData.categories.forEach(category => {
            const categoryGrades = classData.grades.filter(g => g.categoryId === category.id);
            
            if (categoryGrades.length > 0) {
                const categoryAverage = categoryGrades.reduce((sum, g) => sum + parseFloat(g.percentage), 0) / categoryGrades.length;
                
                html += `
                    <div style="margin-bottom: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 5px; border-left: 3px solid #667eea;">
                        <h4 style="color: #667eea; margin-bottom: 0.5rem;">${category.name} (${category.weight}% weight)</h4>
                        <div style="margin-bottom: 1rem; color: #555; font-weight: 600;">Category Average: ${categoryAverage.toFixed(2)}%</div>
                        <table class="assignments-table">
                            <thead>
                                <tr>
                                    <th>Assignment</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                `;

                categoryGrades.forEach(grade => {
                    const scorePercentage = parseFloat(grade.percentage);
                    const color = scorePercentage >= 80 ? '#48bb78' : scorePercentage >= 70 ? '#ed8936' : '#f56565';
                    html += `
                        <tr>
                            <td>${grade.assignment}</td>
                            <td style="color: ${color}; font-weight: bold;">${grade.score}/${grade.maxScore} (${scorePercentage}%)</td>
                        </tr>
                    `;
                });

                html += `
                            </tbody>
                        </table>
                    </div>
                `;
            }
        });
    } else {
        // No categories defined for this class
        html += `
            <table class="assignments-table">
                <thead>
                    <tr>
                        <th>Assignment</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
        `;

        classData.grades.forEach(grade => {
            const scorePercentage = parseFloat(grade.percentage);
            const color = scorePercentage >= 80 ? '#48bb78' : scorePercentage >= 70 ? '#ed8936' : '#f56565';
            html += `
                <tr>
                    <td>${grade.assignment}</td>
                    <td style="color: ${color}; font-weight: bold;">${grade.score}/${grade.maxScore} (${scorePercentage}%)</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;
    }

    panel.innerHTML = html;
}
