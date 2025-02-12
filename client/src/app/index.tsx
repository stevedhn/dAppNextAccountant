// pages/index.tsx
import { useState, useEffect, FormEvent } from 'react';
import { NextPage } from 'next';
import { ethers } from 'ethers';
// Import the contract ABI from the JSON file
import Bookkeeping from '../contracts/Bookkeeping.json';

const Home: NextPage = () => {
  // Replace with your deployed contract address
  const contractAddress: string = '0xActualContractAddress'; // Replace with actual address

  const [account, setAccount] = useState<string>('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  // Initialize ethers provider, signer, and contract instance
  useEffect(() => {
    const initialize = async () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          const ethersProvider = new ethers.BrowserProvider((window as any).ethereum);
          setProvider(ethersProvider);
          const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);
          const signer = await ethersProvider.getSigner();
          const contractInstance = new ethers.Contract(contractAddress, Bookkeeping.abi, signer);
          setContract(contractInstance);
        } catch (error: any) {
          console.error('Error accessing MetaMask accounts:', error);
          setStatus('Error: Unable to access MetaMask accounts.');
        }
      } else {
        setStatus('MetaMask not detected. Please install MetaMask.');
      }
    };

    initialize();
  }, [contractAddress]);

  // Function to record a new transaction on the blockchain
  const recordTransaction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (contract && account) {
      setStatus('Submitting transaction...');
      try {
        // Call the smart contract function with provided values.
        // Ensure that amount is converted to the expected type (if necessary).
        const tx = await contract.recordTransaction(ethers.parseUnits(amount, 'ether'), description, to);
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
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Decentralized Bookkeeping dApp</h1>
      <p>
        <strong>Connected Account:</strong> {account || 'Not connected'}
      </p>
      <form onSubmit={recordTransaction} style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Amount:&nbsp;
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Description:&nbsp;
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Recipient Address:&nbsp;
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Record Transaction
        </button>
      </form>
      <p>
        <strong>Status:</strong> {status}
      </p>
    </div>
  );
};

export default Home;
