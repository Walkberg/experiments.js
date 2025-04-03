export interface FileInfo {
  id: string;
  name: string;
}

export interface FileClient {
  getFile: (fileId: string) => Promise<FileInfo>;
}
