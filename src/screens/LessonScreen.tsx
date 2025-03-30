import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SpeechPlayer from '../components/SpeechPlayer';

// Types for navigation
interface NavigationProps {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
  setOptions: (options: any) => void;
}

interface RouteParams {
  lessonId: string;
  title?: string;
}

// Types for phrases
interface Phrase {
  cantonese: string;
  english: string;
  pronunciation: string;
}

// Mock data for lesson content
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
  },
  '4': {
    title: 'Transportation',
    phrases: [
      { cantonese: 'ba1 si2', english: 'Bus', pronunciation: 'ba si' },
      { cantonese: 'dei6 tit3', english: 'Subway', pronunciation: 'day tit' },
      { cantonese: 'dik1 si2', english: 'Taxi', pronunciation: 'dik si' },
      { cantonese: 'gei1 cei1', english: 'Airplane', pronunciation: 'gay chay' },
      { cantonese: 'hang4 zau6', english: 'Walk', pronunciation: 'hang zau' },
    ]
  }
};

const LessonScreen = ({ route, navigation }: { route: { params: RouteParams }, navigation: NavigationProps }) => {
  const { lessonId, title } = route.params;
  const lesson = LESSONS[lessonId as keyof typeof LESSONS] || { title: 'Lesson not found', phrases: [] };
  
  React.useEffect(() => {
    navigation.setOptions({
      title: title || lesson.title || 'Lesson',
    });
  }, [navigation, title, lesson.title]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <Text style={styles.lessonSubtitle}>Learn these common phrases</Text>
        </View>
        
        {lesson.phrases.map((phrase: Phrase, index: number) => (
          <View key={index} style={styles.phraseCard}>
            <Text style={styles.cantonese}>{phrase.cantonese}</Text>
            <Text style={styles.english}>{phrase.english}</Text>
            <Text style={styles.pronunciation}>Pronunciation: {phrase.pronunciation}</Text>
            
            <View style={styles.actionRow}>
              <SpeechPlayer 
                text={phrase.cantonese} 
                language="zh-HK" 
                label="Listen" 
              />
              
              <TouchableOpacity 
                style={styles.repeatButton}
                onPress={() => navigation.navigate('PhraseDetail', { 
                  lessonId, 
                  phraseIndex: index 
                })}
              >
                <Text style={styles.repeatButtonText}>Practice</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        <TouchableOpacity
          style={styles.practiceButton}
          onPress={() => navigation.navigate('Practice', { lessonId })}
        >
          <Text style={styles.practiceButtonText}>Practice this lesson</Text>
        </TouchableOpacity>
      </ScrollView>
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
  },
  header: {
    marginBottom: 20,
    backgroundColor: '#FFF8E1',
    padding: 16,
    borderRadius: 10,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  lessonSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  phraseCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cantonese: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  english: {
    fontSize: 18,
    color: '#555',
    marginBottom: 6,
  },
  pronunciation: {
    fontSize: 16,
    color: '#777',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  repeatButton: {
    backgroundColor: '#5C6BC0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  repeatButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  practiceButton: {
    backgroundColor: '#ED4B4F',
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  practiceButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default LessonScreen;
