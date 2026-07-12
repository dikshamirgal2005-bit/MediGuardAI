import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SHADOWS, SPACING } from '../styles/theme';
import { MEDICINES, checkInteractions } from '../data/medicineDb';

export default function InteractionChecker({ activeMeds, onAddMed, onRemoveMed, onNavigateToTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim().length > 0) {
      const filtered = MEDICINES.filter(
        (med) =>
          med.name.toLowerCase().includes(text.toLowerCase()) ||
          med.generic.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const selectMedFromSearch = (med) => {
    // Prevent duplicates
    if (activeMeds.some(m => m.id === med.id)) {
      alert(`${med.name} is already in your Active Medications list.`);
    } else {
      onAddMed(med);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  // Dynamically calculate all current active interactions
  const getAllCurrentInteractions = () => {
    const allAlerts = [];
    const checkedPairs = new Set();

    for (let i = 0; i < activeMeds.length; i++) {
      for (let j = i + 1; j < activeMeds.length; j++) {
        const drugA = activeMeds[i];
        const drugB = activeMeds[j];
        
        const pairKey = [drugA.id, drugB.id].sort().join('-');
        if (checkedPairs.has(pairKey)) continue;
        checkedPairs.add(pairKey);

        const interactions = checkInteractions(drugA.id, [drugB.id]);
        if (interactions.length > 0) {
          allAlerts.push({
            drugA,
            drugB,
            ...interactions[0]
          });
        }
      }
    }
    return allAlerts;
  };

  const currentInteractions = getAllCurrentInteractions();
  const severeInteractionsCount = currentInteractions.filter(i => i.severity === 'SEVERE').length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Interaction Checker</Text>
        <Text style={styles.subtitle}>Manage active prescriptions and check for combined drug hazards.</Text>
      </View>

      {/* Manual Search Bar */}
      <View style={styles.searchSection}>
        <Text style={styles.sectionLabel}>Add Medication Manually</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Type drug name (e.g. Warfarin, Xanax...)"
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        
        {searchResults.length > 0 && (
          <View style={styles.searchResultsBox}>
            {searchResults.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.searchResultItem}
                onPress={() => selectMedFromSearch(item)}
              >
                <View>
                  <Text style={styles.searchResultName}>{item.name}</Text>
                  <Text style={styles.searchResultGeneric}>{item.generic}</Text>
                </View>
                <Text style={styles.addIcon}>➕</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Severe Alert Summary Box */}
      {currentInteractions.length > 0 && (
        <View style={[
          styles.alertSummaryBox,
          severeInteractionsCount > 0 ? styles.alertSummarySevere : styles.alertSummaryModerate
        ]}>
          <View style={styles.alertSummaryHeader}>
            <Text style={styles.alertSummaryEmoji}>⚠️</Text>
            <Text style={styles.alertSummaryTitle}>
              {severeInteractionsCount > 0 
                ? 'CRITICAL WARNING: Severe Drug Conflicts!' 
                : 'Caution: Moderate Drug Conflicts Detected'}
            </Text>
          </View>
          <Text style={styles.alertSummaryText}>
            We found {currentInteractions.length} adverse reaction{currentInteractions.length > 1 ? 's' : ''} in your medicine combo. {severeInteractionsCount > 0 ? 'Consulting a doctor is highly advised.' : ''}
          </Text>
          {severeInteractionsCount > 0 && (
            <TouchableOpacity 
              style={styles.alertConsultBtn}
              onPress={() => onNavigateToTab('telehealth')}
            >
              <Text style={styles.alertConsultBtnText}>Start Live Call with Doctor</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Active Medications List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>Active Medication Intake ({activeMeds.length})</Text>
        {activeMeds.length > 0 && (
          <Text style={styles.helperText}>Intake list is monitored in real-time</Text>
        )}
      </View>

      {activeMeds.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>💊</Text>
          <Text style={styles.emptyText}>No medications added yet.</Text>
          <Text style={styles.emptySubText}>Use the Medicine Scanner or search above to compile your prescription list and review safety warnings.</Text>
        </View>
      ) : (
        <View style={styles.medsList}>
          {activeMeds.map((med) => (
            <View key={med.id} style={styles.medListItem}>
              <View style={styles.medListInfo}>
                <Text style={styles.medListName}>{med.name}</Text>
                <Text style={styles.medListSub}>{med.generic} • {med.category}</Text>
                {med.isHighPower && (
                  <View style={styles.highPowerBadge}>
                    <Text style={styles.highPowerBadgeText}>HIGH POWERED</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onRemoveMed(med.id)}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Detailed Interaction Cards */}
      {currentInteractions.length > 0 && (
        <View style={styles.interactionsSection}>
          <Text style={styles.sectionLabel}>Detected Drug Interactions</Text>
          {currentInteractions.map((item, index) => (
            <View key={index} style={styles.interactionFullCard}>
              <View style={styles.interTitleBar}>
                <Text style={styles.interTitle}>
                  {item.drugA.name} + {item.drugB.name}
                </Text>
                <View style={[
                  styles.sevBadge,
                  item.severity === 'SEVERE' ? styles.sevSevere : styles.sevModerate
                ]}>
                  <Text style={styles.sevBadgeText}>{item.severity}</Text>
                </View>
              </View>

              <Text style={styles.interMechanism}>Mechanism: {item.mechanism}</Text>
              <Text style={styles.interDescription}>{item.description}</Text>

              {/* Action Recommendation */}
              <View style={styles.recContainer}>
                <Text style={styles.recTitle}>Recommendation:</Text>
                <Text style={styles.recText}>
                  {item.severity === 'SEVERE'
                    ? `DO NOT combine. Talk to your cardiologist or GP about safer alternatives like ${item.drugA.alternatives[0] || 'other options'}.`
                    : 'Monitor for side effects such as nausea or stomach irritation. Discuss dosage reduction with your doctor.'}
                </Text>
              </View>
            </View>
          ))}
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
  searchSection: {
    marginBottom: SPACING.lg,
    zIndex: 10, // Ensure results overlap
  },
  sectionLabel: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SPACING.borderRadius,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    color: COLORS.text,
    fontSize: 14,
  },
  searchResultsBox: {
    backgroundColor: COLORS.cardBgElevated,
    borderRadius: SPACING.borderRadius,
    marginTop: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  searchResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchResultName: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  searchResultGeneric: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  addIcon: {
    fontSize: 16,
    color: COLORS.primaryLight,
  },
  alertSummaryBox: {
    borderRadius: SPACING.borderRadiusLarge,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderLeftWidth: 5,
    ...SHADOWS.medium,
  },
  alertSummarySevere: {
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    borderLeftColor: COLORS.danger,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
  },
  alertSummaryModerate: {
    backgroundColor: 'rgba(217, 119, 6, 0.12)',
    borderLeftColor: COLORS.warning,
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.3)',
  },
  alertSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  alertSummaryEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  alertSummaryTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  alertSummaryText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  alertConsultBtn: {
    backgroundColor: COLORS.danger,
    borderRadius: SPACING.borderRadius,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md,
    alignSelf: 'flex-start',
  },
  alertConsultBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  helperText: {
    fontSize: 11,
    color: COLORS.primaryLight,
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: COLORS.cardBg,
    borderRadius: SPACING.borderRadiusLarge,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: SPACING.md,
    opacity: 0.6,
  },
  emptyText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    fontWeight: '600',
  },
  emptySubText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
  medsList: {
    marginBottom: SPACING.lg,
  },
  medListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SPACING.borderRadius,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  medListInfo: {
    flex: 1,
  },
  medListName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  medListSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  highPowerBadge: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: SPACING.xs,
    borderWidth: 0.5,
    borderColor: COLORS.dangerLight,
  },
  highPowerBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.dangerLight,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardBgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.md,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  interactionsSection: {
    marginBottom: SPACING.xl,
  },
  interactionFullCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: SPACING.borderRadiusLarge,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  interTitleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  interTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  sevBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sevSevere: {
    backgroundColor: COLORS.danger,
  },
  sevModerate: {
    backgroundColor: COLORS.warning,
  },
  sevBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  interMechanism: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: SPACING.xs,
  },
  interDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  recContainer: {
    backgroundColor: COLORS.cardBgElevated,
    borderRadius: SPACING.borderRadius,
    padding: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  recTitle: {
    ...TYPOGRAPHY.small,
    color: COLORS.primaryLight,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  recText: {
    ...TYPOGRAPHY.body,
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 16,
  },
});
