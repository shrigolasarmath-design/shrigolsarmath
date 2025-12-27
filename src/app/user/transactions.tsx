"use client";

import { useState, useEffect } from 'react';

interface Transaction {
  id: number;
  amount: number;
  date: string;
  seva: string;
}

const initialTransactions: Transaction[] = [
  { id: 1, amount: 500, date: '2025-12-01', seva: 'Abhishekam' },
  { id: 2, amount: 1000, date: '2025-12-15', seva: 'Archana' },
  { id: 3, amount: 200, date: '2025-12-20', seva: 'Deepa Seva' },
];

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch transaction history (dummy data for now)
    setTimeout(() => {
      setTransactions(initialTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-2xl p-10 border-t-4 border-blue-600">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 text-blue-900">Transaction History</h1>
            <p className="text-gray-700 text-lg">View all your donations and seva bookings.</p>
          </div>

          {loading ? (
            <div className="text-center text-gray-600">Loading...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center text-gray-600">No transactions found.</div>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Seva</th>
                  <th className="border border-gray-300 px-4 py-2">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{txn.date}</td>
                    <td className="border border-gray-300 px-4 py-2">{txn.seva}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">₹{txn.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}