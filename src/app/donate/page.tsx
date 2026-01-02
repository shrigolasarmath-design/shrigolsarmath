'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DonatePage() {
  const router = useRouter();
  const { isUserLoggedIn } = useAuth();
  const [amount, setAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const userAuth = localStorage.getItem('userAuth');
    if (userAuth !== 'true' && !isUserLoggedIn) {
      router.push('/login');
    }
  }, [isUserLoggedIn, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !donorName || !email || !mobileNumber || !address) {
      alert('Please fill in all required fields');
      return;
    }

    // In a real application, this would process the payment
    console.log({
      amount,
      donorName,
      email,
      mobileNumber,
      address,
      message,
    });

    setSubmitted(true);
    setTimeout(() => {
      setAmount('');
      setDonorName('');
      setEmail('');
      setMobileNumber('');
      setAddress('');
      setMessage('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-yellow-50 py-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-2xl p-10 border-t-4 border-yellow-600">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-3 text-amber-900">🙏 Make a Donation</h1>
            <p className="text-gray-700 text-lg leading-relaxed">
              Your generous donation helps us maintain the temple, support community services, and continue our sacred mission. Every contribution is blessed and appreciated.
            </p>
          </div>

          {submitted ? (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-500 text-amber-900 px-6 py-6 rounded-lg text-center shadow-md">
              <h2 className="text-2xl font-bold mb-3">🙏 Thank You for Your Blessed Donation!</h2>
              <p className="text-lg">
                We are deeply grateful for your generosity. May the divine blessings shower upon you and your family. A confirmation has been sent to <strong>{email}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Donation Amount */}
              <div>
                <label htmlFor="amount" className="block text-lg font-semibold text-amber-900 mb-2">
                  💳 Donation Amount (₹)
                </label>
                <input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount in Rupees"
                  className="w-full px-5 py-3 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none bg-yellow-50 text-gray-800 font-medium"
                />
              </div>

              {/* Donor Name */}
              <div>
                <label htmlFor="name" className="block text-lg font-semibold text-amber-900 mb-2">
                  👤 Your Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-5 py-3 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none bg-yellow-50 text-gray-800 font-medium"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-lg font-semibold text-amber-900 mb-2">
                  📧 Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-5 py-3 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none bg-yellow-50 text-gray-800 font-medium"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="mobile" className="block text-lg font-semibold text-amber-900 mb-2">
                  📱 Mobile Number
                </label>
                <input
                  id="mobile"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter your 10-digit mobile number"
                  className="w-full px-5 py-3 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none bg-yellow-50 text-gray-800 font-medium"
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-lg font-semibold text-amber-900 mb-2">
                  🏠 Address
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full address (Street, City, State, Zip)"
                  rows={3}
                  className="w-full px-5 py-3 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none bg-yellow-50 text-gray-800 font-medium"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-lg font-semibold text-amber-900 mb-2">
                  💬 Prayer or Message (Optional)
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your prayers, wishes, or message of gratitude..."
                  rows={4}
                  className="w-full px-5 py-3 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none bg-yellow-50 text-gray-800 font-medium"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg text-lg"
              >
                ✨ Donate Now ✨
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

