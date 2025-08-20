import { Header } from "@/components/Header";
import { SearchSection } from "@/components/SearchSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <SearchSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
