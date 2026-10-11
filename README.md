# SigmaGPT — Full Stack AI Chat Application

SigmaGPT is a full-stack AI chat application that allows users to interact with a locally running AI model. It features user authentication, persistent conversations, and chat history management.

## 🚀 Features

* **User Authentication:** Secure signup and login using JWT authentication.
* **AI-Powered Chat:** Generate responses using the locally running Ollama AI model.
* **Conversation Management:** Create and manage multiple conversations.
* **Persistent Chat History:** Store conversations and messages in MongoDB.
* **Chat History Retrieval:** Reopen previous conversations, including after refreshing the page.
* **Multiple Chat Modes:** Support for chat, code, debug, explain, write, and optimize modes.
* **Responsive Frontend:** Built with React and Vite.

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Tokens (JWT)

### AI Integration

* Ollama
* Llama 3.2 1B

## 📁 Project Structure

```text
SigmaGPT/
├── server/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js
│
├── sigmagpt/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## ⚙️ Prerequisites

Before running SigmaGPT, make sure you have installed:

* Node.js and npm
* MongoDB or a MongoDB connection URI
* Ollama

## 💻 Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Tanvi-gupta-cmd/SigmaGPT.git
cd SigmaGPT
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Replace the placeholder values with your actual configuration. Never upload your `.env` file or secrets to GitHub.

### 4. Install and Run Ollama

Install Ollama from its official website:

https://ollama.com/

Download the model:

```bash
ollama pull llama3.2:1b
```

Make sure Ollama is running locally and accessible at:

```text
http://localhost:11434
```

### 5. Start the Backend

From the `server` directory, run:

```bash
npm run dev
```

If the project does not have a development script, use the appropriate start command configured in `server/package.json`.

The backend should run at:

```text
http://localhost:5000
```

### 6. Start the Frontend

Open a new terminal:

```bash
cd sigmagpt
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

## 🔐 Environment Variables

| Variable     | Description                               |
| ------------ | ----------------------------------------- |
| `PORT`       | Backend server port                       |
| `MONGO_URI`  | MongoDB connection string                 |
| `JWT_SECRET` | Secret used to sign authentication tokens |

## 🤖 How AI Responses Work

SigmaGPT sends user prompts from the React frontend to its Express backend. The backend communicates with the locally running Ollama service, which generates a response using the Llama 3.2 1B model.

Conversation messages are stored in MongoDB so users can reopen previous chats.

## 🔒 Security Notes

* Keep environment variables and credentials private.
* Never commit `.env` files to GitHub.
* Use a strong, private JWT secret.
* Configure appropriate CORS settings before deployment.

## 🌐 Deployment Notes

The application currently uses a local Ollama model. Making the frontend and backend publicly accessible does not automatically make the local AI model available online.

For a public deployment, configure a backend environment that can securely access the AI model and database.

## 👩‍💻 Author

**Tanvi Kumari**

* GitHub: [Tanvi-gupta-cmd](https://github.com/Tanvi-gupta-cmd)

## 📄 License

This project is available for learning and portfolio purposes. Add a license file if you intend to distribute it under a specific open-source license.
