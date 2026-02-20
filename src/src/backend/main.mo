import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import MixinStorage "blob-storage/Mixin";
import ExternalBlob "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";

actor {
  // Video library entry (persistent data)
  type Video = {
    id : Text;
    user : Principal;
    prompt : Text;
    duration : Nat;
    style : Text;
    aspectRatio : Text;
    timestamp : Time.Time;
    status : VideoStatus;
    video : ExternalBlob.ExternalBlob;
  };

  // Video generation job for external API
  type VideoGenerationJob = {
    id : Text;
    user : Principal;
    prompt : Text;
    duration : Nat;
    style : Text;
    aspectRatio : Text;
    timestamp : Time.Time;
    status : VideoStatus;
    video : ?ExternalBlob.ExternalBlob;
  };

  type VideoStatus = {
    #queued;
    #processing;
    #completed;
    #failed;
  };

  module Video {
    public func compare(video1 : Video, video2 : Video) : Order.Order {
      Text.compare(video1.id, video2.id);
    };
  };

  // Persistent storage for videos
  let videos = Map.empty<Text, Video>();
  let jobs = Map.empty<Text, VideoGenerationJob>();

  // Generate unique video ID
  var nextId = 0;
  func generateId() : Text {
    let id = nextId.toText();
    nextId += 1;
    id;
  };

  // Video parameter type
  type VideoParams = {
    prompt : Text;
    duration : Nat;
    style : Text;
    aspectRatio : Text;
  };

  // Initialize user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  // Submit new video generation job
  public shared ({ caller }) func generateVideo(params : VideoParams) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can generate videos");
    };

    let jobId = generateId();

    let job : VideoGenerationJob = {
      id = jobId;
      user = caller;
      prompt = params.prompt;
      duration = params.duration;
      style = params.style;
      aspectRatio = params.aspectRatio;
      timestamp = Time.now();
      status = #queued;
      video = null;
    };

    jobs.add(jobId, job);

    jobId;
  };

  // Update job status
  public shared ({ caller }) func updateJobStatus(jobId : Text, status : VideoStatus, video : ?ExternalBlob.ExternalBlob) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update job status");
    };

    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job does not exist") };
      case (?job) {
        jobs.add(
          jobId,
          {
            id = job.id;
            user = job.user;
            prompt = job.prompt;
            duration = job.duration;
            style = job.style;
            aspectRatio = job.aspectRatio;
            timestamp = job.timestamp;
            status;
            video;
          },
        );
      };
    };
  };

  // Finalize job and store persistent video
  public shared ({ caller }) func finalizeJob(jobId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can finalize jobs");
    };

    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job does not exist") };
      case (?job) {
        if (job.user != caller) {
          Runtime.trap("Unauthorized: Only job owner can finalize job");
        };
        switch (job.video) {
          case (null) { Runtime.trap("Job has no associated video") };
          case (?video) {
            let videoData : Video = {
              id = job.id;
              user = job.user;
              prompt = job.prompt;
              duration = job.duration;
              style = job.style;
              aspectRatio = job.aspectRatio;
              timestamp = job.timestamp;
              status = job.status;
              video;
            };

            videos.add(jobId, videoData);

            // Remove job from jobs
            jobs.remove(jobId);
          };
        };
      };
    };
  };

  // Get job by ID
  public query ({ caller }) func getJob(jobId : Text) : async VideoGenerationJob {
    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job does not exist") };
      case (?job) {
        if (job.user != caller and not (AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: Only job owner or admin can view job");
        };
        job;
      };
    };
  };

  // Get all jobs for a user
  public query ({ caller }) func getUserJobs(user : Principal) : async [VideoGenerationJob] {
    if (not AccessControl.isAdmin(accessControlState, caller) and caller != user) {
      Runtime.trap("Unauthorized: Can only view your own jobs");
    };

    jobs.values().toArray().filter(func(j) { j.user == user });
  };

  // Transformation function for HTTP requests
  public shared query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // HTTP Outcall to external AI service for video generation
  public shared ({ caller }) func requestAIService(jobId : Text, url : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can request AI service");
    };

    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job does not exist") };
      case (?job) {
        if (job.user != caller) {
          Runtime.trap("Unauthorized: Only job owner can request AI service for this job");
        };
      };
    };

    await OutCall.httpGetRequest(url, [], transform);
  };

  // Get video by ID
  public query ({ caller }) func getVideo(videoId : Text) : async Video {
    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video does not exist") };
      case (?video) {
        if (video.user != caller and not (AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: Only video owner or admin can view video");
        };
        video;
      };
    };
  };

  // Get all videos for a user
  public query ({ caller }) func getUserVideos(user : Principal) : async [Video] {
    if (not AccessControl.isAdmin(accessControlState, caller) and caller != user) {
      Runtime.trap("Unauthorized: Can only view your own videos");
    };

    videos.values().toArray().filter(func(v) { v.user == user });
  };

  // Delete video by ID
  public shared ({ caller }) func deleteVideo(videoId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete videos");
    };

    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video does not exist") };
      case (?video) {
        if (video.user != caller and not (AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: Only video owner or admin can delete video");
        };
      };
    };

    videos.remove(videoId);
  };

  // Regenerate video with new parameters
  public shared ({ caller }) func regenerateVideo(originalVideoId : Text, newParams : VideoParams) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can regenerate videos");
    };

    switch (videos.get(originalVideoId)) {
      case (null) { Runtime.trap("Video does not exist") };
      case (?originalVideo) {
        if (originalVideo.user != caller) {
          Runtime.trap("Unauthorized: Only video owner can regenerate video");
        };
      };
    };

    let jobId = generateId();

    let job : VideoGenerationJob = {
      id = jobId;
      user = caller;
      prompt = newParams.prompt;
      duration = newParams.duration;
      style = newParams.style;
      aspectRatio = newParams.aspectRatio;
      timestamp = Time.now();
      status = #queued;
      video = null;
    };

    jobs.add(jobId, job);

    jobId;
  };
};
