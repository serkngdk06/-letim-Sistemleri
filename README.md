BU ÖDEV İŞLETİM SİSTEMLERİ DERSİ İÇİN (DR.Ögr. Üyesi HASAN SERDAR)  HAZIRLANMIŞTIR 

# 🤖 Android OS Simülatörü

İşletim Sistemleri dersi için geliştirilmiş **interaktif Android simülatör** uygulaması.

## 📱 Ekran Görüntüleri

### Ana Ekran
- 6 renkli uygulama ikonu
- Gerçek zamanlı bellek ve süreç istatistikleri
- Sistem Yöneticisi erişimi

### Sistem Yöneticisi
- **Bellek Yönetimi**: Dinamik hesaplama ve görsel gösterim
- **Süreç Yönetimi**: Tüm aktif süreçlerin listesi
- **Etkileşimli Kontrol**: Her süreç için "Sonlandır" butonu

## ✨ Öne Çıkan Özellikler

### 🔧 Süreç Yönetimi
- ✅ Otomatik PID ataması
- ✅ Rastgele bellek tahsisi (30-120 MB)
- ✅ **Etkileşimli süreç sonlandırma** (❌ Sonlandır butonu)
- ✅ Süreç durumları: Running, Blocked, Ready

### 💾 Bellek Yönetimi
- ✅ **Toplam Bellek**: 2048 MB
- ✅ **Kullanılan Bellek**: Dinamik hesaplama (tüm süreçlerin toplamı)
- ✅ **Boş Bellek**: Gerçek zamanlı güncelleme
- ✅ Görsel bellek çubuğu (renk kodlu: yeşil/sarı/kırmızı)

### 🔄 I/O Simülasyonu
- ✅ **Tarayıcı** açıldığında otomatik olarak 5 saniye "Blocked" durumuna geçer
- ✅ Running → Blocked → Running durum geçişi
- ✅ Gerçek zamanlı durum güncellemeleri

### 🎮 Uygulamalar
1. 📊 **Sistem Yöneticisi** - Merkezi kontrol paneli
2. 📱 **Sosyal Medya A** - Normal süreç
3. 🎮 **Oyun B** - Normal süreç
4. 🌐 **Tarayıcı** - I/O simülasyonu (5 saniye Blocked)
5. 🎵 **Müzik Player** - Normal süreç
6. 📷 **Kamera** - Normal süreç

## 🚀 Hızlı Başlangıç

### Kurulum
```bash
cd Android-Smilator
npm install
```

### Çalıştırma
```bash
npm start
```

### Platform Seçimi
- **Android**: `a` tuşuna basın veya QR kod ile Expo Go kullanın
- **iOS**: `i` tuşuna basın (Mac gerekli)
- **Web**: `w` tuşuna basın

## 📚 Kullanım Kılavuzu

### 1. Süreç Oluşturma
1. Ana ekrandan bir uygulama ikonuna tıklayın
2. Otomatik olarak bir süreç oluşturulur
3. Sistem Yöneticisi'nde görüntüleyin

### 2. Süreç İzleme
1. "Sistem Yöneticisi" ikonuna tıklayın
2. Tüm aktif süreçleri görün:
   - PID (Process ID)
   - Süreç Adı
   - Durum (Running/Blocked)
   - Bellek Kullanımı
   - Başlatma Zamanı

### 3. Süreç Sonlandırma
1. Sistem Yöneticisi'nde bir sürecin yanındaki "❌ Sonlandır" butonuna tıklayın
2. Onay dialogunda "Sonlandır" seçin
3. Süreç listeden kaldırılır ve bellek serbest bırakılır

### 4. Bellek İzleme
- Sistem Yöneticisi'nde bellek bölümünü görüntüleyin
- Toplam, Kullanılan ve Boş bellek değerlerini izleyin
- Görsel çubuk ile kullanım yüzdesini gözlemleyin

### 5. I/O Simülasyonu
1. "Tarayıcı" uygulamasını açın
2. Hızlıca Sistem Yöneticisi'ne geçin
3. Tarayıcı sürecinin durumunu izleyin:
   - İlk 5 saniye: 🔴 **Blocked**
   - 5 saniye sonra: ✅ **Running**

## 🎯 İşletim Sistemi Konseptleri

### Process Management
- Process Creation & Termination
- Process ID (PID) Management
- Process States (Running, Blocked, Ready)

### Memory Management
- Memory Allocation
- Memory Deallocation
- Dynamic Memory Tracking
- Memory Visualization

### I/O Management
- Blocking I/O
- State Transitions
- I/O Completion

## 🔧 Teknik Detaylar

### Teknoloji Stack
- **Framework**: React Native (Expo)
- **State Management**: React Hooks (useState)
- **Platform**: iOS, Android, Web

### Veri Yapıları
```javascript
Process {
  pid: Number,        // Benzersiz ID (1, 2, 3...)
  name: String,       // Uygulama adı
  state: String,      // 'Running', 'Blocked', 'Ready'
  memory: Number,     // MB (30-120 arası rastgele)
  startTime: String   // HH:MM:SS
}
```

### Ana Fonksiyonlar
- `startProcess()` - Yeni süreç oluşturur
- `terminateProcess()` - Süreci sonlandırır
- `calculateUsedMemory()` - Toplam bellek kullanımını hesaplar
- `changeProcessState()` - Süreç durumunu değiştirir

## 📖 Dökümanlar

- **TEKNIK_ACIKLAMA.md** - Detaylı teknik döküman
  - Kod açıklamaları
  - Veri akış diyagramları
  - Kullanım senaryoları
  - Özelleştirme rehberi

## 🎓 Ödev Gereksinimleri

### ✅ Tamamlanan Gereksinimler

1. ✅ Ana Ekran ve Uygulama İkonları (6 adet)
2. ✅ Sistem Yöneticisi Paneli
3. ✅ Süreç Yönetimi
   - ✅ PID, Ad, Durum, Bellek gösterimi
   - ✅ **Süreç sonlandırma (Kill Process)**
4. ✅ Bellek Yönetimi ve İzleme
   - ✅ Toplam: 2048 MB
   - ✅ Kullanılan: Dinamik hesaplama
   - ✅ Boş: Dinamik hesaplama
5. ✅ I/O Durum Geçişi Simülasyonu
   - ✅ Tarayıcı: 5 saniye Blocked

## 🌟 Öne Çıkan Yenilikler

- **❌ Sonlandır Butonu**: Her süreç için etkileşimli sonlandırma
- **Rastgele Bellek**: 30-120 MB arası gerçekçi simülasyon
- **Dinamik Hesaplama**: Bellek gerçek zamanlı hesaplanır
- **Otomatik I/O**: Tarayıcı özel davranışı
- **Onay Dialogu**: Güvenli süreç sonlandırma
- **Renkli UI**: Modern ve kullanıcı dostu tasarım

## 📊 Örnek Kullanım Senaryosu

```
1. Uygulama Başlat
   ├── Bellek: 0/2048 MB
   └── Süreç: 0

2. "Sosyal Medya A" Aç
   ├── Yeni Süreç: PID 1, 87 MB
   └── Bellek: 87/2048 MB

3. "Tarayıcı" Aç
   ├── Yeni Süreç: PID 2, 54 MB (Blocked 5 saniye)
   └── Bellek: 141/2048 MB

4. "Oyun B" Aç
   ├── Yeni Süreç: PID 3, 112 MB
   └── Bellek: 253/2048 MB

5. Sosyal Medya A'yı Sonlandır
   ├── PID 1 kaldırıldı
   └── Bellek: 166/2048 MB (87 MB serbest bırakıldı)
```

## 🐛 Bilinen Sınırlamalar

- Bu bir **eğitim amaçlı simülatör**dür
- Gerçek işletim sistemi fonksiyonları kullanmaz
- Bellek değerleri simüle edilmiştir
- I/O işlemleri `setTimeout` ile simüle edilir

## 🤝 Katkıda Bulunma

Bu proje İşletim Sistemleri dersi için geliştirilmiştir. Eğitim amaçlıdır.

## 📄 Lisans

Eğitim amaçlı - Serbestçe kullanılabilir

---

**İşletim Sistemleri Dersi Projesi** | 2025 | React Native


