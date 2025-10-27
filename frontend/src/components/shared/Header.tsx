import { Shield, LogOut, Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "../../context/UserContext";
import { toast } from "sonner@2.0.3";

type Page = "home" | "learn" | "modules" | "play" | "leaderboard" | "profile";

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isAuthenticated: boolean;
  onLogout?: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenAuthModal?: () => void;
}

export function Header({
  currentPage,
  onNavigate,
  isAuthenticated,
  onLogout,
  isDarkMode,
  onToggleTheme,
  onOpenAuthModal,
}: HeaderProps) {
  const { user, logout } = useUser();

  const handleLogout = async () => {
    try {
      await logout();
      if (onLogout) onLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLoginClick = () => {
    if (isAuthenticated && user) {
      // User is already signed in, show toast
      toast.info(`You're already signed in as ${user.displayName || user.email || "User"}.`);
    } else if (onOpenAuthModal) {
      // Open authentication modal
      onOpenAuthModal();
    }
  };

  const navItems: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "Learn", page: "learn" },
    { label: "Play", page: "play" },
    { label: "Leaderboard", page: "leaderboard" },
  ];

  return (
    <header className="bg-[#162E51] dark:bg-[#0F1419] border-b border-white/10 dark:border-white/10 shadow-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title - Left */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <div className="bg-white rounded-lg p-2 shadow-sm">
              <Shield className="h-6 w-6" style={{ color: '#2E8540' }} />
            </div>
            <div className="text-left">
              <h1 className="text-white text-xl" style={{ fontFamily: 'Public Sans, sans-serif', fontWeight: 700 }}>
                USDA AI Red Team Training Game
              </h1>
              <p className="text-xs" style={{ color: '#E8F0F2', opacity: 0.8 }}>
                U.S. Department of Agriculture | AI Center of Excellence
              </p>
            </div>
          </button>

          {/* Navigation and Controls - Right */}
          <div className="flex items-center gap-6">
            {!isAuthenticated && (
              <Button
                onClick={handleLoginClick}
                className="transition-colors duration-200"
                style={{
                  backgroundColor: '#2E8540',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontFamily: 'Public Sans, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1B5E20';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2E8540';
                }}
              >
                Login
              </Button>
            )}
            
            {isAuthenticated && (
              <>
              {/* Navigation Links */}
              <nav className="flex items-center gap-6">
                {navItems.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => onNavigate(item.page)}
                    className={`relative text-white hover:text-teal transition-colors duration-200 ${
                      currentPage === item.page ? "text-teal" : ""
                    }`}
                    style={{ letterSpacing: "0.5px" }}
                  >
                    {item.label}
                    {/* Active underline indicator */}
                    {currentPage === item.page && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal opacity-60"></span>
                    )}
                  </button>
                ))}
              </nav>

              {/* Divider */}
              <div className="h-6 w-px bg-white/20"></div>

              {/* User Controls */}
              <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <button
                  onClick={onToggleTheme}
                  className="rounded-full p-2 transition-colors duration-200 h-8 w-8 flex items-center justify-center"
                  style={{ color: '#E8F0F2' }}
                  aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#4CAF50';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#E8F0F2';
                  }}
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5 transition-all" />
                  ) : (
                    <Moon className="h-5 w-5 transition-all" />
                  )}
                </button>

                {/* User Avatar */}
                <button
                  onClick={() => onNavigate("profile")}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
                  title="View Profile"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-white/30 transition-all">
                    {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />}
                    <AvatarFallback className="text-sm" style={{ backgroundColor: '#2E8540', color: '#ffffff' }}>
                      {user?.displayName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm hidden md:inline" style={{ color: '#E8F0F2', fontFamily: 'Public Sans, sans-serif', fontWeight: 600 }}>
                    {user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "User"}
                  </span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full h-8 w-8 flex items-center justify-center transition-colors duration-200"
                  style={{ color: '#E8F0F2' }}
                  title="Sign Out"
                  aria-label="Sign Out"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#EF4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#E8F0F2';
                  }}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
