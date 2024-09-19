import { PDFDocument, rgb } from 'pdf-lib';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
  console.log("開始！");
  
  // 既存のPDFファイルを読み込む
  const pdfPath = path.resolve('./public/A4分割PDF.pdf'); // publicフォルダに置く
  console.log("pdf読み込み！");
  
  let existingPdfBytes;
  try {
    existingPdfBytes = fs.readFileSync(pdfPath);
    console.log("pdf関係OK！");
  } catch (error) {
    console.error("PDF読み込みエラー:", error);
    return NextResponse.json({ message: 'PDF読み込みエラー' }, { status: 500 });
  }

  // PDFドキュメントをロードする
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // ページを取得
  const pages = pdfDoc.getPages();
  console.log(pages.length + "ページ取得完了！");
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  console.log(`Page size: width=${width}, height=${height}`);

  // ページにテキストを書き込む
  firstPage.drawText('Hello, World!', {
    x: 320,
    y: height - 100,
    size: 15,
    color: rgb(0, 0, 1),
  });
  firstPage.drawText('Hello, World!', {
    x: 320,
    y: height - 125,
    size: 15,
    color: rgb(0, 0, 1),
  });
  firstPage.drawText('Hello, World!', {
    x: 320,
    y: height - 145,
    size: 10,
    color: rgb(0, 0, 1),
  });
  firstPage.drawText('Hello, World!', {
    x: 320,
    y: height - 165,
    size: 15,
    color: rgb(0, 0, 1),
  });
  firstPage.drawText('A', {
    x: 510,
    y: height - 170,
    size: 15,
    color: rgb(0, 0, 1),
  });
  firstPage.drawText('B', {
    x: 540,
    y: height - 170,
    size: 15,
    color: rgb(0, 0, 1),
  });
  firstPage.drawText('C', {
    x: 570,
    y: height - 170,
    size: 15,
    color: rgb(0, 0, 1),
  });
  firstPage.drawText('AAAAA', {
    x: 600,
    y: height - 170,
    size: 15,
    color: rgb(0, 0, 1),
  });
  console.log("テキスト書き込み完了！");

  // 新しいPDFとして書き出す
  const pdfBytes = await pdfDoc.save();
  console.log("pdf書き出し完了！");


  // 新しいPDFをクライアントに返す
  return new NextResponse(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=newfile.pdf', // これにより、ファイルがダウンロードされます
    },
  });
  
}