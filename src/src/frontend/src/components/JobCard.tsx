import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Clock, Palette, Monitor, Calendar } from "lucide-react";
import type { VideoGenerationJob } from "../backend";

interface JobCardProps {
  job: VideoGenerationJob;
}

export default function JobCard({ job }: JobCardProps) {
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

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isActive = job.status === "queued" || job.status === "processing";
  const progress = job.status === "processing" ? 60 : job.status === "queued" ? 20 : 100;

  return (
    <Card className="border-2 border-accent/30 bg-accent/5">
      <CardHeader className="p-0 relative">
        {/* Animated Placeholder */}
        <div className="relative aspect-video bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 flex items-center justify-center overflow-hidden">
          {isActive && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent animate-pulse" />
              <Loader2 className="w-12 h-12 text-accent animate-spin" />
            </>
          )}
          {job.status === "failed" && (
            <div className="text-destructive text-center p-4">
              <p className="text-sm font-medium">Generation Failed</p>
            </div>
          )}
          {/* Status Badge */}
          <Badge
            className={`absolute top-2 right-2 ${getStatusColor(job.status)}`}
          >
            {job.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {/* Prompt */}
        <p className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
          {job.prompt}
        </p>

        {/* Progress Bar (for active jobs) */}
        {isActive && (
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {job.status === "queued"
                ? "Waiting in queue..."
                : "Generating video..."}
            </p>
          </div>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {job.duration.toString()}s
          </div>
          <div className="flex items-center gap-1">
            <Palette className="w-3 h-3" />
            {job.style}
          </div>
          <div className="flex items-center gap-1">
            <Monitor className="w-3 h-3" />
            {job.aspectRatio}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(job.timestamp)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
