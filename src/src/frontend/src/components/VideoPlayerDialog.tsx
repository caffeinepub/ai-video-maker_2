import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Clock, Palette, Monitor } from "lucide-react";
import { toast } from "sonner";
import type { Video } from "../backend";

interface VideoPlayerDialogProps {
  video: Video | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VideoPlayerDialog({
  video,
  open,
  onOpenChange,
}: VideoPlayerDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (open && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay prevented by browser
      });
    }
  }, [open]);

  if (!video) return null;

  const videoUrl = video.video.getDirectURL();

  const handleDownload = () => {
    try {
      const link = document.createElement("a");
      link.href = videoUrl;
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="relative">
          {/* Video Player */}
          <div className="relative aspect-video bg-black">
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full h-full"
              controlsList="nodownload"
            />
          </div>

          {/* Video Info Overlay */}
          <div className="p-6 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">
                {video.prompt}
              </DialogTitle>
              <DialogDescription className="flex flex-wrap gap-3 pt-2">
                <Badge variant="secondary" className="gap-1">
                  <Clock className="w-3 h-3" />
                  {video.duration.toString()}s
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Palette className="w-3 h-3" />
                  {video.style}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Monitor className="w-3 h-3" />
                  {video.aspectRatio}
                </Badge>
              </DialogDescription>
            </DialogHeader>

            <Button onClick={handleDownload} className="w-full gap-2">
              <Download className="w-4 h-4" />
              Download Video
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
