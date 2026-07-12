import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SHADOWS, SPACING } from '../styles/theme';

const MOCK_DOCTORS = [
  {
    id: '1',
    name: 'Dr. Evelyn Carter, PharmD',
    specialty: 'Geriatric Pharmacology',
    facility: 'St. Jude Geriatric Care',
    distance: '0.8 miles',
    phone: '+15550199',
    address: '452 Medical Parkway, Suite 100',
    available: true,
  },
  {
    id: '2',
    name: 'Dr. Marcus Vance, MD',
    specialty: 'Family Medicine & Geriatrics',
    facility: 'Vance Integrative Health',
    distance: '1.4 miles',
    phone: '+15550244',
    address: '910 Pine Avenue, Building B',
    available: true,
  },
  {
    id: '3',
    name: 'Dr. Priya Patel, DO',
    specialty: 'Cardiology & Senior Care',
    facility: 'Metro Heart & Vascular Center',
    distance: '2.3 miles',
    phone: '+15550388',
    address: '778 Cardiology Way, Floor 3',
    available: false,
  },
  {
    id: '4',
    name: 'Hillside Senior Health Clinic',
    specialty: 'Multi-Specialty Care Center',
    facility: 'County Health System',
    distance: '3.1 miles',
    phone: '+15550411',
    address: '1205 Hillside Boulevard',
    available: true,
  }
];

export default function NearbyDoctors({ activeMeds }) {
  const [requestStatus, setRequestStatus] = useState({});

  const handleCall = (phone, doctorName) => {
    const url = `tel:${phone}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          // Fallback alert for web or devices without phone support
          Alert.alert(
            'Simulated Call Initiated',
            `Calling ${doctorName} at ${phone}...`,
            [{ text: 'OK' }]
          );
        }
      })
      .catch((err) => console.error('Error opening call url:', err));
  };

  const handleSMS = (phone, doctorName) => {
    let medsText = '';
    if (activeMeds && activeMeds.length > 0) {
      medsText = ` My current list: ${activeMeds.map(m => m.name).join(', ')}.`;
    }
    
    const body = encodeURIComponent(`Hello, I am using the MediGuard app and would like to consult about drug reactions.${medsText}`);
    const url = `sms:${phone}${Platform.OS === 'ios' ? '&' : '?'}body=${body}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          // Fallback alert for web
          Alert.alert(
            'Simulated SMS Initiated',
            `Sending SMS to ${doctorName} at ${phone}:\n"${decodeURIComponent(body)}"`,
            [{ text: 'OK' }]
          );
        }
      })
      .catch((err) => console.error('Error opening SMS url:', err));
  };

  const handleRequestAlternative = (doctorId, doctorName) => {
    if (activeMeds.length === 0) {
      Alert.alert('Empty Prescriptions', 'Add medications to your intake list first to request alternatives.', [{ text: 'OK' }]);
      return;
    }

    setRequestStatus(prev => ({ ...prev, [doctorId]: 'sending' }));

    setTimeout(() => {
      setRequestStatus(prev => ({ ...prev, [doctorId]: 'sent' }));
      Alert.alert(
        'Request Dispatched',
        `An alternative prescription request containing your active list has been securely faxed/transmitted to ${doctorName}. They will review and contact you.`,
        [{ text: 'OK' }]
      );
    }, 2000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Practitioners</Text>
        <Text style={styles.subtitle}>Directly contact or query local doctors to substitute risky medications.</Text>
      </View>

      {/* Mock Map Visualization */}
      <View style={styles.mapCard}>
        <View style={styles.mapGraphic}>
          <Text style={styles.mapText}>🗺️ Interactive Medical Map</Text>
          <Text style={styles.mapSubtext}>Showing 4 clinics near your location</Text>
          
          {/* Mock Map Markers */}
          <View style={[styles.marker, { top: 30, left: 60 }]}><Text style={styles.markerText}>🏥</Text></View>
          <View style={[styles.marker, { top: 80, left: 180 }]}><Text style={styles.markerText}>🩺</Text></View>
          <View style={[styles.marker, { top: 120, left: 90 }]}><Text style={styles.markerText}>🏥</Text></View>
          <View style={[styles.marker, { top: 60, left: 280 }]}><Text style={styles.markerText}>🩺</Text></View>
          {/* User Location */}
          <View style={[styles.userMarker, { top: 95, left: 160 }]}><View style={styles.userPulse} /></View>
        </View>
      </View>

      {/* Doctors List */}
      <Text style={styles.sectionLabel}>Available Clinics & Specialists</Text>
      {MOCK_DOCTORS.map((doc) => (
        <View key={doc.id} style={styles.docCard}>
          <View style={styles.docCardHeader}>
            <View style={styles.docTitleGroup}>
              <Text style={styles.docName}>{doc.name}</Text>
              <Text style={styles.docFacility}>{doc.facility}</Text>
              <Text style={styles.docSpec}>{doc.specialty}</Text>
            </View>
            <View style={[styles.statusBadge, doc.available ? styles.statusAvail : styles.statusUnavail]}>
              <Text style={styles.statusBadgeText}>{doc.available ? 'OPEN' : 'CLOSED'}</Text>
            </View>
          </View>

          <View style={styles.docContactInfo}>
            <Text style={styles.infoText}>📍 {doc.address}</Text>
            <Text style={styles.infoText}>📏 {doc.distance} away • {doc.phone}</Text>
          </View>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.actionBtnCall}
              onPress={() => handleCall(doc.phone, doc.name)}
            >
              <Text style={styles.actionBtnText}>📞 Call</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionBtnSms}
              onPress={() => handleSMS(doc.phone, doc.name)}
            >
              <Text style={styles.actionBtnText}>💬 SMS</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.actionBtnReq,
                requestStatus[doc.id] === 'sent' ? styles.actionBtnReqSent : null
              ]}
              onPress={() => handleRequestAlternative(doc.id, doc.name)}
              disabled={requestStatus[doc.id] === 'sending' || requestStatus[doc.id] === 'sent'}
            >
              <Text style={[styles.actionBtnText, requestStatus[doc.id] !== 'sent' && { color: '#FFFFFF' }]}>
                {requestStatus[doc.id] === 'sending' ? 'Sending...' : 
                 requestStatus[doc.id] === 'sent' ? '✓ Sent Request' : '🔄 Request Substitute'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
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
  mapCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: SPACING.borderRadiusLarge,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  mapGraphic: {
    height: 180,
    backgroundColor: '#1E293B',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    ...TYPOGRAPHY.h3,
    color: '#FFFFFF',
    fontWeight: 'bold',
    zIndex: 1,
  },
  mapSubtext: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
    zIndex: 1,
  },
  marker: {
    position: 'absolute',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: {
    fontSize: 18,
  },
  userMarker: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.infoLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userPulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.info,
    borderColor: '#fff',
    borderWidth: 2,
  },
  sectionLabel: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.md,
    fontWeight: 'bold',
  },
  docCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: SPACING.borderRadiusLarge,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  docCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.sm,
  },
  docTitleGroup: {
    flex: 1,
    paddingRight: SPACING.xs,
  },
  docName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  docFacility: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  docSpec: {
    fontSize: 11,
    color: COLORS.infoLight,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusAvail: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 0.5,
    borderColor: COLORS.success,
  },
  statusUnavail: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 0.5,
    borderColor: COLORS.danger,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  docContactInfo: {
    paddingVertical: SPACING.sm,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  actionBtnCall: {
    flex: 1,
    marginRight: 6,
    backgroundColor: COLORS.cardBgElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SPACING.borderRadius,
    paddingVertical: 8,
    alignItems: 'center',
  },
  actionBtnSms: {
    flex: 1,
    marginRight: 6,
    backgroundColor: COLORS.cardBgElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SPACING.borderRadius,
    paddingVertical: 8,
    alignItems: 'center',
  },
  actionBtnReq: {
    flex: 2,
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.borderRadius,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnReqSent: {
    backgroundColor: COLORS.cardBgElevated,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});
