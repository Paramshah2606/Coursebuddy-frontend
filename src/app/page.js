'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router=useRouter();
  useEffect(()=>{
    router.push("/user/login");
  },[])
  return (
    <div className='min-h-screen text-gray-400 font-semibold flex justify-center item-center'>
      <div className='text-gray-400 font-semibold'>Redirecting you to login page...</div>
    </div>
  );
}
