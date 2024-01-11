import { FileUploadArea } from "@/modules/files/components/FileUploadArea";
import { ReactNode } from "react";
import { useCreateDocument } from "../providers/DriveDocumentProvider";

interface DocumentUploadAreaProps {
  children: ReactNode;
  folderId?: string;
}

export function DocumentUploadArea({
  folderId,
  children,
}: DocumentUploadAreaProps) {
  const createDocument = useCreateDocument();

  const handleFileUpload = (fileId: string) => {
    createDocument({ fileId, folderId: folderId ?? null, driveId: "dr" });
  };

  return (
    <FileUploadArea onFileUploaded={handleFileUpload}>
      {children}
    </FileUploadArea>
  );
}
