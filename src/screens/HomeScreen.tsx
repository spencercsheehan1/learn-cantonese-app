import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const LESSONS = [
  { id: '1', title: 'Greetings', level: 'Beginner' },
  { id: '2', title: 'Numbers', level: 'Beginner' },
  { id: '3', title: 'Food & Drinks', level: 'Beginner' },
  { id: '4', title: 'Transportation', level: 'Intermediate' },
  { id: '5', title: 'Shopping', level: 'Intermediate' },
  { id: '6', title: 'Directions', level: 'Advanced' },
];

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to Learn Cantonese</Text>
        <Text style={styles.headerSubtitle}>Start your journey today</Text>
      </View>
      
      <FlatList
        data={LESSONS}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.lessonCard}
            onPress={() => navigation.navigate('Lesson', { lessonId: item.id, title: item.title })}
          >
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>{item.title}</Text>
              <Text style={styles.lessonLevel}>{item.level}</Text>
            </View>
            <Text style={styles.arrowIcon}>→</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
      
      <TouchableOpacity 
        style={styles.practiceButton}
        onPress={() => navigation.navigate('Practice')}
      >
        <Text style={styles.practiceButtonText}>Practice Mode</Text>
      </TouchableOpacity>
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF8E1',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  listContent: {
    padding: 16,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  lessonLevel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  arrowIcon: {
    fontSize: 20,
    color: '#ED4B4F',
  },
  practiceButton: {
    backgroundColor: '#ED4B4F',
    padding: 16,
    borderRadius: 10,
    margin: 16,
    alignItems: 'center',
  },
  practiceButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default HomeScreen;
