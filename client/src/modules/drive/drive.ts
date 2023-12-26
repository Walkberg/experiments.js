export interface Drive {
  id: string;
}

export interface DriveFolder {
  id: string;
  name: string;
}

export interface DriveFolderNew {
  name: string;
}

export interface DriveFolderUpdate {
  id: string;
  name: string;
}

export interface DriveDocument {
  id: string;
  name: string;
  size: number;
  folderId: string | null;
}

export interface DriveDocumentMove {
  documentId: string;
  folderId: string | null;
}
