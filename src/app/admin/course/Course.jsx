'use client';

import Link from "next/link";

export default function Course({ courses }) {
  return (
    <div>
      <div className="grid grid-cols-4 gap-7">
        {
          courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col bg-white border rounded-xl shadow hover:shadow-xl transition p-4"
            >
              <div className="flex justify-center items-center mb-3">
                <img
                  src={course.cover_image}
                  alt={course.title}
                  className="h-40 w-full object-contain rounded-xl bg-gray-50"
                />
              </div>
              <Link href={`/admin/course/${course.id}`}>
                <div className="font-semibold text-gray-800 mb-1 text-center hover:text-indigo-700 transition">
                  {course.title}
                </div>
              </Link>
              <div className="font-medium text-gray-400 mb-1 text-center">
                  {course.description}
                </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}