import { DriveDocument } from "./drive";

export const selectDocumentsByFolderId =
  (folderId: string) =>
  (docs: DriveDocument[]): DriveDocument[] =>
    docs.filter((doc) => doc.folderId === folderId);
