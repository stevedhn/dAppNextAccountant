import { ethers } from 'ethers';
import Bookkeeping from '../../../contracts/Bookkeeping.sol';

// Connect to the Ethereum network
const provider = new ethers.providers.Web3Provider(window.ethereum);

// Get the signer
const signer = provider.getSigner();

// Contract address and ABI
const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const contractABI = Bookkeeping.abi;

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, signer);

export const addTransaction = async (description, amount) => {
  try {
    const tx = await contract.addTransaction(description, amount);
    await tx.wait();
    console.log('Transaction added:', tx);
  } catch (error) {
    console.error('Error adding transaction:', error);
  }
};

export const getTransaction = async (id) => {
  try {
    const transaction = await contract.getTransaction(id);
    console.log('Transaction:', transaction);
    return transaction;
  } catch (error) {
    console.error('Error getting transaction:', error);
  }
};

export const getAllTransactions = async () => {
  try {
    const transactions = await contract.getAllTransactions();
    console.log('All transactions:', transactions);
    return transactions;
  } catch (error) {
    console.error('Error getting all transactions:', error);
  }
};
