# AI Video Maker

## Current State

This is a new Caffeine project with:
- React + TypeScript frontend scaffolding with shadcn/ui components
- Internet Identity authentication hooks configured
- No backend implementation yet
- No App.tsx or user-facing UI components

## Requested Changes (Diff)

### Add
- **User Authentication System**: Full login/logout flow using Internet Identity with role-based authorization
- **Text-to-Video Generation Interface**: Input form with prompt textarea and customization options (duration, style, aspect ratio)
- **Video Generation Backend**: API to handle text-to-video requests via HTTP outcalls to external AI video generation service
- **Video Storage System**: Store generated videos using blob storage with metadata (prompt, settings, creation date)
- **Video Library/Gallery**: Dashboard view showing user's video history with thumbnails, metadata, and playback
- **Video Management**: Ability to view, download, regenerate (with modified prompts), and delete videos
- **User-specific video access**: Each user can only access their own generated videos

### Modify
- Add `App.tsx` as main application component with routing and layout
- Configure main.tsx to use authorization provider

### Remove
- None (new project)

## Implementation Plan

### Backend (Motoko)
1. User management with Internet Identity authentication and authorization
2. Video generation request handling:
   - Accept text prompt with customization parameters (duration, style, aspect ratio)
   - Make HTTP outcalls to external AI video service API
   - Handle async video generation workflow
3. Video storage and retrieval:
   - Store video files in blob storage
   - Track video metadata (user ID, prompt, settings, timestamps, status)
   - Provide CRUD operations for user's video library
4. Access control to ensure users only access their own videos

### Frontend (React + TypeScript)
1. **Authentication flow**: Login/logout UI with Internet Identity integration
2. **Home/Dashboard page**: 
   - Video generation form with prompt input and customization controls
   - "Generate Video" button with loading states
3. **Video Library page**:
   - Grid/list view of user's generated videos
   - Video cards showing thumbnail, prompt, creation date, settings
   - Video player for preview
   - Actions: download, regenerate, delete
4. **Navigation**: Header with app branding, navigation links, and user profile/logout
5. **Loading and error states**: Spinners, progress indicators, error messages
6. **Responsive design**: Mobile-friendly layout

### Components Required
- **authorization**: User authentication and role-based access control
- **blob-storage**: Video file storage with HTTP URL access
- **http-outcalls**: Backend calls to external AI video generation API

## UX Notes

- Generation process should show clear progress/status (queued, processing, complete, failed)
- Video library should display videos in reverse chronological order (newest first)
- Regenerate feature should pre-fill the form with previous prompt and settings
- Download should provide direct file download
- Consider pagination if user has many videos
- Clear error messaging if video generation fails (API limits, invalid prompts, etc.)
- Mobile users should be able to generate and view videos on smaller screens
