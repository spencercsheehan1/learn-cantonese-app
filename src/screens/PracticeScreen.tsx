import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for practice questions
const PRACTICE_QUESTIONS = [
  {
    id: '1',
    question: 'How do you say "Hello" in Cantonese?',
    options: ['man6 ngon6', 'zou2 san4', 'nei5 hou2', 'dou1 ze6'],
    correctAnswer: 'nei5 hou2'
  },
  {
    id: '2',
    question: 'What does "dou1 ze6" mean?',
    options: ['Hello', 'Goodbye', 'Thank you', 'Good morning'],
    correctAnswer: 'Thank you'
  },
  {
    id: '3',
    question: 'How do you say "Three" in Cantonese?',
    options: ['yat1', 'yi6', 'saam1', 'sei3'],
    correctAnswer: 'saam1'
  },
  {
    id: '4',
    question: 'What is the Cantonese word for "Good night"?',
    options: ['zou2 san4', 'man6 ngon6', 'nei5 hou2', 'hou2 yi3 gin3 nei5'],
    correctAnswer: 'man6 ngon6'
  },
  {
    id: '5',
    question: 'How do you say "Nice to meet you" in Cantonese?',
    options: ['dou1 ze6', 'nei5 hou2', 'zou2 san4', 'hou2 yi3 gin3 nei5'],
    correctAnswer: 'hou2 yi3 gin3 nei5'
  }
];

const PracticeScreen = ({ navigation }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: 'Practice Mode',
    });
  }, [navigation]);

  const currentQuestion = PRACTICE_QUESTIONS[currentQuestionIndex];

  const handleAnswer = (option) => {
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
        
        {currentQuestion.options.map((option, index) => (
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
        ))}
      </View>
      
      {answered && (
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
  }
});

export default PracticeScreen;
