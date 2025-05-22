'use client';
import { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import { getUsers } from "@/api/apiHandler";
import Link from "next/link";
import { useRouter } from "next/navigation";

function UserTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const usersPerPage = 10;
  const Router=useRouter();


  function handleProgress(id){
    Router.push(`/admin/userProgress/${id}`);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await getUsers();
      setUsers(res.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);
  const pages = [...Array(totalPages)].map((_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">User Management</h1>

      {users.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          No users found.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-700">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-700">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.email} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-700">{user.full_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{user.phone}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.role=='user' &&
                      <Link href={`/admin/userProgress/${user.id}`} className="text-white bg-green-400 hover:bg-green-800 px-4 py-2 transition font-medium text-sm rounded">
                        View Progress
                      </Link>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center p-4 border-t border-gray-200">
            <nav className="flex space-x-2">
              {pages.map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    currentPage === num 
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {num}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserTable;