// Admin Dashboard Functions

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('adminName').textContent = currentUser.name;
    loadClasses();
    loadStudents();
    loadGrades();
    loadClassesForGradeAssignment();
    loadCategoryClassSelect();
});

// Show/Hide sections
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    event.target.classList.add('active');

    // Refresh data when section is shown
    if (sectionId === 'classes') {
        loadClasses();
        loadCategoryClassSelect();
    } else if (sectionId === 'students') {
        loadStudents();
    } else if (sectionId === 'grades') {
        loadGrades();
        loadClassesForGradeAssignment();
    }
}

// === CLASS MANAGEMENT ===
function addClass() {
    const className = document.getElementById('className').value.trim();

    if (!className) {
        alert('Please enter a class name');
        return;
    }

    const classes = JSON.parse(localStorage.getItem('classes') || '[]');
    
    const newClass = {
        id: Date.now().toString(),
        name: className
    };

    classes.push(newClass);
    localStorage.setItem('classes', JSON.stringify(classes));
    
    document.getElementById('className').value = '';
    loadClasses();
    loadClassesForGradeAssignment();
    loadCategoryClassSelect();
    alert('✅ Class created successfully!');
}

function loadClasses() {
    const classes = JSON.parse(localStorage.getItem('classes') || '[]');
    const tbody = document.querySelector('#classesTable tbody');
    tbody.innerHTML = '';

    if (classes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #999;">No classes created yet</td></tr>';
        return;
    }

    classes.forEach(cls => {
        const grades = JSON.parse(localStorage.getItem('grades') || '[]');
        const studentsInClass = [...new Set(grades
            .filter(g => g.classId === cls.id)
            .map(g => g.studentId))].length;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${cls.name}</strong></td>
            <td>${studentsInClass}</td>
            <td>
                <button onclick="deleteClass('${cls.id}')" class="btn btn-danger btn-small">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function deleteClass(classId) {
    if (confirm('Are you sure you want to delete this class?')) {
        let classes = JSON.parse(localStorage.getItem('classes') || '[]');
        classes = classes.filter(c => c.id !== classId);
        localStorage.setItem('classes', JSON.stringify(classes));
        
        // Also delete grades and categories associated with this class
        let grades = JSON.parse(localStorage.getItem('grades') || '[]');
        grades = grades.filter(g => g.classId !== classId);
        localStorage.setItem('grades', JSON.stringify(grades));

        let categories = JSON.parse(localStorage.getItem('categories') || '[]');
        categories = categories.filter(c => c.classId !== classId);
        localStorage.setItem('categories', JSON.stringify(categories));
        
        loadClasses();
        loadGrades();
        loadClassesForGradeAssignment();
        loadCategoryClassSelect();
        alert('✅ Class deleted successfully!');
    }
}

// === CATEGORY MANAGEMENT ===
function loadCategoryClassSelect() {
    const classes = JSON.parse(localStorage.getItem('classes') || '[]');
    const select = document.getElementById('categoryClassSelect');
    select.innerHTML = '<option value="">Select a class</option>';

    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.id;
        option.textContent = cls.name;
        select.appendChild(option);
    });
}

function loadCategoriesForClass() {
    const classId = document.getElementById('categoryClassSelect').value;
    const tbody = document.querySelector('#categoriesTable tbody');
    tbody.innerHTML = '';

    if (!classId) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #999;">Select a class</td></tr>';
        return;
    }

    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const classCategories = categories.filter(c => c.classId === classId);

    if (classCategories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #999;">No categories created yet</td></tr>';
        return;
    }

    let totalWeight = 0;
    classCategories.forEach(cat => {
        totalWeight += parseFloat(cat.weight);
    });

    classCategories.forEach(cat => {
        const row = document.createElement('tr');
        const weightWarning = totalWeight > 100 ? '<span style="color: #f56565; font-size: 0.85rem;"> ⚠️ Total weight exceeds 100%</span>' : '';
        row.innerHTML = `
            <td>${cat.name}</td>
            <td>${cat.weight}%</td>
            <td>
                <button onclick="deleteCategory('${cat.id}')" class="btn btn-danger btn-small">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    if (totalWeight !== 100) {
        const warningRow = document.createElement('tr');
        warningRow.innerHTML = `<td colspan="3" style="color: #f56565; font-size: 0.9rem;">⚠️ Total weightage: ${totalWeight}% (should be 100%)</td>`;
        tbody.appendChild(warningRow);
    }
}

function addCategory() {
    const classId = document.getElementById('categoryClassSelect').value;
    const categoryName = document.getElementById('categoryName').value.trim();
    const categoryWeight = parseFloat(document.getElementById('categoryWeight').value);

    if (!classId) {
        alert('Please select a class');
        return;
    }

    if (!categoryName || !categoryWeight || categoryWeight <= 0) {
        alert('Please enter category name and valid weightage');
        return;
    }

    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const classCategories = categories.filter(c => c.classId === classId);
    
    const currentTotal = classCategories.reduce((sum, c) => sum + parseFloat(c.weight), 0);
    if (currentTotal + categoryWeight > 100) {
        alert(`Total weightage would exceed 100% (currently ${currentTotal}%)`);
        return;
    }

    const newCategory = {
        id: Date.now().toString(),
        classId: classId,
        name: categoryName,
        weight: categoryWeight
    };

    categories.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(categories));
    
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryWeight').value = '';
    
    loadCategoriesForClass();
    alert('✅ Category added successfully!');
}

function deleteCategory(categoryId) {
    if (confirm('Are you sure you want to delete this category?')) {
        let categories = JSON.parse(localStorage.getItem('categories') || '[]');
        categories = categories.filter(c => c.id !== categoryId);
        localStorage.setItem('categories', JSON.stringify(categories));
        
        loadCategoriesForClass();
        alert('✅ Category deleted successfully!');
    }
}

// === STUDENT MANAGEMENT ===
function addStudent() {
    const studentName = document.getElementById('studentName').value.trim();
    const studentEmail = document.getElementById('studentEmail').value.trim();
    const studentId = document.getElementById('studentId').value.trim();

    if (!studentName || !studentEmail || !studentId) {
        alert('Please fill in all fields');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if student ID already exists
    if (users.find(u => u.id === studentId)) {
        alert('Student ID already exists');
        return;
    }

    const newStudent = {
        id: studentId,
        username: studentId,
        password: 'pass123',
        role: 'student',
        name: studentName,
        email: studentEmail
    };

    users.push(newStudent);
    localStorage.setItem('users', JSON.stringify(users));
    
    document.getElementById('studentName').value = '';
    document.getElementById('studentEmail').value = '';
    document.getElementById('studentId').value = '';
    
    loadStudents();
    alert('✅ Student added successfully! Default password is "pass123"');
}

function loadStudents() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const students = users.filter(u => u.role === 'student');
    const tbody = document.querySelector('#studentsTable tbody');
    tbody.innerHTML = '';

    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">No students added yet</td></tr>';
        return;
    }

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.id}</td>
            <td>
                <button onclick="deleteStudent('${student.id}')" class="btn btn-danger btn-small">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student? Their grades will also be deleted.')) {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.filter(u => u.id !== studentId);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Delete grades for this student
        let grades = JSON.parse(localStorage.getItem('grades') || '[]');
        grades = grades.filter(g => g.studentId !== studentId);
        localStorage.setItem('grades', JSON.stringify(grades));
        
        loadStudents();
        loadGrades();
        alert('✅ Student deleted successfully!');
    }
}

// === GRADE ASSIGNMENT ===
function loadClassesForGradeAssignment() {
    const classes = JSON.parse(localStorage.getItem('classes') || '[]');
    const select = document.getElementById('gradeClassSelect');
    select.innerHTML = '<option value="">Select a class</option>';

    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.id;
        option.textContent = cls.name;
        select.appendChild(option);
    });
}

function loadStudentsAndCategoriesForClass() {
    const classId = document.getElementById('gradeClassSelect').value;
    
    // Load students
    const studentSelect = document.getElementById('gradeStudentSelect');
    studentSelect.innerHTML = '<option value="">Select a student</option>';

    if (!classId) {
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const students = users.filter(u => u.role === 'student');

    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = student.name;
        studentSelect.appendChild(option);
    });

    // Load categories
    const categorySelect = document.getElementById('gradeCategory');
    categorySelect.innerHTML = '<option value="">Select a category</option>';

    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const classCategories = categories.filter(c => c.classId === classId);

    classCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
    });
}

function assignGrade() {
    const classId = document.getElementById('gradeClassSelect').value;
    const studentId = document.getElementById('gradeStudentSelect').value;
    const categoryId = document.getElementById('gradeCategory').value;
    const assignmentName = document.getElementById('assignmentName').value.trim();
    const scoreValue = parseFloat(document.getElementById('scoreValue').value);
    const maxScore = parseFloat(document.getElementById('maxScore').value);

    if (!classId || !studentId || !categoryId || !assignmentName || !scoreValue || !maxScore) {
        alert('Please fill in all fields');
        return;
    }

    if (scoreValue > maxScore) {
        alert('Score cannot be greater than max score');
        return;
    }

    const grades = JSON.parse(localStorage.getItem('grades') || '[]');
    
    const newGrade = {
        id: Date.now().toString(),
        classId: classId,
        studentId: studentId,
        categoryId: categoryId,
        assignment: assignmentName,
        score: scoreValue,
        maxScore: maxScore,
        percentage: ((scoreValue / maxScore) * 100).toFixed(2),
        date: new Date().toLocaleDateString()
    };

    grades.push(newGrade);
    localStorage.setItem('grades', JSON.stringify(grades));
    
    document.getElementById('gradeClassSelect').value = '';
    document.getElementById('gradeStudentSelect').value = '';
    document.getElementById('gradeCategory').value = '';
    document.getElementById('assignmentName').value = '';
    document.getElementById('scoreValue').value = '';
    document.getElementById('maxScore').value = '';
    
    loadGrades();
    alert('✅ Grade assigned successfully!');
}

function loadGrades() {
    const grades = JSON.parse(localStorage.getItem('grades') || '[]');
    const classes = JSON.parse(localStorage.getItem('classes') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const tbody = document.querySelector('#gradesTable tbody');
    tbody.innerHTML = '';

    if (grades.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No grades assigned yet</td></tr>';
        return;
    }

    grades.forEach(grade => {
        const cls = classes.find(c => c.id === grade.classId);
        const student = users.find(u => u.id === grade.studentId);
        const category = categories.find(c => c.id === grade.categoryId);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cls ? cls.name : 'Unknown'}</td>
            <td>${student ? student.name : 'Unknown'}</td>
            <td>${grade.assignment}</td>
            <td>${category ? category.name : 'Unknown'}</td>
            <td><strong>${grade.score}/${grade.maxScore} (${grade.percentage}%)</strong></td>
            <td>
                <button onclick="deleteGrade('${grade.id}')" class="btn btn-danger btn-small">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function deleteGrade(gradeId) {
    if (confirm('Are you sure you want to delete this grade?')) {
        let grades = JSON.parse(localStorage.getItem('grades') || '[]');
        grades = grades.filter(g => g.id !== gradeId);
        localStorage.setItem('grades', JSON.stringify(grades));
        loadGrades();
        alert('✅ Grade deleted successfully!');
    }
}
