'use client';
import { useState, useEffect } from "react";
import Course from "./Course";
import Link from 'next/link';
import { getCourses } from "@/api/apiHandler";

export default function CoursePage() {
  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchCourse() {
    setLoading(true);
    let res = await getCourses();
    setLoading(false);
    if (res.code==1) {
      setCourses(res.data);
    }
  }

  useEffect(() => {
    fetchCourse();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">Course Management</h2>
        <div className="flex justify-center mb-6">
          <Link
            href='/admin/course/add'
            className="bg-indigo-600 text-white px-5 py-2 rounded font-medium hover:bg-indigo-700 transition"
          >
            + Add Course
          </Link>
        </div>
        <div className="py-6">
                  {loading ? (
                    <div className="text-center text-gray-500 py-12">Loading Courses...</div>
                  ) : !courses || courses.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">No Courses found.</div>
                  ) : (
                    <Course courses={courses} />
                  )}
                </div>
      </div>
    </div>
  );
}