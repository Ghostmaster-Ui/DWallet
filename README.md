# 🦊 DWallet – Decentralized Wallet (MetaMask Clone)

Welcome to **DWallet** – a sleek, production-ready Ethereum wallet built with **React**, **Ethers.js**, and the **Etherscan API**, inspired by MetaMask. This project lets users:

- 🔐 Connect their MetaMask wallet
- 💰 Check live Ethereum balances
- 📜 View real-time transaction history
- ⚙️ Interact with Sepolia or Mainnet (via Infura RPC)
- 🎨 Enjoy a clean Tailwind-powered UI

---

## 🚀 Live Features

✅ Connect MetaMask Wallet  
📈 Fetch ETH balance from any valid address  
📜 Retrieve full transaction history via Etherscan  
🔁 Refresh data dynamically  
🛡️ Keeps `.env` secret using Git best practices  

---

## ⚙️ Tech Stack

| Technology     | Description                     |
|----------------|---------------------------------|
| React.js       | Frontend library for UI         |
| Ethers.js      | Ethereum blockchain interaction |
| Tailwind CSS   | Clean, responsive styling       |
| Infura RPC     | Ethereum node access            |
| Etherscan API  | Transaction & balance data      |

---

## 🔐 Setup: .env Configuration

Before running the app, create a `.env` file in the root with your credentials:

```env
REACT_APP_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
REACT_APP_ETHERSCAN_API=YOUR_ETHERSCAN_API_KEY

# Clone the repo
git clone https://github.com/Ghostmaster-Ui/DWallet.git
cd DWallet

# Install dependencies
npm install

# Start the development server
npm start



✍️ Author
Made with 💻 and ☕ by Advit Singh

GitHub: Ghostmaster-Ui

📄 License
This project is licensed under the MIT License.
