# 🚀Event-Ticketing-System.

A blockchain-powered platform to manage the event ticketing system.

Where data are stored on-chain as encrypted data. Consumers have full control over the transparency of the tickets as well as the betting system for bidding the tickets as well as the royalties to the event organizer. Tickets are created in the form of NFTs for the Blockchain system and transparency.

🛠Built for KRACKHACK 2025


## 🚀 Installation & Setup


1. Clone the repository:
 ```
   git clone https://github.com/paul-abhirup/Event-Ticketing-System

   cd Even-Ticketing-System
```

2. Install Dependencies:
    ```
   npm install
   ```
   do this step in frontendAPP Directory , backend directory. not needed for the blockchain layer 

3. Add .env file 

```bash
# Blockchain  .env add this to the blockchain directory

POLYGON_RPC_URL=
POLYGONSCAN_API_KEY=
ETHERSCAN_API_KEY=

```
```bash
# For Backend Code  .env add this to the backend directory

REACT_APP_API_URL=http://localhost:3005
# This url is for the backend api url where the api is backend is hosted

SUPABASE_URL=
SUPABASE_ANON_KEY=
BLOCKCHAIN_RPC_URL=
PRIVATE_KEY=
TICKET_NFT_ADDRESS=0x459607044C0494585868F4620b9943CD022de465
MARKETPLACE_ADDRESS=0x0e345F3E98cc8fc34F1DB5C1Ae496F743401bdB6
REDIS_URL=
JWT_SECRET="your-secret-key-here"
PORT=3005
FRONTEND_URL=http://localhost:3000
SUPABASE_SERVICE_KEY=
```

```bash
# For the Frontend Code add this .env to the frontendAPP directory
REACT_APP_TICKET_NFT_ADDRESS=0x459607044C0494585868F4620b9943CD022de465

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_URL=http://localhost:3005
# This url is for the backend api url where the api is backend is hosted

VITE_WS_URL=ws://localhost:3005/ws

```
   
5. Start the development server:
    
```
   npm run dev 
```

6. Open http://localhost:3000/ in your browser it is where the frontned is hosted and the backend is hosted in ttp://localhost:3005/ .

## 🎥Demo
 
 [Check out the live demo: website link here](https://youtu.be/hPd_FLQjVGQ).

 ## 📁 Repository Structure

```bash
ticketing-system/
├── frontend/ 🖥️ React UI
│ ├── src/
│ │ ├── components/ 🧩 (Navbar, TicketCard, MarketListings)
│ │ ├── pages/ 🏠 (Home, Login, Dashboard, Marketplace)
│ │ ├── styles/ 🎨 Tailwind/Framer Motion configs
│ │ ├── utils/ ⚙️ Web3/API helpers
│ │ ├── App.jsx 🚀 Root component
│ │ └── main.jsx ⚛️ React entry
│ ├── public/ 🌐 Static assets
│ ├── tailwind.config.js 🌀 Tailwind setup
│ └── vite.config.js ⚡ Build config

├── backend/ ⚙️ Express API
│ ├── src/
│ │ ├── routes/ 🛣️ (auth.js, tickets.js, market.js)
│ │ ├── controllers/ 🎮 Business logic
│ │ ├── middleware/ 🔐 Auth/rate limiting
│ │ ├── supabase/ 🗄️ DB client config
│ │ └── server.js 🚪 Entry point
│ ├── redis/ 🚦 Rate limiting config
│ └── .env.example 🔒 Env template

├── contracts/ ⛓️ Solidity Smart Contracts
│ ├── TicketNFT.sol 🎫 NFT ticket logic
│ ├── Marketplace.sol 💹 Resale/bidding logic
│ ├── tests/ 🧪 Hardhat test suite
│ └── scripts/ 📜 Deployment scripts

├── scripts/ 🤖 Automation
│ ├── deploy/ 🚀 Contract deployment
│ ├── monitor/ 📊 Blockchain event watchers
│ └── test/ ✅ E2E test scripts

├── docs/ 📚 Documentation
│ ├── ARCHITECTURE.md 🏗️ System design
│ ├── API_REFERENCE.md 📡 Endpoint specs
│ └── USER_GUIDE.md 👩💻 Setup instructions

├── .github/ 🤝 CI/CD
│ └── workflows/ 🚦 GitHub Actions

├── .env 🔐 Environment variables
├── docker-compose.yml 🐳 Container setup
├── package.json 📦 Dependency management
└── README.md 📖 You are here!
```

## Summary of Codebase
1. Backend (backend/)
Tech Stack: Node.js, Express.js, SQL
```
Functionality:
               Manages API routes, middleware, and services.
               Handles ticket-related blockchain interactions.
               Stores smart contract details in Marketplace.json and TicketNFT.json.
               schema.sql suggests database integration.
```
 
3. Blockchain (blockchain/)
Tech Stack: Hardhat, Solidity
```
Functionality:
              Contains smart contracts, deployment scripts, and testing framework.
              hardhat.config.js defines the blockchain development setup.
```
   
5. Frontend (frontendAPP/)
Tech Stack: React (TypeScript), Vite, TailwindCSS
```
Functionality:
             Implements UI components, pages, and services for the app.
             Uses TypeScript for type safety.
             Configured with ESLint and PostCSS for styling.
             Likely fetches data from the backend and interacts with blockchain smart contracts.
```
---
   

 ## ✨Features
 - 🕵️Fraud Prevention: NFT-based tickets are tamper-proof and verifiable on-chain, sliminating duplication or forgery.

-  💵Fair Pricing: Smart contracts enfore maximum resale prices and royalties to prevent scalping while ensuring fair comensation for organizers.

-  📢Transparency: All transactions are recorded on the blockchain and are publicly verifiable.
 
-  ⛓️Decentralization: The system removes reliance on centralized platforms by enabling direct interactions between users via smart contracts.

- 🎨User-Friendly Design: Integrates familiar tools like wallets (MetaMask) with off-chain storage(supabase) to provide a seamless experience even for non-crypto-savy users.

- 🔒Security: The system uses Metamask for authentication and Supabase for off-chain storage, ensuring a secure and reliable platform.

 - 📦Scalability: The system is designed to handle a large number of users and transactions, making it suitable for large-scale events.
 
 - Anti-Bot Feature : The User cant use Bots to buy multiple tickets 
---
 ## 💾System Architecture


![system archtecture dark mode](https://github.com/user-attachments/assets/41e09103-c6dc-4423-a3a1-b01ade33bba9)

 
---
 ## 🛠Tech Stack
 - **Frontend:** React, Tailwind CSS, Framer Motion, 
 - **Backend:** Node.js, Express
 - **Database:** Supabase
 - **Blockchain:** Ethereum/Polygon
 - **Smart Contracts:** Solidity
 - **Real-Time:** Redis and Websocket
 - **Authentication:** Metamask Authentication and Supabase Authentication
---

## **App workflow**

Here’s how to design the authentication and user experience:

### **1. Wallet Authentication**
- **Flow**:
    1. User clicks "Connect Wallet".
    2. Frontend prompts user to sign a message using their wallet.
    3. Backend verifies the signature and issues a JWT. 
    4. JWT is stored in the frontend (e.g., localStorage) for subsequent requests.
        
- **Features**:    
    - Support for multiple wallets (MetaMask, WalletConnect, etc.).
    - Session persistence (user stays logged in across page refreshes).

### **2. User Registration**
- **Flow**:    
    1. User connects their wallet.
    2. User provides an email address.
    3. Backend links the wallet address to the email and creates a user profile in Supabase.
        
- **Features**:    
    - Email verification (optional).
    - Profile management (update email, view transaction history).
        

### **3. Event Discovery**
- **Flow**:    
    1. User browses the home page for upcoming events.
    2. User clicks on an event to view details (date, venue, ticket prices).
        
- **Features**:
    - Filter events by date, location, or price.
    - Display event highlights (e.g., popular events, sold-out events).
        

### **4. Ticket Purchase**
- **Flow**:
    
    1. User selects a ticket and clicks "Buy".        
    2. Frontend initiates a transaction to mint the ticket NFT.        
    3. Backend handles the transaction and updates the user’s ticket list.
        
- **Features**:    
    - Gas fee estimation.        
    - Transaction status updates (pending, confirmed, failed).
        

### **5. Ticket Management**
- **Flow**:
    1. User navigates to their profile page.
    2. User views their owned tickets.
    3. User can list tickets for resale or transfer them to another wallet.
        
- **Features**:    
    - Display ticket details (event, seat info, QR code).        
    - Allow users to list tickets with a fixed price or auction.
        

### **6. Marketplace Interaction**
- **Flow**:    
    1. User browses the marketplace for resold tickets.        
    2. User can place a bid or buy a ticket directly.        
    3. Backend handles the transaction and updates the marketplace.
        
- **Features**:    
    - Sort listings by price, date, or event.        
    - Real-time bid updates.
        

### **7. Event Attendance**
- **Flow**:    
    1. User presents their ticket (QR code) at the event.        
    2. Event organizer scans the QR code and validates the ticket on-chain.
        
- **Features**:
    - QR code generation for each ticket.        
    - On-chain validation to prevent fraud.
        

### **8. Post-Event**
- **Flow**:
    1. User views their transaction history and royalties earned (if applicable).        
    2. User can provide feedback or rate the event.
        
- **Features**:    
    - Display transaction history (minting, buying, selling).        
    - Show royalties earned from resales.
        



# Smart-Contract Verification

```
# TicketNFT deployed to: 0x459607044C0494585868F4620b9943CD022de465
# Marketplace deployed to: 0x0e345F3E98cc8fc34F1DB5C1Ae496F743401bdB6
```
You can verify the smart contact using **EtherScan** or **PolygonScan**

 ## 🏆 Team Members
 
 -**Abhirup Paul**
 -**Ankit Suthar**
