import { X } from "lucide-react";
import { Button } from "./button";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 "
      onClick={onClose}
    >
      <div
        className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10 rounded-t-lg">
          <h2 className="text-lg font-semibold pr-4">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 prose prose-sm max-w-none">{children}</div>
        </div>
      </div>
    </div>
  );
};
