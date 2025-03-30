import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface PhraseItemProps {
  cantonese: string;
  english: string;
  pronunciation: string;
  onPress?: () => void;
}

const PhraseItem = ({ cantonese, english, pronunciation, onPress }: PhraseItemProps) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={styles.cantonese}>{cantonese}</Text>
      <Text style={styles.english}>{english}</Text>
      <Text style={styles.pronunciation}>Pronunciation: {pronunciation}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
  }
});

export default PhraseItem;
