import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { recognizeSpeech, evaluatePronunciation } from '../utils/speechRecognition';
import SpeechPlayer from '../components/SpeechPlayer';

// Types
interface Phrase {
  cantonese: string;
  english: string;
  pronunciation: string;
}

interface NavigationProps {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
  setOptions: (options: any) => void;
}

interface RouteParams {
  lessonId: string;
  phraseIndex: number;
}

// Mock data for lessons
const LESSONS = {
  '1': {
    title: 'Greetings',
    phrases: [
      { cantonese: 'nei5 hou2', english: 'Hello', pronunciation: 'nay ho' },
      { cantonese: 'zou2 san4', english: 'Good morning', pronunciation: 'zoh sahn' },
      { cantonese: 'man6 ngon6', english: 'Good night', pronunciation: 'mahn ngohn' },
      { cantonese: 'dou1 ze6', english: 'Thank you', pronunciation: 'doh zeh' },
      { cantonese: 'hou2 yi3 gin3 nei5', english: 'Nice to meet you', pronunciation: 'ho yi gin nay' },
    ]
  },
  '2': {
    title: 'Numbers',
    phrases: [
      { cantonese: 'yat1', english: 'One', pronunciation: 'yat' },
      { cantonese: 'yi6', english: 'Two', pronunciation: 'yi' },
      { cantonese: 'saam1', english: 'Three', pronunciation: 'sahm' },
      { cantonese: 'sei3', english: 'Four', pronunciation: 'say' },
      { cantonese: 'ng5', english: 'Five', pronunciation: 'ng' },
    ]
  },
  '3': {
    title: 'Food & Drinks',
    phrases: [
      { cantonese: 'sik6 faan6', english: 'Eat rice/meal', pronunciation: 'sik faan' },
      { cantonese: 'jam2 seoi2', english: 'Drink water', pronunciation: 'yam seui' },
      { cantonese: 'cha4', english: 'Tea', pronunciation: 'cha' },
      { cantonese: 'gafe1', english: 'Coffee', pronunciation: 'ga-feh' },
      { cantonese: 'daan6 gou1', english: 'Cake', pronunciation: 'daan goh' },
    ]
  }
};

const PhraseDetailScreen = ({ route, navigation }: { route: { params: RouteParams }, navigation: NavigationProps }) => {
  const { lessonId, phraseIndex } = route.params;
  const lesson = LESSONS[lessonId as keyof typeof LESSONS];
  const phrase = lesson?.phrases[phraseIndex] as Phrase;

  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [message, setMessage] = useState('Press the microphone to practice saying this phrase');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    errors: Array<{
      word: string;
      correctPronunciation: string;
      advice: string;
    }>;
    overallFeedback: string;
  } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      title: `Practice: ${phrase?.english || 'Phrase'}`,
    });
  }, [navigation, phrase]);

  if (!phrase) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Phrase not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
        await requestPermission();
      }
      
      setMessage('Listening...');
      setIsRecording(true);
      
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
      setMessage('Failed to start recording');
      setIsRecording(false);
    }
  }

  async function stopRecording() {
    setIsRecording(false);
    setMessage('Analyzing your pronunciation...');
    setIsEvaluating(true);
    
    try {
      if (!recording) return;
      
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (!uri) {
        throw new Error('Recording URI is undefined');
      }
      
      // Use AI for pronunciation evaluation
      const result = await evaluatePronunciation(phrase.cantonese, uri);
      
      // Update state with feedback
      setFeedback(result);
      setMessage(`Score: ${result.score}/100`);
      setAttempts(attempts + 1);
      
      // Update best score if current score is better
      if (result.score > bestScore) {
        setBestScore(result.score);
      }
      
      setIsEvaluating(false);
      setRecording(null);
    } catch (err) {
      console.error('Failed to process recording', err);
      setMessage('Failed to analyze pronunciation');
      setIsEvaluating(false);
      setRecording(null);
    }
  }

  const resetPractice = () => {
    setFeedback(null);
    setMessage('Press the microphone to practice saying this phrase');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.english}>{phrase.english}</Text>
          <Text style={styles.cantonese}>{phrase.cantonese}</Text>
          <Text style={styles.pronunciation}>Pronunciation: {phrase.pronunciation}</Text>
          
          <View style={styles.listenContainer}>
            <SpeechPlayer 
              text={phrase.cantonese} 
              language="zh-HK" 
              label="Listen to Correct Pronunciation" 
            />
          </View>
        </View>
        
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Pronunciation Tips</Text>
          <Text style={styles.tipText}>• Listen carefully to the tones in Cantonese</Text>
          <Text style={styles.tipText}>• Pay attention to the numbers after syllables - they indicate tone</Text>
          <Text style={styles.tipText}>• Practice each part of the phrase separately first</Text>
          <Text style={styles.tipText}>• Record yourself and compare with the example</Text>
        </View>
        
        <View style={styles.practiceContainer}>
          <Text style={styles.practiceTitle}>Practice Speaking</Text>
          
          {attempts > 0 && (
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>Attempts: {attempts}</Text>
              <Text style={styles.statsText}>Best Score: {bestScore}/100</Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={[styles.micButton, isRecording && styles.recordingButton]} 
            onPress={isRecording ? stopRecording : startRecording}
            disabled={isEvaluating}
          >
            {isEvaluating ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Text style={styles.micButtonText}>{isRecording ? '■' : '🎤'}</Text>
            )}
          </TouchableOpacity>
          
          <Text style={styles.messageText}>{message}</Text>
          
          {feedback && (
            <View style={styles.feedbackContainer}>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Your Score</Text>
                <Text style={[
                  styles.scoreValue, 
                  feedback.score >= 90 ? styles.excellentScore : 
                  feedback.score >= 70 ? styles.goodScore : 
                  styles.needsWorkScore
                ]}>
                  {feedback.score}
                </Text>
              </View>
              
              <Text style={styles.feedbackText}>{feedback.overallFeedback}</Text>
              
              {feedback.errors.length > 0 && (
                <View style={styles.improvementContainer}>
                  <Text style={styles.improvementTitle}>Improvement Tips</Text>
                  {feedback.errors.map((error, index) => (
                    <View key={index} style={styles.improvementItem}>
                      <Text style={styles.errorWord}>{error.word}: </Text>
                      <Text style={styles.errorAdvice}>{error.advice}</Text>
                    </View>
                  ))}
                </View>
              )}
              
              <TouchableOpacity style={styles.tryAgainButton} onPress={resetPractice}>
                <Text style={styles.buttonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back to Lesson</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  english: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cantonese: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ED4B4F',
    marginBottom: 8,
  },
  pronunciation: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  listenContainer: {
    marginTop: 8,
  },
  tipsCard: {
    backgroundColor: '#E8F4FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2980B9',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
  },
  practiceContainer: {
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  practiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ED4B4F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  recordingButton: {
    backgroundColor: '#DC3545',
  },
  micButtonText: {
    fontSize: 36,
    color: 'white',
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 24,
  },
  feedbackContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  excellentScore: {
    color: '#27AE60',
  },
  goodScore: {
    color: '#F39C12',
  },
  needsWorkScore: {
    color: '#E74C3C',
  },
  feedbackText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  improvementContainer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  improvementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  improvementItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  errorWord: {
    fontWeight: 'bold',
    color: '#E74C3C',
  },
  errorAdvice: {
    flex: 1,
    color: '#333',
  },
  tryAgainButton: {
    backgroundColor: '#5C6BC0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  backButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#E74C3C',
    marginBottom: 20,
  },
});

export default PhraseDetailScreen; 