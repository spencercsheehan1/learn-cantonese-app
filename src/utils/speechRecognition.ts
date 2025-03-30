// This is a utilities file for speech recognition and AI language evaluation
// using the cantonese.ai API services

// Constants for the API
const API_ENDPOINT = 'https://api.cantonese.ai';
// Don't hard-code API keys in source code - this should be loaded from environment variables
// or secure storage in a real application
const API_KEY = process.env.CANTONESE_AI_API_KEY || '';

// Types
interface RecognitionResult {
  text: string;
  confidence: number;
  errorMessage?: string;
}

interface PronunciationFeedback {
  score: number; // 0-100 score
  errors: Array<{
    word: string;
    correctPronunciation: string;
    advice: string;
  }>;
  overallFeedback: string;
}

/**
 * Convert speech recording to text using cantonese.ai API
 * @param audioUri URI of the recorded audio
 * @returns Promise with recognition result
 */
export const recognizeSpeech = async (audioUri: string): Promise<RecognitionResult> => {
  try {
    // In a real implementation, this would make an actual API call
    // For development/demo purposes, we're simulating the API response

    // Mock implementation - replace with actual API call when you have API access
    console.log('Transcribing speech from:', audioUri);
    
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock result
    return {
      text: "nei5 hou2", // Mock transcription result
      confidence: 0.92,
    };
    
    /* Actual implementation would look like:
    const formData = new FormData();
    formData.append('audio', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'speech.m4a',
    });
    
    // Get API key from secure storage, not from source code
    const apiKey = await getSecureApiKey(); // This would be your implementation for retrieving the key securely
    
    const response = await fetch(`${API_ENDPOINT}/speech-to-text`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      body: formData,
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to recognize speech');
    }
    
    return {
      text: result.text,
      confidence: result.confidence,
    };
    */
  } catch (error) {
    console.error('Speech recognition error:', error);
    return {
      text: '',
      confidence: 0,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Evaluate pronunciation quality and provide feedback
 * @param expectedText The Cantonese text that the user was supposed to say
 * @param actualAudioUri URI of the recorded speech
 * @returns Promise with pronunciation feedback
 */
export const evaluatePronunciation = async (
  expectedText: string,
  actualAudioUri: string
): Promise<PronunciationFeedback> => {
  try {
    // In a real implementation, this would make an actual API call
    // For development/demo purposes, we're simulating the API response
    
    console.log('Evaluating pronunciation of:', expectedText, 'from audio:', actualAudioUri);
    
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, we'll randomly generate a score and some feedback
    const randomScore = Math.floor(65 + Math.random() * 35); // Score between 65-100
    
    // Simulate different feedback based on the score range
    let feedback;
    let errors = [];
    
    if (randomScore > 90) {
      feedback = "Excellent pronunciation! Your tone and rhythm are spot on.";
    } else if (randomScore > 80) {
      feedback = "Very good pronunciation. Pay attention to your tones a bit more.";
      if (expectedText.includes('nei5')) {
        errors.push({
          word: 'nei5',
          correctPronunciation: 'nei5 (rising tone)',
          advice: 'Try raising your pitch at the end of this word.'
        });
      }
    } else if (randomScore > 70) {
      feedback = "Good effort! Work on your tones and rhythm.";
      if (expectedText.includes('hou2')) {
        errors.push({
          word: 'hou2',
          correctPronunciation: 'hou2 (rising tone)',
          advice: 'This should have a rising tone. Try again with more emphasis.'
        });
      }
    } else {
      feedback = "Keep practicing! Focus on the tonal aspects of Cantonese.";
      errors.push({
        word: expectedText.split(' ')[0],
        correctPronunciation: `${expectedText.split(' ')[0]} (check tone number)`,
        advice: 'Listen to the example again and try to match the pitch pattern.'
      });
    }
    
    return {
      score: randomScore,
      errors,
      overallFeedback: feedback
    };
    
    /* Actual implementation would look like:
    const formData = new FormData();
    formData.append('audio', {
      uri: actualAudioUri,
      type: 'audio/m4a',
      name: 'speech.m4a',
    });
    formData.append('expected_text', expectedText);
    
    // Get API key from secure storage, not from source code
    const apiKey = await getSecureApiKey(); // This would be your implementation for retrieving the key securely
    
    const response = await fetch(`${API_ENDPOINT}/evaluate-pronunciation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      body: formData,
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to evaluate pronunciation');
    }
    
    return {
      score: result.score,
      errors: result.errors,
      overallFeedback: result.feedback
    };
    */
  } catch (error) {
    console.error('Pronunciation evaluation error:', error);
    return {
      score: 50,
      errors: [],
      overallFeedback: 'We encountered an error evaluating your pronunciation. Please try again.'
    };
  }
}; 