# Google Docs & Excel to JSON Converter

**Vando Agency** tarafından geliştirilen bu proje, **Excel, Word, CSV, TXT, PDF ve Google Docs** dosyalarınızı tarayıcı üzerinde (Client-Side) çalışan güvenli bir altyapı ile **JSON formatına** dönüştüren modern bir web uygulamasıdır.

Proje **React 19**, **Vite**, **TypeScript** ve **Tailwind CSS** kullanılarak geliştirilmiştir. Sunucu taraflı bir işlem barındırmaz; tüm dosya ayrıştırma işlemleri kullanıcının tarayıcısında gerçekleşir.

---

## 🚀 Özellikler

*   **Geniş Format Desteği:**
    *   **Excel (`.xlsx`, `.xls`):** Çoklu sayfa (sheet) desteği ile her sekmeyi ayrı bir JSON olarak dışarı aktarır.
    *   **CSV:** Virgülle ayrılmış verileri JSON dizilerine dönüştürür.
    *   **Word (`.docx`):** Paragrafları ve metin yapısını koruyarak ayrıştırır.
    *   **PDF:** Sayfa bazlı metin çıkarma işlemi yapar.
    *   **Text (`.txt`) ve JSON:** Düz metinleri işler.
    *   **Google Docs Entegrasyonu:** OAuth2 ile Google Drive üzerindeki dokümanlarınızı doğrudan çeker.
*   **Gizlilik Odaklı:** Dosyalar sunucuya yüklenmez, işlem tamamen tarayıcıda gerçekleşir.
*   **Toplu İşlem:** 
    *   Aynı anda 15 dosyaya kadar yükleme.
    *   Tek tıklamayla tüm sonuçları **ZIP** arşivi olarak indirme.
*   **JSON Önizleme:** Renklendirilmiş sözdizimi, kopyalama ve tekil indirme seçenekleri.
*   **Çoklu Dil:** Türkçe (TR) ve İngilizce (EN) dil desteği.
*   **Modern UI:** Tailwind CSS ile duyarlı (responsive) tasarım.

---

## 🛠️ Teknoloji Yığını

*   **Core:** React 19, TypeScript, Vite
*   **Styling:** Tailwind CSS, FontAwesome
*   **State Management:** React Context API (LanguageContext)
*   **File Parsing:**
    *   `xlsx` (Excel/CSV)
    *   `mammoth` (Word)
    *   `pdfjs-dist` (PDF)
*   **Integration:** Google Identity Services (GIS), Google API Client (gapi)

---

## ⚙️ Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/vandoagency/document-to-json.git
cd document-to-json
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
# veya
yarn install
```

### 3. Uygulamayı Başlatın (Development)
```bash
npm run dev
```
Tarayıcınızda `http://localhost:5173` adresine giderek uygulamayı görüntüleyebilirsiniz.

### 4. Production Build Almak
```bash
npm run build
```
Bu komut `dist/` klasörüne optimize edilmiş statik dosyaları çıkarır.

---

## 🔑 Konfigürasyon (Google Docs API)

Uygulama Google Docs verilerini çekmek için Google API kullanır. Yerel ortamda veya kendi hostunuzda bu özelliği kullanmak için:

1.  [Google Cloud Console](https://console.cloud.google.com/)'da bir proje oluşturun.
2.  **Google Docs API**'yi etkinleştirin.
3.  **Credentials** (Kimlik Bilgileri) oluşturun:
    *   **API Key:** Genel erişim için.
    *   **OAuth 2.0 Client ID:** Kullanıcı oturumu açmak için (Authorised JavaScript origins kısmına `http://localhost:5173` ve production domaininizi ekleyin).
4.  Uygulama arayüzündeki **Google Docs** sekmesinde "API Ayarları"na tıklayarak bu bilgileri girin. (Bilgiler tarayıcınızın LocalStorage alanında saklanır).

---

## 📂 Proje Yapısı

```
src/
├── components/       # UI bileşenleri (Header, FileUploader, JsonViewer vb.)
├── contexts/         # Global state (LanguageContext)
├── services/         # İş mantığı (localFileService, googleDocsFetcher)
├── types/            # TypeScript tip tanımlamaları
├── App.tsx           # Ana uygulama bileşeni
└── index.tsx         # Giriş noktası
```

---

## 🔒 Güvenlik & Gizlilik

*   **Client-Side Processing:** `services/localFileService.ts` dosyası incelendiğinde görüleceği üzere, dosyalar `FileReader` API kullanılarak tarayıcıda okunur. Herhangi bir backend servisine POST edilmez.
*   **Google Auth:** OAuth işlemleri Google'ın resmi kütüphaneleri (`accounts.google.com/gsi/client`) üzerinden yönetilir. Token'lar sunucumuzda saklanmaz.

---

## ⚖️ Lisans

Bu proje **Vando Agency** tarafından geliştirilmiştir.
Ticari kullanım, özel lisanslama ve kurumsal çözümler için iletişime geçiniz.

## 📬 İletişim

**Vando Agency**
🌐 [https://vandoagency.com](https://vandoagency.com)
📧 info@vandoagency.com
