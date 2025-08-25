import { useState } from "react";
import { Header } from "@/components/Header";
import { SearchSection } from "@/components/SearchSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [key, setKey] = useState(0); // Force re-render for new conversation

  const handleOpenHistory = () => {
    setIsHistoryOpen(true);
  };

  const handleNewConversation = () => {
    setKey((prev) => prev + 1); // Force re-render
  };

  return (
    <div className="h-screen flex flex-col">
      <Header
        onOpenHistory={handleOpenHistory}
        onNewConversation={handleNewConversation}
      />
      <main className="flex-1 flex flex-col bg-background">
        <SearchSection
          key={key}
          isHistoryOpen={isHistoryOpen}
          setIsHistoryOpen={setIsHistoryOpen}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
