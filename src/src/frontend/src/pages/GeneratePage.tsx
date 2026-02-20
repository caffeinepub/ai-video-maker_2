import { useState } from "react";
import { useGenerateVideo, useGetUserJobs } from "../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Sparkles, Film, Clock, Palette, Monitor } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { VideoParams } from "../backend";

const DURATION_OPTIONS = [
  { value: "3", label: "3 seconds" },
  { value: "5", label: "5 seconds" },
  { value: "10", label: "10 seconds" },
  { value: "15", label: "15 seconds" },
  { value: "30", label: "30 seconds" },
];

const STYLE_OPTIONS = [
  { value: "cinematic", label: "Cinematic" },
  { value: "animation", label: "Animation" },
  { value: "realistic", label: "Realistic" },
  { value: "artistic", label: "Artistic" },
  { value: "cartoon", label: "Cartoon" },
  { value: "documentary", label: "Documentary" },
];

const ASPECT_RATIO_OPTIONS = [
  { value: "16:9", label: "16:9 Landscape" },
  { value: "9:16", label: "9:16 Portrait" },
  { value: "1:1", label: "1:1 Square" },
  { value: "4:3", label: "4:3 Classic" },
];

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("10");
  const [style, setStyle] = useState("cinematic");
  const [aspectRatio, setAspectRatio] = useState("16:9");

  const generateMutation = useGenerateVideo();
  const { data: jobs = [] } = useGetUserJobs();

  const activeJobs = jobs.filter(
    (job) => job.status === "queued" || job.status === "processing"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      toast.error("Please enter a prompt for your video");
      return;
    }

    const params: VideoParams = {
      prompt: prompt.trim(),
      duration: BigInt(duration),
      style,
      aspectRatio,
    };

    try {
      const jobId = await generateMutation.mutateAsync(params);
      toast.success(
        "Video generation started! Check your library in a few minutes.",
        {
          description: `Job ID: ${jobId}`,
        }
      );
      // Don't clear the form in case user wants to generate variations
    } catch (error) {
      console.error("Failed to generate video:", error);
      toast.error("Failed to start video generation. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "queued":
        return "bg-muted text-muted-foreground";
      case "processing":
        return "bg-accent text-accent-foreground";
      case "completed":
        return "bg-success text-success-foreground";
      case "failed":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Create Your Vision
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Describe your video idea, customize the settings, and let AI bring it
          to life in cinematic quality
        </p>
      </div>

      {/* Active Jobs Alert */}
      {activeJobs.length > 0 && (
        <Card className="mb-8 border-accent/50 bg-accent/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 text-accent animate-spin" />
              <CardTitle className="text-lg">
                {activeJobs.length} Video{activeJobs.length > 1 ? "s" : ""}{" "}
                Generating
              </CardTitle>
            </div>
            <CardDescription>
              Your videos are being created. This usually takes 2-5 minutes.{" "}
              <Link to="/library" className="text-accent hover:underline">
                View in Library →
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeJobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-3 rounded-lg bg-card border"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{job.prompt}</p>
                  <p className="text-xs text-muted-foreground">
                    {job.duration.toString()}s · {job.style} · {job.aspectRatio}
                  </p>
                </div>
                <Badge
                  className={getStatusColor(job.status)}
                  variant="secondary"
                >
                  {job.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Generation Form */}
      <Card className="border-2 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            <CardTitle className="text-2xl font-display">
              Video Generator
            </CardTitle>
          </div>
          <CardDescription>
            Fill in the details below to generate your AI video
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Prompt Input */}
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-base font-display">
                Video Prompt
              </Label>
              <Textarea
                id="prompt"
                placeholder="Describe your video... e.g., 'A drone shot flying over a misty mountain range at sunrise, with golden light breaking through the clouds'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={generateMutation.isPending}
                rows={5}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Be specific and descriptive for best results
              </p>
            </div>

            {/* Customization Options Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Duration
                </Label>
                <Select
                  value={duration}
                  onValueChange={setDuration}
                  disabled={generateMutation.isPending}
                >
                  <SelectTrigger id="duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Style */}
              <div className="space-y-2">
                <Label htmlFor="style" className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  Style
                </Label>
                <Select
                  value={style}
                  onValueChange={setStyle}
                  disabled={generateMutation.isPending}
                >
                  <SelectTrigger id="style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STYLE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <Label htmlFor="aspectRatio" className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-muted-foreground" />
                  Aspect Ratio
                </Label>
                <Select
                  value={aspectRatio}
                  onValueChange={setAspectRatio}
                  disabled={generateMutation.isPending}
                >
                  <SelectTrigger id="aspectRatio">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ASPECT_RATIO_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full text-lg h-14"
              disabled={generateMutation.isPending || !prompt.trim()}
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Your Video...
                </>
              ) : (
                <>
                  <Film className="mr-2 h-5 w-5" />
                  Generate Video
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
