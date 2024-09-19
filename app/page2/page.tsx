"use client"; 
import { useState } from 'react'; 

export default function Home() { 
  const [inputValue] = useState(''); 
  const [responseMessage, setResponseMessage] = useState(''); 

  // フォーム送信ハンドラ 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
    console.log("page.tsx開始！")
    e.preventDefault();  // ページリロードを防ぐ 
    console.log("page.tsx開始2！")
    try { 
      const res = await fetch('/api/pdf-rewrite', { //http://localhost:3000/api/pdf-rewrite
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
        }, 
        body: JSON.stringify({ data: inputValue }), 
      }); 
      console.log("page.tsx設定OK！")

      const result = await res.json(); 
       
      // APIからのレスポンスを表示 
      setResponseMessage(result.message); 
    } catch (error) { 
      console.error('エラーが発生しました', error); 
      setResponseMessage('エラーが発生しました'); 
    } 
  }; 

  return ( 
    <main className="w-full h-screen flex justify-center items-center"> 
      <div className="w-[375px] h-full flex justify-center items-center"> 
        {/* フォームに onSubmit を追加 */}
        <form onSubmit={handleSubmit} className="bg-slate-500 w-80 h-24 rounded-md text-white flex justify-center items-center"> 
          {/* input type="submit" に変更 */}
          <input type="submit" value="PDF発行！" className=" text-white font-bold py-2 px-4 rounded" /> 
        </form> 
        {/* レスポンスメッセージを表示する */}
        {responseMessage && <p>{responseMessage}</p>}
      </div> 
    </main> 
  ); 
} 
