# My Website

A modern landing page with a Node.js/Express backend API.

## Project Structure

```
d:\Website
├── public/
│   ├── index.html      # Main HTML file
│   ├── style.css       # Styling
│   └── app.js          # Frontend JavaScript
├── src/
│   └── server.js       # Express server
├── package.json        # Node.js dependencies
└── README.md          # This file
```

## Setup Instructions

### 1. Install Dependencies

Open a terminal in the `d:\Website` directory and run:

```bash
npm install
```

This will install Express and CORS dependencies from `package.json`.

### 2. Start the Server

Run the following command:

```bash
npm start
```

Or directly:

```bash
node src/server.js
```

You should see:
```
🚀 Server is running on http://localhost:3000
📝 Open http://localhost:3000 in your browser
```

### 3. Open in Browser

Navigate to: **http://localhost:3000**

## Features

- **Modern Landing Page**: Responsive design with navigation
- **API Endpoints**:
  - `GET /api/greeting` - Returns a greeting message
  - `POST /api/contact` - Handles contact form submissions
- **Frontend Interactions**: Buttons and forms communicate with the backend
- **Smooth Scrolling**: Smooth navigation between sections
- **Responsive Design**: Works on desktop and mobile devices

## API Documentation

### GET /api/greeting

Returns a welcome message from the backend.

**Response:**
```json
{
  "message": "👋 Hello! Welcome to the API..."
}
```

### POST /api/contact

Accepts contact form data.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello!"
}
```

**Response:**
```json
{
  "message": "Thank you, John Doe! Your message has been received..."
}
```

## Next Steps

1. Customize the content in `public/index.html`
2. Modify styles in `public/style.css`
3. Add more API endpoints in `src/server.js`
4. Connect to a database for storing messages
5. Deploy to a hosting service

## Troubleshooting

**Frontend can't connect to API?**
- Make sure the backend server is running (`npm start`)
- Check that port 3000 is not in use by another application
- Check browser console for errors (F12 → Console tab)

**Port 3000 already in use?**
Edit `src/server.js` and change the PORT variable to another number (e.g., 3001)

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Styling**: Custom CSS with gradients and animations
- **Middleware**: CORS for cross-origin requests
