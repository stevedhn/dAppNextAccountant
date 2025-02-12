// pages/index.tsx
import { useState, useEffect, FormEvent } from 'react';
import { NextPage } from 'next';
import { ethers } from 'ethers';
// Import the contract ABI from the JSON file
import Bookkeeping from '../contracts/Bookkeeping.json';

const Home: NextPage = () => {
  // Replace with your deployed contract address
  const contractAddress: string = '0xYourContractAddressHere';

  const [account, setAccount] = useState<string>('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  // Initialize ethers provider, signer, and contract instance
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const ethersProvider = new ethers.BrowserProvider((window as any).ethereum);
      setProvider(ethersProvider);
      (window as any).ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((accounts: string[]) => {
          setAccount(accounts[0]);
          const signer = ethersProvider.getSigner();
          const contractInstance = new ethers.Contract(contractAddress, Bookkeeping.abi, signer);
          setContract(contractInstance);
        })
        .catch((error: any) => {
          console.error('Error accessing MetaMask accounts:', error);
          setStatus('Error: Unable to access MetaMask accounts.');
        });
    } else {
      setStatus('MetaMask not detected. Please install MetaMask.');
    }
  }, [contractAddress]);

  // Function to record a new transaction on the blockchain
  const recordTransaction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (contract && account) {
      setStatus('Submitting transaction...');
      try {
        // Call the smart contract function with provided values
        const tx = await contract.recordTransaction(amount, description, to);
        await tx.wait(); // Wait for the transaction to be mined
        setStatus('Transaction recorded successfully!');
        setAmount('');
        setDescription('');
        setTo('');
      } catch (error: any) {
        console.error('Transaction error:', error);
        setStatus('Error: ' + error.message);
      }
    } else {
      setStatus('Contract or account not loaded.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-blue-800 text-white min-h-screen p-6">
          <h2 className="text-2xl font-bold mb-8">QuickBook Clone</h2>
          <nav>
            <ul>
              <li className="mb-4">
                <a href="#" className="hover:text-gray-300">Dashboard</a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:text-gray-300">Transactions</a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:text-gray-300">Reports</a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:text-gray-300">Settings</a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">
              Connected Account: {account || 'Not connected'}
            </p>
          </header>

          {/* Record Transaction Form */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Record Transaction</h2>
            <form onSubmit={recordTransaction}>
              <div className="mb-4">
                <label className="block text-gray-700">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Recipient Address</label>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                Record Transaction
              </button>
            </form>
            {status && (
              <div className="mt-4 p-2 bg-gray-200 rounded">
                <p className="text-sm text-gray-800">{status}</p>
              </div>
            )}
          </section>

          {/* Placeholder for Transactions List */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Amount</th>
                  <th className="py-2 px-4 border-b">Description</th>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">From</th>
                  <th className="py-2 px-4 border-b">To</th>
                </tr>
              </thead>
              <tbody>
                {/* Map your transaction data here */}
                <tr>
                  <td className="py-2 px-4 border-b text-center" colSpan={6}>
                    No transactions found.
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
