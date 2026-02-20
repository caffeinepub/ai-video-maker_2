# Cinematic AI - AI Video Generator

A full-featured AI video generation application built on the Internet Computer with React, TypeScript, and shadcn/ui.

## Features

### 🎬 Video Generation
- **Text-to-Video**: Transform text prompts into cinematic videos
- **Customization Options**:
  - Duration: 3s, 5s, 10s, 15s, 30s
  - Style: Cinematic, Animation, Realistic, Artistic, Cartoon, Documentary
  - Aspect Ratio: 16:9, 9:16, 1:1, 4:3
- **Real-time Progress**: Track generation status with live updates

### 📚 Video Library
- **Grid Gallery**: Beautiful responsive grid of all your videos
- **Video Management**:
  - Play videos in full-screen modal player
  - Download videos
  - Regenerate with same or modified settings
  - Delete unwanted videos
- **Smart Filtering**: View all videos, generating, or failed generations
- **Stats Dashboard**: Overview of total videos, active generations, and success rate

### 🔐 Authentication
- **Internet Identity Integration**: Secure, decentralized authentication
- **User Profiles**: Set up your name on first login
- **Protected Routes**: Authentication required for app features

### 🎨 Design System
- **Custom Design Tokens**: Deep indigo-to-violet gradient with electric cyan accents
- **Typography**: Space Grotesk (display) + Literata (body)
- **Dark/Light Mode**: Full theme support with smooth transitions
- **Responsive**: Mobile-first design that works on all devices
- **Cinematic Aesthetic**: Film-inspired UI with dramatic gradients and motion

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Routing**: TanStack Router
- **State Management**: React Query
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with OKLCH color system
- **Backend**: Motoko canister on Internet Computer
- **Storage**: Blob storage for video files
- **Auth**: Internet Identity

## Project Structure

```
src/frontend/src/
├── components/
│   ├── Header.tsx              # Navigation header with auth
│   ├── ProfileSetupDialog.tsx  # First-time user profile setup
│   ├── VideoCard.tsx           # Video grid card with actions
│   ├── JobCard.tsx             # Generation job status card
│   └── VideoPlayerDialog.tsx   # Full-screen video player
├── pages/
│   ├── LoginPage.tsx           # Authentication landing
│   ├── GeneratePage.tsx        # Video generation form
│   └── LibraryPage.tsx         # Video gallery and management
├── hooks/
│   ├── useQueries.ts           # React Query hooks for backend
│   ├── useActor.ts             # Backend actor hook (generated)
│   └── useInternetIdentity.ts  # Auth hook (generated)
├── App.tsx                     # Root component with routing
└── index.css                   # Design tokens and global styles
```

## Routes

- `/login` - Public authentication page
- `/` - Protected video generation page
- `/library` - Protected video library and management

## Backend Integration

The frontend integrates with Motoko backend APIs:

### Video Generation
- `generateVideo(params)` - Start new video generation job
- `regenerateVideo(videoId, params)` - Regenerate existing video

### Video Management
- `getUserVideos(principal)` - Get all completed videos
- `getUserJobs(principal)` - Get all generation jobs (including in-progress)
- `getVideo(videoId)` - Get single video
- `deleteVideo(videoId)` - Delete video

### User Profile
- `getCallerUserProfile()` - Get current user profile
- `saveCallerUserProfile(profile)` - Save user profile

## Data Models

### Video
```typescript
interface Video {
  id: string;
  prompt: string;
  duration: bigint;
  style: string;
  aspectRatio: string;
  status: VideoStatus; // "completed" | "failed"
  video: ExternalBlob; // Video file
  user: Principal;
  timestamp: Time;
}
```

### VideoGenerationJob
```typescript
interface VideoGenerationJob {
  id: string;
  prompt: string;
  duration: bigint;
  style: string;
  aspectRatio: string;
  status: VideoStatus; // "queued" | "processing" | "completed" | "failed"
  video?: ExternalBlob;
  user: Principal;
  timestamp: Time;
}
```

## Key Features Implemented

✅ Internet Identity authentication with logout
✅ User profile setup on first login
✅ Video generation with full customization
✅ Real-time polling for job status updates
✅ Video library with grid layout
✅ Video playback in modal player
✅ Download functionality
✅ Regenerate videos with same settings
✅ Delete videos with confirmation
✅ Responsive mobile/desktop design
✅ Dark/light theme support
✅ Loading states and skeletons
✅ Error handling with toast notifications
✅ Empty states for no content
✅ Stats dashboard
✅ Status badges (queued, processing, completed, failed)
✅ Progress indicators for generating videos
✅ Protected routes with redirects
✅ Clean header navigation
✅ Professional footer with branding

## Design Quality Standards

### Visual Craft Applied
- **Custom color palette**: Deep space indigo (#1a1a3e) with electric cyan (#00d4ff) accents
- **Typography hierarchy**: Bold display font (Space Grotesk) for headings, elegant serif (Literata) for body
- **Motion**: Smooth transitions, hover states, and progress animations
- **Spatial composition**: Generous spacing, clear hierarchy, balanced layouts
- **Signature detail**: Gradient hero text with animated shimmer effect

### Quality Observations
1. **User hesitation point**: First-time users might not know Internet Identity - added help link
2. **Hierarchy risk**: Multiple CTAs on video cards - made "Play" primary action
3. **Missing state**: No feedback during video download - added success toast

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm --filter '@caffeine/template-frontend' start

# TypeScript check
pnpm --filter '@caffeine/template-frontend' typescript-check

# Lint
pnpm --filter '@caffeine/template-frontend' lint

# Build
pnpm --filter '@caffeine/template-frontend' build:skip-bindings
```

## Notes

- Videos are polled every 5 seconds for status updates
- Jobs are polled every 3 seconds during generation
- Video files are served via direct URLs (getDirectURL) for streaming and caching
- All routes except `/login` require authentication
- Theme preference persists across sessions
- User profile is required before using the app

## Future Enhancements

Potential features to add:
- Video editing (trim, crop)
- Batch generation from multiple prompts
- Video sharing via public links
- Collections/folders for organization
- Search and filter by prompt/style
- Video analytics (views, downloads)
- Export settings presets
