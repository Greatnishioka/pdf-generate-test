"use client"; 
import { useState } from 'react'; 

export default function Home() { 
  const [inputValue] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  // フォーム送信ハンドラ
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // ページリロードを防ぐ

    try {
      console.log("page.tsx開始！");

      const res = await fetch('/api/re-write', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: inputValue }),
      });

      console.log("page.tsx設定OK！");

      if (!res.ok) {
        throw new Error(`サーバーエラー: ${res.statusText}`);
      }

      const blob = await res.blob();

      // PDFファイルをダウンロードさせる
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'output.pdf'; // ダウンロードするファイル名
      document.body.appendChild(a); // ダウンロードリンクを一時的に追加
      a.click(); // ダウンロードを自動的に開始
      a.remove(); // リンクを削除

      setResponseMessage('PDFのダウンロードが完了しました！');
    } catch (error) {
      console.error('エラーが発生しました', error);
      setResponseMessage('エラーが発生しました');
    }
  };

  return ( 
    <main className="w-full h-screen flex justify-center items-center"> 
      <div className="w-[375px] h-full flex justify-center items-center flex-col"> 
        {/* フォームに onSubmit を追加 */}
        <form method='POST' onSubmit={handleSubmit} className="bg-slate-500 w-80 h-24 rounded-md text-white flex justify-center items-center"> 
          {/* input type="submit" に変更 */}
          <input type="submit" value="PDF発行！" className=" text-white font-bold py-2 px-4 rounded" /> 
        </form> 
        {/* レスポンスメッセージを表示する */}
        {responseMessage && <p>{responseMessage}</p>}
      </div> 
    </main> 
  ); 
} 
