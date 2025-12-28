import React, { useState, useEffect } from 'react';
import { ConvertedData, GoogleCredentials } from '../types';
import { getDeviceId, generateUniqueId } from '../services/identityService';

interface GoogleDocsFetcherProps {
  onFilesAdded: (data: ConvertedData[]) => void;
  onError: (msg: string) => void;
}

// Scopes required
const SCOPES = "https://www.googleapis.com/auth/documents.readonly";
const DISCOVERY_DOCS = ['https://docs.googleapis.com/$discovery/rest?version=v1'];

const GoogleDocsFetcher: React.FC<GoogleDocsFetcherProps> = ({ onFilesAdded, onError }) => {
  const [docUrl, setDocUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [creds, setCreds] = useState<GoogleCredentials>({
    clientId: '',
    apiKey: ''
  });
  const [showSettings, setShowSettings] = useState(false);
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [gisLoaded, setGisLoaded] = useState(false);
  const [tokenClient, setTokenClient] = useState<any>(null);

  // Load state from local storage on mount
  useEffect(() => {
    const savedCreds = localStorage.getItem('vando_google_creds');
    if (savedCreds) {
      setCreds(JSON.parse(savedCreds));
    }

    // Check if scripts are loaded
    const checkGapi = setInterval(() => {
      if (window.gapi) {
        setGapiLoaded(true);
        clearInterval(checkGapi);
      }
    }, 500);

    const checkGis = setInterval(() => {
      if (window.google) {
        setGisLoaded(true);
        clearInterval(checkGis);
      }
    }, 500);

    return () => {
      clearInterval(checkGapi);
      clearInterval(checkGis);
    };
  }, []);

  const extractDocId = (url: string): string | null => {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : (url.length > 20 ? url : null);
  };

  const initializeGapiClient = async () => {
    if (!creds.apiKey) throw new Error("API Anahtarı eksik. Lütfen ayarlardan ekleyin.");
    
    await new Promise<void>((resolve, reject) => {
      window.gapi.load('client', { callback: resolve, onerror: reject });
    });

    await window.gapi.client.init({
      apiKey: creds.apiKey,
      discoveryDocs: DISCOVERY_DOCS,
    });
  };

  const handleAuthAndFetch = async () => {
    const docId = extractDocId(docUrl);
    if (!docId) {
      onError("Geçerli bir Google Doküman URL'si veya ID'si giriniz.");
      return;
    }

    if (!creds.clientId || !creds.apiKey) {
      setShowSettings(true);
      onError("Lütfen önce Google Cloud Credentials bilgilerinizi giriniz.");
      return;
    }

    setLoading(true);

    try {
      // 1. Initialize GAPI Client if needed
      if (!window.gapi.client.docs) {
        await initializeGapiClient();
      }

      // 2. Initialize Token Client if needed
      let client = tokenClient;
      if (!client) {
        client = window.google.accounts.oauth2.initTokenClient({
          client_id: creds.clientId,
          scope: SCOPES,
          callback: async (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              await fetchDocContent(docId);
            } else {
              setLoading(false);
              onError("Yetkilendirme başarısız oldu.");
            }
          },
        });
        setTokenClient(client);
      }

      // 3. Request Token (Triggers Popup)
      client.requestAccessToken();

    } catch (err: any) {
      console.error(err);
      onError(`Bağlantı Hatası: ${err.message || err.result?.error?.message}`);
      setLoading(false);
    }
  };

  const fetchDocContent = async (docId: string) => {
    try {
      const response = await window.gapi.client.docs.documents.get({
        documentId: docId,
      });
      
      const currentDeviceId = getDeviceId(); // Get stable user ID

      onFilesAdded([{
        id: generateUniqueId(),
        creatorId: currentDeviceId, // Inject User ID
        fileName: response.result.title || "Google Doc",
        fileType: 'google-doc',
        data: response.result.body, 
        timestamp: new Date().toISOString()
      }]);
      setDocUrl(''); // Clear input on success
    } catch (err: any) {
      onError(`Doküman okuma hatası: ${err.result?.error?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('vando_google_creds', JSON.stringify(creds));
    setShowSettings(false);
    window.location.reload();
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <i className="fab fa-google text-blue-500"></i> Google Docs Import
        </h3>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 underline"
        >
          <i className="fas fa-cog"></i> API Ayarları
        </button>
      </div>

      {showSettings && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm space-y-3 mb-4 animate-fade-in">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Client ID</label>
            <input 
              type="text" 
              value={creds.clientId}
              onChange={(e) => setCreds({...creds, clientId: e.target.value})}
              placeholder="xxxxxxxx.apps.googleusercontent.com"
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">API Key</label>
            <input 
              type="text" 
              value={creds.apiKey}
              onChange={(e) => setCreds({...creds, apiKey: e.target.value})}
              placeholder="AIzaSy..."
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setShowSettings(false)}
              className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded"
            >
              İptal
            </button>
            <button 
              onClick={saveSettings}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Kaydet
            </button>
          </div>
          <p className="text-xs text-yellow-600 mt-2">
            <i className="fas fa-exclamation-triangle mr-1"></i>
            Bu bilgileri Google Cloud Console'dan almalısınız. Sadece tarayıcınızın yerel hafızasında (LocalStorage) saklanır.
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <input 
          type="text" 
          value={docUrl}
          onChange={(e) => setDocUrl(e.target.value)}
          placeholder="https://docs.google.com/document/d/..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
        />
        <button
          onClick={handleAuthAndFetch}
          disabled={loading || !gapiLoaded || !gisLoaded}
          className={`px-6 py-2 rounded-lg font-medium text-white transition-all shadow-md flex items-center gap-2
            ${loading || !gapiLoaded || !gisLoaded
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
            }`}
        >
          {loading ? (
            <><i className="fas fa-spinner fa-spin"></i> İşleniyor</>
          ) : (
            <><i className="fas fa-file-import"></i> JSON'a Çevir</>
          )}
        </button>
      </div>
      
      {(!gapiLoaded || !gisLoaded) && (
        <p className="text-xs text-orange-500 animate-pulse">
          Google API kütüphaneleri yükleniyor...
        </p>
      )}

      <div className="text-xs text-gray-500">
        <p>Google Docs API v1 kullanılarak dökümanın <code>body</code> yapısı JSON formatında çekilir.</p>
      </div>
    </div>
  );
};

export default GoogleDocsFetcher;