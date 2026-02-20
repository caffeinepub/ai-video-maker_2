import { useState } from "react";
import { useDeleteVideo, useRegenerateVideo } from "../hooks/useQueries";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Play,
  Download,
  MoreVertical,
  Trash2,
  RefreshCw,
  Calendar,
  Clock,
  Palette,
  Monitor,
} from "lucide-react";
import type { Video, VideoParams } from "../backend";

interface VideoCardProps {
  video: Video;
  onPlay: () => void;
}

export default function VideoCard({ video, onPlay }: VideoCardProps) {
  const deleteMutation = useDeleteVideo();
  const regenerateMutation = useRegenerateVideo();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDownload = () => {
    try {
      const url = video.video.getDirectURL();
      const link = document.createElement("a");
      link.href = url;
      link.download = `video-${video.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download video");
    }
  };

  const handleRegenerate = async () => {
    const params: VideoParams = {
      prompt: video.prompt,
      duration: video.duration,
      style: video.style,
      aspectRatio: video.aspectRatio,
    };

    try {
      await regenerateMutation.mutateAsync({
        videoId: video.id,
        params,
      });
      toast.success("Video regeneration started");
    } catch (error) {
      console.error("Regeneration failed:", error);
      toast.error("Failed to regenerate video");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(video.id);
      toast.success("Video deleted");
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete video");
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground";
      case "failed":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const videoUrl = video.video.getDirectURL();

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-accent/50">
        <CardHeader className="p-0 relative">
          {/* Video Thumbnail */}
          <div className="relative aspect-video bg-muted overflow-hidden">
            <video
              src={videoUrl}
              className="w-full h-full object-cover"
              preload="metadata"
            />
            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                size="lg"
                onClick={onPlay}
                className="rounded-full w-16 h-16 p-0"
              >
                <Play className="w-8 h-8 fill-current" />
              </Button>
            </div>
            {/* Status Badge */}
            <Badge
              className={`absolute top-2 right-2 ${getStatusColor(video.status)}`}
            >
              {video.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          {/* Prompt */}
          <p className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
            {video.prompt}
          </p>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {video.duration.toString()}s
            </div>
            <div className="flex items-center gap-1">
              <Palette className="w-3 h-3" />
              {video.style}
            </div>
            <div className="flex items-center gap-1">
              <Monitor className="w-3 h-3" />
              {video.aspectRatio}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(video.timestamp)}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            onClick={onPlay}
            variant="default"
            size="sm"
            className="flex-1 gap-2"
            disabled={video.status !== "completed"}
          >
            <Play className="w-4 h-4" />
            Play
          </Button>
          <Button
            onClick={handleDownload}
            variant="secondary"
            size="sm"
            className="gap-2"
            disabled={video.status !== "completed"}
          >
            <Download className="w-4 h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleRegenerate}
                disabled={regenerateMutation.isPending}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                disabled={deleteMutation.isPending}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this video. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
