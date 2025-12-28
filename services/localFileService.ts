import * as XLSX from 'xlsx';
import mammoth from 'mammoth';

// Helper to read file as ArrayBuffer
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) resolve(e.target.result as ArrayBuffer);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// Helper to read file as Text with explicit UTF-8 encoding
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) resolve(e.target.result as string);
    };
    reader.onerror = reject;
    reader.readAsText(file, 'UTF-8');
  });
};

export const parseLocalFile = async (file: File): Promise<any> => {
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'xlsx':
    case 'xls':
    case 'csv':
      try {
        const data = await readFileAsArrayBuffer(file);
        // codepage: 65001 ensures UTF-8 is used for CSV files if BOM is missing. 
        // It is ignored for binary Excel files which handle encoding internally.
        const workbook = XLSX.read(data, { type: 'array', codepage: 65001 });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(sheet, { defval: "" });
      } catch (error) {
        console.error(error);
        throw new Error("Excel/CSV dosyası okunamadı.");
      }

    case 'txt':
      try {
        const text = await readFileAsText(file);
        // Simple strategy: Split by lines, try to return an array of lines or just the content object
        return {
          content: text,
          lines: text.split('\n').map(line => line.trim()).filter(Boolean)
        };
      } catch (error) {
        throw new Error("Metin dosyası okunamadı.");
      }

    case 'docx':
    case 'doc':
      try {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        // Using mammoth to extract raw text. 
        // Note: For full JSON structure preservation of a Docx, complex parsing is needed.
        // Mammoth is best for extracting content to HTML or Text.
        const result = await mammoth.extractRawText({ arrayBuffer });
        return {
          fullText: result.value,
          messages: result.messages,
          paragraphs: result.value.split('\n').filter(p => p.trim().length > 0)
        };
      } catch (error) {
        throw new Error("Word dosyası okunamadı. Lütfen dosyanın bozuk olmadığından emin olun.");
      }
      
    case 'json':
      try {
        const jsonText = await readFileAsText(file);
        return JSON.parse(jsonText);
      } catch (error) {
        throw new Error("Geçersiz JSON dosyası.");
      }

    default:
      throw new Error("Desteklenmeyen dosya formatı.");
  }
};