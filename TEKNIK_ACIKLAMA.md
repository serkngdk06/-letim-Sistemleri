# Android OS Simülatörü - Teknik Açıklama

## 📚 Genel Bakış

Bu uygulama, İşletim Sistemleri dersi için geliştirilmiş interaktif bir Android simülatörüdür. Temel işletim sistemi prensiplerini (süreç yönetimi, bellek yönetimi, I/O yönetimi) görsel ve etkileşimli bir şekilde simüle eder.

## 🎯 Temel Özellikler

### 1. Ana Ekran (Home Screen)
- **6 Uygulama İkonu**: Sistem Yöneticisi, Sosyal Medya A, Oyun B, Tarayıcı, Müzik Player, Kamera
- **Dinamik Status Bar**: Aktif süreç sayısı, bellek kullanımı ve boş bellek gösterilir
- **Renkli İkonlar**: Her uygulama kendine özgü renk teması

### 2. Süreç (Process) Yönetimi - Etkileşimli

#### Süreç Oluşturma
```javascript
const startProcess = (appName) => {
  const memory = getRandomMemory(); // 30-120 MB arası rastgele
  const newProcess = {
    pid: nextPID,           // Benzersiz süreç kimliği
    name: appName,          // Uygulama adı
    state: 'Running',       // Başlangıç durumu
    memory: memory,         // Bellek kullanımı (MB)
    startTime: new Date().toLocaleTimeString('tr-TR')
  };
  
  setProcesses([...processes, newProcess]);
  setNextPID(nextPID + 1);  // PID sayacını artır
  
  return newProcess.pid;
};
```

**Özellikler:**
- Her uygulama açıldığında otomatik olarak bir süreç oluşturulur
- PID otomatik olarak artan bir sayaçtan atanır (1, 2, 3...)
- Her süreç **rastgele bellek** tüketir (30-120 MB arası)
- Başlangıç zamanı kaydedilir

#### Süreç Sonlandırma (Kill Process) ⭐ YENİ
```javascript
const terminateProcess = (pid) => {
  const process = processes.find(p => p.pid === pid);
  if (process) {
    setProcesses(processes.filter(p => p.pid !== pid));
    
    // Eğer uygulama açıksa, ana ekrana dön
    if (currentScreen === process.name.toLowerCase()) {
      setCurrentScreen('home');
    }
  }
};
```

**Özellikler:**
- Sistem Yöneticisi'nde her sürecin yanında "❌ Sonlandır" butonu
- Kullanıcı onay dialogu ile güvenli sonlandırma
- Süreci listeden kaldırır
- Belleği otomatik serbest bırakır
- Eğer o uygulama açıksa, kullanıcıyı ana ekrana gönderir

**Kullanıcı Deneyimi:**
```javascript
const handleKillProcess = (pid, name) => {
  Alert.alert(
    'Süreci Sonlandır',
    `"${name}" sürecini sonlandırmak istediğinizden emin misiniz?`,
    [
      { text: 'İptal', style: 'cancel' },
      { 
        text: 'Sonlandır', 
        onPress: () => terminateProcess(pid),
        style: 'destructive' 
      }
    ]
  );
};
```

### 3. Bellek Yönetimi ve İzleme ⭐

#### Dinamik Bellek Hesaplama
```javascript
const TOTAL_MEMORY = 2048; // MB (sabit)

// Toplam kullanılan belleği hesapla
const calculateUsedMemory = () => {
  return processes.reduce((total, process) => total + process.memory, 0);
};

// Kullanılan Bellek = Tüm süreçlerin bellek toplamı
const usedMemory = calculateUsedMemory();

// Boş Bellek = Toplam - Kullanılan
const freeMemory = TOTAL_MEMORY - usedMemory;

// Kullanım Yüzdesi
const memoryUsagePercent = ((usedMemory / TOTAL_MEMORY) * 100).toFixed(1);
```

**Görselleştirme:**
- **Toplam Bellek**: 2048 MB (sabit)
- **Kullanılan Bellek**: Dinamik olarak hesaplanır (kırmızı renk)
- **Boş Bellek**: Dinamik olarak hesaplanır (yeşil renk)
- **Bellek Çubuğu**: Görsel yüzdelik gösterim
  - 0-50%: Yeşil (#4CAF50)
  - 50-80%: Sarı (#FFC107)
  - 80-100%: Kırmızı (#FF5722)

### 4. Durum Geçişi Simülasyonu (State Transitions) ⭐

#### Tarayıcı Özel Davranışı
```javascript
// Tarayıcı açıldığında otomatik I/O simülasyonu
if (appName === 'Tarayıcı') {
  setTimeout(() => {
    changeProcessState(newProcess.pid, 'Blocked');  // 5 saniye Blocked
    setTimeout(() => {
      changeProcessState(newProcess.pid, 'Running');  // Tekrar Running
    }, 5000);
  }, 100);
}
```

**I/O Simülasyonu Süreci:**
1. Kullanıcı "Tarayıcı" uygulamasını açar
2. Süreç başlangıçta "Running" durumunda oluşturulur
3. 100ms sonra durum "Blocked"a geçer (I/O işlemi simülasyonu)
4. 5 saniye boyunca "Blocked" kalır
5. 5 saniye sonra otomatik olarak "Running"a döner

**Görsel Gösterim:**
- Running: ✅ Yeşil badge
- Blocked: 🔴 Kırmızı badge
- Sistem Yöneticisi'nde gerçek zamanlı güncelleme

### 5. Sistem Yöneticisi Paneli

#### Bellek Yönetimi Bölümü
- **Toplam Bellek**: 2048 MB
- **Kullanılan Bellek**: Dinamik hesaplama
- **Boş Bellek**: Dinamik hesaplama
- **Görsel Çubuk**: Yüzdelik kullanım gösterimi

#### Süreç Yönetimi Bölümü
Her süreç için gösterilen bilgiler:

| Alan | Açıklama | Örnek |
|------|----------|-------|
| PID | Process ID (benzersiz) | 1, 2, 3... |
| Süreç Adı | Uygulama adı | "Tarayıcı" |
| Durum | Running/Blocked/Ready | Running ✅ |
| Bellek | Tüketilen bellek (MB) | 87 MB |
| Başlangıç | Başlatma zamanı | 14:30:25 |
| Sonlandır Butonu | ❌ Zorla kapat | Tıklanabilir |

**İstatistikler:**
- Toplam Süreç Sayısı
- Running Süreç Sayısı
- Blocked Süreç Sayısı

## 🔧 Teknik Uygulama

### Veri Yapıları

#### Process Objesi
```javascript
{
  pid: Number,           // Benzersiz süreç kimliği (auto-increment)
  name: String,          // Süreç/Uygulama adı
  state: String,         // 'Running', 'Blocked', 'Ready'
  memory: Number,        // MB cinsinden bellek (30-120 arası rastgele)
  startTime: String      // Başlatma zamanı (HH:MM:SS formatında)
}
```

### State Management (React Hooks)

```javascript
// Ana state'ler
const [currentScreen, setCurrentScreen] = useState('home');
const [processes, setProcesses] = useState([]);  // Süreç dizisi
const [nextPID, setNextPID] = useState(1);       // PID sayacı
const TOTAL_MEMORY = 2048;                       // Sabit bellek
```

### Ana Fonksiyonlar

#### 1. getRandomMemory()
```javascript
const getRandomMemory = () => {
  return Math.floor(Math.random() * (120 - 30 + 1)) + 30;
};
```
- 30 ile 120 MB arasında rastgele bellek değeri üretir
- Her süreç başlatıldığında çağrılır

#### 2. calculateUsedMemory()
```javascript
const calculateUsedMemory = () => {
  return processes.reduce((total, process) => total + process.memory, 0);
};
```
- Tüm süreçlerin bellek değerlerini toplar
- Array.reduce() kullanarak verimli hesaplama

#### 3. startProcess(appName)
- Yeni süreç oluşturur
- Rastgele bellek atar
- PID sayacını artırır
- Özel davranışları uygular (Tarayıcı için I/O)

#### 4. terminateProcess(pid)
- Belirtilen PID'ye sahip süreci bulur
- Süreç dizisinden kaldırır
- Bellek otomatik serbest bırakılır (garbage collection)
- Ekran kontrolü yapar

#### 5. changeProcessState(pid, newState)
```javascript
const changeProcessState = (pid, newState) => {
  setProcesses(prevProcesses => 
    prevProcesses.map(p => 
      p.pid === pid ? { ...p, state: newState } : p
    )
  );
};
```
- Belirli bir sürecin durumunu değiştirir
- Immutable state güncellemesi yapar

#### 6. openApp(appName)
```javascript
const openApp = (appName) => {
  // Aynı uygulama için sadece bir süreç
  const existingProcess = processes.find(p => p.name === appName);
  if (!existingProcess) {
    startProcess(appName);
  }
  setCurrentScreen(appName.toLowerCase());
};
```
- Uygulama açar
- Eğer süreç yoksa oluşturur
- Aynı uygulama için yinelenen süreç oluşturmaz

## 🎨 Kullanıcı Arayüzü

### Renk Paleti
```javascript
backgroundColor: '#0a0e27',    // Ana arkaplan (koyu lacivert)
cardBackground: '#151932',     // Kartlar
headerBackground: '#1a1f3a',   // Header
accentColor: '#4ECDC4',        // Vurgu rengi (turkuaz)
successColor: '#4CAF50',       // Running durumu (yeşil)
dangerColor: '#FF5722',        // Blocked durumu (kırmızı)
warningColor: '#FFC107',       // Ready durumu (sarı)
```

### Bileşen Hiyerarşisi
```
App
├── HomeScreen
│   ├── AppIcon (x6)
│   └── StatusBar
├── SystemManager
│   ├── MemoryManagement
│   │   ├── MemoryInfo
│   │   └── MemoryBar
│   ├── ProcessManagement
│   │   └── ProcessCard (x N)
│   │       ├── ProcessHeader
│   │       │   └── KillButton
│   │       └── ProcessDetails
│   └── InfoSection
└── AppScreen
    ├── AppIcon (Large)
    ├── ProcessInfoCard
    └── SpecialInfo (Tarayıcı için)
```

## 📊 Veri Akışı Diyagramları

### Süreç Oluşturma Akışı
```
Kullanıcı İkona Tıklar
    ↓
openApp(appName)
    ↓
Süreç var mı kontrol?
    ↓ (Hayır)
startProcess(appName)
    ↓
getRandomMemory() → [30-120 MB]
    ↓
newProcess oluştur
    ↓
Tarayıcı mı?
    ↓ (Evet)
setTimeout → Blocked (5 saniye)
    ↓
processes state güncelle
    ↓
PID++, Ekran değiştir
    ↓
React yeniden render
    ↓
UI Güncellenir
```

### Süreç Sonlandırma Akışı
```
Kullanıcı "Sonlandır" butonuna tıklar
    ↓
handleKillProcess(pid, name)
    ↓
Alert.alert() → Onay iste
    ↓
Kullanıcı "Sonlandır" seçer
    ↓
terminateProcess(pid)
    ↓
Süreci bul (processes.find)
    ↓
Süreç bulundu mu?
    ↓ (Evet)
processes.filter() → Süreci kaldır
    ↓
Uygulama açık mı?
    ↓ (Evet)
Ana ekrana dön
    ↓
React state güncelle
    ↓
Bellek otomatik yeniden hesaplanır
    ↓
UI Güncellenir
```

### Bellek Hesaplama Akışı
```
Her render'da
    ↓
calculateUsedMemory()
    ↓
processes.reduce()
    ↓
Tüm süreçlerin bellek değerlerini topla
    ↓
usedMemory = toplam
    ↓
freeMemory = TOTAL_MEMORY - usedMemory
    ↓
memoryUsagePercent = (usedMemory / TOTAL_MEMORY) * 100
    ↓
Bellek çubuğu rengini belirle
    ↓
UI'da göster
```

## 🔬 İşletim Sistemi Konseptleri

### 1. Process Management
- **Process Creation**: `fork()` ve `exec()` konseptinin basitleştirilmiş hali
- **Process ID**: Benzersiz PID ataması
- **Process States**: Running, Blocked, Ready durumları
- **Process Termination**: `kill()` sistem çağrısının simülasyonu

### 2. Memory Management
- **Memory Allocation**: Her süreç için bellek tahsisi
- **Memory Deallocation**: Süreç sonlandığında otomatik serbest bırakma
- **Memory Tracking**: Toplam ve kullanılan bellek takibi
- **Memory Visualization**: Görsel bellek haritası

### 3. I/O Management
- **Blocking I/O**: Tarayıcı uygulamasında simüle edilir
- **State Transitions**: Running → Blocked → Running
- **I/O Wait Time**: 5 saniyelik bekleme simülasyonu

### 4. Resource Management
- **Resource Allocation**: Bellek kaynak tahsisi
- **Resource Limitation**: 2048 MB maksimum bellek
- **Resource Monitoring**: Gerçek zamanlı kaynak izleme

## 🎯 Eğitsel Değer

### Öğrenilen Konseptler

1. **Süreç Yaşam Döngüsü**
   - Süreç nasıl başlatılır?
   - Süreç nasıl çalışır?
   - Süreç nasıl sonlandırılır?

2. **Bellek Yönetimi**
   - Bellek nasıl tahsis edilir?
   - Bellek kullanımı nasıl izlenir?
   - Bellek nasıl serbest bırakılır?

3. **I/O İşlemleri**
   - I/O işlemi sırasında ne olur?
   - Süreç neden bloklanır?
   - Bloklanmış süreç nasıl tekrar çalışır hale gelir?

4. **Kaynak Yönetimi**
   - Sınırlı kaynaklar nasıl yönetilir?
   - Kaynak kullanımı nasıl optimize edilir?

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
```json
{
  "expo": "~54.0.20",
  "react": "19.1.0",
  "react-native": "0.81.5"
}
```

### Kurulum
```bash
cd "Android-Smilator"
npm install
npm start
```

### Platform Seçenekleri
- **Android**: `a` tuşu (emülatör) veya Expo Go (fiziksel cihaz)
- **iOS**: `i` tuşu (simulator) veya Expo Go (fiziksel cihaz)
- **Web**: `w` tuşu

## 📱 Kullanım Senaryoları

### Senaryo 1: Temel Süreç Yönetimi
1. Uygulamayı başlatın
2. "Sosyal Medya A" uygulamasını açın
3. "Sistem Yöneticisi"ne gidin
4. Yeni sürecin PID: 1, Durum: Running, Bellek: ~XX MB olduğunu görün
5. "❌ Sonlandır" butonuna tıklayın
6. Onaylayın
7. Sürecin listeden kaybolduğunu ve belleğin serbest bırakıldığını gözlemleyin

### Senaryo 2: I/O Simülasyonu
1. "Tarayıcı" uygulamasını açın
2. Hızlıca "Sistem Yöneticisi"ne geçin
3. Tarayıcı sürecinin durumunu gözlemleyin:
   - İlk 5 saniye: 🔴 Blocked (kırmızı)
   - 5 saniye sonra: ✅ Running (yeşil)

### Senaryo 3: Bellek Yönetimi
1. "Sistem Yöneticisi"ni açın
2. Başlangıç: Kullanılan = 0 MB, Boş = 2048 MB
3. Ana ekrana dönün
4. 4-5 uygulama açın
5. "Sistem Yöneticisi"ne tekrar girin
6. Bellek kullanımını gözlemleyin (örn: Kullanılan = 320 MB)
7. Bellek çubuğunun dolduğunu görün
8. Bir süreci sonlandırın
9. Belleğin azaldığını ve çubuğun küçüldüğünü gözlemleyin

### Senaryo 4: Çoklu Süreç Yönetimi
1. 5 farklı uygulama açın
2. "Sistem Yöneticisi"nde 5 aktif süreç görün
3. PID'lerin 1'den 5'e kadar olduğunu görün
4. Toplam bellek kullanımını hesaplayın
5. İki süreci sonlandırın
6. Sadece 3 sürecin kaldığını ve belleğin azaldığını görün

## 🔧 Özelleştirme

### Bellek Miktarını Değiştirme
```javascript
const TOTAL_MEMORY = 4096; // 4 GB
```

### Rastgele Bellek Aralığını Değiştirme
```javascript
const getRandomMemory = () => {
  return Math.floor(Math.random() * (200 - 50 + 1)) + 50; // 50-200 MB
};
```

### I/O Bekleme Süresini Değiştirme
```javascript
setTimeout(() => {
  changeProcessState(newProcess.pid, 'Running');
}, 10000); // 10 saniye
```

## 📈 Performans

- **React State**: Verimli state yönetimi
- **Render Optimizasyonu**: Gereksiz render'lar önlenir
- **Memory Leaks**: Yok (React hooks doğru kullanımı)
- **setTimeout Cleanup**: Otomatik temizleme

## 🐛 Hata Yönetimi

- **PID Çakışması**: Olmaz (auto-increment sayaç)
- **Aynı Uygulama İki Kez**: Önlenir (existingProcess kontrolü)
- **Bellek Taşması**: UI görsel uyarı verir (%80+ kırmızı)
- **Süreç Bulunamadı**: Güvenli kontroller

## 📝 Notlar

1. Bu bir **simülatör**dür, gerçek işletim sistemi işlevleri kullanmaz
2. Bellek değerleri **simüle edilmiştir**, gerçek RAM kullanımını göstermez
3. I/O işlemleri **setTimeout** ile simüle edilir
4. Süreç durumları **JavaScript objelerinde** tutulur
5. Eğitim amaçlı, basitleştirilmiş bir modeldir

## 🎓 Ödev İçin Önemli Noktalar

### Karşılanan Gereksinimler ✅

1. ✅ **Ana Ekran**: 6 uygulama ikonu
2. ✅ **Sistem Yöneticisi**: Merkezi kontrol paneli
3. ✅ **Süreç Oluşturma**: Otomatik PID, rastgele bellek
4. ✅ **Süreç Bilgileri**: PID, Ad, Durum, Bellek
5. ✅ **Süreç Sonlandırma**: ❌ Sonlandır butonu (etkileşimli)
6. ✅ **Bellek Yönetimi**: Toplam, Kullanılan, Boş (dinamik hesaplama)
7. ✅ **Bellek İzleme**: Görsel çubuk ve yüzde gösterimi
8. ✅ **I/O Simülasyonu**: Tarayıcı 5 saniye Blocked
9. ✅ **Durum Geçişi**: Running → Blocked → Running
10. ✅ **Görsel Arayüz**: Modern, kullanıcı dostu

### Öne Çıkan Özellikler 🌟

- **Etkileşimli Süreç Sonlandırma**: Her süreç için "Sonlandır" butonu
- **Dinamik Bellek Hesaplama**: Gerçek zamanlı reduce() ile hesaplama
- **Otomatik I/O Simülasyonu**: Tarayıcı özel davranışı
- **Rastgele Bellek Tahsisi**: Gerçekçi simülasyon
- **Renkli Durum Göstergesi**: Running (yeşil), Blocked (kırmızı)
- **Kullanıcı Onayı**: Süreç sonlandırma için güvenlik dialogu

---

**Geliştirici**: İşletim Sistemleri Dersi Projesi  
**Tarih**: 2025  
**Platform**: React Native (Expo)  
**Amaç**: Eğitim ve Simülasyon

