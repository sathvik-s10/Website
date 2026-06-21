// Initialize authentication system
function initAuth() {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        // User is logged in, redirect based on role
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'index.html' || currentPage === '') {
            if (currentUser.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'student-dashboard.html';
            }
        }
    } else {
        // User is not logged in
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'admin-dashboard.html' || currentPage === 'student-dashboard.html') {
            window.location.href = 'index.html';
        }
    }
}

// Initialize sample data on first load
function initializeSampleData() {
    if (!localStorage.getItem('initialized')) {
        // Create admin account
        const admin = {
            id: 'admin',
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            name: 'Administrator'
        };

        // Create sample students
        const students = [
            {
                id: 'student1',
                username: 'student1',
                password: 'pass123',
                role: 'student',
                name: 'John Smith',
                email: 'john@school.com'
            },
            {
                id: 'student2',
                username: 'student2',
                password: 'pass123',
                role: 'student',
                name: 'Emma Johnson',
                email: 'emma@school.com'
            },
            {
                id: 'student3',
                username: 'student3',
                password: 'pass123',
                role: 'student',
                name: 'Alex Wilson',
                email: 'alex@school.com'
            }
        ];

        // Store users
        let users = [admin, ...students];
        localStorage.setItem('users', JSON.stringify(users));

        // Create sample classes
        const classes = [
            { id: '1', name: 'Mathematics 101' },
            { id: '2', name: 'English Literature' },
            { id: '3', name: 'Physics 101' }
        ];
        localStorage.setItem('classes', JSON.stringify(classes));

        // Create sample categories
        const categories = [
            { id: 'cat1', classId: '1', name: 'Homework', weight: 40 },
            { id: 'cat2', classId: '1', name: 'Labs', weight: 30 },
            { id: 'cat3', classId: '1', name: 'Exams', weight: 30 },
            { id: 'cat4', classId: '2', name: 'Participation', weight: 20 },
            { id: 'cat5', classId: '2', name: 'Essays', weight: 50 },
            { id: 'cat6', classId: '2', name: 'Final Project', weight: 30 },
            { id: 'cat7', classId: '3', name: 'Homework', weight: 30 },
            { id: 'cat8', classId: '3', name: 'Lab Work', weight: 40 },
            { id: 'cat9', classId: '3', name: 'Exams', weight: 30 }
        ];
        localStorage.setItem('categories', JSON.stringify(categories));

        // Create sample grades with the new format
        const grades = [
            { id: 'g1', classId: '1', studentId: 'student1', categoryId: 'cat1', assignment: 'Homework 1', score: 85, maxScore: 100, percentage: 85, date: '6/15/2026' },
            { id: 'g2', classId: '1', studentId: 'student1', categoryId: 'cat1', assignment: 'Homework 2', score: 92, maxScore: 100, percentage: 92, date: '6/16/2026' },
            { id: 'g3', classId: '1', studentId: 'student1', categoryId: 'cat2', assignment: 'Lab 1', score: 38, maxScore: 50, percentage: 76, date: '6/17/2026' },
            { id: 'g4', classId: '1', studentId: 'student1', categoryId: 'cat3', assignment: 'Midterm Exam', score: 88, maxScore: 100, percentage: 88, date: '6/18/2026' },
            { id: 'g5', classId: '2', studentId: 'student1', categoryId: 'cat4', assignment: 'Class Participation', score: 90, maxScore: 100, percentage: 90, date: '6/15/2026' },
            { id: 'g6', classId: '2', studentId: 'student1', categoryId: 'cat5', assignment: 'Essay 1', score: 78, maxScore: 100, percentage: 78, date: '6/16/2026' }
        ];
        localStorage.setItem('grades', JSON.stringify(grades));
        localStorage.setItem('initialized', 'true');
    }
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMessage');

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user with matching credentials
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Store current user session
        localStorage.setItem('currentUser', JSON.stringify(user));
        errorMsg.classList.remove('show');
        
        // Redirect based on role
        if (user.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'student-dashboard.html';
        }
    } else {
        errorMsg.textContent = '❌ Invalid username or password';
        errorMsg.classList.add('show');
    }
}

// Get current logged-in user
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeSampleData();
    initAuth();
});
