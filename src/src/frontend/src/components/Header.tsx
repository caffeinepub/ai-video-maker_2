import { Link, useRouterState } from "@tanstack/react-router";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import { Film, Library, Menu, Moon, Sun, User, LogOut } from "lucide-react";
import { useTheme } from "next-themes";

export default function Header() {
  const { identity, clear, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    window.location.href = "/login";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Film className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
            Cinematic AI
          </span>
        </Link>

        {/* Navigation and User Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                <Link to="/">
                  <Button
                    variant={currentPath === "/" ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Film className="w-4 h-4" />
                    Generate
                  </Button>
                </Link>
                <Link to="/library">
                  <Button
                    variant={currentPath === "/library" ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Library className="w-4 h-4" />
                    Library
                  </Button>
                </Link>
              </nav>

              {/* Mobile Navigation Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <Link to="/">
                    <DropdownMenuItem>
                      <Film className="w-4 h-4 mr-2" />
                      Generate
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/library">
                    <DropdownMenuItem>
                      <Library className="w-4 h-4 mr-2" />
                      Library
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Profile / Auth */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10 border-2 border-accent">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-display font-semibold">
                      {userProfile?.name ? getInitials(userProfile.name) : <User className="w-5 h-5" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {userProfile?.name && (
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {userProfile.name}
                  </div>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button
                size="sm"
                disabled={loginStatus === "logging-in"}
                className="gap-2"
              >
                {loginStatus === "logging-in" ? "Logging in..." : "Login"}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
