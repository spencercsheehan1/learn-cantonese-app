#!/bin/bash

# Create S3 bucket for Terraform state
aws s3api create-bucket \
  --bucket learn-cantonese-app-terraform-state \
  --region us-east-1

# Enable versioning on the S3 bucket
aws s3api put-bucket-versioning \
  --bucket learn-cantonese-app-terraform-state \
  --versioning-configuration Status=Enabled

# Enable encryption on the S3 bucket
aws s3api put-bucket-encryption \
  --bucket learn-cantonese-app-terraform-state \
  --server-side-encryption-configuration '{
    "Rules": [
      {
        "ApplyServerSideEncryptionByDefault": {
          "SSEAlgorithm": "AES256"
        }
      }
    ]
  }'

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name learn-cantonese-app-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

echo "Terraform backend resources created successfully!" 