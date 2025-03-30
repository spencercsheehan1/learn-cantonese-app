import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import * as Speech from 'expo-speech';

interface SpeechPlayerProps {
  text: string;
  language?: string;
  label?: string;
}

const SpeechPlayer: React.FC<SpeechPlayerProps> = ({ 
  text, 
  language = 'zh-HK', // Default to Hong Kong Cantonese
  label = 'Listen'
}) => {
  const [speaking, setSpeaking] = useState(false);

  const speak = async () => {
    const isSpeaking = await Speech.isSpeakingAsync();
    
    if (isSpeaking) {
      await Speech.stop();
      setSpeaking(false);
      return;
    }

    setSpeaking(true);
    
    Speech.speak(text, {
      language,
      pitch: 1.0,
      rate: 0.75, // Slightly slower for learning purposes
      onDone: () => setSpeaking(false),
      onError: () => setSpeaking(false)
    });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={speak} disabled={speaking}>
      <View style={styles.buttonContent}>
        {speaking ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.icon}>🔊</Text>
        )}
        <Text style={styles.text}>{speaking ? 'Playing...' : label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4A6DA7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
    color: 'white',
    marginRight: 8,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  }
});

export default SpeechPlayer; 