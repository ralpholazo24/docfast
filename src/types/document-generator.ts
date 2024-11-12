export interface DocumentData {
  [key: string]: string[];
}

export interface GeneratedDocument {
  content: string;
  filename: string;
  blob?: Blob;
} 