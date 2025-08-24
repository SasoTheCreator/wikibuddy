import { useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { ChatInputPreview } from "./ChatInputPreview";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatContainerProps {
  currentArticle: {
    title: string;
    url: string;
  } | null;
  messages: Message[];
  isLoading: boolean;
  copiedMessageId: string | null;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onClearContext: () => void;
  onClearChat: () => void;
  onCopyMessage: (messageId: string, content: string) => void;
  onSaveBotResponse: (
    messageId: string,
    content: string,
    userQuestion?: string
  ) => void;
  savedResponseIds: string[];
  hasUnsavedMessages?: boolean;
  unsavedMessageCount?: number;
}

export const ChatContainer = ({
  currentArticle,
  messages,
  isLoading,
  copiedMessageId,
  inputValue,
  onInputChange,
  onSendMessage,
  onClearContext,
  onClearChat,
  onCopyMessage,
  onSaveBotResponse,
  savedResponseIds,
  hasUnsavedMessages = false,
  unsavedMessageCount = 0,
}: ChatContainerProps) => {
  const [hasStartedConversation, setHasStartedConversation] = useState(false);

  const handleFirstQuestion = () => {
    setHasStartedConversation(true);
    onSendMessage();
  };

  // Si pas d'article, afficher le preview
  if (!currentArticle) {
    return <ChatInputPreview onFirstQuestion={() => {}} />;
  }

  // Si article chargé mais pas encore de conversation, afficher juste l'input
  if (!hasStartedConversation) {
    return (
      <div className="w-full h-full flex flex-col bg-background border rounded-lg shadow-sm">
        <ChatHeader
          currentArticle={currentArticle}
          onClearContext={onClearContext}
          onClearChat={onClearChat}
        />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Ready to learn about {currentArticle.title}?
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ask your first question to start the conversation
              </p>
            </div>
          </div>
        </div>
        <ChatInput
          inputValue={inputValue}
          onInputChange={onInputChange}
          onSendMessage={handleFirstQuestion}
          isLoading={isLoading}
          hasArticle={true}
          isPreview={false}
          hasUnsavedMessages={hasUnsavedMessages}
          unsavedMessageCount={unsavedMessageCount}
        />
      </div>
    );
  }

  // Conversation en cours, afficher l'interface complète
  return (
    <div className="w-full h-full flex flex-col bg-background border rounded-lg shadow-sm">
      <ChatHeader
        currentArticle={currentArticle}
        onClearContext={onClearContext}
        onClearChat={onClearChat}
      />

      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        copiedMessageId={copiedMessageId}
        currentArticle={currentArticle}
        onCopyMessage={onCopyMessage}
        onSaveBotResponse={onSaveBotResponse}
        savedResponseIds={savedResponseIds}
      />

      <ChatInput
        inputValue={inputValue}
        onInputChange={onInputChange}
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        hasArticle={true}
        hasUnsavedMessages={hasUnsavedMessages}
        unsavedMessageCount={unsavedMessageCount}
      />
    </div>
  );
};
