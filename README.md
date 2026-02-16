# Wobsocket2 - AI Chat Application

An interactive chat application powered by WebSockets and Google's Gemini AI. This project features a React frontend and an Express backend, enabling real-time communication with an AI assistant.

## Tech Stack

### Frontend
-   **React**: UI Library
-   **Vite**: Build Tool
-   **Tailwind CSS**: Styling
-   **Socket.IO Client**: Real-time communication

### Backend
-   **Node.js & Express**: Server framework
-   **Socket.IO**: Real-time event-based communication
-   **Google Gemini AI**: Generative AI model integration (`@google/genai`)

## Features
-   **Real-time Chat**: Instant messaging with AI responses via WebSockets.
-   **Context Awareness**: Maintains chat history per session for context-aware responses.
-   **Responsive UI**: Modern, responsive interface built with Tailwind CSS.
-   **Environment Configuration**: Easy setup with environment variables for deployment.

## Prerequisites

-   Node.js (v14 or later recommended)
-   npm (Node Package Manager)
-   A Google Gemini API Key

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd wobsocket2
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd Backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../Frontend
    npm install
    ```

## Configuration

### Backend
1.  Navigate to the `Backend` directory.
2.  Create a `.env` file based on `.env.example`:
    ```env
    PORT=3000
    FRONTEND_URL=http://localhost:5173
    GOOGLE_API_KEY=YOUR_GEMINI_API_KEY
    ```

### Frontend
1.  Navigate to the `Frontend` directory.
2.  Create a `.env` file based on `.env.example`:
    ```env
    VITE_API_URL=http://localhost:3000
    ```

## Running the Application

1.  **Start the Backend Server:**
    ```bash
    cd Backend
    npm start
    ```
    The server will run on `http://localhost:3000`.

2.  **Start the Frontend Development Server:**
    ```bash
    cd Frontend
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173`.

## Deployment

The project is configured for deployment with environment variables.
-   **Frontend**: Build for production using `npm run build`.
-   **Backend**: Use standard Node.js deployment practices. Ensure environment variables are set on your hosting platform.

## Project Structure

```
wobsocket2/
├── Backend/          # Express server with Socket.IO and AI integration
│   ├── src/          # Source files
│   ├── server.js     # Main server entry point
│   └── package.json
└── Frontend/         # React application
    ├── src/          # Source files
    └── vite.config.js
```
