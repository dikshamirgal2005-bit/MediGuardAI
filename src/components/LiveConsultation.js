import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SHADOWS, SPACING } from '../styles/theme';

export default function LiveConsultation({ activeMeds }) {
  const [callState, setCallState] = useState('idle'); // idle, ringing, connected, ended
  const [timer, setTimer] = useState(0);
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);

  // Call timer simulation
  useEffect(() => {
    let interval;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const startCall = () => {
    setCallState('ringing');
    setTimeout(() => {
      setCallState('connected');
    }, 3000); // Ring for 3 seconds, then connect
  };

  const endCall = () => {
    setCallState('ended');
    setTimeout(() => {
      setCallState('idle');
    }, 2000); // Return to idle after 2s
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const severeMedsCount = activeMeds.filter(m => m.isHighPower).length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Doctor Telehealth</Text>
        <Text style={styles.subtitle}>Instantly consult nearby medical practitioners about drug concerns.</Text>
      </View>

      {callState === 'idle' && (
        <View style={styles.lobbyCard}>
          <Text style={styles.lobbyTitle}>SafeRx Virtual Consultation</Text>
          <Text style={styles.lobbyDesc}>
            Connect with an available on-call GP or clinical pharmacist to review your high-power drug combinations.
          </Text>

          <View style={styles.doctorInfoRow}>
            <View style={styles.doctorAvatar}>
              <Text style={styles.docEmoji}>🩺</Text>
            </View>
            <View style={styles.doctorDetails}>
              <Text style={styles.docName}>Dr. Evelyn Carter, PharmD</Text>
              <Text style={styles.docSpec}>Geriatric Pharmacologist (Active)</Text>
              <Text style={styles.docWait}>⚡ Average wait time: Under 2 mins</Text>
            </View>
          </View>

          {severeMedsCount > 0 && (
            <View style={styles.alertBanner}>
              <Text style={styles.alertBannerText}>
                ⚠️ You have {severeMedsCount} high-power medication(s) active. These details will be securely shared with the doctor.
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.callButton} onPress={startCall}>
            <Text style={styles.callButtonText}>Start Video Consultation</Text>
          </TouchableOpacity>
        </View>
      )}

      {callState === 'ringing' && (
        <View style={styles.callScreen}>
          <View style={styles.avatarBig}>
            <Text style={styles.avatarBigEmoji}>👩‍⚕️</Text>
          </View>
          <Text style={styles.ringingDocName}>Dr. Evelyn Carter</Text>
          <Text style={styles.ringingStatus}>Connecting secure line...</Text>
          <TouchableOpacity style={styles.hangupButton} onPress={endCall}>
            <Text style={styles.hangupText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {callState === 'connected' && (
        <View style={styles.activeCallContainer}>
          {/* Main Video Window (Doctor Feed) */}
          <View style={styles.videoWindow}>
            {/* Mock Doctor Camera Feed */}
            <View style={styles.doctorFeed}>
              <Text style={styles.videoPlaceholderText}>👩‍⚕️ Dr. Evelyn Carter</Text>
              <Text style={styles.videoStatusBadge}>🔴 LIVE (HD)</Text>
              <Text style={styles.videoLatencyBadge}>📶 Latency: 12ms</Text>
            </View>

            {/* PIP Self View */}
            {!camOff && (
              <View style={styles.pipView}>
                <Text style={styles.pipEmoji}>👤</Text>
                <Text style={styles.pipLabel}>You</Text>
              </View>
            )}
          </View>

          {/* Call Control Strip */}
          <View style={styles.controlsStrip}>
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
            <View style={styles.controlButtons}>
              <TouchableOpacity
                style={[styles.ctrlBtn, micMuted ? styles.ctrlBtnActive : null]}
                onPress={() => setMicMuted(!micMuted)}
              >
                <Text style={styles.ctrlIcon}>{micMuted ? '🎙️❌' : '🎙️'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.ctrlBtn, camOff ? styles.ctrlBtnActive : null]}
                onPress={() => setCamOff(!camOff)}
              >
                <Text style={styles.ctrlIcon}>{camOff ? '📷❌' : '📷'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ctrlBtnHangup} onPress={endCall}>
                <Text style={styles.ctrlIconHangup}>📞</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Live Prescription / Doctor Notes Panel */}
          <View style={styles.docNotesPanel}>
            <Text style={styles.docNotesTitle}>Live Prescription & Notes</Text>
            <View style={styles.notesList}>
              <View style={styles.noteItem}>
                <Text style={styles.noteBullet}>📌</Text>
                <Text style={styles.noteText}>Currently reviewing: Warfarin + Aspirin risks.</Text>
              </View>
              <View style={styles.noteItem}>
                <Text style={styles.noteBullet}>📌</Text>
                <Text style={styles.noteText}>Recommendation: Discontinue Aspirin, transition to Tylenol for pain.</Text>
              </View>
              {timer > 15 && (
                <View style={styles.noteItem}>
                  <Text style={styles.noteBullet}>💊</Text>
                  <Text style={styles.noteText}>New Prescription Sent: Acetaminophen 500mg, twice daily as needed.</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {callState === 'ended' && (
        <View style={styles.endedScreen}>
          <Text style={styles.endedEmoji}>🏁</Text>
          <Text style={styles.endedTitle}>Consultation Completed</Text>
          <Text style={styles.endedDesc}>
            Your consultation with Dr. Carter has ended. A summary and your updated prescriptions have been saved.
          </Text>
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
  lobbyCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: SPACING.borderRadiusLarge,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  lobbyTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  lobbyDesc: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  doctorInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBgElevated,
    borderRadius: SPACING.borderRadius,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.infoLight,
  },
  docEmoji: {
    fontSize: 24,
  },
  doctorDetails: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  docName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  docSpec: {
    fontSize: 12,
    color: COLORS.infoLight,
    marginTop: 2,
  },
  docWait: {
    fontSize: 10,
    color: COLORS.primaryLight,
    fontWeight: 'bold',
    marginTop: 4,
  },
  alertBanner: {
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.25)',
    borderRadius: SPACING.borderRadius,
    padding: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  alertBannerText: {
    fontSize: 11.5,
    color: COLORS.dangerLight,
    textAlign: 'center',
    lineHeight: 16,
  },
  callButton: {
    backgroundColor: COLORS.info,
    borderRadius: SPACING.borderRadius,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  callButtonText: {
    ...TYPOGRAPHY.h3,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  callScreen: {
    backgroundColor: COLORS.cardBg,
    borderRadius: SPACING.borderRadiusLarge,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 380,
    ...SHADOWS.medium,
  },
  avatarBig: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.cardBgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  avatarBigEmoji: {
    fontSize: 48,
  },
  ringingDocName: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  ringingStatus: {
    ...TYPOGRAPHY.body,
    color: COLORS.infoLight,
    marginTop: SPACING.sm,
    fontStyle: 'italic',
    marginBottom: SPACING.xl,
  },
  hangupButton: {
    backgroundColor: COLORS.danger,
    borderRadius: SPACING.borderRadius,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
  },
  hangupText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  activeCallContainer: {
    marginBottom: SPACING.lg,
  },
  videoWindow: {
    width: '100%',
    height: 240,
    backgroundColor: '#000',
    borderRadius: SPACING.borderRadiusLarge,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  doctorFeed: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B', // Slate 800 representing video frame
  },
  videoPlaceholderText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  videoStatusBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  videoLatencyBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(11, 15, 25, 0.6)',
    color: COLORS.textSecondary,
    fontSize: 9,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  pipView: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.sm,
    width: 70,
    height: 95,
    backgroundColor: '#334155', // PIP background
    borderRadius: SPACING.borderRadius,
    borderWidth: 1.5,
    borderColor: COLORS.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipEmoji: {
    fontSize: 24,
  },
  pipLabel: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 2,
  },
  controlsStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: SPACING.borderRadiusLarge,
    padding: SPACING.md,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  timerText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  controlButtons: {
    flexDirection: 'row',
  },
  ctrlBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardBgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ctrlBtnActive: {
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    borderColor: COLORS.dangerLight,
  },
  ctrlIcon: {
    fontSize: 16,
  },
  ctrlBtnHangup: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '135deg' }],
  },
  ctrlIconHangup: {
    fontSize: 18,
    color: '#fff',
  },
  docNotesPanel: {
    backgroundColor: COLORS.cardBg,
    borderRadius: SPACING.borderRadiusLarge,
    padding: SPACING.md,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  docNotesTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  notesList: {
    marginTop: SPACING.xs,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  noteBullet: {
    fontSize: 14,
    marginRight: SPACING.sm,
  },
  noteText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontSize: 13,
    flex: 1,
  },
  endedScreen: {
    backgroundColor: COLORS.cardBg,
    borderRadius: SPACING.borderRadiusLarge,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  endedEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  endedTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  endedDesc: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 18,
  },
});
