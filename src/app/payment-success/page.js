'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchSessionData, getCourseById } from '@/api/apiHandler';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [session, setSession] = useState(null);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    async function fetchSessionDetails() {
      try {
        const res = await fetchSessionData({ session_id: sessionId });
        setSession(res.data.session);
        const courseId = res.data.session.metadata.course_id;
        if (courseId) {
          const res2 = await getCourseById(courseId);
          setCourse(res2.data.course);
        }
      } catch (err) {
        console.error('Error fetching session details', err);
      }
    }
    if (sessionId) fetchSessionDetails();
  }, [sessionId]);

  function generateInvoicePDF() {
    if (!session || !course) return;

    const doc = new jsPDF();

    // Branding
    doc.setFontSize(22);
    doc.setTextColor('#3B82F6');
    doc.text('EduTech Pvt. Ltd.', 14, 20);

    doc.setFontSize(12);
    doc.setTextColor('#555');
    doc.text('INVOICE', 14, 28);

    // Invoice & Customer Details
    doc.setFontSize(10);
    doc.setTextColor('#000');
    doc.text(`Invoice #: ${session.id}`, 14, 38);
    doc.text(`Invoice Date: ${new Date(session.created * 1000).toLocaleDateString()}`, 14, 44);
    doc.text(`Customer Email: ${session.customer_email}`, 14, 50);

    // Draw a line
    doc.setDrawColor('#3B82F6');
    doc.line(14, 54, 196, 54);

    // Course Table
    autoTable(doc, {
      startY: 60,
      head: [[
        'Course',
        'Description',
        'Quantity',
        'Unit Price',
        'Total'
      ]],
      body: [[
        course?.title || 'N/A',
        course?.description || 'N/A',
        '1',
        course?.price || '0',
        course?.price || '0',
      ]],
      headStyles: {
        fillColor: [59, 130, 246], // Tailwind blue-600
        textColor: 255,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 10,
      },
      styles: {
        halign: 'center',
      },
      margin: { left: 14, right: 14 }
    });

    // Calculate Y position after table
    const finalY = doc.lastAutoTable.finalY + 10;

    // Payment Summary
    doc.setFontSize(12);
    doc.setTextColor('#3B82F6');
    doc.text('Payment Summary', 14, finalY);

    doc.setFontSize(10);
    doc.setTextColor('#000');
    autoTable(doc, {
      startY: finalY + 4,
      head: [['Total Amount Paid', 'Status', 'Date']],
      body: [[
        (session.amount_total / 100).toFixed(2),
        session.payment_status.charAt(0).toUpperCase() + session.payment_status.slice(1),
        new Date(session.created * 1000).toLocaleString()
      ]],
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 10,
      },
      styles: {
        halign: 'center',
      },
      margin: { left: 14, right: 14 }
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor('#666');
    doc.text('Thank you for your purchase!', 105, 285, { align: 'center' });
    doc.text('For support, contact: support@edutech.com', 105, 292, { align: 'center' });

    doc.save('invoice.pdf');
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-500">Loading payment details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mb-6">
            <svg className="h-12 w-12 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
          <p className="text-gray-700 mb-2">Thank you for your purchase. Your payment was processed successfully.</p>
          <p className="text-gray-500 mb-6">A summary of your transaction is below. An invoice has been sent to your email.</p>
        </div>

        {course && (
          <div className="bg-white rounded-lg p-6 mt-4 text-left border mb-6">
            <h3 className="text-lg font-semibold text-indigo-700 mb-2">Course Purchased</h3>
            <div className="mb-1"><span className="font-medium">Title:</span> {course.title}</div>
            <div className="mb-1"><span className="font-medium">Description:</span> {course.description}</div>
            <div className="mb-1"><span className="font-medium">Price:</span> ₹{course.price}</div>
          </div>
        )}

        <div className="bg-gray-100 rounded-lg p-6 mb-6 text-left">
          <h3 className="text-lg font-semibold text-indigo-700 mb-4">Payment Summary</h3>
          <div className="mb-2 flex justify-between">
            <span className="font-medium text-gray-700">Amount Paid:</span>
            <span className="font-bold text-indigo-700">₹{session.amount_total / 100}</span>
          </div>
          <div className="mb-2 flex justify-between">
            <span className="font-medium text-gray-700">Email:</span>
            <span className="text-gray-700">{session.customer_email}</span>
          </div>
          <div className="mb-2 flex justify-between">
            <span className="font-medium text-gray-700">Status:</span>
            <span className={`font-semibold px-2 py-1 rounded 
              ${session.payment_status === 'paid' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
              {session.payment_status.charAt(0).toUpperCase() + session.payment_status.slice(1)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Date:</span>
            <span className="text-gray-700">{new Date(session.created * 1000).toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={generateInvoicePDF}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition mb-4 flex items-center justify-center gap-2"
        >
          <span>📄</span> Download Invoice (PDF)
        </button>

        <a
          href="/user/course"
          className="block text-indigo-600 hover:underline font-medium mt-2"
        >
          Go To Courses
        </a>
      </div>
    </div>
  );
}
