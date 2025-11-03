import { LogOut, Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "../../context/UserContext";
import { toast } from "sonner@2.0.3";
import usdaLogo from "figma:asset/fe46ba86f87cfc9f9ab97c58bcc60686524f146d.png";

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
    <header 
      className="bg-[#162E51] dark:bg-[#0F1419] border-b border-white/10 dark:border-white/10 shadow-md transition-colors duration-200"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title - Left */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#162E51] rounded-lg"
            aria-label="Go to home page - USDA AI Red Team Training Game"
            style={{ gap: '10px' }}
          >
            <img 
              src={usdaLogo} 
              alt="USDA – United States Department of Agriculture"
              className="transition-transform duration-200 hover:scale-105 dark:drop-shadow-md"
              style={{ 
                width: '42px', 
                height: 'auto',
                objectFit: 'contain'
              }}
            />
            <div className="text-left">
              <h1 className="text-white text-xl" style={{ fontFamily: 'Public Sans, sans-serif', fontWeight: 700 }}>
                USDA AI Red Team Training Game
              </h1>
              <p className="text-xs text-slate-100" style={{ opacity: 0.8 }}>
                U.S. Department of Agriculture | AI Center of Excellence
              </p>
            </div>
          </button>

          {/* Navigation and Controls - Right */}
          <div className="flex items-center gap-6">
            {!isAuthenticated && (
              <Button
                onClick={handleLoginClick}
                className="transition-colors duration-200 bg-success hover:bg-success/90 text-white"
                style={{
                  fontWeight: 600,
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontFamily: 'Public Sans, sans-serif'
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
                  className="rounded-full p-2 transition-colors duration-200 h-8 w-8 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#162E51] text-slate-100 hover:text-success"
                  aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  aria-pressed={isDarkMode}
                  role="switch"
                  title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5 transition-all" aria-hidden="true" />
                  ) : (
                    <Moon className="h-5 w-5 transition-all" aria-hidden="true" />
                  )}
                </button>

                {/* User Avatar */}
                <button
                  onClick={() => onNavigate("profile")}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity group focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#162E51] rounded-lg px-2 py-1"
                  title="View Profile"
                  aria-label={`View profile for ${user?.displayName || user?.email || "User"}`}
                >
                  <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-white/30 transition-all">
                    {user?.photoURL && <AvatarImage src={user.photoURL} alt={`${user.displayName || "User"} profile picture`} />}
                    <AvatarFallback className="text-sm bg-success text-white" aria-hidden="true">
                      {user?.displayName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm hidden md:inline text-slate-100" style={{ fontFamily: 'Public Sans, sans-serif', fontWeight: 600 }}>
                    {user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "User"}
                  </span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full h-8 w-8 flex items-center justify-center transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#162E51] text-slate-100 hover:text-red-400"
                  title="Sign Out"
                  aria-label="Sign Out"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#EF4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#E8F0F2';
                  }}
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
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
