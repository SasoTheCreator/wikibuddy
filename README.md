# WikiBuddy

WikiBuddy is an intelligent learning assistant that transforms how you explore and understand Wikipedia articles. Using advanced AI technology, it helps you dive deeper into any topic with personalized explanations, interactive conversations, and comprehensive summaries.

## Features

- **Interactive Learning**: Ask questions about any Wikipedia article and get AI-powered responses
- **Smart Note-Taking**: Save important responses for future reference
- **Conversation History**: Keep track of your learning sessions organized by article
- **Local Storage**: All your data is stored locally in your browser - no account required
- **Real-time Analysis**: Get instant insights and explanations about complex topics

## How to Use

1. **Search**: Enter any English Wikipedia article URL in the search bar
2. **Read**: Get an AI-generated summary and key insights about the topic
3. **Chat**: Ask follow-up questions to dive deeper into any aspect
4. **Save**: Bookmark important responses in your conversation history

## Technologies Used

This project is built with:

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **AI Integration**: Anthropic Claude API
- **Storage**: Local browser storage
- **Icons**: Lucide React

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Setup

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd wikibuddy

# Install dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Start both frontend and backend
npm start
```

### Development Commands

```bash
# Start both frontend and backend together
npm start
# or
npm run dev:full

# Start only the frontend (client)
npm run dev
# or
npm run dev:client

# Start only the backend (server)
npm run dev:server
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── ChatContainer.tsx
│   ├── SearchInterface.tsx
│   └── ...
├── lib/                # Utility libraries
│   ├── ai.ts          # AI service integration
│   ├── storage.ts     # Local storage management
│   └── wikipedia.ts   # Wikipedia API integration
├── hooks/              # Custom React hooks
└── pages/              # Page components
```

## Privacy

WikiBuddy respects your privacy:

- No account registration required
- All data stored locally in your browser
- No personal information collected
- AI processing handled by Anthropic's Claude API

## Support

For questions or support, please contact: contact@sasothecreator.com

## License

This project is for educational and personal use.
