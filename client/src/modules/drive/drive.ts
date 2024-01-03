export interface Drive {
  id: string;
}

export interface DriveFolder {
  id: string;
  name: string;
  driveId: string;
}

export interface DriveFolderNew {
  name: string;
  driveId: string;
}

export interface DriveFolderUpdate {
  id: string;
  name: string;
}

export interface DriveDocument {
  id: string;
  filename: string;
  size: number;
  fileId: string;
  folderId: string | null;
  driveId: string;
}

export interface DocumentNew {
  fileId: string;
  folderId: string | null;
  driveId: string;
}

export interface DocumentCreated {
  id: string;
}

export interface DocumentUpdate {
  id: string;
  folderId: string | null;
}

export interface DocumentFiltering {
  folderId?: string | null;
  driveId?: string;
}

export interface DriveDocumentMove {
  documentId: string;
  folderId: string | null;
}

export interface FolderCreated {
  id: string;
}

export interface FolderFiltering {
  driveId: string;
}

export interface FolderUpdate {
  id: string;
  name: string;
}

export interface DriveClient {
  createFolder: (folderNew: DriveFolderNew) => Promise<FolderCreated>;
  getFolders: (filtering: FolderFiltering) => Promise<DriveFolder[]>;
  updateFolder: (folderUpdate: FolderUpdate) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  createDocument: (documentNew: DocumentNew) => Promise<DocumentCreated>;
  getDocuments: (filtering: DocumentFiltering) => Promise<DriveDocument[]>;
  updateDocument: (documentUpdate: DocumentUpdate) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}
