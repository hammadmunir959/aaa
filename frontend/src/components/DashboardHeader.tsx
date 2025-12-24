import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, ChevronDown, Sun, Moon, Activity, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";
import AdminProfileModal from "@/components/AdminProfileModal";
import NotificationDropdown from "@/components/NotificationDropdown";

const DashboardHeader = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const adminName =
    user?.firstName || user?.lastName
      ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
      : user?.email ?? "Admin User";
  const adminEmail = user?.email ?? "admin@aaa-as.co.uk";
  const homePath = user?.adminType === "super-admin" ? "/super-admin/dashboard" : "/admin/dashboard";

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-[hsl(var(--primary)/0.7)] backdrop-blur-md text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 py-3">
          {/* Logo + Tagline */}
          <div className="flex flex-1 min-w-[200px] items-center gap-4">
            <Link to={homePath} className="flex items-center space-x-3">
              <Logo className="h-14 w-40 sm:h-16 sm:w-44" alt="AAA Accident Solutions LTD" />
            </Link>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs uppercase tracking-[0.2em] text-accent font-bold">
                Admin Control Room
              </span>
              <span className="text-sm text-muted-foreground">
                Oversee operations & performance
              </span>
            </div>
          </div>

          {/* Utilities */}
          <div className="flex items-center gap-2">
            {user?.adminType !== "super-admin" && <NotificationDropdown />}

            {mounted && (
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full border-border text-foreground hover:bg-muted"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-muted"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-accent-foreground">
                    <User className="w-4 h-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{adminName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{adminEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setProfileModalOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/admin/dashboard/activity")}>
                  <Activity className="mr-2 h-4 w-4" />
                  <span>Activity</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <AdminProfileModal open={profileModalOpen} onOpenChange={setProfileModalOpen} />
    </header>
  );
};

export default DashboardHeader;

