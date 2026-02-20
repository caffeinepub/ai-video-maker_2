import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Video {
    id: string;
    status: VideoStatus;
    duration: bigint;
    video: ExternalBlob;
    user: Principal;
    style: string;
    timestamp: Time;
    prompt: string;
    aspectRatio: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface VideoParams {
    duration: bigint;
    style: string;
    prompt: string;
    aspectRatio: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface VideoGenerationJob {
    id: string;
    status: VideoStatus;
    duration: bigint;
    video?: ExternalBlob;
    user: Principal;
    style: string;
    timestamp: Time;
    prompt: string;
    aspectRatio: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VideoStatus {
    completed = "completed",
    queued = "queued",
    processing = "processing",
    failed = "failed"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteVideo(videoId: string): Promise<void>;
    finalizeJob(jobId: string): Promise<void>;
    generateVideo(params: VideoParams): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    getJob(jobId: string): Promise<VideoGenerationJob>;
    getUserJobs(user: Principal): Promise<Array<VideoGenerationJob>>;
    getUserVideos(user: Principal): Promise<Array<Video>>;
    getVideo(videoId: string): Promise<Video>;
    isCallerAdmin(): Promise<boolean>;
    regenerateVideo(originalVideoId: string, newParams: VideoParams): Promise<string>;
    requestAIService(jobId: string, url: string): Promise<string>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateJobStatus(jobId: string, status: VideoStatus, video: ExternalBlob | null): Promise<void>;
}
