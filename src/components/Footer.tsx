import { Navigate } from "react-router-dom";
import { Button } from "./ui/button";
import { FooterModals } from "./FooterModals";
import { useState } from "react";

export const Footer = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleSupportClick = () => {
    // Replace this URL with your actual payment link
    const paymentUrl = "https://buy.stripe.com/eVq8wPgCW0YXbgwfsAdfG00";
    window.open(paymentUrl, "_blank", "noopener,noreferrer");
  };

  const openModal = (modalType: string) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <footer className=" bg-slate-100">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start justify-between ">
            <div className="flex items-start">
              <Button
                variant="outline"
                title="Tips button"
                onClick={handleSupportClick}
              >
                Support this project
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-2  text-sm text-muted-foreground mt-4 ">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openModal("about")}
                className="hover:text-primary transition-colors"
              >
                About the project
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openModal("privacy")}
                className="hover:text-primary transition-colors"
              >
                Privacy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openModal("terms")}
                className="hover:text-primary transition-colors"
              >
                Terms
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openModal("help")}
                className="hover:text-primary transition-colors"
              >
                Help
              </Button>
            </div>
          </div>
        </div>
      </footer>

      <FooterModals activeModal={activeModal} onClose={closeModal} />
    </>
  );
};
