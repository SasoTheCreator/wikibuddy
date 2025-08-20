import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Shield, Zap } from "lucide-react";

export const AuthNotice = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-large">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center">
                <Database className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl">Ready to save your learning progress?</CardTitle>
              <CardDescription className="text-lg max-w-2xl mx-auto">
                To enable note saving, user authentication, and full learning management features, 
                connect your project to Supabase - our recommended backend solution.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-3">
                  <Shield className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Secure Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Safe user login and account management
                  </p>
                </div>
                <div className="space-y-3">
                  <Database className="h-8 w-8 text-secondary mx-auto" />
                  <h3 className="font-semibold">Data Storage</h3>
                  <p className="text-sm text-muted-foreground">
                    Reliable cloud database for all your notes
                  </p>
                </div>
                <div className="space-y-3">
                  <Zap className="h-8 w-8 text-accent mx-auto" />
                  <h3 className="font-semibold">Real-time Sync</h3>
                  <p className="text-sm text-muted-foreground">
                    Access your learning anywhere, anytime
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Click the green Supabase button in the top-right corner to get started
                </p>
                <Button variant="hero" size="lg">
                  Learn More About Supabase Integration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};