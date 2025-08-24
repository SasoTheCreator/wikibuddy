import { Modal } from "./ui/modal";
import { Button } from "./ui/button";
import { ExternalLink, Mail, Github, Twitter, BookOpen } from "lucide-react";

interface FooterModalsProps {
  activeModal: string | null;
  onClose: () => void;
}

export const FooterModals = ({ activeModal, onClose }: FooterModalsProps) => {
  return (
    <>
      {/* About Modal */}
      <Modal
        isOpen={activeModal === "about"}
        onClose={onClose}
        title="About WikiBuddy"
      >
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6 rounded">
            <div>
              <h4 className="font-semibold text-lg mb-3">What is WikiBuddy?</h4>
              <p className="text-muted-foreground leading-relaxed">
                WikiBuddy is an intelligent learning assistant that transforms
                how you explore and understand Wikipedia articles. Using
                advanced AI technology, we help you dive deeper into any topic
                with personalized explanations, interactive conversations, and
                comprehensive summaries.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-3">Mission</h4>
              <p className="text-muted-foreground leading-relaxed">
                Learning should be accessible, engaging, and personalized. The
                mission to WikiBuddy is to make knowledge discovery more
                intuitive and enjoyable by providing intelligent insights and
                interactive learning experiences.
              </p>
            </div>
          </div>

          <div className="bg-blue-50  p-6 rounded-lg">
            <h4 className="font-semibold text-lg mb-4">About the Author</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Hi 👋 I'm Saso, a young web designer who loves building small apps
              in my spare times. I'm freelancing right now, you can discover
              more about me and my projects in my portfolio. I also enjoy
              writing about my passions and sharing ideas on no/low-code, AI &
              Automations or whatever. Come connect with me !
            </p>

            <div className="flex flex-wrap gap-8 mt-4">
              <a
                href="https://saso-the-creator.webflow.io/"
                className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                <span>My website</span>
              </a>
              <a
                href="https://www.linkedin.com/in/sarah-sophie-thouabtia/"
                className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span>LinkedIn</span>
              </a>
              <a
                href="https://medium.com/@sarahsophie.thouabtia"
                className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                </svg>
                <span>Medium</span>
              </a>
              <a
                href="https://substack.com/@sarahsophieshares?utm_campaign=profile&utm_medium=profile-page"
                className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                </svg>
                <span>Substack</span>
              </a>
            </div>

            <div className="mt-6 pt-4 border-t border-blue-200 dark:border-blue-800">
              <Button
                onClick={() => {
                  const paymentUrl =
                    "https://buy.stripe.com/eVq8wPgCW0YXbgwfsAdfG00";
                  window.open(paymentUrl, "_blank", "noopener,noreferrer");
                }}
                className="w-full bg-primary hover:bg-primary-dark text-white"
              >
                Support the Project
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Privacy Modal */}
      <Modal
        isOpen={activeModal === "privacy"}
        onClose={onClose}
        title="Privacy Policy"
      >
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Last updated:</strong> December 2024
            </p>
          </div>

          <section>
            <p className="text-muted-foreground leading-relaxed mb-6">
              This Privacy Policy explains how WikiBuddy ("we", "our", "us")
              handles information when you use our application.
            </p>
          </section>

          <section>
            <h4 className="text-lg font-semibold mb-3">
              01. Information We Do Not Collect
            </h4>
            <div className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                We do not require an account or registration.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We do not collect personal information such as your name, email
                address, or contact details.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                All app data (e.g., your settings) is stored locally in your
                browser's local storage.
              </p>
            </div>
          </section>

          <section>
            <h4 className="text-lg font-semibold mb-3">
              02. Information Processed Through the AI API
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              When you use the app, the text you enter is sent to Anthropic's
              Claude API for processing.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This content may include personal information if you choose to
              provide it.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We do not store this content on our servers, but it may be
              processed by Anthropic in accordance with their{" "}
              <a
                href="https://www.anthropic.com/legal/privacy"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h4 className="text-lg font-semibold mb-3">
              03. Analytics and Tracking
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              We use Google Analytics to understand how users interact with our
              app.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Google Analytics may use cookies and collect information such as
              device type, browser, and usage statistics.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You can learn more about how Google handles data here:{" "}
              <a
                href="https://policies.google.com/privacy"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h4 className="text-lg font-semibold mb-3">04. Data Security</h4>
            <p className="text-muted-foreground leading-relaxed">
              We do not transfer or store your personal data ourselves.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              However, please note that no data transmission over the internet
              can be guaranteed as 100% secure.
            </p>
          </section>

          <section>
            <h4 className="text-lg font-semibold mb-3">05. Your Choices</h4>
            <p className="text-muted-foreground leading-relaxed">
              You can clear your browser's local storage at any time to remove
              data saved by the app.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You can manage or disable cookies through your browser settings.
            </p>
          </section>

          <section>
            <h4 className="text-lg font-semibold mb-3">
              06. Changes to This Policy
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. Continued use
              of the app means you accept the updated version.
            </p>
          </section>

          <section>
            <h4 className="text-lg font-semibold mb-3">07. Contact</h4>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, you can
              contact us at{" "}
              <a
                href="mailto:contact@sasothecreator.com"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                contact@sasothecreator.com
              </a>
            </p>
          </section>
        </div>
      </Modal>

      {/* Terms Modal */}
      <Modal
        isOpen={activeModal === "terms"}
        onClose={onClose}
        title="Terms of Service"
      >
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <p className="text-sm text-blue-800 ">
              <strong>Effective date:</strong> December 2024
            </p>
          </div>

          <section>
            <h3 className="text-xl font-semibold mb-3">Welcome to WikiBuddy</h3>
            <p className="text-muted-foreground leading-relaxed">
              By using this application, you agree to the following terms:
            </p>
          </section>

          <section>
            <h4 className="text-lg font-semibold mb-3">
              01. Use of the Service
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              This app is provided for informational and personal use only. You
              agree not to use it for illegal, harmful, or abusive purposes.
            </p>
          </section>

          <section>
            <h4 className="text-lg font-semibold mb-3">
              02. AI-Generated Content
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              The app uses an external AI service (Claude by Anthropic) to
              generate responses. Outputs may be inaccurate, incomplete, or
              inappropriate. You are solely responsible for how you use the
              generated content.
            </p>
          </section>

          <section>
            <h4 className="text-lg font-semibold mb-3">
              03. No Account / Local Storage
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              The app does not require an account. Data is only stored locally
              in your browser and is not collected by us.
            </p>
          </section>

          <section>
            <h4 className="text-lg font-semibold mb-3">
              04. Third-Party Services
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              Prompts you enter are sent to Anthropic's API for processing. By
              using this app, you acknowledge and agree to{" "}
              <a
                href="https://www.anthropic.com/legal/terms"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Anthropic's Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="https://www.anthropic.com/legal/privacy"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              05. Disclaimer of Liability
            </h3>
            <div className="bg-red-50 p-4 rounded border border-red-200 ">
              <p className="text-sm text-red-800 ">
                <strong>Disclaimer:</strong> We provide this app "as is" without
                any warranties. We are not responsible for any damages or losses
                resulting from its use.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              06. Changes to the Terms
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              We may update these terms from time to time. Continued use of the
              app means you accept the updated version.
            </p>
          </section>
        </div>
      </Modal>

      {/* Help Modal */}
      <Modal
        isOpen={activeModal === "help"}
        onClose={onClose}
        title="Help & Support"
      >
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Quick Guide:</strong> Search any Wikipedia topic and chat
              with AI to learn more
            </p>
          </div>

          <section>
            <h4 className="text-lg font-semibold mb-3">
              01. How to Use WikiBuddy
            </h4>
            <div className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                <strong>Search:</strong> Enter any Englush Wikipedia article in
                the search bar to start learing more about the subject.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Read:</strong> Get an AI-generated summary and key
                insights about the topic
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Chat:</strong> Ask follow-up questions to dive deeper
                into any aspect
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Save:</strong> You can save important buddy responses in
                your conversation history
              </p>
            </div>
          </section>

          <section>
            <h4 className="text-lg font-semibold mb-3">
              02. Pro Tips for Better Results
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Be specific:</strong> "What are the main causes of
                  climate change?" instead of "Tell me about climate"
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Ask for examples:</strong> "Can you give me real-world
                  applications of quantum physics?"
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Build on answers:</strong> Use follow-up questions to
                  explore topics in depth
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Request comparisons:</strong> "How does this compare
                  to..." for better understanding
                </p>
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-lg font-semibold mb-3">
              03. Managing Your Sessions
            </h4>
            <div className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                <strong>New Conversation:</strong> Click "New conversation" in
                the header to start fresh
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>History:</strong> Access saved responses via the
                bookmark icon in the header
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Local Storage:</strong> All data is stored locally in
                your browser - no account needed
              </p>
            </div>
          </section>

          <section>
            <h4 className="text-lg font-semibold mb-3">
              04. URL & Session Management
            </h4>
            <div className="bg-red-50 p-4 rounded border border-red-200">
              <p className="text-sm text-red-800 mb-3">
                <strong>Important:</strong> Your session is tied to the current
                URL
              </p>
              <div className="space-y-2">
                <p className="text-sm text-red-700">
                  • <strong>Don't refresh</strong> the page during a
                  conversation - you'll lose your chat history
                </p>
                <p className="text-sm text-red-700">
                  • <strong>Bookmark the URL</strong> if you want to return to a
                  specific conversation later
                </p>
                <p className="text-sm text-red-700">
                  • <strong>Use "New conversation"</strong> to start fresh
                  without losing your current session
                </p>
                <p className="text-sm text-red-700">
                  • <strong>Check your browser history</strong> to find previous
                  sessions
                </p>
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-lg font-semibold mb-3">05. Troubleshooting</h4>
            <div className="space-y-3">
              <div className="bg-muted p-3 rounded">
                <p className="text-sm text-muted-foreground">
                  <strong>AI not responding?</strong> Check your internet
                  connection and try refreshing the page. Claude servers might
                  also be down
                </p>
              </div>
              <div className="bg-muted p-3 rounded">
                <p className="text-sm text-muted-foreground">
                  <strong>Lost your conversation?</strong> Check your browser
                  history or start a new session
                </p>
              </div>
              <div className="bg-muted p-3 rounded">
                <p className="text-sm text-muted-foreground">
                  <strong>Search not working?</strong> Make sure you're
                  searching for a valid Wikipedia topic
                </p>
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-lg font-semibold mb-3">06. Need More Help?</h4>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-primary" />
              <a
                href="mailto:contact@sasothecreator.com"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                contact@sasothecreator.com
              </a>
            </div>
          </section>
        </div>
      </Modal>
    </>
  );
};
