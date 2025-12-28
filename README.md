# Dokümanlarınızı Anında JSON'a Çevirin

**Vando Agency** güvencesiyle; **Excel, Word, CSV, TXT, PDF ve Google Docs** dosyalarınızı geliştiriciler için **işlenebilir, temiz ve standart JSON formatına** dönüştürün.

Bu proje; veri işleme, entegrasyon, yapay zeka, raporlama ve otomasyon süreçlerinde dokümanları hızlıca JSON çıktısına dönüştürmek isteyen ekipler için geliştirilmiştir.

---

## 🚀 Özellikler

- 📄 Çoklu dosya formatı desteği  
  - Excel (`.xlsx`, `.xls`)
  - Word (`.docx`)
  - CSV
  - TXT
  - PDF
  - Google Docs
- 🔄 Otomatik JSON şeması oluşturma
- 🧹 Temiz ve normalize edilmiş veri çıktısı
- 🤖 AI & API entegrasyonlarına hazır yapı
- ⚡ Hızlı ve ölçeklenebilir dönüşüm altyapısı
- 🛠️ Geliştirici dostu çıktı formatı

---

## 🧠 Kullanım Senaryoları

- Yapay zeka model eğitimi (LLM, RAG, embedding)
- API entegrasyonları
- Veri migrasyonu
- Raporlama ve dashboard sistemleri
- No-code / Low-code platformlar
- Backend & frontend veri besleme

---

## ⚙️ Kurulum, Çalıştırma, Konfigürasyon, Güvenlik, Entegrasyon ve Lisans

### Kurulum

```bash
git clone https://github.com/vandoagency/document-to-json
cd document-to-json
npm install
```

### Çalıştırma

```bash
npm run start
```

veya

```bash
node index.js --file ./docs/ornek.pdf
```

### Konfigürasyon

`config.json` dosyası üzerinden aşağıdaki ayarlar yönetilebilir:

- JSON şema yapısı
- Dil algılama ve otomatik etiketleme
- Sayfa / tablo / paragraf bazlı ayrıştırma
- Metadata detayları
- AI destekli içerik ayrıştırma (opsiyonel)

### Güvenlik & Gizlilik

- Dosyalar üçüncü taraf servislerle paylaşılmaz
- İstenirse tamamen lokal ortamda çalıştırılabilir
- Kurumsal projeler için kapalı ağ (on-premise) kurulum desteği mevcuttur

### Entegrasyon

- REST API
- Webhook
- AI / LLM sistemleri (OpenAI, Azure, Claude vb.)
- Vector Database çözümleri (Pinecone, Weaviate, FAISS)
- Backend frameworkleri (Node.js, Python)

---

## 📦 Örnek JSON Çıktısı

```json
{
  "document_type": "pdf",
  "file_name": "ornek-dokuman.pdf",
  "content": [
    {
      "page": 1,
      "data": {
        "title": "Başlık",
        "paragraphs": [
          "Birinci paragraf",
          "İkinci paragraf"
        ]
      }
    }
  ],
  "metadata": {
    "created_at": "2025-01-01",
    "language": "tr"
  }
}
```

---

## ⚖️ Lisans

Bu proje **Vando Agency** tarafından geliştirilmiştir.
Ticari kullanım, özel lisanslama ve kurumsal çözümler için iletişime geçiniz.

## 📬 İletişim

**Vando Agency**  
🌐 [https://vandoagency.com](https://vandoagency.com)  
📧 info@vandoagency.com
