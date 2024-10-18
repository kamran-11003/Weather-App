
# Weather App

## Overview
The **Weather App** is a web-based application that provides real-time weather updates, interactive charts, 
and a chatbot to assist users with weather-related inquiries. This project focuses on delivering an engaging 
and informative user experience by combining multiple web technologies.

## Features
- **Weather Dashboard:** Displays live weather conditions for selected locations.
- **Visual Charts:** Presents weather statistics (e.g., temperature trends, humidity levels) in an intuitive format.
- **Chatbot Integration:** Allows users to interact with a simple AI-powered chatbot for weather queries.
- **Custom Styling:** Clean and responsive CSS design for a polished look.
- **Media Assets:** Includes weather-related images and icons for better visualization.

## Prerequisites
- Visual Studio Code installed.
- **Live Server** extension installed in VS Code.
- Internet connection to fetch live weather data (if applicable).

## Installation Instructions

### Step 1: Clone the Repository
```bash
git clone <https://github.com/kamran-11003/Weather-App>
```

### Step 2: Open the Project in VS Code
1. Launch **Visual Studio Code**.
2. Go to **File** > **Open Folder**, and select the `Weather-App` folder.

### Step 3: Install Live Server Extension
1. Open the **Extensions** tab (left sidebar).
2. Search for **Live Server** and click **Install**.

### Step 4: Run the App with Live Server
1. Open the `index.html` file in VS Code.
2. Right-click inside the editor and select **"Open with Live Server"**.
3. Your browser will open with the app running at `http://127.0.0.1:5500/` or `http://localhost:5500/`.

## Project Structure
```
Weather-App/
│
├── index.html          # Main entry point of the app
├── Dashboard.html      # Dashboard for weather overview
├── Charts.html         # Displays weather-related charts
├── Chatbot.html        # AI chatbot interface
├── index.css           # Main stylesheet
├── chart.css           # Styles for charts
├── ai.css              # Chatbot styles
├── index.js            # Main JavaScript logic
├── chart.js            # Chart interactions
├── ai.js               # Chatbot functionality
├── assets/             # Media files (images, icons)
└── .git/               # Git repository files
```

## How to Use the App
1. Open the `index.html` page to start the application.
2. Use the navigation options to switch between the dashboard, charts, and chatbot sections.
3. Use the chatbot for weather-related inquiries.
