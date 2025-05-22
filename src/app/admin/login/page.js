"use client";
import { signin } from "@/api/apiHandler";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
  emailphone: Yup.string().required("Email or phone is required"),
  password: Yup.string().required("Password is required")
});

const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      emailphone: "",
      password: ""
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      let res = await signin(values);
      setLoading(false);
        if (res.code == 1) {
          toast.success(res.message);
          localStorage.setItem("user-token", res.data.user_token);
          localStorage.setItem("role", res.data.role);
          localStorage.setItem("username", res.data.full_name);
          router.push('/user/course');
        } else {
          toast.error(res.message);
        }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-indigo-700 mb-2 text-center">Welcome back Admin</h2>
        <p className="text-gray-500 mb-6 text-center">Please enter your details.</p>
        <form onSubmit={formik.handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="emailphone" className="block text-sm font-medium text-gray-700 mb-1">
              Email or Phone
            </label>
            <input
              type="text"
              name="emailphone"
              autoComplete="username"
              className={`w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              value={formik.values.emailphone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.emailphone && formik.errors.emailphone && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.emailphone}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              className={`w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;