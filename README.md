# Voice-Based Patient Call System

## Overview
This project aims to develop a **voice-based patient call system** that allows patients to communicate their needs to nurses in a natural and convenient manner. The system leverages **Azure OpenAI** and **Autonomous AI Agents** to process, analyze, and prioritize patient requests.

### Key Features
- **Autonomous AI Agents**: AI-powered agents process and act upon patient requests based on predefined rules and priorities.
- **Speech Services Integration**: Converts speech to text and vice versa for seamless communication.
- **NLP-Powered Request Analysis**: Uses **Azure OpenAI** for analyzing and prioritizing patient requests.
- **Voice-Driven Communication System**: A user-friendly voice assistant for patients.
- **Nurse Mobile Application**: Displays real-time patient requests with room numbers and priority levels.
- **Improved Patient Care**: Ensures faster response times for critical requests.

---

## Getting Started

This project consists of multiple components:
- **Admin Frontend** (`admin-frontend`)
- **Admin Backend** (`npm-backend`)
- **Voice Care Connect Backend** (`voice-care-connect-backend`)
- **Voice Care Connect Frontend** (`voice-care-connect-frontend`)

### Prerequisites
Ensure you have the following installed:
- **Node.js** (Latest LTS version recommended)
- **npm** (Comes with Node.js)
- **npx** (For running Expo CLI)

---

## Installation & Setup

### 1. **Admin Frontend**
```sh
cd admin-frontend
npm install
npm start
```
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### 2. **Admin Backend**
```sh
cd npm-backend
npm install
npm start
```
Runs the backend server.

### 3. **Voice Care Connect Backend**
```sh
cd voice-care-connect-backend
npm install
npm start
```
Starts the backend server for voice care system.

### 4. **Voice Care Connect Frontend**
```sh
cd voice-care-connect-frontend
npm install
npx expo start
```
Runs the frontend for the voice care system using Expo.

---

## Available Scripts

### **Frontend (React & React Native)**
- `npm start` - Starts the development server.
- `npm run build` - Builds the project for production.
- `npx expo start` - Runs the React Native app in Expo.

### **Backend (Node.js & Express)**
- `npm start` - Starts the backend server.
- `npm test` - Runs tests (if implemented).
- `npm run build` - Builds the backend for production.

---

## Deployment
- For **React Frontend**, build and deploy using:
  ```sh
  npm run build
  ```
- For **Backend**, deploy to **Heroku, AWS, or Azure** as needed.
- For **React Native Frontend**, use **Expo Publish**:
  ```sh
  expo publish
  ```

---

## Learn More
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Azure OpenAI Documentation](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/)

---

## Troubleshooting
### `npm run build` Fails to Minify
If the production build fails, refer to the [troubleshooting guide](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify).

---

## Contributing
Feel free to fork this project, submit issues, or create pull requests to enhance the system!

---

## License
This project is licensed under the **MIT License**.
