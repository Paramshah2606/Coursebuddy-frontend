"use client";
import { signup } from '@/api/apiHandler';
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import Link from "next/link";

const validationSchema = Yup.object({
  full_name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  country_code: Yup.string().required("Country code is required"),
  phone: Yup.number().integer().required("Phone number is required"),
  password: Yup.string().required("Password is required"),
});

const SignUpForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      country_code: "+91",
      phone: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      let res = await signup(values);
      setLoading(false);
      if (res.code == 1) {
        toast.success(res.message);
        localStorage.setItem("user-token", res.data.user_token);
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
        <h2 className="text-3xl font-bold text-indigo-700 mb-2 text-center">Create your account</h2>
        <p className="text-gray-500 mb-6 text-center">Sign up to get started. It’s quick and easy!</p>
        <form onSubmit={formik.handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <input
              type="text"
              name="full_name"
              autoComplete="name"
              className={`w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              value={formik.values.full_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.full_name && formik.errors.full_name && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.full_name}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              className={`w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>
          <div className="flex gap-3">
            <div className="w-1/3">
              <label htmlFor="country_code" className="block text-sm font-medium text-gray-700 mb-1">
                Code
              </label>
              <input
                type="text"
                name="country_code"
                className={`w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                value={formik.values.country_code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
              />
              {formik.touched.country_code && formik.errors.country_code && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.country_code}</p>
              )}
            </div>
            <div className="w-2/3">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone number
              </label>
              <input
                type="text"
                name="phone"
                autoComplete="tel"
                className={`w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.phone}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
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
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <div className="mt-6 text-sm text-center text-gray-600">
          Already have an account?
          <Link href="/user/login" className="text-indigo-600 hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
