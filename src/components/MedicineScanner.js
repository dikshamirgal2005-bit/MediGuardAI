import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SHADOWS, SPACING } from '../styles/theme';
import { MEDICINES, findMedicineByText, checkInteractions } from '../data/medicineDb';

export default function MedicineScanner({ activeMeds, onAddMed }) {
  const [scanning, setScanning] = useState(false);
  const [scannedMed, setScannedMed] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [scanResultText, setScanResultText] = useState('');
  
  // Laser animation value
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  // Start scanline animation
  useEffect(() => {
    if (scanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scanLineAnim.setValue(0);
    }
  }, [scanning]);

  // Simulate scanning action
  const startMockScan = (medicineName) => {
    setScanning(true);
    setScannedMed(null);
    setInteractions([]);
    setScanResultText('');

    setTimeout(() => {
      setScanning(false);
      const med = findMedicineByText(medicineName);
      if (med) {
        setScannedMed(med);
        setScanResultText(`Recognized label text: "${med.name} ${med.generic} ${med.category} 50mg"`);
        // Check for interactions
        const activeIds = activeMeds.map(m => m.id);
        const alerts = checkInteractions(med.id, activeIds);
        setInteractions(alerts);
      } else {
        setScanResultText('Scanning failed: Text on medicine label could not be recognized. Try another preset.');
      }
    }, 2500); // 2.5 seconds scanning simulation
  };

  const handleAddMed = () => {
    if (scannedMed) {
      onAddMed(scannedMed);
      setScannedMed(null);
      setInteractions([]);
      setScanResultText('');
    }
  };

  // Calculate laser position
  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 180],
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medicine Scanner</Text>
        <Text style={styles.subtitle}>Scan labels or prescription papers to identify high-power medicines and risks.</Text>
      </View>

      {/* Viewfinder Area */}
      <View style={styles.viewfinderContainer}>
        <View style={styles.viewfinder}>
          {scanning ? (
            <>
              <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
              <View style={styles.scanningOverlay}>
                <Text style={styles.scanningText}>ANALYZING TEXT...</Text>
              </View>
            </>
          ) : scannedMed ? (
            <View style={styles.resultOverlay}>
              <Text style={styles.resultTextSuccess}>SCAN SUCCESSFUL</Text>
              <Text style={styles.resultTextSub}>{scannedMed.name}</Text>
            </View>
          ) : (
            <View style={styles.idleOverlay}>
              <Text style={styles.idleText}>Viewfinder Active</Text>
              <Text style={styles.idleSubText}>Tap a preset below to simulate bottle scanning</Text>
            </View>
          )}

          {/* Corner borders for look and feel */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>

      {/* Preset Scan Bottles */}
      <Text style={styles.sectionLabel}>Select a medicine label to scan:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
        {MEDICINES.map((med) => (
          <TouchableOpacity
            key={med.id}
            style={styles.presetCard}
            onPress={() => startMockScan(med.name)}
            disabled={scanning}
          >
            <View style={styles.presetBottleIcon}>
              <Text style={styles.presetIconText}>💊</Text>
            </View>
            <Text style={styles.presetName}>{med.name}</Text>
            <Text style={styles.presetGeneric}>{med.generic}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Scan details result */}
      {scanResultText ? (
        <View style={styles.ocrTextBox}>
          <Text style={styles.ocrText}>{scanResultText}</Text>
        </View>
      ) : null}

      {/* Scanned Details Card */}
      {scannedMed && (
        <View style={styles.medCard}>
          <View style={styles.medHeader}>
            <View>
              <Text style={styles.medNameText}>{scannedMed.name}</Text>
              <Text style={styles.medGenericText}>{scannedMed.generic}</Text>
            </View>
            <View style={[
              styles.badge, 
              scannedMed.isHighPower ? styles.badgeHighPower : styles.badgeNormal
            ]}>
              <Text style={styles.badgeText}>
                {scannedMed.isHighPower ? 'HIGH POWER' : 'STANDARD'}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{scannedMed.description}</Text>

          {/* Beers Criteria Alert */}
          {scannedMed.beersCriteria && (
            <View style={styles.beersAlertBox}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertEmoji}>⚠️</Text>
                <Text style={styles.beersAlertTitle}>Geriatric (Senior Care) Warning</Text>
              </View>
              <Text style={styles.beersAlertText}>{scannedMed.beersWarning}</Text>
            </View>
          )}

          {/* Interactions Warnings */}
          {interactions.length > 0 ? (
            <View style={styles.interactionsContainer}>
              <Text style={styles.interactionMainTitle}>⚠️ Interaction Alerts Found ({interactions.length})</Text>
              {interactions.map((inter, idx) => (
                <View key={idx} style={styles.interactionAlertCard}>
                  <View style={styles.interactionAlertHeader}>
                    <Text style={[
                      styles.severityBadge, 
                      inter.severity === 'SEVERE' ? styles.severitySevere : styles.severityModerate
                    ]}>
                      {inter.severity} INTERACTION
                    </Text>
                    <Text style={styles.interactDrug}>With active: {inter.withDrug.name}</Text>
                  </View>
                  <Text style={styles.interactDesc}>{inter.description}</Text>
                  <Text style={styles.interactMechanism}>Mechanism: {inter.mechanism}</Text>
                </View>
              ))}
            </View>
          ) : (
            activeMeds.length > 0 && (
              <View style={styles.interactionSafeBox}>
                <Text style={styles.safeEmoji}>✅</Text>
                <Text style={styles.interactionSafeText}>No interactions detected with your active medications.</Text>
              </View>
            )
          )}

          <Text style={styles.sectionTitle}>Potential Side Effects</Text>
          <View style={styles.bulletContainer}>
            {scannedMed.sideEffects.map((effect, idx) => (
              <Text key={idx} style={styles.bulletItem}>• {effect}</Text>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Safer Alternatives for Seniors</Text>
          <View style={styles.bulletContainer}>
            {scannedMed.alternatives.map((alt, idx) => (
              <Text key={idx} style={styles.bulletItem}>• {alt}</Text>
            ))}
          </View>

          {/* Add Button */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddMed}>
            <Text style={styles.addButtonText}>Add to Active Medications list</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    backgroundColor: COLORS.background,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  viewfinderContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  viewfinder: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.cardBg,
    borderRadius: SPACING.borderRadiusLarge,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  scanningOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primaryLight,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 4,
    backgroundColor: COLORS.primaryLight,
    shadowColor: COLORS.primaryLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  resultOverlay: {
    alignItems: 'center',
  },
  resultTextSuccess: {
    ...TYPOGRAPHY.h3,
    color: COLORS.success,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  resultTextSub: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  idleOverlay: {
    alignItems: 'center',
    padding: SPACING.md,
  },
  idleText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  idleSubText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: 12,
    marginTop: 4,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: COLORS.primaryLight,
  },
  topLeft: {
    top: 15,
    left: 15,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 15,
    right: 15,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 15,
    left: 15,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 15,
    right: 15,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  sectionLabel: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  presetScroll: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  presetCard: {
    width: 120,
    backgroundColor: COLORS.cardBg,
    borderRadius: SPACING.borderRadius,
    padding: SPACING.sm,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  presetBottleIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: COLORS.cardBgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  presetIconText: {
    fontSize: 20,
  },
  presetName: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  presetGeneric: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  ocrTextBox: {
    backgroundColor: COLORS.cardBgElevated,
    padding: SPACING.sm,
    borderRadius: SPACING.borderRadius,
    marginBottom: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.info,
  },
  ocrText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  medCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: SPACING.borderRadiusLarge,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  medHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.md,
  },
  medNameText: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  medGenericText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
  },
  badgeHighPower: {
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    borderWidth: 1,
    borderColor: COLORS.dangerLight,
  },
  badgeNormal: {
    backgroundColor: 'rgba(5, 150, 105, 0.2)',
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  descriptionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  beersAlertBox: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderRadius: SPACING.borderRadius,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
    marginBottom: SPACING.md,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  beersAlertTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.dangerLight,
    fontWeight: 'bold',
  },
  beersAlertText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontSize: 13,
  },
  interactionsContainer: {
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    borderRadius: SPACING.borderRadius,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.warning,
    marginBottom: SPACING.md,
  },
  interactionMainTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.warningLight,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  interactionAlertCard: {
    backgroundColor: COLORS.cardBgElevated,
    borderRadius: SPACING.borderRadius,
    padding: SPACING.sm,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  interactionAlertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  severityBadge: {
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    color: '#FFFFFF',
  },
  severitySevere: {
    backgroundColor: COLORS.danger,
  },
  severityModerate: {
    backgroundColor: COLORS.warning,
  },
  interactDrug: {
    ...TYPOGRAPHY.small,
    color: COLORS.text,
    fontWeight: '600',
  },
  interactDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  interactMechanism: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  interactionSafeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.success,
    borderRadius: SPACING.borderRadius,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  safeEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  interactionSafeText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
  },
  bulletContainer: {
    marginBottom: SPACING.md,
    paddingLeft: SPACING.xs,
  },
  bulletItem: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.borderRadius,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
    ...SHADOWS.small,
  },
  addButtonText: {
    ...TYPOGRAPHY.h3,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
