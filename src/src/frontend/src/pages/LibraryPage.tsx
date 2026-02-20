import { useState } from "react";
import { useGetUserVideos, useGetUserJobs } from "../hooks/useQueries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoCard from "../components/VideoCard";
import JobCard from "../components/JobCard";
import VideoPlayerDialog from "../components/VideoPlayerDialog";
import { Film, Loader2, Library as LibraryIcon } from "lucide-react";
import type { Video } from "../backend";

export default function LibraryPage() {
  const { data: videos = [], isLoading: videosLoading } = useGetUserVideos();
  const { data: jobs = [], isLoading: jobsLoading } = useGetUserJobs();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const completedVideos = videos.filter((v) => v.status === "completed");
  const failedVideos = videos.filter((v) => v.status === "failed");

  const activeJobs = jobs.filter(
    (job) => job.status === "queued" || job.status === "processing"
  );
  const completedJobs = jobs.filter((job) => job.status === "completed");
  const failedJobs = jobs.filter((job) => job.status === "failed");

  const isLoading = videosLoading || jobsLoading;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <LibraryIcon className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold">
            Your Video Library
          </h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Manage, preview, and download all your AI-generated videos
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Videos</CardDescription>
            <CardTitle className="text-3xl font-display">
              {completedVideos.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Generating</CardDescription>
            <CardTitle className="text-3xl font-display text-accent">
              {activeJobs.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>This Month</CardDescription>
            <CardTitle className="text-3xl font-display">
              {videos.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Success Rate</CardDescription>
            <CardTitle className="text-3xl font-display text-success">
              {videos.length > 0
                ? Math.round((completedVideos.length / videos.length) * 100)
                : 0}
              %
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">
            All ({completedVideos.length + activeJobs.length})
          </TabsTrigger>
          <TabsTrigger value="generating">
            Generating ({activeJobs.length})
          </TabsTrigger>
          <TabsTrigger value="failed">
            Failed ({failedJobs.length + failedVideos.length})
          </TabsTrigger>
        </TabsList>

        {/* All Videos Tab */}
        <TabsContent value="all" className="space-y-6">
          {/* Active Jobs Section */}
          {activeJobs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-accent animate-spin" />
                <h2 className="text-2xl font-display font-semibold">
                  Currently Generating
                </h2>
                <Badge variant="secondary">{activeJobs.length}</Badge>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          )}

          {/* Completed Videos Section */}
          {completedVideos.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-display font-semibold">
                  Completed Videos
                </h2>
                <Badge variant="secondary">{completedVideos.length}</Badge>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onPlay={() => setSelectedVideo(video)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading &&
            completedVideos.length === 0 &&
            activeJobs.length === 0 && (
              <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Film className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-display font-semibold mb-2">
                    No videos yet
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Start creating amazing AI videos by generating your first
                    video from the Generate page
                  </p>
                </CardContent>
              </Card>
            )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-48 w-full rounded-lg" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Generating Tab */}
        <TabsContent value="generating">
          {activeJobs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Loader2 className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-display font-semibold mb-2">
                  No videos generating
                </h3>
                <p className="text-muted-foreground">
                  Your active video generations will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Failed Tab */}
        <TabsContent value="failed">
          {failedJobs.length > 0 || failedVideos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {failedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
              {failedVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onPlay={() => setSelectedVideo(video)}
                />
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Film className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-display font-semibold mb-2">
                  No failed videos
                </h3>
                <p className="text-muted-foreground">Great job! All your generations succeeded</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Video Player Dialog */}
      <VideoPlayerDialog
        video={selectedVideo}
        open={!!selectedVideo}
        onOpenChange={(open) => !open && setSelectedVideo(null)}
      />
    </div>
  );
}
