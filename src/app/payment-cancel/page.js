'use client';

import Link from "next/link";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="bg-red-100 rounded-full h-20 w-20 flex items-center justify-center mb-6">
            <svg className="h-12 w-12 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Cancelled</h1>
          <p className="text-gray-700 mb-2">Your transaction was not completed.</p>
          <p className="text-gray-500 mb-6">You can try again or return to the shop.</p>
        </div>
        <Link
          href="/user/course"
          className="block w-full bg-gray-200 text-indigo-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Back to Courses
        </Link>
      </div>
    </div>
  );
}
