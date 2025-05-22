'use client';

import Link from "next/link";
import { getCourseById, markLesson, getMarkedLesson, getUserCourseProgress, getSubscription, createCheckout } from "@/api/apiHandler";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import LessonVideo from "@/components/LessonVideo";
import { toast } from 'react-toastify';

export default function CourseDetailPage() {
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [markedLesson, setMarkedLesson] = useState([]);
  const [progressData, setProgressData] = useState(null);
  const [subscription, setSubscription] = useState([]);
  const { id } = useParams();

  async function handleMark(lesson_id) {
    let res = await markLesson({ lesson_id, course_id: id });
    if (res.code == 1) {
      toast.success(res.message);
      fetchMarkedLessons();
      fetchProgress();
    } else {
      toast.error(res.message);
    }
  }

  async function buyCourseHandler() {
    let res2 = await createCheckout({ course_id: id });
    if (res2.data.url) {
      window.location.href = res2.data.url;
    }else{
      toast.error("Try again after sometime");
    }
  }

  async function fetchCourse() {
    const res = await getCourseById(id);
    setCourse(res.data.course);
    setLesson(res.data.lesson);
  }

  async function fetchMarkedLessons() {
    let res2 = await getMarkedLesson();
    setMarkedLesson(res2.data);
  }

  async function fetchProgress() {
    let res = await getUserCourseProgress({ course_id: id });
    setProgressData(res.data.progress);
  }

  async function getSubscriptionDetail() {
    let subscriptionRes = await getSubscription();
    if (subscriptionRes.code == 1 && subscriptionRes.data?.length > 0) {
      setSubscription(subscriptionRes.data);
    }
  }

  useEffect(() => {
    fetchMarkedLessons();
    fetchCourse();
    fetchProgress();
    getSubscriptionDetail();
    // eslint-disable-next-line
  }, []);

  const isSubscribed = subscription.find((s) => s.course_id == id);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {course ? (
          <>
            <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">{course.title}</h2>
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex-1 flex justify-center items-center bg-gray-100 rounded-lg p-4">
                <img
                  src={course.cover_image}
                  alt={course.title}
                  className="h-64 w-64 object-contain rounded-xl"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-gray-700 mb-6">{course.description}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Category: <span className="font-medium text-gray-700">{course.category}</span>
                </p>
                {!isSubscribed && (
                  <div className="mt-6">
                    <div className="text-center font-bold text-indigo-700 text-xl mb-4">
                      ₹{course.price}
                    </div>
                    <button
                      onClick={() => buyCourseHandler()}
                      className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                      Buy Now
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isSubscribed ? (
              <>
                {/* Progress Section */}
                <div className="border-t pt-8 mt-8">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-800">Your Progress</h3>
                  {!progressData ? (
                    <p className="text-gray-500">No course progress found for you.</p>
                  ) : (
                    <div className="space-y-4 bg-white shadow rounded p-6 border">
                      <div className="w-full bg-gray-200 rounded h-4">
                        <div
                          className="bg-indigo-600 h-4 rounded"
                          style={{ width: `${progressData.progress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{progressData.progress}% completed</p>
                    </div>
                  )}
                </div>

                {/* Lessons Section */}
                <div className="border-t pt-8 mt-8">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-800">Lessons</h3>
                  {!lesson ? (
                    <div className="text-center text-gray-500 py-12">Loading lessons...</div>
                  ) : lesson.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">No lessons added for this course yet.</div>
                  ) : (
                    <div className="space-y-8">
                      {lesson.map((l, ind) => (
                        <div key={l.id} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                          <h4 className="text-xl font-semibold text-indigo-700 mb-4">
                            Lesson {ind + 1}{l.title ? `: ${l.title}` : ""}
                          </h4>
                          {l.text_lesson && (
                            <div
                              className="rich-text max-w-none mb-6 text-gray-700"
                              dangerouslySetInnerHTML={{ __html: l.text_lesson }}
                            />
                          )}
                          {l.video_link && (
                            <div className="flex flex-col items-center gap-2 mb-4">
                              <LessonVideo link={l.video_link} />
                            </div>
                          )}
                          {markedLesson && markedLesson.find((m) => m.lesson_id == l.id) ? (
                            <div className="my-2 flex flex-col items-center">
                              <span className="bg-green-600 text-white px-5 py-2 rounded font-semibold">
                                You have completed this lesson.
                              </span>
                            </div>
                          ) : (
                            <div className="my-2 flex flex-col items-center">
                              <button
                                onClick={() => handleMark(l.id)}
                                className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 transition font-semibold"
                              >
                                Mark as Done
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="mt-10 flex flex-col items-center">
                <div className="bg-yellow-100 text-yellow-800 px-6 py-4 rounded font-medium text-center mb-6">
                  To access the lessons, please purchase this course.
                </div>
              </div>
            )}

            <div className="mt-10 flex justify-center">
              <Link
                href="/user/course"
                className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition text-lg font-medium"
              >
                Back to Course Listing
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-16">Loading course details...</div>
        )}
      </div>
    </div>
  );
}
