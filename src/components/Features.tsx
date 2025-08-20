import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, NotebookPen, Share, Search, Tags, Download } from "lucide-react";
import chatIcon from "@/assets/chat-icon.jpg";
import notesIcon from "@/assets/notes-icon.jpg";

const features = [
  {
    icon: MessageSquare,
    title: "Interactive Chat",
    description: "Ask questions about any Wikipedia article and get instant, intelligent answers.",
    image: chatIcon,
    gradient: "from-primary to-primary-dark"
  },
  {
    icon: NotebookPen,
    title: "Smart Notes",
    description: "Save important insights, organize by sessions, and never lose track of your learning.",
    image: notesIcon,
    gradient: "from-secondary to-secondary/80"
  },
  {
    icon: Search,
    title: "Powerful Search",
    description: "Find your notes instantly with keyword search and smart filtering options.",
    gradient: "from-accent to-accent/80"
  },
  {
    icon: Tags,
    title: "Organize & Tag",
    description: "Categorize your notes with tags and keep your knowledge structured.",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    icon: Share,
    title: "Share & Collaborate",
    description: "Share your learning sessions with others or export to your favorite platforms.",
    gradient: "from-pink-500 to-pink-600"
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description: "Download your notes as PDF or Markdown for offline access and portability.",
    gradient: "from-indigo-500 to-indigo-600"
  }
];

export const Features = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">Everything you need to learn better</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to transform how you interact with knowledge on Wikipedia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border-0 shadow-soft bg-gradient-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="space-y-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};