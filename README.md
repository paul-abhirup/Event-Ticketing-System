# 🚀Event-Ticketing-System.

A blockchain-powered platform to manage the event ticketing system.

Where data are stored on-chain as encrypted data. Consumers have full control over the transparency of the tickets as well as the betting system for bidding the tickets as well as the royalties to the event organizer. Tickets are created in the form of NFTs for the Blockchain system and transparency.

🛠Built for KRACKHACK 2025


## 🚀 Installation & Setup


1. Clone the repository:
 
   git clone https://github.com/paul-abhirup/Event-Ticketing-System

   cd Even-Ticketing-System


2. Install Dependencies:
    
   npm install

   do this step in frontendAPP, backend, blockchain directory.


4. Start the development server:
    
   npm run dev 


5. Open http://localhost:3005/ in your browser.

## 🎥Demo
 
 Check out the live demo: website link here.

 Watch our demo video: youtube video here.

 ![Screenshot_1]
 ![Screenshot_2]
 ![Screenshot_3]
 ![Screenshot_4]

 ## 📁 Repository Structure


📦 repository-root ├── 🗂 backend # Backend server using Node.js & Express │ ├── 📂 src # Source code │ │ ├── 📂 controllers # Handles business logic │ │ ├── 📂 middleware # Middleware for authentication, logging, etc. │ │ ├── 📂 routes # API route handlers │ │ ├── 📂 services # External service interactions │ │ ├── 📂 utils # Utility functions │ │ ├── 📜 app.js # Main Express app │ │ ├── 📜 server.js # Server entry point │ │ ├── 📜 Marketplace.json # Smart contract ABI │ │ ├── 📜 TicketNFT.json # Ticket NFT Smart Contract ABI │ │ ├── 📜 package.json # Backend dependencies │ │ ├── 📜 package-lock.json # Lock file for package versions │ │ ├── 📜 schema.sql # SQL schema for database ├── 🗂 blockchain # Blockchain smart contracts │ ├── 📂 contracts # Solidity smart contracts │ ├── 📂 ignition # Contract deployment automation │ ├── 📂 scripts # Deployment/testing scripts │ ├── 📂 test # Blockchain testing scripts │ ├── 📜 hardhat.config.js # Hardhat configuration │ ├── 📜 package.json # Blockchain dependencies │ ├── 📜 package-lock.json # Lock file for package versions │ ├── 📜 README.md # Documentation for blockchain setup ├── 🗂 frontendAPP # Frontend React application │ ├── 📂 src # Source code │ │ ├── 📂 components # Reusable UI components │ │ ├── 📂 lib # Utility functions/libraries │ │ ├── 📂 pages # Page components │ │ ├── 📂 services # API & blockchain interactions │ │ ├── 📂 types # TypeScript interfaces/types │ │ ├── 📂 utils # Helper functions │ │ ├── 📜 App.tsx # Main React component │ │ ├── 📜 index.css # Global styles │ │ ├── 📜 main.tsx # React entry point │ │ ├── 📜 vite-env.d.ts # Environment types │ ├── 📜 index.html # Root HTML file │ ├── 📜 eslint.config.js # ESLint configuration │ ├── 📜 package.json # Frontend dependencies │ ├── 📜 package-lock.json # Lock file for package versions │ ├── 📜 postcss.config.js # PostCSS configuration │ ├── 📜 tailwind.config.js # TailwindCSS configuration │ ├── 📜 tickets_rows.csv # Sample ticket data │ ├── 📜 tsconfig.app.json # TypeScript config for frontend │ ├── 📜 tsconfig.json # General TypeScript config │ ├── 📜 tsconfig.node.json # TypeScript config for Node.js │ ├── 📜 vite.config.ts # Vite configuration ├── 🗂 frontend-test # Possibly for testing frontend components ├── 📜 LICENSE # License file ├── 📜 .gitignore # Ignored files for Git

## Summary of Codebase
1. Backend (backend/)
Tech Stack: Node.js, Express.js, SQL
Functionality:
               Manages API routes, middleware, and services.
               Handles ticket-related blockchain interactions.
               Stores smart contract details in Marketplace.json and TicketNFT.json.
               schema.sql suggests database integration.

 
2. Blockchain (blockchain/)
Tech Stack: Hardhat, Solidity
Functionality:
              Contains smart contracts, deployment scripts, and testing framework.
              hardhat.config.js defines the blockchain development setup.

   
4. Frontend (frontendAPP/)
Tech Stack: React (TypeScript), Vite, TailwindCSS
Functionality:
             Implements UI components, pages, and services for the app.
             Uses TypeScript for type safety.
             Configured with ESLint and PostCSS for styling.
             Likely fetches data from the backend and interacts with blockchain smart contracts.

   

 ## ✨Features
 🕵️Fraud Prevention: NFT-based tickets are tamper-proof and verifiable on-chain, sliminating duplication or forgery.

 💵Fair Pricing: Smart contracts enfore maximum resale prices and royalties to prevent scalping while ensuring fair comensation for organizers.

 📢Transparency: All transactions are recorded on the blockchain and are publicly verifiable.
 
 ⛓️Decentralization: The system removes reliance on centralized platforms by enabling direct interactions between users via smart contracts.

 🎨User-Friendly Design: Integrates familiar tools like wallets (MetaMask) with off-chain storage(supabase) to provide a seamless experience even for non-crypto-savy users.

 🔒Security: The system uses Metamask for authentication and Supabase for off-chain storage, ensuring a secure and reliable platform.

 📦Scalability: The system is designed to handle a large number of users and transactions, making it suitable for large-scale events.

 ## 💾System Architecture


![system archtecture dark mode](https://github.com/user-attachments/assets/41e09103-c6dc-4423-a3a1-b01ade33bba9)

 

 ## 🛠Tech Stack
 - **Frontend:** React, Tailwind CSS
 - **Backend:** Node.js, Express
 - **Database:** Supabase
 - **Blockchain:** Ethereum/Polygon
 - **Smart Contracts:** Solidity
 - **Real-Time:** Redis and Websocket
 - **Authentication:** Metamask Authentication and Supabase Authentication



 ## 🏆 Team Members
 
 -**Abhirup Paul**
 -**Ankit Suthar**
