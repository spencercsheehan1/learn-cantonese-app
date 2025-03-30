import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface LessonCardProps {
  title: string;
  level: string;
  onPress: () => void;
}

const LessonCard = ({ title, level, onPress }: LessonCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.lessonInfo}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.level}>{level}</Text>
      </View>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  level: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  arrow: {
    fontSize: 20,
    color: '#ED4B4F',
  }
});

export default LessonCard;
