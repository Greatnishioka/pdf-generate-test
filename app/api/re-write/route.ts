import { PDFDocument, rgb } from 'pdf-lib'; 
import { NextResponse } from 'next/server'; 
import fs from 'fs'; 
import path from 'path'; 

const fontkit = require('fontkit');  // requireでfontkitをインポート(eslintに引っかかる形なので要修正？)

export async function POST() { 
  console.log("開始！"); 
   
  // 既存のPDFファイルとフォントを読み込む(フォントをWebフォントにできる？←必要であれば要検証) 
  const pdfPath = path.resolve('./public/A4分割PDF.pdf'); // publicフォルダに置く 
  const fontPath = path.resolve('./public/NotoSansJP-Medium.ttf'); // publicフォルダに置く 
  console.log("pdf・フォント存在確認OK！"); 
   
  let existingPdfBytes; 
  let fontBytes; 

  try { 
    existingPdfBytes = fs.readFileSync(pdfPath); 
    fontBytes = fs.readFileSync(fontPath); 
    console.log("pdf・フォント関係の読み込みOK！"); 
  } catch (error) { 
    console.error("PDF読み込みエラー:", error); 
    return NextResponse.json({ message: 'PDF読み込みエラー' }, { status: 500 }); 
  } 

  // PDFのロード 
  const pdfDoc = await PDFDocument.load(existingPdfBytes); 

  // fontkit読み込み←なんか日本語フォント使う場合は必須っぽいけど、結構クセ者な感じする。
  pdfDoc.registerFontkit(fontkit);  

  //ここでフォント使用可能にしてる
  const customFont = await pdfDoc.embedFont(fontBytes); 

  // ページ取得 
  const pages = pdfDoc.getPages(); 
  console.log(pages.length + "ページ取得完了OK！"); 
  const firstPage = pages[0]; 

  //↓pdfのサイズ
  //width=841.89, height=595.276

  // ページにテキストを書き込む 
  firstPage.drawText('Hello, World!', { 
    x: 320, 
    y: 500, 
    size: 15, 
    color: rgb(0, 0, 1), 
    font: customFont,  // これ指定しないとフォントはデフォルト(日本語非対応)のものが使われてしまう
  }); 
  firstPage.drawText('西岡', { 
    x: 600, 
    y: 420, 
    size: 15, 
    color: rgb(0, 0, 1), 
    font: customFont,  
  }); 
  console.log("テキスト書き込みOK！"); 

  // 新しいPDFとして書き出す 
  const pdfBytes = await pdfDoc.save(); 
  console.log("pdf書き出しOK！"); 

  // 新しいPDFをクライアントに返す 
  return new NextResponse(pdfBytes, { 
    headers: { 
      'Content-Type': 'application/pdf', 
      'Content-Disposition': 'attachment; filename=newfile.pdf', // これでファイルがダウンロードできる
    }, 
  }); 
}
