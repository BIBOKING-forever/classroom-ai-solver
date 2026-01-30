export interface StreamPostData {
  id: string;
  classId: string;
  authorName: string;
  authorAvatar?: string;
  date: string;
  content: string;
  attachment?: string; // Base64 data URL
  attachmentName?: string;
  attachmentMimeType?: string;
  sources?: SourceData[];
  isAi?: boolean;
  comments?: CommentData[];
}

export interface SourceData {
  title: string;
  uri: string;
}

export interface CommentData {
  id: string;
  authorName: string;
  content: string;
  date: string;
}

export interface ClassData {
  id: string;
  name: string;
  section?: string;
  themeColor: string; // Tailwind bg class for UI accents
  subjectContext: string; // The prompt for the AI
  initial?: string;
  avatarColor?: string; // Tailwind bg class for the avatar
}

export enum Tab {
  STREAM = 'Stream',
  CLASSWORK = 'Classwork',
  PEOPLE = 'People'
}