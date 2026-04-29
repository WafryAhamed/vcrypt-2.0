# <div align="center">🚗 vCrypt — Vehicle Registry & Transfer (v2.0)</div>

<div align="center">

### 🔐 Blockchain-Based Vehicle Ownership System

<p>
A professional full-stack decentralized application (dApp) for secure vehicle registration, verification, and ownership transfer using smart contracts.
</p>


### 🧰 Tech Stack

<p align="center">

<img src="https://skillicons.dev/icons?i=solidity,react,nodejs,express,postgres,prisma,tailwind,typescript,js,git,docker" />

</p>


<p align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen)
![Status](https://img.shields.io/badge/status-active-success)

</p>

</div>

---

## ✨ Features

✔ Smart Contract-based Vehicle Registry
<br>
✔ Secure Ownership Transfer (Blockchain Verified)<br>
✔ Wallet Authentication (SIWE - Sign in with Ethereum)<br>
✔ Backend API with Event Handling<br>
✔ Modern React Frontend with Web3 Integration<br>
✔ Role-based System (User / Officer / Admin)<br>
✔ Real-time Notifications & Transaction Logs



## 🏗️ Project Structure

```
vCrypt/
│
├── blockchain/        # Smart contracts (Hardhat)
├── server/            # Backend API (Node + Express)
├── client/            # Frontend (React + Vite)
```

---

## 👥 User Roles & Functionalities

### 👤 Visitor

* Browse homepage & documentation
* View demo screenshots
* Connect wallet (WalletConnect / Injected)

---

### 🚗 Vehicle Owner

* Register vehicle (VIN, model, year)
* View “My Vehicles” dashboard
* Verify vehicle status (on-chain)
* Request ownership transfer
* Download CSV reports
* Receive notifications

---

### 🛂 Officer

* Approve / Reject registrations
* Review documents & logs
* Search vehicles (VIN, year, status)

---

### 🧑‍💼 Admin

* Dashboard analytics (vehicles, approvals)
* Manage users & roles
* Export system reports
* Configure API & deployment settings

---

### 🌐 Authenticated Users

* Global vehicle search
* Transaction history
* View blockchain records
* Real-time updates



## ⚡ Quick Setup

### 1️⃣ Clone Repository

```bash
git clone <repo-url>
cd vCrypt
```

---

### 2️⃣ Blockchain Setup

```bash
cd blockchain
npm install
npx hardhat node
npx hardhat compile
npx hardhat test
```


### 3️⃣ Backend Setup

```bash
cd server
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

---

### 4️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create `.env` files in each module:

```
RPC_URL=
PRIVATE_KEY=
CONTRACT_ADDRESS=
DATABASE_URL=
VITE_API_URL=
```

⚠️ Never commit `.env` files


## 🧪 Testing

* Smart Contracts → `npx hardhat test`
* Backend → Add Jest/Mocha
* Frontend → Run locally & test UI



## 🔌 API Overview

| Method | Endpoint               | Description        |
| ------ | ---------------------- | ------------------ |
| GET    | /api/auth/nonce        | Get SIWE nonce     |
| POST   | /api/auth/siwe         | Login with wallet  |
| POST   | /api/vehicles/register | Register vehicle   |
| GET    | /api/vehicles/my       | Get user vehicles  |
| POST   | /api/vehicles/transfer | Transfer ownership |




## 🤝 Contributing

* Fork repository
* Create feature branch
* Submit pull request



## 📄 License

MIT License


