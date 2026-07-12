import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SHADOWS, SPACING } from './src/styles/theme';

// Import custom components
import MedicineScanner from './src/components/MedicineScanner';
import InteractionChecker from './src/components/InteractionChecker';
import MedicalChatbot from './src/components/MedicalChatbot';
import LiveConsultation from './src/components/LiveConsultation';
import NearbyDoctors from './src/components/NearbyDoctors';

// Initial state for demonstration purposes (starts with Warfarin to show interactions)
import { MEDICINES } from './src/data/medicineDb';

const { width } = Dimensions.get('window');
const isDesktopWeb = Platform.OS === 'web' && width > 768;

export default function App() {
  const [currentTab, setCurrentTab] = useState('scanner'); // scanner, checker, chatbot, telehealth, doctors
  const [activeMeds, setActiveMeds] = useState([
    MEDICINES.find(m => m.id === 'warfarin') // default active med to show interactions instantly
  ]);

  const handleAddMed = (med) => {
    if (!activeMeds.some((m) => m.id === med.id)) {
      setActiveMeds((prev) => [...prev, med]);
    }
  };

  const handleRemoveMed = (medId) => {
    setActiveMeds((prev) => prev.filter((m) => m.id !== medId));
  };

  // Switch tabs programmatically (e.g. from interaction warning to telehealth doctor call)
  const handleNavigateToTab = (tabId) => {
    setCurrentTab(tabId);
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'scanner':
        return <MedicineScanner activeMeds={activeMeds} onAddMed={handleAddMed} />;
      case 'checker':
        return (
          <InteractionChecker
            activeMeds={activeMeds}
            onAddMed={handleAddMed}
            onRemoveMed={handleRemoveMed}
            onNavigateToTab={handleNavigateToTab}
          />
        );
      case 'chatbot':
        return <MedicalChatbot />;
      case 'telehealth':
        return <LiveConsultation activeMeds={activeMeds} />;
      case 'doctors':
        return <NearbyDoctors activeMeds={activeMeds} />;
      default:
        return <MedicineScanner activeMeds={activeMeds} onAddMed={handleAddMed} />;
    }
  };

  return (
    <View style={styles.outerContainer}>
      <StatusBar style="light" backgroundColor={COLORS.background} />
      <SafeAreaView style={styles.safeContainer}>
        {/* Desktop Browser Wrapper Frame */}
        <View style={styles.appContainer}>
          {/* Header Bar */}
          <View style={styles.headerBar}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoHeart}>🛡️</Text>
              <View>
                <Text style={styles.logoText}>MediGuard AI</Text>
                <Text style={styles.tagline}>Senior Medication Safety</Text>
              </View>
            </View>
            <View style={styles.activeCountContainer}>
              <Text style={styles.activeCountLabel}>Active Combo:</Text>
              <Text style={styles.activeCountBadge}>{activeMeds.length}</Text>
            </View>
          </View>

          {/* Main App Content View */}
          <View style={styles.contentBody}>{renderContent()}</View>

          {/* Custom Bottom Tab Bar */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabItem, currentTab === 'scanner' && styles.tabItemActive]}
              onPress={() => setCurrentTab('scanner')}
            >
              <Text style={styles.tabIcon}>📷</Text>
              <Text style={[styles.tabLabel, currentTab === 'scanner' && styles.tabLabelActive]}>
                Scanner
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, currentTab === 'checker' && styles.tabItemActive]}
              onPress={() => setCurrentTab('checker')}
            >
              <Text style={styles.tabIcon}>⚠️</Text>
              <Text style={[styles.tabLabel, currentTab === 'checker' && styles.tabLabelActive]}>
                Checker
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, currentTab === 'chatbot' && styles.tabItemActive]}
              onPress={() => setCurrentTab('chatbot')}
            >
              <Text style={styles.tabIcon}>💬</Text>
              <Text style={[styles.tabLabel, currentTab === 'chatbot' && styles.tabLabelActive]}>
                MediBot
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, currentTab === 'telehealth' && styles.tabItemActive]}
              onPress={() => setCurrentTab('telehealth')}
            >
              <Text style={styles.tabIcon}>🩺</Text>
              <Text style={[styles.tabLabel, currentTab === 'telehealth' && styles.tabLabelActive]}>
                Telehealth
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, currentTab === 'doctors' && styles.tabItemActive]}
              onPress={() => setCurrentTab('doctors')}
            >
              <Text style={styles.tabIcon}>📍</Text>
              <Text style={[styles.tabLabel, currentTab === 'doctors' && styles.tabLabelActive]}>
                Consult
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#EDE9FE', // Light violet outer frame background
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.background,
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: isDesktopWeb ? 540 : '100%', // Elegant phone mockup on desktop screens
    backgroundColor: COLORS.background,
    borderLeftWidth: isDesktopWeb ? 1 : 0,
    borderRightWidth: isDesktopWeb ? 1 : 0,
    borderColor: COLORS.border,
    alignSelf: 'center',
    position: 'relative',
    height: '100%',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? 12 : 36, // Adjust padding for platform statusbars
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.small,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoHeart: {
    fontSize: 26,
    marginRight: SPACING.sm,
  },
  logoText: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  tagline: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginTop: -2,
  },
  activeCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBgElevated,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: SPACING.sm,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  activeCountLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginRight: 6,
    fontWeight: '600',
  },
  activeCountBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
    backgroundColor: COLORS.cardBg,
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: 'center',
    lineHeight: 18,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  contentBody: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: SPACING.xs,
    justifyContent: 'space-around',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: SPACING.xs,
    opacity: 0.6,
  },
  tabItemActive: {
    opacity: 1,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
