import { v4 as uuidv4 } from "uuid";
import {
  FolderCreated,
  FolderFiltering,
  FolderUpdate,
  DocumentNew,
  DocumentCreated,
  DocumentFiltering,
  DocumentUpdate,
  DriveFolder,
  DriveFolderNew,
  DriveClient,
  DriveDocument,
} from "./drive";

const defaultFolders: DriveFolder[] = [
  { id: "folder-1", name: "folder 1", driveId: "drive-1" },
  { id: "folder-2", name: "folder 2", driveId: "drive-1" },
  { id: "folder-3", name: "folder 3", driveId: "drive-1" },
];

const defaultDocuments: DriveDocument[] = [
  {
    id: "Adezc",
    filename: "document-1",
    size: 456653289,
    folderId: "folder-1",
    driveId: "drive-1",
    fileId: "file-1",
  },
  {
    id: "fds",
    filename: "document-2",
    size: 456653289,
    folderId: null,
    driveId: "drive-1",
    fileId: "file-2",
  },
  {
    id: "dfs",
    filename: "document-3",
    size: 456653289,
    folderId: null,
    driveId: "drive-1",
    fileId: "file-3",
  },
];

export class InMemoryDriveClient implements DriveClient {
  private folders: DriveFolder[] = defaultFolders;
  private documents: DriveDocument[] = defaultDocuments;

  async createFolder(folderNew: DriveFolderNew): Promise<FolderCreated> {
    const newFolder: DriveFolder = {
      id: uuidv4(),
      name: folderNew.name,
      driveId: folderNew.driveId,
    };
    this.folders.push(newFolder);
    return { id: newFolder.id };
  }

  async getFolders(filtering: FolderFiltering): Promise<DriveFolder[]> {
    return this.folders.filter(
      (folder) => folder.driveId === filtering.driveId
    );
  }

  async updateFolder(folderUpdate: FolderUpdate): Promise<void> {
    const index = this.folders.findIndex(
      (folder) => folder.id === folderUpdate.id
    );
    if (index !== -1) {
      this.folders[index].name = folderUpdate.name;
    }
  }

  async deleteFolder(id: string): Promise<void> {
    this.folders = this.folders.filter((folder) => folder.id !== id);
  }

  async createDocument(documentNew: DocumentNew): Promise<DocumentCreated> {
    const newDocument: DriveDocument = {
      id: uuidv4(),
      size: 564489465,
      filename: documentNew.name,
      fileId: uuidv4(), // You may adjust this as needed
      folderId: documentNew.folderId,
      driveId: documentNew.driveId,
    };
    this.documents.push(newDocument);

    return { id: newDocument.id };
  }

  async getDocuments(filtering: DocumentFiltering): Promise<DriveDocument[]> {
    return this.documents.filter(
      (document) => document.driveId === filtering.driveId
    );
  }

  async updateDocument(documentUpdate: DocumentUpdate): Promise<void> {
    const index = this.documents.findIndex(
      (document) => document.id === documentUpdate.id
    );
    if (index !== -1) {
      this.documents[index].folderId = documentUpdate.folderId;
    }
  }

  async deleteDocument(id: string): Promise<void> {
    this.documents = this.documents.filter((document) => document.id !== id);
  }
}
