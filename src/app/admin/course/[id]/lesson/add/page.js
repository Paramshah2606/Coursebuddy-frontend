"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from 'react-toastify';
import { addLesson } from "@/api/apiHandler";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const validationSchema = Yup.object({
  video: Yup.string().url("Must be a valid video URL").required("Lesson video is required"),
});

const AddLessonForm = () => {
  const router=useRouter();
  const {id}=useParams();
  const [loading,setLoading]=useState(false);

  const formik = useFormik({
    initialValues: {
      video: ""
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const data={
          video:values.video,
          id
        }
        const res = await addLesson(data);
        setLoading(false);
        if (res.code == 1) {
          toast.success(res.message);
          router.push(`/admin/course/${id}`);
          resetForm();
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        toast.error("Error submitting form");
      }
    },
  });

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Add Lesson</h2>
      <Link href={`/admin/course/${id}/lesson/add/text`}><div className="font-semibold text-gray-800 mb-4 text-center hover:text-indigo-700 transition">If you want to add Text Lesson Click me!!</div></Link>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="video" className="block mb-1 font-medium">Video Link</label>
          <input
            type="text"
            name="video"
            className="w-full border border-gray-300 p-2 rounded"
            value={formik.values.video}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.video && formik.errors.video && (
            <p className="text-red-500 text-sm">{formik.errors.video}</p>
          )}
        </div>

        <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
          {!loading ? "Add Lesson" : "Adding Lesson..."}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddLessonForm;
