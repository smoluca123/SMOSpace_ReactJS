# SMO Space - Modern React Application

A modern social media platform built with React, TypeScript, and Vite, featuring a rich set of UI components and real-time capabilities.

## 🚀 Features

### Core Features

- **Post Management**

  - Create posts with rich text and image uploads
  - Edit and delete your own posts
  - View posts in a responsive feed
  - Like and share posts
  - Real-time post updates

- **Comments System**

  - Real-time comments on posts
  - Edit and delete your own comments
  - Nested comments support
  - Real-time comment updates

- **User Profiles**

  - Customizable user profiles
  - Profile picture and cover photo
  - User activity history
  - Followers and following lists

- **Social Features**

  - Friend system with friend requests
  - Follow/unfollow functionality
  - User search and discovery
  - Activity feed

- **Real-time Communication**
  - Real-time notifications
  - Live chat system
  - Online/offline status
  - Message read receipts

### Technical Features

- **Modern Tech Stack**: Built with React 19, TypeScript, and Vite
- **Rich UI Components**: Using Radix UI primitives and custom components
- **State Management**: Redux Toolkit for global state management
- **Real-time Features**: Socket.IO integration for real-time updates
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom animations and utilities
- **Rich Text Editor**: TipTap integration for content editing
- **API Integration**: Axios for HTTP requests
- **Type Safety**: Full TypeScript support
- **Code Quality**: ESLint and Prettier for code formatting and linting

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form + Zod
- **Real-time**: Socket.IO
- **HTTP Client**: Axios
- **Rich Text Editor**: TipTap
- **Animations**: Framer Motion

## 📦 Installation

1. Clone the repository:

```bash
git clone [repository-url]
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
bun install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

## 🏗️ Project Structure

```
src/
├── apis/         # API integration
├── assets/       # Static assets
├── components/   # Reusable UI components
├── contexts/     # React contexts
├── guard/        # Route guards and authentication
├── hooks/        # Custom React hooks
├── lib/          # Utility functions and configurations
├── modules/      # Feature modules
├── redux/        # Redux store and slices
├── routes/       # Application routes
└── main.tsx      # Application entry point
```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## 🔧 Configuration

The project uses several configuration files:

- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration
- `.prettierrc` - Prettier configuration

## 📝 License

[Add your license information here]

## 👥 Contributing

[Add contribution guidelines here]
