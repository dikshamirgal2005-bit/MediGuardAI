import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SHADOWS, SPACING } from '../styles/theme';
import { MEDICINES } from '../data/medicineDb';

export default function MedicalChatbot() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! I am MediBot, your geriatric drug safety assistant. You can ask me questions about medicines, dosage safety, or upload an image of a pill bottle/prescription to analyze side effects and conflicts. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef();

  const handleSend = (text, imageUri = null) => {
    if (!text && !imageUri) return;

    // Add user message
    const newUserMsg = {
      id: Math.random().toString(),
      sender: 'user',
      text: text || 'Sent an image for analysis',
      image: imageUri,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputVal('');
    setIsTyping(true);

    // Trigger bot reply simulator
    setTimeout(() => {
      setIsTyping(false);
      let replyText = '';
      
      const query = text ? text.toLowerCase() : '';

      if (imageUri) {
        // Image analysis response
        replyText = '📸 [Image Analysis] I analyzed the label of the prescription bottle in the photo. It appears to be Xanax (Alprazolam) 0.5mg. \n\n⚠️ Warning: Xanax is a benzodiazepine. It is on the Beers Criteria list of high-risk drugs for elderly patients because it causes severe drowsiness, loss of motor coordination, and significantly increases the risk of falls and fractures. I highly recommend discussing safer alternatives like Buspirone or CBT with your physician.';
      } else if (query.includes('warfarin') && query.includes('aspirin')) {
        replyText = '⚠️ CRITICAL ALERT: Combining Warfarin (Coumadin) and Aspirin increases the danger of severe internal and gastrointestinal bleeding. They should not be taken together unless explicitly directed and monitored by your cardiologist. If you experience severe bruising, dark stools, or nosebleeds, contact emergency services.';
      } else if (query.includes('ibuprofen') && query.includes('lisinopril')) {
        replyText = '⚠️ SEVERE INTERACTION: Taking Ibuprofen (an NSAID) with Lisinopril (an ACE Inhibitor blood pressure medication) can cause acute kidney injury. It also causes fluid retention and neutralizes Lisinopril\'s blood pressure-lowering effect. For pain, Acetaminophen (Tylenol) is generally a much safer alternative for your kidneys.';
      } else if (query.includes('fall') || query.includes('drowsy') || query.includes('sleep')) {
        replyText = '💤 Senior Fall Hazard Alert: Several classes of medicines cause drowsiness and falls in older adults:\n1. Benzodiazepines (e.g. Xanax, Valium)\n2. Strong Antihistamines (e.g. Benadryl, PM sleep aids containing diphenhydramine)\n3. Muscle Relaxants\n4. Opioid pain relievers (e.g. Tramadol).\n\nIf you or an elderly relative are taking these, please ensure the home environment is clear of tripping hazards and consult your GP about tapering options.';
      } else if (query.includes('hello') || query.includes('hi')) {
        replyText = 'Hello! I am here to help you review drug combinations and answer geriatric medication safety questions. Please feel free to ask about any specific drug or upload an image.';
      } else {
        // Search database for matches
        const matchedMed = MEDICINES.find(med => 
          query.includes(med.name.toLowerCase()) || 
          query.includes(med.generic.toLowerCase())
        );

        if (matchedMed) {
          replyText = `ℹ️ Drug Profile for ${matchedMed.name} (${matchedMed.generic}):\n\n• Category: ${matchedMed.category}\n• High-power Alert: ${matchedMed.isHighPower ? 'YES' : 'NO'}\n• Description: ${matchedMed.description}\n\n${matchedMed.beersCriteria ? `⚠️ Geriatric warning: ${matchedMed.beersWarning}\n\n` : ''}• Key Side Effects: ${matchedMed.sideEffects.join(', ')}\n• Safer alternatives: ${matchedMed.alternatives.join(', ')}`;
        } else {
          replyText = 'I received your query. To protect your health, remember that high-power medicines like blood thinners (Warfarin), NSAIDs (Ibuprofen), sleep aids (Benadryl), and anxiety meds (Xanax) require extreme caution in seniors. \n\nIf you have a prescription, you can type the drug name, scan it, or send an image here, and I will check its hazards!';
        }
      }

      const newBotMsg = {
        id: Math.random().toString(),
        sender: 'bot',
        text: replyText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newBotMsg]);
    }, 1800);
  };

  const handleSuggestionPress = (suggestionText) => {
    handleSend(suggestionText);
  };

  const simulateImageSend = () => {
    // We simulate selecting a pill bottle photo
    handleSend(null, 'https://example.com/mock-pill-bottle.jpg');
  };

  // Scroll to bottom on new message
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  const renderMessage = ({ item }) => {
    const isBot = item.sender === 'bot';
    return (
      <View style={[styles.messageRow, isBot ? styles.botRow : styles.userRow]}>
        {isBot && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🤖</Text>
          </View>
        )}
        <View style={[
          styles.messageBubble, 
          isBot ? styles.botBubble : styles.userBubble,
          item.image ? styles.imageBubble : null
        ]}>
          {item.image ? (
            <View style={styles.imageAttachmentContainer}>
              <View style={styles.mockImageContainer}>
                <Text style={styles.mockImageEmoji}>📸</Text>
                <Text style={styles.mockImageText}>Pill Bottle Image Attached</Text>
              </View>
            </View>
          ) : null}
          <Text style={[styles.messageText, isBot ? styles.botText : styles.userText]}>
            {item.text}
          </Text>
          <Text style={styles.messageTime}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  const SUGGESTIONS = [
    'Can I take Ibuprofen with Warfarin?',
    'Which medicines cause elderly falls?',
    'Tell me about Xanax side effects',
  ];

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={styles.container}
    >
      {/* Disclaimer Banner */}
      <View style={styles.disclaimerBox}>
        <Text style={styles.disclaimerText}>
          ⚠️ <Text style={styles.boldText}>Medical Disclaimer:</Text> MediBot is an AI assistant, not a doctor. For emergencies, call 911 or visit the nearest ER immediately.
        </Text>
      </View>

      {/* Message List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageListContent}
        ListFooterComponent={
          isTyping && (
            <View style={styles.typingContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>🤖</Text>
              </View>
              <View style={[styles.messageBubble, styles.botBubble]}>
                <Text style={[styles.messageText, styles.botText, styles.typingText]}>
                  MediBot is analyzing...
                </Text>
              </View>
            </View>
          )
        }
      />

      {/* Suggestion Chips */}
      {messages.length === 1 && (
        <View style={styles.suggestionsContainer}>
          {SUGGESTIONS.map((s, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.suggestionChip}
              onPress={() => handleSuggestionPress(s)}
            >
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Input Tray */}
      <View style={styles.inputTray}>
        <TouchableOpacity style={styles.imageButton} onPress={simulateImageSend}>
          <Text style={styles.imageButtonText}>📸</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Ask MediBot about drug interactions..."
          placeholderTextColor={COLORS.textSecondary}
          value={inputVal}
          onChangeText={setInputVal}
          onSubmitEditing={() => handleSend(inputVal)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => handleSend(inputVal)}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  disclaimerBox: {
    backgroundColor: 'rgba(219, 121, 6, 0.08)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    padding: SPACING.sm,
  },
  disclaimerText: {
    fontSize: 11,
    color: COLORS.warningLight,
    textAlign: 'center',
    lineHeight: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
  messageListContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    maxWidth: '85%',
  },
  botRow: {
    alignSelf: 'flex-start',
  },
  userRow: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.cardBgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarText: {
    fontSize: 16,
  },
  messageBubble: {
    borderRadius: SPACING.borderRadiusLarge,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    flexShrink: 1,
    ...SHADOWS.small,
  },
  botBubble: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: COLORS.accent,
    borderTopRightRadius: 4,
  },
  imageBubble: {
    paddingTop: SPACING.xs,
  },
  messageText: {
    ...TYPOGRAPHY.body,
    fontSize: 13.5,
    lineHeight: 18.5,
  },
  botText: {
    color: COLORS.text,
  },
  userText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 9,
    color: COLORS.textSecondary,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  typingContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    alignSelf: 'flex-start',
  },
  typingText: {
    fontStyle: 'italic',
    color: COLORS.textSecondary,
  },
  suggestionsContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xs,
    flexDirection: 'column',
    alignItems: 'center',
  },
  suggestionChip: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    marginBottom: 6,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  suggestionText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  inputTray: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: SPACING.sm,
  },
  imageButton: {
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
  imageButtonText: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    height: 38,
    color: COLORS.text,
    fontSize: 13,
  },
  sendButton: {
    marginLeft: SPACING.sm,
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.md,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  imageAttachmentContainer: {
    width: 180,
    height: 90,
    borderRadius: SPACING.borderRadius,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mockImageContainer: {
    flex: 1,
    backgroundColor: COLORS.cardBgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockImageEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  mockImageText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
});
