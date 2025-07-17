// Types.ts

/**
 * Defines possible content visibility states.
 */
export type Visibility = 'public' | 'private' | 'unlisted';

/**
 * Defines the types of video content available on the platform.
 */
export type VideoContentType =
  | 'course'
  | 'series'
  | 'episode'
  | 'vlog'
  | 'song'
  | 'movie'
  | 'standalone';

export interface Role {
  id: string; // e.g., 'role_admin', 'role_instructor', 'role_student'
  name: 'admin' | 'instructor' | 'student';
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  roleId: Role['id'];
  avatarUrl?: string;
}

export interface VideoContent {
  id: string; // e.g., 'content_abcde'
  title: string;
  description: string;
  type: VideoContentType; // Discriminator field
  thumbnailUrl: string;
  duration: number; // Duration in seconds
  uploadDate: string; // ISO 8601 date string (e.g., "2025-03-26T10:00:00Z")
  visibility: Visibility;
  creatorId: User['id']; // Reference to the User ID of the creator/uploader
  tags?: string[]; // Optional tags for searching/filtering
}

export interface Course extends Omit<VideoContent, 'type'> {
  type: 'course';
  modules: Array<{
    id: string; // e.g., 'module_xyz'
    title: string;
    order: number;
  }>;
  instructorId: User['id']; // Explicit instructor reference
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  // Consider adding total estimated duration, prerequisites, etc. later
  contentIds: string[]; // IDs of VideoContent (episodes/lessons) belonging to this course
}

/**
 * Represents a series of related video content (e.g., a multi-part tutorial).
 */
export interface Series {
  id: string; // e.g., 'series_pqrst'
  title: string;
  description: string;
  thumbnailUrl: string; // Series often have their own branding
  creatorId: User['id'];

  episodeIds: Array<VideoContent['id']>;
}

export interface Episode extends Omit<VideoContent, 'type'> {
  type: 'episode';
  seriesId?: Series['id']; // Optional: An episode might belong to a series
  courseId?: Course['id']; // Optional: An episode might belong to a course (as a lesson)
  episodeNumber?: number; // Order within a series
  seasonNumber?: number; // Optional: For series with seasons
}

// Example of a standalone video type (Vlog, Song, Movie, etc.)
// Uses the base VideoContent interface directly or slightly extended.
export interface Vlog extends Omit<VideoContent, 'type'> {
  type: 'vlog';
  // Add any vlog-specific fields if needed
}

export interface Movie extends Omit<VideoContent, 'type'> {
  type: 'movie';
  // Add movie-specific fields (e.g., genre, director, cast) if needed
}



export interface BackendApiResponse<T> {
  status: 'success' | 'error';
  message: string | null;
  data: T | null;
  errorCode?: string | null;
}

export interface BackendErrorPayload {
  status: 'error';
  message: string;
  data: null;
  errorCode?: string | null;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    // ... other pageable fields if needed
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
  // ... other pagination fields
}