'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {jwtDecode} from "jwt-decode";

export default function Navbar() {
  const router = useRouter();
  const pathname=usePathname();
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    fetchToken();
  }, []);

  function fetchToken(){
    setToken(localStorage.getItem('user-token'));
    const token=localStorage.getItem('user-token');
    if(token){
      const decoded = jwtDecode(token);
      console.log(decoded);
      const role = decoded.role;
      setRole(role);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user-token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    router.push(role === 'admin' ? '/admin/login' : '/user/login');
  };

  return (
    <nav className="bg-indigo-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold tracking-tight hover:text-indigo-200 transition">Course-buddy</a>
        <div className="md:flex items-center space-x-6">
          {!token && (
            <>
            {pathname.startsWith('/admin') ?
              <button
                onClick={() => router.push('/user/login')}
                className="bg-white text-indigo-700 px-4 py-2 rounded hover:bg-indigo-50 font-medium transition"
              >
                User Login
              </button> 
              :
              <button
                onClick={() => router.push('/admin/login')}
                className="bg-white text-indigo-700 px-4 py-2 rounded hover:bg-indigo-50 font-medium transition"
              >
                Admin Login
              </button>
            }
            </>
          )}

          {token && role === 'user' && (
            <>
              <button onClick={() => router.push('/user/course')} className="hover:text-indigo-200 transition">Home</button>
            </>
          )}

          {token && role === 'admin' && (
            <>
              <button onClick={() => router.push('/admin/course')} className="hover:text-indigo-200 transition">Course Management</button>
              <button onClick={() => router.push('/admin/userList')} className="hover:text-indigo-200 transition">User Management</button>
            </>
          )}

          {token && (
            <button
              onClick={handleLogout}
              className="ml-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 font-medium transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}