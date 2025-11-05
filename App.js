import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useState, useEffect } from 'react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [processes, setProcesses] = useState([]);
  const [nextPID, setNextPID] = useState(1);
  const TOTAL_MEMORY = 2048; // MB

  // Rastgele bellek değeri üret (30-120 MB arası)
  const getRandomMemory = () => {
    return Math.floor(Math.random() * (120 - 30 + 1)) + 30;
  };

  // Toplam kullanılan belleği hesapla
  const calculateUsedMemory = () => {
    return processes.reduce((total, process) => total + process.memory, 0);
  };

  // Yeni süreç başlat
  const startProcess = (appName) => {
    const memory = getRandomMemory();
    const newProcess = {
      pid: nextPID,
      name: appName,
      state: 'Running',
      memory: memory,
      startTime: new Date().toLocaleTimeString('tr-TR')
    };
    
    setProcesses([...processes, newProcess]);
    setNextPID(nextPID + 1);
    
    // Eğer Tarayıcı ise, otomatik olarak 5 saniye blocked olsun
    if (appName === 'Tarayıcı') {
      setTimeout(() => {
        changeProcessState(newProcess.pid, 'Blocked');
        setTimeout(() => {
          changeProcessState(newProcess.pid, 'Running');
        }, 5000);
      }, 100);
    }
    
    return newProcess.pid;
  };

  // Süreç sonlandır (Kill Process)
  const terminateProcess = (pid) => {
    const process = processes.find(p => p.pid === pid);
    if (process) {
      setProcesses(processes.filter(p => p.pid !== pid));
      
      // Eğer o sürecin uygulaması açıksa, ana ekrana dön
      if (currentScreen === process.name.toLowerCase()) {
        setCurrentScreen('home');
      }
    }
  };

  // Süreç durumunu değiştir
  const changeProcessState = (pid, newState) => {
    setProcesses(prevProcesses => 
      prevProcesses.map(p => 
        p.pid === pid ? { ...p, state: newState } : p
      )
    );
  };

  // Uygulama aç
  const openApp = (appName) => {
    // Eğer bu uygulama için zaten bir süreç varsa, sadece ekranı aç
    const existingProcess = processes.find(p => p.name === appName);
    if (!existingProcess) {
      startProcess(appName);
    }
    setCurrentScreen(appName.toLowerCase());
  };

  // Uygulamadan çık (ana ekrana dön, süreç devam eder)
  const closeAppScreen = () => {
    setCurrentScreen('home');
  };

  // Ana Ekran Bileşeni
  const HomeScreen = () => {
    const usedMemory = calculateUsedMemory();
    const freeMemory = TOTAL_MEMORY - usedMemory;

    return (
      <View style={styles.homeScreen}>
        <Text style={styles.timeText}>{new Date().toLocaleTimeString('tr-TR')}</Text>
        <Text style={styles.titleText}>Android OS Simülatörü</Text>
        
        <View style={styles.iconGrid}>
          <AppIcon 
            name="Sistem Yöneticisi" 
            icon="📊" 
            color="#FF6B6B"
            onPress={() => setCurrentScreen('system')}
          />
          <AppIcon 
            name="Sosyal Medya A" 
            icon="📱" 
            color="#4ECDC4"
            onPress={() => openApp('Sosyal Medya A')}
          />
          <AppIcon 
            name="Oyun B" 
            icon="🎮" 
            color="#95E1D3"
            onPress={() => openApp('Oyun B')}
          />
          <AppIcon 
            name="Tarayıcı" 
            icon="🌐" 
            color="#F38181"
            onPress={() => openApp('Tarayıcı')}
          />
          <AppIcon 
            name="Müzik Player" 
            icon="🎵" 
            color="#AA96DA"
            onPress={() => openApp('Müzik Player')}
          />
          <AppIcon 
            name="Kamera" 
            icon="📷" 
            color="#FCBAD3"
            onPress={() => openApp('Kamera')}
          />
        </View>
        
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>
            🔄 Aktif Süreçler: {processes.length}
          </Text>
          <Text style={styles.statusText}>
            💾 Bellek: {usedMemory} MB / {TOTAL_MEMORY} MB kullanımda
          </Text>
          <Text style={styles.statusText}>
            🆓 Boş: {freeMemory} MB
          </Text>
        </View>
      </View>
    );
  };

  // Uygulama İkonu Bileşeni
  const AppIcon = ({ name, icon, color, onPress }) => (
    <TouchableOpacity 
      style={[styles.appIcon, { backgroundColor: color || '#16213e' }]} 
      onPress={onPress}
    >
      <Text style={styles.iconEmoji}>{icon}</Text>
      <Text style={styles.iconText}>{name}</Text>
    </TouchableOpacity>
  );

  // Sistem Yöneticisi Bileşeni
  const SystemManager = () => {
    const usedMemory = calculateUsedMemory();
    const freeMemory = TOTAL_MEMORY - usedMemory;
    const memoryUsagePercent = ((usedMemory / TOTAL_MEMORY) * 100).toFixed(1);
    
    const handleKillProcess = (pid, name) => {
      Alert.alert(
        'Süreci Sonlandır',
        `"${name}" sürecini sonlandırmak istediğinizden emin misiniz?`,
        [
          {
            text: 'İptal',
            style: 'cancel'
          },
          {
            text: 'Sonlandır',
            onPress: () => terminateProcess(pid),
            style: 'destructive'
          }
        ]
      );
    };

    return (
      <ScrollView style={styles.systemManager}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Ana Ekran</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sistem Yöneticisi</Text>
        </View>

        {/* Bellek Yönetimi ve İzleme */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💾 Bellek Yönetimi</Text>
          <View style={styles.memoryInfoBox}>
            <View style={styles.memoryRow}>
              <Text style={styles.memoryLabel}>Toplam Bellek:</Text>
              <Text style={styles.memoryValue}>{TOTAL_MEMORY} MB</Text>
            </View>
            <View style={styles.memoryRow}>
              <Text style={styles.memoryLabel}>Kullanılan Bellek:</Text>
              <Text style={[styles.memoryValue, styles.memoryUsed]}>{usedMemory} MB</Text>
            </View>
            <View style={styles.memoryRow}>
              <Text style={styles.memoryLabel}>Boş Bellek:</Text>
              <Text style={[styles.memoryValue, styles.memoryFree]}>{freeMemory} MB</Text>
            </View>
          </View>
          
          {/* Bellek Kullanım Çubuğu */}
          <View style={styles.memoryBarContainer}>
            <View style={styles.memoryBarBackground}>
              <View 
                style={[
                  styles.memoryBarFill, 
                  { 
                    width: `${memoryUsagePercent}%`,
                    backgroundColor: memoryUsagePercent > 80 ? '#FF5722' : memoryUsagePercent > 50 ? '#FFC107' : '#4CAF50'
                  }
                ]} 
              />
            </View>
            <Text style={styles.memoryPercent}>{memoryUsagePercent}% Kullanımda</Text>
          </View>
        </View>

        {/* Süreç Yönetimi - Etkileşimli */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Süreç Yönetimi</Text>
          <View style={styles.processStats}>
            <Text style={styles.infoText}>Toplam Süreç Sayısı: {processes.length}</Text>
            <Text style={styles.infoText}>
              Running: {processes.filter(p => p.state === 'Running').length} | 
              Blocked: {processes.filter(p => p.state === 'Blocked').length}
            </Text>
          </View>
          
          {processes.length === 0 ? (
            <View style={styles.noProcessContainer}>
              <Text style={styles.noProcessEmoji}>🔍</Text>
              <Text style={styles.noProcess}>Aktif süreç bulunmuyor</Text>
              <Text style={styles.noProcessHint}>Ana ekrandan bir uygulama başlatın</Text>
            </View>
          ) : (
            <View style={styles.processList}>
              {processes.map(process => (
                <View key={process.pid} style={styles.processCard}>
                  <View style={styles.processHeader}>
                    <View style={styles.processInfo}>
                      <Text style={styles.processName}>{process.name}</Text>
                      <Text style={styles.processPID}>PID: {process.pid}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.killButton}
                      onPress={() => handleKillProcess(process.pid, process.name)}
                    >
                      <Text style={styles.killButtonText}>❌ Sonlandır</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.processDetails}>
                    <View style={styles.processDetailItem}>
                      <Text style={styles.processDetailLabel}>Durum:</Text>
                      <View style={[
                        styles.stateBadge,
                        process.state === 'Running' ? styles.stateRunning : 
                        process.state === 'Blocked' ? styles.stateBlocked : styles.stateReady
                      ]}>
                        <Text style={styles.stateBadgeText}>
                          {process.state === 'Running' ? '✅ Running' : 
                           process.state === 'Blocked' ? '🔴 Blocked' : '⏸ Ready'}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.processDetailItem}>
                      <Text style={styles.processDetailLabel}>Bellek:</Text>
                      <Text style={styles.processDetailValue}>{process.memory} MB</Text>
                    </View>
                    
                    <View style={styles.processDetailItem}>
                      <Text style={styles.processDetailLabel}>Başlangıç:</Text>
                      <Text style={styles.processDetailValue}>{process.startTime}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Bilgilendirme */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ Nasıl Kullanılır?</Text>
          <Text style={styles.infoDetail}>• Ana ekrandan uygulama açarak yeni süreç oluşturun</Text>
          <Text style={styles.infoDetail}>• Her süreç rastgele bellek tüketir (30-120 MB)</Text>
          <Text style={styles.infoDetail}>• "Tarayıcı" açıldığında 5 saniye Blocked olur (I/O simülasyonu)</Text>
          <Text style={styles.infoDetail}>• "Sonlandır" butonu ile süreci zorla kapatabilirsiniz</Text>
        </View>
      </ScrollView>
    );
  };

  // Uygulama Ekranı
  const AppScreen = ({ appName, appIcon, appColor }) => {
    const currentProcess = processes.find(p => p.name === appName);
    
    return (
      <View style={styles.appScreen}>
        <View style={[styles.header, { backgroundColor: appColor || '#0f3460' }]}>
          <TouchableOpacity onPress={closeAppScreen} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{appName}</Text>
        </View>

        <View style={styles.appContent}>
          <View style={[styles.appIconLarge, { backgroundColor: appColor || '#16213e' }]}>
            <Text style={styles.appIconLargeEmoji}>{appIcon}</Text>
          </View>
          <Text style={styles.appTitle}>{appName}</Text>
          <Text style={styles.appSubtitle}>Uygulama Çalışıyor...</Text>
          
          {currentProcess && (
            <View style={styles.processInfoCard}>
              <Text style={styles.processInfoTitle}>🔧 Süreç Bilgileri</Text>
              <View style={styles.processInfoRow}>
                <Text style={styles.processInfoLabel}>Process ID:</Text>
                <Text style={styles.processInfoText}>{currentProcess.pid}</Text>
              </View>
              <View style={styles.processInfoRow}>
                <Text style={styles.processInfoLabel}>Durum:</Text>
                <Text style={[
                  styles.processInfoText,
                  currentProcess.state === 'Running' ? styles.textRunning : styles.textBlocked
                ]}>
                  {currentProcess.state}
                </Text>
              </View>
              <View style={styles.processInfoRow}>
                <Text style={styles.processInfoLabel}>Bellek Kullanımı:</Text>
                <Text style={styles.processInfoText}>{currentProcess.memory} MB</Text>
              </View>
              <View style={styles.processInfoRow}>
                <Text style={styles.processInfoLabel}>Başlatma Zamanı:</Text>
                <Text style={styles.processInfoText}>{currentProcess.startTime}</Text>
              </View>
            </View>
          )}

          {appName === 'Tarayıcı' && currentProcess && (
            <View style={styles.specialInfo}>
              <Text style={styles.specialInfoText}>
                🌐 Tarayıcı açıldığında I/O simülasyonu için 5 saniye "Blocked" durumuna geçer.
              </Text>
            </View>
          )}

          <Text style={styles.helpText}>
            Bu uygulama, işletim sisteminde bir süreç olarak çalışmaktadır. 
            Detayları Sistem Yöneticisi'nden görüntüleyebilirsiniz.
          </Text>
        </View>
      </View>
    );
  };

  // Ekran Yönlendirme
  const renderScreen = () => {
    switch(currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'system':
        return <SystemManager />;
      case 'sosyal medya a':
        return <AppScreen appName="Sosyal Medya A" appIcon="📱" appColor="#4ECDC4" />;
      case 'oyun b':
        return <AppScreen appName="Oyun B" appIcon="🎮" appColor="#95E1D3" />;
      case 'tarayıcı':
        return <AppScreen appName="Tarayıcı" appIcon="🌐" appColor="#F38181" />;
      case 'müzik player':
        return <AppScreen appName="Müzik Player" appIcon="🎵" appColor="#AA96DA" />;
      case 'kamera':
        return <AppScreen appName="Kamera" appIcon="📷" appColor="#FCBAD3" />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderScreen()}
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  homeScreen: {
    flex: 1,
    padding: 20,
  },
  timeText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.8,
  },
  titleText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 100,
  },
  appIcon: {
    width: '28%',
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  iconEmoji: {
    fontSize: 45,
    marginBottom: 8,
  },
  iconText: {
    color: '#fff',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '600',
  },
  statusBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1f3a',
    padding: 15,
    borderTopWidth: 2,
    borderTopColor: '#2d3561',
  },
  statusText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 13,
    marginBottom: 3,
  },
  systemManager: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  header: {
    backgroundColor: '#1a1f3a',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#2d3561',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#151932',
    margin: 12,
    padding: 18,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#2d3561',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  memoryInfoBox: {
    backgroundColor: '#1a1f3a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  memoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  memoryLabel: {
    color: '#aaa',
    fontSize: 15,
  },
  memoryValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  memoryUsed: {
    color: '#FF6B6B',
  },
  memoryFree: {
    color: '#4CAF50',
  },
  memoryBarContainer: {
    marginTop: 10,
  },
  memoryBarBackground: {
    height: 30,
    backgroundColor: '#1a1f3a',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2d3561',
  },
  memoryBarFill: {
    height: '100%',
    borderRadius: 15,
  },
  memoryPercent: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  processStats: {
    marginBottom: 15,
  },
  infoText: {
    color: '#ddd',
    fontSize: 14,
    marginBottom: 5,
  },
  processList: {
    marginTop: 10,
  },
  processCard: {
    backgroundColor: '#1a1f3a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2d3561',
  },
  processHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3561',
  },
  processInfo: {
    flex: 1,
  },
  processName: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  processPID: {
    color: '#888',
    fontSize: 13,
  },
  killButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  killButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  processDetails: {
    gap: 8,
  },
  processDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  processDetailLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  processDetailValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  stateBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  stateBadgeText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  stateRunning: {
    backgroundColor: '#4CAF50',
  },
  stateBlocked: {
    backgroundColor: '#FF5722',
  },
  stateReady: {
    backgroundColor: '#FFC107',
  },
  noProcessContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noProcessEmoji: {
    fontSize: 50,
    marginBottom: 15,
  },
  noProcess: {
    color: '#888',
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  noProcessHint: {
    color: '#666',
    fontSize: 13,
  },
  infoSection: {
    backgroundColor: '#151932',
    margin: 12,
    padding: 18,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#2d3561',
  },
  infoTitle: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoDetail: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 6,
    lineHeight: 20,
  },
  appScreen: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  appContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  appIconLarge: {
    width: 120,
    height: 120,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  appIconLargeEmoji: {
    fontSize: 70,
  },
  appTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
  },
  appSubtitle: {
    color: '#4ECDC4',
    fontSize: 16,
    marginTop: 8,
    fontStyle: 'italic',
  },
  processInfoCard: {
    backgroundColor: '#151932',
    padding: 20,
    borderRadius: 15,
    marginTop: 25,
    width: '100%',
    borderWidth: 1,
    borderColor: '#2d3561',
  },
  processInfoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  processInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 5,
  },
  processInfoLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  processInfoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  textRunning: {
    color: '#4CAF50',
  },
  textBlocked: {
    color: '#FF5722',
  },
  specialInfo: {
    backgroundColor: '#1a1f3a',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#F38181',
  },
  specialInfoText: {
    color: '#ddd',
    fontSize: 13,
    lineHeight: 20,
  },
  helpText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 25,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
