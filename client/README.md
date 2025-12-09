# **Tick-M Events — Frontend**

**Live URL:** [https://tick-m.cloud/](https://tick-m.cloud/)
**Admin Dashboard:** React + Vite + Material UI

Tick-M Events Frontend is a modern React Admin Dashboard built with **Vite.js**, **Material UI**, **Redux Toolkit**, and **Socket.io**.
It powers the Admin Panel for managing events, tickets, users, notifications, QR scanning, and more.

---

## 🚀 **Tech Stack**

* **React 18**
* **Vite.js**
* **Material UI (MUI v5)**
* **Redux Toolkit**
* **React Router v6**
* **Socket.IO Client**
* **Firebase**
* **ApexCharts / Recharts / Chart.js**
* **TypeScript**

---

## 📄 **Pages Included**

* **Dashboard**
* **Users Management**
* **Events Management**
* **Products**
* **Blog**
* **Sign In / Authentication**
* **404 Not Found**
* **QR Scanner**
* **Event Insights**
* **Ticket Management**
* **Real-time Notifications**

---

## ⚙️ **System Requirements**

* **Node.js v20.x (Recommended)**
* **Yarn or npm**
* **Vite 5+**

---

## 🛠️ **Installation**

Clone the repository:

```bash
git clone https://github.com/nitinsahu-sahu/tick-m-events.git
cd tick-m-events
```

Install packages:

```bash
npm install
# or
yarn install
```

---

## ▶️ **Running the Project**

### **Development Mode**

```bash
npm run dev
# OR
yarn dev
```

Local development URL:

```
http://localhost:3039
```

---

### 🌐 **Build for Production**

```bash
npm run build
# OR
yarn build
```

Preview build output:

```bash
npm start
# OR
yarn start
```

---

## 📁 **Project Structure**

```
Tick-m-events/
│── public/
│── src/
│   ├── components/
│   ├── layouts/
│   ├── sections/
│   ├── pages/
│   ├── routes/
│   ├── utils/
│   ├── hooks/
│   ├── redux/
│   └── App.tsx
│── index.html
│── tsconfig.json
│── package.json
│── vite.config.js
│── README.md
```

---

## 🔌 **Socket Configuration**

Make sure your `.env` contains:

```
VITE_SOCKET_URL=https://tick-m.cloud:8001
VITE_API_URL=https://tick-m.cloud:8000
```

---

## 🧪 **Testing the Application**

UI elements are based on Minimal UI Kit:
[https://github.com/minimal-ui-kit/material-kit-react/tree/main/src](https://github.com/minimal-ui-kit/material-kit-react/tree/main/src)

Use your browser or API-connected components to test:

* SignIn flow
* Events dashboard
* Ticket scanning (QR scan page)
* Real-time socket updates
* CRUD operations

---

## 📜 **Scripts Overview**

```json
"scripts": {
  "dev": "vite",
  "start": "vite preview",
  "build": "tsc && vite build",
  "lint": "eslint \"src/**/*.{js,jsx,ts,tsx}\"",
  "lint:fix": "eslint --fix \"src/**/*.{js,jsx,ts,tsx}\"",
  "fm:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx}\"",
  "fm:fix": "prettier --write \"src/**/*.{js,jsx,ts,tsx}\"",
  "rm:all": "rm -rf node_modules .next out dist build",
  "re:start": "yarn rm:all && yarn install && yarn dev",
  "re:build": "yarn rm:all && yarn install && yarn build",
  "dev:host": "vite --host"
}
```

---

## 📞 **Contact**

For any support or queries:

**Email:** [support@tick-m.cloud](mailto:support@tick-m.cloud)
**Website:** [https://tick-m.cloud/](https://tick-m.cloud/)

---

## 📄 **License**

Licensed under **MIT License**.

---

