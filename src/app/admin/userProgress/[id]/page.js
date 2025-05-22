'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserCourseProgress } from '@/api/apiHandler';
import Link from 'next/link'; 

export default function AdminUserProgressPage() {
  const { id } = useParams();
  const [progressData, setProgressData] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchProgress() {
      const res = await getUserCourseProgress({id}); 
      setUser(res.data.user);
      setProgressData(res.data.progress);
    }
    fetchProgress();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700">Progress Report</h1>
      {user && <h2 className="text-lg text-gray-700 mb-6">User: {user.full_name} ({user.email})</h2>}

      {progressData.length === 0 ? (
        <p className="text-gray-500">No course progress found for this user.</p>
      ) : (
        <div className="space-y-6">
          {progressData.map((course, index) => (
            <div key={index} className="bg-white shadow rounded p-6 border">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h3>
              <div className="w-full bg-gray-200 rounded h-4">
                <div
                  className="bg-indigo-600 h-4 rounded"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">{course.progress}% completed</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-10 flex justify-center">
                    <Link
                      href="/admin/userList"
                      className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition text-lg font-medium"
                    >
                      Back to users page
                    </Link>
        </div>
    </div>
  );
}
