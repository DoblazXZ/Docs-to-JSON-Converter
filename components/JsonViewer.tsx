import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { ConvertedData } from '../types';

interface JsonViewerProps {
  files: ConvertedData[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ files, onRemove, onClearAll }) => {
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  // Set the newest file as active when files change or currently active is deleted
  useEffect(() => {
    if (files.length > 0) {
        if (!activeFileId || !files.find(f => f.id === activeFileId)) {
            setActiveFileId(files[files.length - 1].id);
        }
    } else {
        setActiveFileId(null);
    }
  }, [files, activeFileId]);

  if (files.length === 0) return null;

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  const handleDownloadSingle = (file: ConvertedData) => {
    const jsonString = JSON.stringify(file.data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.fileName.replace(/\s+/g, '_')}_converted.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllZip = async () => {
    try {
      const zip = new JSZip();
      
      // Filename collision handling
      const nameCounts: Record<string, number> = {};

      // Explicitly iterate over ALL files to add them to ZIP
      files.forEach(file => {
        // Strip existing extension and sanitized spaces
        let baseName = file.fileName.replace(/\s+/g, '_');
        baseName = baseName.replace(/\.(xlsx|xls|csv|txt|docx|doc|json)$/i, "");
        
        let fileName = baseName;

        // Handle duplicates by appending _1, _2 etc.
        if (nameCounts[baseName]) {
          nameCounts[baseName]++;
          fileName = `${baseName}_${nameCounts[baseName]}`;
        } else {
          nameCounts[baseName] = 1;
        }
        
        // Add file to zip
        zip.file(`${fileName}.json`, JSON.stringify(file.data, null, 2));
      });

      // Generate and download ZIP
      const content = await zip.generateAsync({type: "blob"});
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Vando_Docs_Batch_${files.length}_Files.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("ZIP Error:", error);
      alert("ZIP dosyası oluşturulurken hata oluştu. Tarayıcı konsolunu kontrol edin.");
    }
  };

  const handleCopy = () => {
    if (activeFile) {
      navigator.clipboard.writeText(JSON.stringify(activeFile.data, null, 2));
      alert('Aktif dosya JSON verisi panoya kopyalandı!');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-full animate-fade-in-up">
      {/* Top Toolbar with Tabs and Actions */}
      <div className="bg-gray-100 border-b border-gray-200 flex flex-col">
        
        {/* Actions Bar */}
        <div className="px-4 py-3 flex justify-between items-center bg-gray-50 border-b border-gray-200">
           <div className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 py-0.5 px-3 rounded-full text-xs font-bold border border-blue-200">
                {files.length} Dosya Yüklendi
              </span>
           </div>
           <div className="flex gap-2">
             <button 
                onClick={handleDownloadAllZip}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow transition-colors flex items-center gap-2"
                title="Listedeki tüm dosyaları ZIP olarak indir"
              >
                <i className="fas fa-file-archive"></i> Tümünü İndir (ZIP)
              </button>
              <button 
                onClick={onClearAll}
                className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 text-xs font-medium rounded transition-colors"
                title="Listeyi Temizle"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
           </div>
        </div>

        {/* Horizontal Tabs Scrollable Container */}
        <div className="flex overflow-x-auto bg-gray-200 p-1 gap-1 whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {files.map(file => (
            <div 
              key={file.id}
              onClick={() => setActiveFileId(file.id)}
              className={`
                group flex items-center min-w-[140px] max-w-[200px] px-3 py-2 rounded-t-lg cursor-pointer text-xs font-medium border-b-2 transition-all select-none
                ${(activeFile && activeFile.id === file.id) 
                  ? 'bg-gray-800 text-white border-blue-500 shadow-sm relative z-10' 
                  : 'bg-white text-gray-600 border-transparent hover:bg-gray-50 opacity-90'}
              `}
            >
              <i className={`mr-2 ${file.fileType.includes('excel') || file.fileName.endsWith('xls') || file.fileName.endsWith('csv') ? 'fas fa-file-excel text-green-500' : 'fas fa-file-alt text-blue-400'}`}></i>
              <span className="truncate flex-1 mr-2" title={file.fileName}>{file.fileName}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); onRemove(file.id); }}
                className={`w-5 h-5 flex items-center justify-center rounded-full transition-colors ${(activeFile && activeFile.id === file.id) ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-red-100 hover:text-red-500 text-gray-300'}`}
                title="Bu dosyayı kapat"
              >
                <i className="fas fa-times text-[10px]"></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active File Header */}
      {activeFile && (
        <div className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center shadow-md z-10 relative">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-gray-700 p-2 rounded text-white shrink-0">
              <i className="fas fa-code text-sm"></i>
            </div>
            <div className="truncate">
              <h3 className="font-bold text-sm truncate text-white" title={activeFile.fileName}>{activeFile.fileName}</h3>
              <p className="text-[10px] text-gray-400 font-mono">{activeFile.fileType} • {new Date(activeFile.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
          
          <div className="flex gap-2 shrink-0 ml-2">
            <button 
              onClick={handleCopy}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors text-white flex items-center gap-2"
              title="JSON Kopyala"
            >
              <i className="fas fa-copy"></i> <span className="hidden sm:inline">Kopyala</span>
            </button>
            <button 
              onClick={() => handleDownloadSingle(activeFile)}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-xs transition-colors text-white flex items-center gap-2"
              title="Sadece bu dosyayı indir"
            >
              <i className="fas fa-download"></i> <span className="hidden sm:inline">İndir (.json)</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Active File Content */}
      <div className="flex-1 overflow-auto bg-gray-900 p-4 min-h-[400px]">
        {activeFile ? (
          <pre className="font-mono text-sm text-green-400 leading-relaxed whitespace-pre-wrap break-all">
            {JSON.stringify(activeFile.data, null, 2)}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 flex-col">
            <i className="fas fa-file-code text-4xl mb-4 opacity-50"></i>
            <span>Görüntülenecek dosya yok</span>
          </div>
        )}
      </div>
      
      {activeFile && (
        <div className="bg-gray-100 px-6 py-2 text-xs text-gray-500 border-t border-gray-200 flex justify-between font-mono">
          <span>Uzunluk: {JSON.stringify(activeFile.data).length} karakter</span>
          <span>UTF-8 JSON</span>
        </div>
      )}
    </div>
  );
};

export default JsonViewer;