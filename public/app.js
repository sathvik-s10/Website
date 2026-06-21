// Fetch greeting from backend API
async function getGreeting() {
    try {
        const response = await fetch('http://localhost:3000/api/greeting');
        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch greeting. Make sure the backend server is running.');
    }
}

// Handle contact form submission
async function handleSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const responseDiv = document.getElementById('responseMessage');

    try {
        const response = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message })
        });

        const data = await response.json();

        if (response.ok) {
            responseDiv.className = 'message success';
            responseDiv.textContent = data.message;
            document.getElementById('contactForm').reset();
        } else {
            responseDiv.className = 'message error';
            responseDiv.textContent = 'Error sending message: ' + data.message;
        }
    } catch (error) {
        console.error('Error:', error);
        responseDiv.className = 'message error';
        responseDiv.textContent = 'Failed to send message. Make sure the backend server is running.';
    }

    // Clear message after 5 seconds
    setTimeout(() => {
        responseDiv.className = 'message';
    }, 5000);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
