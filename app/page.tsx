"use client"; 
import { useState } from 'react'; 

export default function Home() { 
  const [inputValue] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  // フォーム送信ハンドラ
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // ページリロード防ぐ

    try {
      console.log("page.tsxの方のスクリプト稼動開始！");

      //
      const res = await fetch('/api/re-write', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: inputValue }),
      });

      console.log("page.tsx設定OK！");

      //404とかroute.tsが無い場合とかにエラー
      if (!res.ok) {
        throw new Error(`サーバーエラー: ${res.statusText}`);
      }

      //pdfの中身(バイナリデータ)
      const blob = await res.blob();

      // PDFファイルをダウンロードさせる
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'output.pdf'; // ダウンロードするファイル名(バイナリデータをpdfにしてる)
      document.body.appendChild(a); // ダウンロードリンクを一時的に追加
      a.click(); // ダウンロードリンクを強制クリック
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
        
        <form method='POST' onSubmit={handleSubmit} className="bg-slate-500 w-80 h-24 rounded-md text-white flex justify-center items-center active:bg-black"> 
          <input type="submit" value="PDF発行！" className=" text-white font-bold py-2 px-4 rounded" /> 
        </form> 
        {/* ここでメッセが返ってきてる場合表示 */}
        {responseMessage && <p>{responseMessage}</p>}
      </div> 
    </main> 
  ); 
} 
