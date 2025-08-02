'use client'

import Link from "next/link";
import { getCourseById } from "@/api/apiHandler";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import LessonVideo from "@/components/LessonVideo";

export default function CourseDetailPage() {
  const [course, setCourse] = useState(null);
  const [lesson,setLesson]=useState(null);

  const { id } = useParams();

  useEffect(() => {
    async function fetchCourse() {
      const res = await getCourseById(id);
      console.log(res);
      setCourse(res.data.course);
      setLesson(res.data.lesson);
    }
    fetchCourse();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {course ? (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">{course.title}</h2>
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex-1 flex justify-center items-center bg-gray-100 rounded-lg p-4">
                <img
                  src={course.cover_image}
                  alt={course.title}
                  className="h-64 w-64 object-contain rounded"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-gray-700 mb-6">{course.description}</p>
                <p className="text-sm text-gray-500 mb-2">Category: <span className="font-medium text-gray-700">{course.category}</span></p>
              </div>
            </div>
            <div className="mt-10 mb-10 flex justify-center">
              <Link
                href={`/admin/course/${id}/lesson/add`}
                className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition text-lg font-medium"
              >
                Add Lesson
              </Link>
            </div>
                <div className="border-t pt-8">
               <h3 className="text-2xl font-semibold mb-6 text-gray-800">Lessons</h3>
            {!lesson ? (
          <div className="text-center text-gray-500 py-12">Loading lessons...</div> ): lesson.length==0 ?
          (<div className="text-center text-gray-500 py-12">No lessons added for this course..</div>) :
          (<div className="space-y-12">
            {
          lesson.map((l,ind)=>(
            <div key={ind} className="bg-gray-50 p-6 rounded-lg shadow-sm">
 <h4 className="text-xl font-semibold text-indigo-700 mb-4">
Lesson {ind + 1}
</h4>

{l.text_lesson && (
<div
  className="rich-text max-w-none mb-6"
  dangerouslySetInnerHTML={{ __html: l.text_lesson }}
/>
)}

{l.video_link && (
<div className="flex flex-col items-center gap-2">
  <LessonVideo link={l.video_link} />
</div>
)}
</div> 
          ))}
          </div>)
        }
            <div className="mt-10 flex justify-center">
              <Link href="/admin/course" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition text-lg font-medium">
                Back to course Listing
              </Link>
            </div>
          </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-16">Loading course details...</div>
        )}
      </div>
    </div>
  );
}
