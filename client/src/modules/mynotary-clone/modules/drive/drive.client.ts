import axios from "axios";
import {
  DocumentCreated,
  DocumentFiltering,
  DocumentNew,
  DocumentUpdate,
  DriveClient,
  DriveDocument,
  DriveFolder,
  DriveFolderNew,
  FolderCreated,
  FolderFiltering,
  FolderUpdate,
} from "./drive";

const API_BASE_URL = "your_api_base_url";

export class DriveClientImpl implements DriveClient {
  async createFolder(folderNew: DriveFolderNew): Promise<FolderCreated> {
    const url = `${API_BASE_URL}/folders`;
    const response = await axios.post(url, folderNew);
    return response.data;
  }

  async getFolders(filtering: FolderFiltering): Promise<DriveFolder[]> {
    const url = `${API_BASE_URL}/folders`;
    const response = await axios.get(url, { params: filtering });
    return response.data;
  }

  async updateFolder(folderUpdate: FolderUpdate): Promise<void> {
    const url = `${API_BASE_URL}/folders/${folderUpdate.id}`;
    const response = await axios.put(url, folderUpdate);
    return response.data;
  }

  async deleteFolder(id: string): Promise<void> {
    const url = `${API_BASE_URL}/folders/${id}`;
    const response = await axios.delete(url);
    return response.data;
  }

  async createDocument(documentNew: DocumentNew): Promise<DocumentCreated> {
    const url = `${API_BASE_URL}/documents`;
    const response = await axios.post(url, documentNew);
    return response.data;
  }

  async getDocuments(filtering: DocumentFiltering): Promise<DriveDocument[]> {
    const url = `${API_BASE_URL}/documents`;
    const response = await axios.get(url, { params: filtering });
    return response.data;
  }

  async updateDocument(documentUpdate: DocumentUpdate): Promise<void> {
    const url = `${API_BASE_URL}/documents/${documentUpdate.id}`;
    const response = await axios.put(url, documentUpdate);
    return response.data;
  }

  async deleteDocument(id: string): Promise<void> {
    const url = `${API_BASE_URL}/documents/${id}`;
    const response = await axios.delete(url);
    return response.data;
  }
}
