import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/LPW_Banner_White.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLighthouseMenuOpen, setIsLighthouseMenuOpen] = useState(false);
  const [lighthouseMenuTimeout, setLighthouseMenuTimeout] = useState<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", href: "#home", isHash: true },
    { name: "Services", href: "#services", isHash: true },
    { name: "Trainings & Workshops", href: "#events", isHash: true },
    { name: "Connect", href: "#stay-connected", isHash: true },
  ];

  const lighthouseSubItems = [
    { name: "Overview", href: "#lighthouse-overview" },
    { name: "Testimonials", href: "#lighthouse-testimonials" },
    { name: "Lighthouse Premium", href: "#lighthouse-premium" },
    { name: "Get a License", href: "#lighthouse-license" },
    { name: "Key Features", href: "#lighthouse-features" },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.isHash && location.pathname !== "/") {
      // If we're not on home page and clicking a hash link, go to home first
      navigate("/" + item.href);
    }
    setIsOpen(false);
  };

  const handleLighthouseClick = () => {
    if (location.pathname === "/lighthouse") {
      // If already on lighthouse page, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to lighthouse page and scroll to top
      navigate("/lighthouse");
      // Small delay to ensure navigation completes before scrolling
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
    setIsOpen(false);
    setIsLighthouseMenuOpen(false);
  };

  const handleLighthouseSubClick = (href: string) => {
    if (location.pathname === "/lighthouse") {
      // If we're already on lighthouse page, update URL and scroll to section
      navigate("/lighthouse" + href, { replace: false });
      // Small delay to ensure navigation completes before scrolling
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Navigate to lighthouse page with anchor
      navigate("/lighthouse" + href);
    }
    setIsOpen(false);
    setIsLighthouseMenuOpen(false);
  };

  const handleMouseEnterLighthouse = () => {
    if (lighthouseMenuTimeout) {
      clearTimeout(lighthouseMenuTimeout);
      setLighthouseMenuTimeout(null);
    }
    setIsLighthouseMenuOpen(true);
  };

  const handleMouseLeaveLighthouse = () => {
    const timeout = setTimeout(() => {
      setIsLighthouseMenuOpen(false);
    }, 200); // 200ms delay before closing
    setLighthouseMenuTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (lighthouseMenuTimeout) {
        clearTimeout(lighthouseMenuTimeout);
      }
    };
  }, [lighthouseMenuTimeout]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <img src={logo} alt="#LetPeople.work" className="h-8" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => handleNavClick(item)}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
            
            {/* Lighthouse Dropdown */}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div 
              className="relative group"
              onMouseEnter={handleMouseEnterLighthouse}
              onMouseLeave={handleMouseLeaveLighthouse}
            >
              <button
                onClick={handleLighthouseClick}
                className="flex items-center text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                Lighthouse
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {isLighthouseMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-border rounded-md shadow-lg z-50">
                  {lighthouseSubItems.map((subItem) => (
                    <button
                      key={subItem.name}
                      onClick={() => handleLighthouseSubClick(subItem.href)}
                      className="block w-full text-left px-4 py-2 text-sm text-foreground hover:text-primary hover:bg-accent transition-colors"
                    >
                      {subItem.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-foreground hover:text-primary transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-foreground hover:text-primary hover:bg-accent transition-colors"
                  onClick={() => handleNavClick(item)}
                >
                  {item.name}
                </a>
              ))}
              
              {/* Mobile Lighthouse Menu */}
              <div>
                <button
                  onClick={handleLighthouseClick}
                  className="block w-full text-left px-3 py-2 rounded-md text-foreground hover:text-primary hover:bg-accent transition-colors font-medium"
                >
                  Lighthouse
                </button>
                {lighthouseSubItems.map((subItem) => (
                  <button
                    key={subItem.name}
                    onClick={() => handleLighthouseSubClick(subItem.href)}
                    className="block w-full text-left px-6 py-2 rounded-md text-sm text-foreground hover:text-primary hover:bg-accent transition-colors"
                  >
                    {subItem.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;