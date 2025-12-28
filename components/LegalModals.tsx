import React from 'react';

type ModalType = 'privacy' | 'terms' | 'cookies' | null;

interface LegalModalsProps {
  activeModal: ModalType;
  onClose: () => void;
}

const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  if (!activeModal) return null;

  const content = {
    privacy: {
      title: "Gizlilik Politikası",
      body: (
        <div className="space-y-4 text-sm text-gray-700">
          <p><strong>Son Güncelleme:</strong> {new Date().toLocaleDateString('tr-TR')}</p>
          <p>Vando Agency ("Biz") olarak gizliliğinize önem veriyoruz. Bu "Docs to JSON" aracı, tamamen istemci taraflı (client-side) çalışan bir web uygulamasıdır.</p>
          
          <h4 className="font-bold text-gray-900">1. Veri İşleme ve Depolama</h4>
          <p>Uygulamamıza yüklediğiniz (sürükle-bırak veya dosya seçimi yoluyla) hiçbir dosya (Excel, Word, CSV vb.) sunucularımıza yüklenmez. Tüm dönüştürme işlemleri, tarayıcınızın belleğinde, JavaScript teknolojisi kullanılarak cihazınızda gerçekleşir. Dosyalarınız cihazınızı terk etmez.</p>

          <h4 className="font-bold text-gray-900">2. Google Docs Entegrasyonu</h4>
          <p>Google Docs'tan veri çekerken, işlem doğrudan Google API'leri ile tarayıcınız arasında gerçekleşir. Erişim jetonları (Access Tokens) veya API anahtarları sunucularımızda saklanmaz, sadece tarayıcınızın <code>localStorage</code> alanında, bir sonraki ziyaretinizde kullanım kolaylığı sağlamak amacıyla tutulur.</p>

          <h4 className="font-bold text-gray-900">3. Analitikler</h4>
          <p>Hizmet kalitesini artırmak amacıyla, kişisel olarak tanımlanamayan (anonim) kullanım verilerini toplamak için Google Analytics kullanmaktayız. IP adresiniz anonimleştirilerek işlenir.</p>

          <h4 className="font-bold text-gray-900">4. Kullanıcı İzolasyonu</h4>
          <p>Bu uygulama tarayıcı tabanlıdır. Her kullanıcının oturumu kendi tarayıcısında izole edilmiştir. Başka kullanıcılar verilerinizi göremez.</p>
        </div>
      )
    },
    terms: {
      title: "Kullanım Şartları",
      body: (
        <div className="space-y-4 text-sm text-gray-700">
          <p>Lütfen "Docs to JSON" aracını kullanmadan önce bu şartları dikkatlice okuyunuz.</p>
          
          <h4 className="font-bold text-gray-900">1. Hizmetin Niteliği</h4>
          <p>Bu araç, geliştiriciler ve veri analistleri için doküman formatlarını JSON formatına çevirmek amacıyla "olduğu gibi" (as-is) sunulmaktadır. Vando Agency, dönüştürme işlemlerinin %100 doğruluğunu garanti etmez.</p>

          <h4 className="font-bold text-gray-900">2. Sorumluluk Reddi</h4>
          <p>Bu aracın kullanımından doğabilecek veri kayıpları, hatalı dönüşümler veya ticari zararlardan Vando Agency sorumlu tutulamaz. Kritik verilerinizle işlem yapmadan önce yedek almanız önerilir.</p>

          <h4 className="font-bold text-gray-900">3. Fikri Mülkiyet</h4>
          <p>Uygulamanın kaynak kodları ve tasarımı Vando Agency mülkiyetindedir. Ancak, araçla dönüştürdüğünüz verilerin (JSON çıktılarının) tüm hakları size aittir.</p>
        </div>
      )
    },
    cookies: {
      title: "Çerez Politikası",
      body: (
        <div className="space-y-4 text-sm text-gray-700">
          <p>Deneyiminizi iyileştirmek için çerezler (cookies) ve yerel depolama (local storage) teknolojilerini kullanıyoruz.</p>

          <h4 className="font-bold text-gray-900">1. Zorunlu Çerezler / Yerel Depolama</h4>
          <p>Uygulamanın çalışması için gerekli olan verilerdir. Örneğin: Google API anahtarlarınızı tarayıcınızda hatırlamak için kullanılan veriler.</p>

          <h4 className="font-bold text-gray-900">2. Analitik Çerezleri</h4>
          <p>Ziyaretçi sayılarını ve trafik kaynaklarını ölçmemize olanak tanıyan Google Analytics çerezleridir. Bu bilgiler toplu halde tutulur ve anonimdir.</p>
          
          <p className="bg-blue-50 p-3 rounded border border-blue-100">
            Çerez ayarlarını tarayıcınızın ayarlar bölümünden dilediğiniz zaman değiştirebilirsiniz.
          </p>
        </div>
      )
    }
  };

  const activeContent = content[activeModal];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">{activeContent?.title}</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-800"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {activeContent?.body}
        </div>
        
        <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModals;