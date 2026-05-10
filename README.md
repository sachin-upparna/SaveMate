# SaveMate

## Project Overview

SaveMate is a web-based fintech application designed to assist users with irregular income streams in building consistent and sustainable savings habits. By combining an intuitive interface with behavioral nudges and secure financial tracking, SaveMate empowers individuals to manage their finances effectively.

## Problem Statement

Individuals with irregular or daily-wage income often struggle to maintain consistent savings due to the unpredictability of their earnings and the lack of financial products tailored to their needs. Traditional banking applications are often designed for salaried professionals, leaving a significant demographic without adequate tools to save for emergencies, goals, or future investments.

## Solution

SaveMate addresses this gap by providing a flexible, high-friction, and goal-oriented savings platform. It encourages micro-savings, restricts impulsive withdrawals through high-friction OTP verification, and uses strategic behavioral nudges to keep users engaged and committed to their financial objectives.

## Core Features

* **Savings Wallet System**: A centralized wallet to track daily deposits from both cash and bank sources.
* **Goal-Based Savings**: Users can create specific financial goals, track their progress, and collaborate with peers.
* **Emergency Withdrawal**: A high-friction withdrawal process requiring two-step OTP verification to deter impulsive spending.
* **Behavioral Email Nudging**: Automated email workflows (welcome, inactivity, first save) powered by the Resend API to reinforce positive habits.
* **Investment Module**: A partner-based investment portal (demo) introducing users to stocks and mutual funds.
* **Financial Passbook**: Downloadable PDF ledger statements with advanced filtering capabilities.
* **Multi-Language Support**: Fully localized interface supporting English, Hindi, and Kannada.
* **Real-Time Updates**: WebSocket integration for instant data synchronization across the application.
* **Profile Management**: Comprehensive user profiles with secure document and image uploading via Cloudinary.

## Tech Stack

* **Frontend**: Next.js (App Router), JavaScript, Tailwind CSS
* **Backend**: Next.js API Routes, Node.js
* **Database**: MongoDB (Mongoose)
* **Authentication**: JWT, HTTP-only Cookies
* **Payments & Logic**: Razorpay (Integration ready), Internal Ledger Wallet
* **Communication**: Resend API (Emails), Socket.io (Real-time updates)
* **Storage**: Cloudinary (Media and document storage)

## System Architecture

SaveMate utilizes a full-stack Next.js architecture leveraging the App Router. The frontend communicates with internal Next.js API routes, which securely handle business logic, authentication, and database operations using Mongoose. Real-time updates are pushed to the client via Socket.io, while external services like Resend and Cloudinary are integrated securely via server-side logic.

## Folder Structure

The repository follows a standard Next.js directory structure:

* `/app` - Contains all frontend pages, layouts, and routing logic under the Next.js App Router paradigm. Also includes multi-language routing (`/[locale]`).
* `/app/api` - Houses all server-side API routes handling authentication, transactions, user data, and external service integrations.
* `/components` - Reusable UI components and shared layout elements used across different pages.
* `/models` - Mongoose database schemas defining the structure for Users, Accounts, Transactions, and Goals.
* `/lib` - Core utility functions, database connection logic, authentication helpers, email dispatchers, and validation services.

## Setup Instructions

Follow these steps to run SaveMate locally for development and testing.

### Prerequisites

Ensure you have Node.js (v18 or higher) and npm installed on your machine. You will also need access to a MongoDB cluster.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd savemate
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory of the project. Copy the variables from the Environment Variables section below and fill in your specific credentials.

### 4. Run the Development Server

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

## Environment Variables

Include the following variables in your `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_key
RESEND_API_KEY=your_resend_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Security Considerations

* Passwords are cryptographically hashed using bcrypt before database storage.
* Session management is handled via secure, HTTP-only JWT cookies to mitigate XSS attacks.
* Withdrawals and sensitive actions require multi-factor verification via email OTP.
* Environment variables are strictly isolated to server-side environments and are never exposed to the client bundle.

## Future Improvements

* Full integration of Razorpay for live bank-to-wallet transactions.
* Advanced AI-driven insights for predicting user saving capacities.
* Mobile application deployment using React Native for deeper market penetration.

## Team Details

Developed for the financial inclusion hackathon. Designed and engineered with a focus on premium user experience and behavioral economics.
