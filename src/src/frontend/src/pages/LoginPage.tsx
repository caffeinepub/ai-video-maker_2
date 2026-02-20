import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Sparkles, Video, Zap } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const { login, identity, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      navigate({ to: "/" });
    }
  }, [identity, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please try again.");
    }
  };

  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Branding and Features */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Transform Words into Cinematic Videos
              </h1>
              <p className="text-xl text-muted-foreground">
                AI-powered video generation at your fingertips. Type a prompt,
                customize your vision, and watch it come to life.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display font-semibold">AI-Powered</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced AI models generate stunning videos from text
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold">Fast Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Get your videos ready in minutes, not hours
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Video className="w-5 h-5 text-success" />
                </div>
                <h3 className="font-display font-semibold">Full Control</h3>
                <p className="text-sm text-muted-foreground">
                  Customize duration, style, and aspect ratio
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Film className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="font-display font-semibold">Your Library</h3>
                <p className="text-sm text-muted-foreground">
                  Store and manage all your creations in one place
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Login Card */}
          <div>
            <Card className="border-2 shadow-xl">
              <CardHeader className="text-center space-y-3 pb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto">
                  <Film className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-3xl font-display">
                  Get Started
                </CardTitle>
                <CardDescription className="text-base">
                  Login securely with Internet Identity to start creating
                  amazing AI videos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  size="lg"
                  className="w-full text-lg h-14"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="w-5 h-5 border-3 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <Film className="w-5 h-5 mr-2" />
                      Login with Internet Identity
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground pt-4">
                  New to Internet Identity?{" "}
                  <a
                    href="https://identity.ic0.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Create an account
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
