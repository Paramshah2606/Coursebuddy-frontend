"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from 'react-toastify';
import { addCourse,getCategories } from "@/api/apiHandler";
import { useRouter } from "next/navigation";

const validationSchema = Yup.object({
  title: Yup.string().required("Course title is required"),
  category_id: Yup.string().required("Category is required"),
  description: Yup.string().required("Description is required"),
  cover_image: Yup.string().url("Must be a valid image URL"),
  price: Yup.number().min(0).integer().required("Price is required")
});

const AddCourseForm = () => {
  const router=useRouter();
  const [categories, setCategories] = useState([]);
  const [loading,setLoading]=useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      if(res.code==1){
        setCategories(res.data);
      }else{
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Error fetching categories.");
    }
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      category_id: "",
      description: "",
      cover_image: "",
      price: 0,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log(values);
        setLoading(true);
        const res = await addCourse(values);
        setLoading(false);
        if (res.code == 1) {
          toast.success(res.message);
          router.push('/admin/course');
          resetForm();
        } else {
          toast.error(res.message || "Failed to add Course");
        }
      } catch (error) {
        toast.error("Error submitting form");
      }
    },
  });

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Add Course</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">

        <div>
          <label htmlFor="title" className="block mb-1 font-medium">Course title:</label>
          <input
            type="text"
            name="title"
            className="w-full border border-gray-300 p-2 rounded"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-red-500 text-sm">{formik.errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="block mb-1 font-medium">Course Price:</label>
          <input
            type="number"
            name="price"
            min={0}
            className="w-full border border-gray-300 p-2 rounded"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.price && formik.errors.price && (
            <p className="text-red-500 text-sm">{formik.errors.price}</p>
          )}
        </div>

        <div>
          <label htmlFor="category_id" className="block mb-1 font-medium">Category:</label>
          <select
            name="category_id"
            className="w-full border border-gray-300 p-2 rounded"
            value={formik.values.category_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {formik.touched.category_id && formik.errors.category_id && (
            <p className="text-red-500 text-sm">{formik.errors.category_id}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 font-medium">Description:</label>
          <textarea
            name="description"
            className="w-full border border-gray-300 p-2 rounded"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          ></textarea>
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-sm">{formik.errors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="cover_image" className="block mb-1 font-medium">Image URL:</label>
          <input
            type="text"
            name="cover_image"
            className="w-full border border-gray-300 p-2 rounded"
            value={formik.values.cover_image}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.cover_image && formik.errors.cover_image&& (
            <p className="text-red-500 text-sm">{formik.errors.cover_image}</p>
          )}
        </div>


        <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
          {!loading ? "Add Course" : "Adding Course..."}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddCourseForm;
