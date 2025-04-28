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

## AWS Deployment with Terraform

This section provides a step-by-step guide to deploy the application on AWS using Terraform. The infrastructure is designed to be cost-effective and suitable for learning purposes.

### Prerequisites

1. Install [Terraform](https://www.terraform.io/downloads.html)
2. Install [AWS CLI](https://aws.amazon.com/cli/)
3. Configure AWS credentials:
   ```bash
   aws configure
   ```
4. Create an S3 bucket for Terraform state:
   ```bash
   aws s3api create-bucket --bucket your-terraform-state-bucket --region us-east-1
   ```

### Infrastructure Components

The Terraform configuration creates:
- VPC with public and private subnets
- ECS Fargate cluster for containerized deployment
- Application Load Balancer
- RDS PostgreSQL database (t3.micro for cost efficiency)
- S3 bucket for static assets
- CloudFront distribution for content delivery
- Route53 DNS configuration (optional)

### Deployment Steps

1. Clone the repository and navigate to the terraform directory:
   ```bash
   git clone https://github.com/yourusername/learn-cantonese-app.git
   cd learn-cantonese-app/terraform
   ```

2. Initialize Terraform:
   ```bash
   terraform init -backend-config="bucket=your-terraform-state-bucket"
   ```

3. Review the planned changes:
   ```bash
   terraform plan
   ```

4. Apply the infrastructure:
   ```bash
   terraform apply
   ```

5. After deployment, you'll receive:
   - Load Balancer DNS name
   - RDS endpoint
   - S3 bucket name
   - CloudFront distribution URL

### Cost Optimization

The infrastructure is designed to be cost-effective:
- Uses t3.micro instances where possible
- Implements auto-scaling with minimum instances
- Uses Fargate spot instances for non-critical workloads
- Implements CloudFront caching to reduce origin requests

### Cleanup

To remove all AWS resources:
```bash
terraform destroy
```

### Security Notes

1. The Terraform configuration includes:
   - Security groups with minimal required access
   - IAM roles with least privilege
   - Encrypted RDS instances
   - Secure parameter storage for secrets

2. Environment variables are stored in AWS Systems Manager Parameter Store
   ```bash
   aws ssm put-parameter --name "/app/CANTONESE_AI_API_KEY" --value "your-api-key" --type SecureString
   ```

## Security Considerations

- The `speechRecognition.ts` file contains placeholders for API handling - in a production environment, implement proper key management
- Consider using a secure storage solution rather than environment variables for mobile deployments
- Do not store API keys directly in your code

## License

This project is licensed under the MIT License - see the LICENSE file for details.
