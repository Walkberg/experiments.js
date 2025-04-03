import { FileUpload } from "@/modules/mynotary-clone/modules/files/components/FileUpload";
import { useCreateDocument } from "../providers/DriveDocumentProvider";

interface DocumentAddProps {
  folderId?: string;
}

export function DocumentAdd({ folderId }: DocumentAddProps) {
  const createDocument = useCreateDocument();

  const handleFileUpload = (fileId: string) => {
    createDocument({ fileId, folderId: folderId ?? null, driveId: "dr" });
  };

  return (
    <div className="m-2">
      <FileUpload onFileUploaded={handleFileUpload} />
    </div>
  );
}
