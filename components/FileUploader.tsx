import React, { useCallback, useState } from 'react';
import { parseLocalFile } from '../services/localFileService';
import { getDeviceId, generateUniqueId } from '../services/identityService';
import { ConvertedData } from '../types';

interface FileUploaderProps {
  onFilesAdded: (files: ConvertedData[]) => void;
  onError: (msg: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesAdded, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const processFiles = async (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    const currentDeviceId = getDeviceId(); // Get stable user ID
    
    if (filesArray.length > 15) {
      onError("Toplu yükleme sınırı aşıldı. Tek seferde en fazla 15 dosya yükleyebilirsiniz.");
      return;
    }

    setIsLoading(true);
    const errors: string[] = [];
    
    // Process all files in parallel
    const promises = filesArray.map(async (file) => {
      try {
        const result = await parseLocalFile(file);
        return {
          id: generateUniqueId(),
          creatorId: currentDeviceId, // Inject User ID
          fileName: file.name,
          fileType: file.type || file.name.split('.').pop() || 'unknown',
          data: result,
          timestamp: new Date().toISOString()
        } as ConvertedData;
      } catch (err: any) {
        errors.push(`${file.name}: ${err.message || "Hata oluştu"}`);
        return null;
      }
    });

    try {
      const results = await Promise.all(promises);
      const validFiles = results.filter((f): f is ConvertedData => f !== null);

      if (validFiles.length > 0) {
        onFilesAdded(validFiles);
      }
      
      if (errors.length > 0) {
        onError(errors.join(' | '));
      }
    } catch (err) {
      onError("Dosya işleme sırasında genel bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // Reset input value to allow selecting the same files again if needed
    e.target.value = '';
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 cursor-pointer relative overflow-hidden
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 scale-[1.01]' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 bg-white'
          }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input 
          type="file" 
          id="fileInput" 
          className="hidden" 
          onChange={onInputChange}
          accept=".csv,.xlsx,.xls,.txt,.doc,.docx,.json" 
          multiple
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-4">
             <i className="fas fa-circle-notch fa-spin text-4xl text-blue-600 mb-4"></i>
             <p className="text-gray-600 animate-pulse">Dosyalar analiz ediliyor...</p>
             <p className="text-xs text-gray-400 mt-2">Bu işlem dosya boyutuna göre biraz zaman alabilir.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
              <i className="fas fa-cloud-upload-alt text-3xl"></i>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                Dosyaları sürükleyin veya <span className="text-blue-600 underline">seçmek için tıklayın</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Maksimum 15 dosya (XLSX, CSV, DOCX, TXT, JSON)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;