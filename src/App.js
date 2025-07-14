// src/App.js
import React, { useState, useEffect } from "react";
import {
  Wallet,
  parseEther,
  formatEther,
  JsonRpcProvider,
  getDefaultProvider,
  Contract
} from "ethers";
import axios from "axios";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint)",
  "function symbol() view returns (string)"
];

const provider = new JsonRpcProvider(process.env.REACT_APP_RPC_URL);

function App() {
  const [wallet, setWallet] = useState(null);
  const [importKey, setImportKey] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState(null);
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [ethBalance, setEthBalance] = useState("");

  useEffect(() => {
    const savedKey = localStorage.getItem("wallet_private_key");
    if (savedKey) {
      try {
        const existingWallet = new Wallet(savedKey);
        setWallet(existingWallet);
      } catch (e) {
        console.error("Wallet restore failed:", e);
      }
    }
  }, []);

  const createWallet = () => {
    const newWallet = Wallet.createRandom();
    localStorage.setItem("wallet_private_key", newWallet.privateKey);
    setWallet(newWallet);
    alert("Wallet created!");
  };

  const handleImport = () => {
    try {
      const imported = new Wallet(importKey.trim());
      localStorage.setItem("wallet_private_key", imported.privateKey);
      setWallet(imported);
      alert("Wallet imported!");
    } catch (err) {
      alert("Invalid private key");
    }
  };

  const checkBalance = async () => {
    if (!wallet) return alert("No wallet connected");
    try {
      const balance = await provider.getBalance(wallet.address);
      setEthBalance(formatEther(balance));
    } catch (err) {
      alert("Failed to fetch balance");
    }
  };

  const sendETH = async () => {
    if (!wallet || !recipient || !amount) return alert("Fill all fields");
    try {
      const signer = wallet.connect(provider);
      const tx = await signer.sendTransaction({
        to: recipient,
        value: parseEther(amount)
      });
      alert("Sent! " + tx.hash);
    } catch (err) {
      alert("Send failed: " + err.message);
    }
  };

  const getTokenBalance = async () => {
    if (!wallet || !tokenAddress) return alert("Missing token address");
    try {
      const contract = new Contract(tokenAddress, ERC20_ABI, provider);
      const bal = await contract.balanceOf(wallet.address);
      const symbol = await contract.symbol();
      setTokenBalance(bal.toString());
      setTokenSymbol(symbol);
    } catch (err) {
      alert("Invalid token or address");
    }
  };

  const getTransactions = async () => {
    if (!wallet) return;
    const api = process.env.REACT_APP_ETHERSCAN_API;
    const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${wallet.address}&startblock=0&endblock=99999999&sort=desc&apikey=${api}`;
    try {
      const res = await axios.get(url);
      if (!Array.isArray(res.data.result)) {
        alert("No transactions found");
        setTransactions([]);
        return;
      }
      setTransactions(res.data.result.slice(0, 5));
    } catch (err) {
      alert("Failed to fetch transactions");
      setTransactions([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-mono">
      <h1 className="text-3xl font-bold mb-6">🔥 DWallet</h1>

      <div className="space-x-3 mb-4">
        <button onClick={createWallet} className="btn">🆕 Create Wallet</button>
        <input
          placeholder="Import private key"
          value={importKey}
          onChange={(e) => setImportKey(e.target.value)}
          className="p-2 text-black"
        />
        <button onClick={handleImport} className="btn">📥 Import</button>
      </div>

      {wallet && (
        <div className="bg-gray-800 p-4 rounded-lg space-y-4">
          <p><strong>📬 Address:</strong> {wallet.address}</p>
          <p><strong>🔐 Private Key:</strong> {wallet.privateKey}</p>
          <button onClick={checkBalance} className="btn">💰 Check Balance</button>
          {ethBalance && <p><strong>Balance:</strong> {ethBalance} ETH</p>}

          <div className="pt-4 border-t border-gray-600">
            <h3 className="font-bold">🚀 Send ETH</h3>
            <input
              placeholder="To"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="p-2 mr-2 text-black"
            />
            <input
              placeholder="Amount (ETH)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-2 mr-2 text-black"
            />
            <button onClick={sendETH} className="btn">Send</button>
          </div>

          <div className="pt-4 border-t border-gray-600">
            <h3 className="font-bold">🪙 Check ERC-20</h3>
            <input
              placeholder="Token contract address"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              className="p-2 mr-2 text-black w-[350px]"
            />
            <button onClick={getTokenBalance} className="btn">Check Token</button>
            {tokenBalance && (
              <p><strong>Token:</strong> {tokenBalance} {tokenSymbol}</p>
            )}
          </div>

          <div className="pt-4 border-t border-gray-600">
            <h3 className="font-bold">📜 Recent Transactions</h3>
            <button onClick={getTransactions} className="btn mb-2">Get Transactions</button>
            <ul className="text-sm">
              {transactions.map((tx) => (
                <li key={tx.hash} className="mb-2">
                  <div><strong>To:</strong> {tx.to}</div>
                  <div><strong>Amount:</strong> {formatEther(tx.value)} ETH</div>
                  <a href={`https://sepolia.etherscan.io/tx/${tx.hash}`} target="_blank" rel="noreferrer" className="text-blue-400 underline">View Tx</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;