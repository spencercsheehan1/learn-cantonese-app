# Learn Cantonese App

A React Native application for learning Cantonese with AI-powered speech recognition.

## Features

- Interactive lessons for learning Cantonese
- Pronunciation practice with audio
- AI-powered voice recognition for pronunciation feedback
- Vocabulary building exercises
- Progress tracking

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm start`

## Project Structure

- `/src/components` - Reusable UI components
- `/src/screens` - Main app screens
- `/src/assets` - Images, audio files, and other assets
- `/src/hooks` - Custom hooks
- `/src/utils` - Utility functions

## API Keys and Security

This app is designed to work with the Cantonese.ai API for speech recognition and pronunciation evaluation. For security:

1. **Never commit API keys to Git**:
   - The app is configured to load API keys from environment variables
   - Create a `.env` file locally with your API keys (this file is gitignored)
   - For production, use a secure method to inject environment variables

2. **Environment Variables**:
   - `CANTONESE_AI_API_KEY`: Your API key for cantonese.ai services

3. **Demo Mode**:
   - By default, the app runs in demo mode with simulated API responses
   - To use real API integration, obtain API keys from [cantonese.ai](https://cantonese.ai)

## Deployment

1. To deploy to the App Store or Google Play, follow the Expo build instructions
2. Ensure all API keys are properly secured and not included in the repository
3. Set up proper environment variable handling for your production environment

## Security Considerations

- The `speechRecognition.ts` file contains placeholders for API handling - in a production environment, implement proper key management
- Consider using a secure storage solution rather than environment variables for mobile deployments
- Do not store API keys directly in your code

## License

This project is licensed under the MIT License - see the LICENSE file for details.
