'use client'

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { addLesson } from '@/api/apiHandler';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';


const QuillEditor = dynamic(() => import('react-quill-new'), { ssr: false });


export default function Home() {
  const [content, setContent] = useState('');
  const {id}=useParams();
  const router=useRouter();
  
  const [loading,setLoading]=useState(false);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3,4, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      [{ align: [] }],
      [{ color: [] }],
    ],
  };


  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'link',
    'align',
    'color',
  ];


  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  async function handleAdd(){
    try {
      setLoading(true);
      let res=await addLesson({id,text_lesson:content});
      setLoading(false);
      if(res.code==1){
        toast.success(res.message);
        router.push(`/admin/course/${id}`);
        setContent('');
      }else{
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Try again after sometime");
    }
  }


  return (
    <main>
      <div className="h-screen w-screen flex items-center flex-col">
      <h2 className="text-2xl font-semibold mb-4 mt-4">Add Text Lesson</h2>
        <div className="h-[70%] w-[90vw]">
          <QuillEditor
            value={content}
            onChange={handleEditorChange}
            modules={quillModules}
            formats={quillFormats}
            className="w-full h-[70%] mt-10 bg-white"
          />
        </div>
        <button
            onClick={handleAdd}
            disabled={loading}
            className="flex items-center justify-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-700 transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
          {!loading ? "Add Lesson" : "Adding Lesson..."}
        </button>
      </div>
    </main>
  );
}