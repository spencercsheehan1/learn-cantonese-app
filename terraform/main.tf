provider "aws" {
  region = var.aws_region
}

terraform {
  backend "s3" {
    # This will be configured via -backend-config on terraform init
  }
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

module "vpc" {
  source = "./modules/vpc"
  
  vpc_cidr             = var.vpc_cidr
  availability_zones   = var.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  environment          = var.environment
}

module "security" {
  source = "./modules/security"
  
  vpc_id      = module.vpc.vpc_id
  environment = var.environment
}

module "frontend" {
  source = "./modules/frontend"
  
  vpc_id                = module.vpc.vpc_id
  public_subnet_ids     = module.vpc.public_subnet_ids
  private_subnet_ids    = module.vpc.private_subnet_ids
  app_security_group_id = module.security.app_security_group_id
  alb_security_group_id = module.security.alb_security_group_id
  environment           = var.environment
  app_name              = var.app_name
  container_image       = var.container_image
  container_port        = var.container_port
} 