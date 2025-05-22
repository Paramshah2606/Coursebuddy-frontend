'use client';

import Link from "next/link";
import { buyCourse, getSubscription, createCheckout } from "@/api/apiHandler";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export default function Course({ courses }) {
  const [subscription, setSubscription] = useState([]);

  async function buyCourseHandler(id) {
    let res2 = await createCheckout({ course_id: id });
    if (res2.data.url) {
      window.location.href = res2.data.url;
    }
  }

  async function getSubscriptionDetail() {
    let subscriptionRes = await getSubscription();
    if (subscriptionRes.code == 1 && subscriptionRes.data?.length > 0) {
      setSubscription(subscriptionRes.data);
    }
  }

  useEffect(() => {
    getSubscriptionDetail();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">Available Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {courses.map((course) => (
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
              <Link href={`/user/course/${course.id}`}>
                <div className="font-semibold text-gray-800 mb-1 text-center hover:text-indigo-700 transition">
                  {course.title}
                </div>
              </Link>
              {!subscription.find((s) => s.course_id == course.id) ? (
                <div className="mt-2">
                  <div className="font-bold text-indigo-700 mb-2 text-center">
                    ₹{course.price}
                  </div>
                  <button
                    onClick={() => buyCourseHandler(course.id)}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                  >
                    Buy Now
                  </button>
                </div>
              ) : (
                <div className="mt-2 text-center">
                  <div className="font-medium text-green-600 mb-2">Already Subscribed</div>
                  <Link
                    href={`/user/course/${course.id}`}
                    className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200 transition font-medium"
                  >
                    Go To Course
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
