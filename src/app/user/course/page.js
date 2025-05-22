'use client';
import { useState, useEffect } from "react";
import Course from "./Course";
import { getCourses, getCategories } from "@/api/apiHandler";

export default function CoursePage() {
  const [courses, setCourses] = useState(null);
  const [categories, setCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  async function fetchCourseCategories() {
    setLoading(true);
    let getCategoriesRes = await getCategories();
    if (getCategoriesRes) {
      setCategories(getCategoriesRes.data);
    }
    let getCoursesRes = await getCourses();
    if (getCoursesRes) {
      setCourses(getCoursesRes.data);
      setFilteredCourses(getCoursesRes.data);
    }
    setLoading(false);
  }

  async function handleCategoryClick(category_id) {
    setSelectedCategory(category_id);
    let data={category_id};
    data.search=search;
    setLoading(true);
    if (category_id == null) {
      setFilteredCourses(courses);
      setLoading(false);
    } else {
      console.log(data);
      const getCourseByCategoryRes = await getCourses(data);
      setFilteredCourses(getCourseByCategoryRes.data);
      setLoading(false);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();
    setLoading(true);
    let data = {
      search
    };
      data.category_id = selectedCategory;
      console.log(data);
    const getCourseBySearchRes = await getCourses(data);
    setFilteredCourses(getCourseBySearchRes.data);
    setLoading(false);
  }

  function handleSearchChange(term) {
    setSearch(term);
    if (term === '') {
      handleCategoryClick(selectedCategory);
    }
  }

  useEffect(() => {
    fetchCourseCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Browse Courses</h2>
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap gap-4 items-center justify-center bg-white rounded-lg shadow p-4 mb-8"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search Courses..."
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-52"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 transition font-semibold"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories ? (
            categories.length === 0 ? (
              <p className="text-gray-500">No categories found</p>
            ) : (
              <>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`px-4 py-2 rounded font-medium transition ${
                      selectedCategory === cat.id
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-indigo-100"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={`px-4 py-2 rounded font-medium transition ${
                    selectedCategory === null
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-indigo-100"
                  }`}
                >
                  All
                </button>
              </>
            )
          ) : (
            <p className="text-gray-500">Fetching categories...</p>
          )}
        </div>
        <div className="py-6">
          {loading ? (
            <div className="text-center text-gray-500 py-12">Loading Courses...</div>
          ) : !filteredCourses || filteredCourses.length === 0 ? (
            <div className="text-center text-gray-400 py-12">No Courses found.</div>
          ) : (
            <Course courses={filteredCourses} />
          )}
        </div>
      </div>
    </div>
  );
}