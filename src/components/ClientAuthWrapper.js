'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {jwtDecode} from "jwt-decode";

export default function ClientAuthWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('user-token');
    let role;
    if(token){
       const decoded = jwtDecode(token);
      console.log(decoded);
      role = decoded.role; 
    }

    const publicUserRoutes = ['/user/login', '/user/signup'];
    const publicAdminRoutes = ['/admin/login'];

    const isUserRoute = pathname.startsWith('/user');
    const isAdminRoute = pathname.startsWith('/admin');

    if (!token || !role) {
      if (isUserRoute && !publicUserRoutes.includes(pathname)) {
        router.push('/user/login');
        return;
      }
      if (isAdminRoute && !publicAdminRoutes.includes(pathname)) {
        router.push('/admin/login');
        return;
      }
    }

    if(token && role){
      if(publicUserRoutes.includes(pathname) || publicAdminRoutes.includes(pathname)){
        router.push(`/${role}/course`);
      }
    }

    if (role && (
      (isUserRoute && role !== 'user') ||
      (isAdminRoute && role !== 'admin')
    )) {
      router.push(`/${role}/course`);
      return;
    }

    setIsReady(true);
  }, [pathname, router]);

  if (!isReady) return null;

  return children;
}


