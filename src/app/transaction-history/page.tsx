'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

let supabase: any = null;

try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
} catch (error) {
  console.error('Failed to initialize Supabase:', error);
}

interface Transaction {
  id: string;
  email: string;
  amount: string;
  type: string;
  date: string;
}

export default function TransactionHistory() {
  const { isUserLoggedIn } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userAuth = localStorage.getItem('userAuth');
    if (userAuth !== 'true' && !isUserLoggedIn) {
      router.push('/login');
      return;
    }

    const fetchTransactions = async () => {
      try {
        if (!supabase) {
          setError('Supabase not configured');
          setLoading(false);
          return;
        }

        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          setError('User email not found');
          setLoading(false);
          return;
        }

        // Fetch from donations table
        const { data: donations, error: donationError } = await supabase
          .from('donations')
          .select('*')
          .eq('email', userEmail)
          .order('created_at', { ascending: false });

        if (donationError) {
          console.error('Error fetching donations:', donationError);
        }

        // Combine and format transactions
        const formattedTransactions = (donations || []).map((donation: any) => ({
          id: donation.id,
          email: donation.email,
          amount: donation.amount,
          type: 'Donation',
          date: new Date(donation.created_at).toLocaleDateString(),
        }));

        setTransactions(formattedTransactions);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transaction history');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [isUserLoggedIn, router]);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Transaction History</h1>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          ) : transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="px-6 py-3 text-left font-semibold">Date</th>
                    <th className="px-6 py-3 text-left font-semibold">Type</th>
                    <th className="px-6 py-3 text-left font-semibold">Amount</th>
                    <th className="px-6 py-3 text-left font-semibold">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-800">{transaction.date}</td>
                      <td className="px-6 py-4 text-gray-800">{transaction.type}</td>
                      <td className="px-6 py-4 font-semibold text-green-600">₹{transaction.amount}</td>
                      <td className="px-6 py-4 text-gray-600">{transaction.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
