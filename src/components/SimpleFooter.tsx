import { useState } from "react";
import LegalInfoDialog from "./LegalInfoDialog";
import logo from "@/assets/LPW_Banner_White.png";

const SimpleFooter = () => {
  const currentYear = new Date().getFullYear();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"impressum" | "privacy" | "terms">("impressum");

  const openDialog = (tab: "impressum" | "privacy" | "terms") => {
    setActiveTab(tab);
    setDialogOpen(true);
  };
  
  return (
    <>
      <footer className="bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            {/* Copyright - Left */}
            <p className="text-muted-foreground text-sm">
              © {currentYear} LetPeopleWork GmbH. All rights reserved.
            </p>

            {/* Logo - Center */}
            <div className="flex-shrink-0">
              <img src={logo}
                alt="LetPeopleWork Logo" 
                className="h-10 w-auto"
                width="180"
                height="40"
                loading="lazy"
              />
            </div>

            {/* Links - Right */}
            <div className="flex space-x-6">
              <button 
                onClick={() => openDialog("impressum")}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm cursor-pointer"
              >
                Impressum
              </button>
              <button 
                onClick={() => openDialog("privacy")}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm cursor-pointer"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => openDialog("terms")}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm cursor-pointer"
              >
                Terms and Conditions
              </button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-4">
            {/* Logo */}
            <div className="flex justify-center">
              <img 
                src="/src/assets/LPW_Banner_White.png" 
                alt="LetPeopleWork Logo" 
                className="h-10 w-auto"
                width="180"
                height="40"
                loading="lazy"
              />
            </div>

            {/* Links */}
            <div className="flex flex-col space-y-2 text-center">
              <button 
                onClick={() => openDialog("impressum")}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm cursor-pointer"
              >
                Impressum
              </button>
              <button 
                onClick={() => openDialog("privacy")}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm cursor-pointer"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => openDialog("terms")}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm cursor-pointer"
              >
                Terms and Conditions
              </button>
            </div>

            {/* Copyright */}
            <p className="text-muted-foreground text-sm text-center">
              © {currentYear} LetPeopleWork GmbH. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      <LegalInfoDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        defaultTab={activeTab}
      />
    </>
  );
};

export default SimpleFooter;