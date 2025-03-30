import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { recognizeSpeech, evaluatePronunciation } from '../utils/speechRecognition';
import SpeechPlayer from '../components/SpeechPlayer';

// Types for navigation
interface RouteParams {
  lessonId?: string;
  practiceType?: 'lesson' | 'single';
  phraseIndex?: number;
}

interface NavigationProps {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
  setOptions: (options: any) => void;
}

// Mock data for practice questions
const PRACTICE_QUESTIONS = [
  {
    id: '1',
    question: 'How do you say "Hello" in Cantonese?',
    options: ['man6 ngon6', 'zou2 san4', 'nei5 hou2', 'dou1 ze6'],
    correctAnswer: 'nei5 hou2',
    audioPrompt: 'Try saying: nei5 hou2'
  },
  {
    id: '2',
    question: 'What does "dou1 ze6" mean?',
    options: ['Hello', 'Goodbye', 'Thank you', 'Good morning'],
    correctAnswer: 'Thank you',
    audioPrompt: 'Try saying: dou1 ze6'
  },
  {
    id: '3',
    question: 'How do you say "Three" in Cantonese?',
    options: ['yat1', 'yi6', 'saam1', 'sei3'],
    correctAnswer: 'saam1',
    audioPrompt: 'Try saying: saam1'
  },
  {
    id: '4',
    question: 'What is the Cantonese word for "Good night"?',
    options: ['zou2 san4', 'man6 ngon6', 'nei5 hou2', 'hou2 yi3 gin3 nei5'],
    correctAnswer: 'man6 ngon6',
    audioPrompt: 'Try saying: man6 ngon6'
  },
  {
    id: '5',
    question: 'How do you say "Nice to meet you" in Cantonese?',
    options: ['dou1 ze6', 'nei5 hou2', 'zou2 san4', 'hou2 yi3 gin3 nei5'],
    correctAnswer: 'hou2 yi3 gin3 nei5',
    audioPrompt: 'Try saying: hou2 yi3 gin3 nei5'
  }
];

const PracticeScreen = ({ navigation, route }: { navigation: NavigationProps, route: { params: RouteParams } }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [message, setMessage] = useState('');
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [voicePracticeMode, setVoicePracticeMode] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [pronunciationFeedback, setPronunciationFeedback] = useState<{
    score: number;
    errors: Array<{
      word: string;
      correctPronunciation: string;
      advice: string;
    }>;
    overallFeedback: string;
  } | null>(null);

  useEffect(() => {
    navigation.setOptions({
      title: 'Practice Mode',
    });
  }, [navigation]);

  const currentQuestion = PRACTICE_QUESTIONS[currentQuestionIndex];

  const handleAnswer = (option: string) => {
    if (answered) return;
    
    setSelectedOption(option);
    setAnswered(true);
    
    if (option === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < PRACTICE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswered(false);
      setSelectedOption(null);
      setVoicePracticeMode(false);
      setPronunciationFeedback(null);
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedOption(null);
    setQuizComplete(false);
    setVoicePracticeMode(false);
    setPronunciationFeedback(null);
  };

  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
        await requestPermission();
      }
      
      setMessage('Listening...');
      setIsRecording(true);
      setPronunciationFeedback(null);
      
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
    setMessage('Processing your speech...');
    setIsEvaluating(true);
    
    try {
      if (!recording) return;
      
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (!uri) {
        throw new Error('Recording URI is undefined');
      }
      
      // Use AI evaluation for pronunciation
      const feedback = await evaluatePronunciation(
        currentQuestion.correctAnswer,
        uri
      );

      // Update state with AI feedback
      setPronunciationFeedback(feedback);
      
      // Set score based on AI evaluation
      if (feedback.score >= 70) {
        setMessage(`Great job! Score: ${feedback.score}/100`);
        if (!answered) {
          setScore(score + 1);
        }
      } else {
        setMessage(`Keep practicing. Score: ${feedback.score}/100`);
      }
      
      setAnswered(true);
      setSelectedOption(currentQuestion.correctAnswer);
      setIsEvaluating(false);
      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
      setMessage('Failed to process recording');
      setIsEvaluating(false);
      setRecording(null);
    }
  }

  const toggleVoicePracticeMode = () => {
    setVoicePracticeMode(!voicePracticeMode);
    setMessage(voicePracticeMode ? '' : 'Press the microphone to start speaking');
    setPronunciationFeedback(null);
  };

  if (quizComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completeContainer}>
          <Text style={styles.completeTitle}>Practice Complete!</Text>
          <Text style={styles.scoreText}>Your Score: {score}/{PRACTICE_QUESTIONS.length}</Text>
          
          <TouchableOpacity style={styles.restartButton} onPress={restartQuiz}>
            <Text style={styles.buttonText}>Practice Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Question {currentQuestionIndex + 1} of {PRACTICE_QUESTIONS.length}</Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>
      
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        
        {!voicePracticeMode ? (
          // Multiple choice mode
          currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === option && answered && option === currentQuestion.correctAnswer && styles.correctOption,
                selectedOption === option && answered && option !== currentQuestion.correctAnswer && styles.incorrectOption,
              ]}
              onPress={() => handleAnswer(option)}
              disabled={answered}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))
        ) : (
          // Voice practice mode
          <View style={styles.voicePracticeContainer}>
            <View style={styles.listenContainer}>
              <Text style={styles.promptText}>{currentQuestion.audioPrompt}</Text>
              <SpeechPlayer 
                text={currentQuestion.correctAnswer} 
                language="zh-HK" 
                label="Listen to Example" 
              />
            </View>
            
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
            
            {message ? <Text style={styles.messageText}>{message}</Text> : null}
            
            {pronunciationFeedback && (
              <View style={styles.feedbackCardContainer}>
                <View style={styles.feedbackCard}>
                  <Text style={styles.feedbackTitle}>AI Pronunciation Feedback</Text>
                  <Text style={styles.feedbackText}>{pronunciationFeedback.overallFeedback}</Text>
                  
                  {pronunciationFeedback.errors.length > 0 && (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorTitle}>Tips for improvement:</Text>
                      {pronunciationFeedback.errors.map((error, index) => (
                        <View key={index} style={styles.errorItem}>
                          <Text style={styles.errorWord}>{error.word}: </Text>
                          <Text style={styles.errorAdvice}>{error.advice}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        )}
      </View>
      
      <View style={styles.actionContainer}>
        {!answered ? (
          <TouchableOpacity 
            style={styles.voiceModeButton} 
            onPress={toggleVoicePracticeMode}
            disabled={isRecording || isEvaluating}
          >
            <Text style={styles.buttonText}>
              {voicePracticeMode ? 'Switch to Multiple Choice' : 'Practice with Voice'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackText}>
              {selectedOption === currentQuestion.correctAnswer ? '✓ Correct!' : '✗ Incorrect!'}
            </Text>
            <TouchableOpacity style={styles.nextButton} onPress={goToNextQuestion}>
              <Text style={styles.buttonText}>
                {currentQuestionIndex < PRACTICE_QUESTIONS.length - 1 ? 'Next Question' : 'See Results'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF8E1',
  },
  progressText: {
    fontSize: 16,
    color: '#666',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  questionContainer: {
    padding: 16,
    flex: 1,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  correctOption: {
    backgroundColor: '#D4EDDA',
    borderColor: '#28A745',
  },
  incorrectOption: {
    backgroundColor: '#F8D7DA',
    borderColor: '#DC3545',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  feedbackContainer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: '#ED4B4F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  restartButton: {
    backgroundColor: '#ED4B4F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  homeButton: {
    backgroundColor: '#6C757D',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  voicePracticeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  listenContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  promptText: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ED4B4F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  recordingButton: {
    backgroundColor: '#DC3545',
  },
  micButtonText: {
    fontSize: 40,
    color: 'white',
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    color: '#555',
  },
  actionContainer: {
    padding: 16,
  },
  voiceModeButton: {
    backgroundColor: '#5C6BC0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
  },
  feedbackCardContainer: {
    width: '100%',
    paddingVertical: 10,
  },
  feedbackCard: {
    backgroundColor: '#F1F8FF',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  errorContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  },
  errorItem: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  errorWord: {
    fontWeight: 'bold',
    color: '#E74C3C',
  },
  errorAdvice: {
    flex: 1,
    color: '#34495E',
  },
});

export default PracticeScreen;
