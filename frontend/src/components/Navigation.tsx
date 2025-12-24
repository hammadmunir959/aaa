import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Logo } from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isDark = theme === "dark";

  const navLinks = [
    { name: "Road Traffic Accidents", path: "/road-traffic-accidents" },
    { name: "Car Sale/Buy", path: "/car-sale-buy" },
    { name: "Contact Us", path: "/contact" },
  ];

  const whatWeDoSubLinks: Array<{ name: string; path: string }> = [
    { name: "Replacement Vehicle", path: "/replacement-vehicle" },
    { name: "Accident Claim Management", path: "/accident-claim-management" },
    { name: "Car Recovery and Storage", path: "/car-recovery-and-storage" },
    { name: "Accidental Repair", path: "/accidental-repair" },
    { name: "Taxi Replacement/PCO Replacement", path: "/pco-replacement" },
  ];

  const companySubLinks: Array<{ name: string; path: string }> = [
    { name: "About", path: "/about" },
    { name: "Our Blogs", path: "/our-blogs" },
    { name: "What to do after accident?", path: "/what-to-do-after-accident" },
    { name: "FAQ's", path: "/faqs" },
    { name: "Testimonials", path: "/testimonials" },
  ];

  return (
    <nav className="sticky top-0 z-50 shadow-lg">
      <div className="bg-[hsl(var(--primary)/0.7)] backdrop-blur-md text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-3 animate-slideInLeft">
              <Logo className="h-[140px] w-[230px]" alt="AAA Accident Solutions LTD" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* 1. Road Traffic Accidents */}
              <Link
                to="/road-traffic-accidents"
                className={`px-4 py-2 rounded-md text-base font-medium hover:text-accent transition-colors ${location.pathname === "/road-traffic-accidents" ? "text-accent" : ""
                  }`}
              >
                Road Traffic Accidents
              </Link>

              {/* 2. Services Link with Dropdown */}
              {/* 2. Services Link with Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <button
                  className={`px-4 py-2 rounded-md text-base font-medium hover:text-accent transition-colors flex items-center gap-1 ${location.pathname === "/what-we-do" ||
                    location.pathname.startsWith("/replacement-vehicle") ||
                    location.pathname.startsWith("/accident-claim-management") ||
                    location.pathname.startsWith("/car-recovery-and-storage") ||
                    location.pathname.startsWith("/accidental-repair") ||
                    location.pathname.startsWith("/pco-replacement") ||
                    location.pathname.startsWith("/our-fleet") ||
                    location.pathname.startsWith("/personal-assistance") ||
                    location.pathname.startsWith("/introducer-support") ||
                    location.pathname.startsWith("/insurance-services")
                    ? "text-accent" : ""
                    }`}
                >
                  Services
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isServicesOpen && (
                  <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-56 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                      {whatWeDoSubLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className={`block select-none rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:text-accent ${location.pathname === link.path ? "text-accent" : ""
                            }`}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Car Sale/Buy */}
              <Link
                to="/car-sale-buy"
                className={`px-4 py-2 rounded-md text-base font-medium hover:text-accent transition-colors ${location.pathname === "/car-sale-buy" ? "text-accent" : ""
                  }`}
              >
                Car Sale/Buy
              </Link>

              {/* 4. Company Link with Dropdown */}
              {/* 4. Company Link with Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsCompanyOpen(true)}
                onMouseLeave={() => setIsCompanyOpen(false)}
              >
                <button
                  className={`px-4 py-2 rounded-md text-base font-medium hover:text-accent transition-colors flex items-center gap-1 ${location.pathname.startsWith("/about") ||
                    location.pathname.startsWith("/our-blogs") ||
                    location.pathname.startsWith("/what-to-do-after-accident") ||
                    location.pathname.startsWith("/faqs") ||
                    location.pathname.startsWith("/testimonials")
                    ? "text-accent" : ""
                    }`}
                >
                  Company
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isCompanyOpen && (
                  <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-56 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                      {companySubLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className={`block select-none rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:text-accent ${location.pathname === link.path ? "text-accent" : ""
                            }`}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Contact Us */}
              <Link
                to="/contact"
                className={`px-4 py-2 rounded-md text-base font-medium hover:text-accent transition-colors ${location.pathname === "/contact" ? "text-accent" : ""
                  }`}
              >
                Contact Us
              </Link>

              {mounted && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  className="ml-4 hidden lg:inline-flex border-border text-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              )}

              <Link to="/make-claim">
                <Button variant="default" className="ml-4 bg-accent text-accent-foreground hover:bg-accent/90 text-base font-medium px-6 py-2">
                  Make a Claim
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-md hover:text-accent transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden pb-4 space-y-1 overflow-y-auto max-h-[80vh]">
              {/* 1. Road Traffic Accidents */}
              <Link
                to="/road-traffic-accidents"
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-1.5 rounded-md text-sm font-medium hover:text-accent transition-colors ${location.pathname === "/road-traffic-accidents" ? "text-accent" : ""
                  }`}
              >
                Road Traffic Accidents
              </Link>

              {/* 2. Services Section in Mobile */}
              <div className="px-4">
                <div className="text-sm font-medium mb-1 text-muted-foreground/80">Services</div>
                <div className="pl-3 space-y-0.5 border-l-2 border-border ml-1">
                  {whatWeDoSubLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block py-1 pl-3 rounded-md text-sm hover:text-accent transition-colors ${location.pathname === link.path ? "text-accent" : ""
                        }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* 3. Car Sale/Buy */}
              <Link
                to="/car-sale-buy"
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-1.5 rounded-md text-sm font-medium hover:text-accent transition-colors ${location.pathname === "/car-sale-buy" ? "text-accent" : ""
                  }`}
              >
                Car Sale/Buy
              </Link>

              {/* 4. Company Section in Mobile */}
              <div className="px-4">
                <div className="text-sm font-medium mb-1 text-muted-foreground/80">Company</div>
                <div className="pl-3 space-y-0.5 border-l-2 border-border ml-1">
                  {companySubLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block py-1 pl-3 rounded-md text-sm hover:text-accent transition-colors ${location.pathname === link.path ? "text-accent" : ""
                        }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* 5. Contact Us */}
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-1.5 rounded-md text-sm font-medium hover:text-accent transition-colors ${location.pathname === "/contact" ? "text-accent" : ""
                  }`}
              >
                Contact Us
              </Link>

              <div className="px-4 pt-2 space-y-2">
                {mounted && (
                  <Button
                    variant="outline"
                    onClick={toggleTheme}
                    className="w-full border-border text-foreground hover:bg-muted hover:text-foreground h-9"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                    </span>
                  </Button>
                )}

                <Link to="/make-claim" onClick={() => setIsOpen(false)} className="block">
                  <Button variant="default" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-sm font-medium py-2 h-10">
                    Make a Claim
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
