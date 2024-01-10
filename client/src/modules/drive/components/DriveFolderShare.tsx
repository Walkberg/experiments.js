import { useEffect, useState } from "react";
import { useDriveClient } from "../providers/DriveClientProvider";
import { DriveDocument } from "../drive";

interface DriveFolderShareProps {
  driveId: string;
  folderId: string;
  documentIds: string[];
}

export const DriveFolderShare = ({
  driveId,
  folderId,
  documentIds,
}: DriveFolderShareProps) => {
  const [driveDocument, setDriveDocument] = useState<DriveDocument[]>([]);

  const driveClient = useDriveClient();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const driveDocuments = await driveClient.getDocuments({ folderId });
        setDriveDocument(driveDocuments);
      } catch (e) {
        console.log("test");
      }
    };
    fetchDocuments();
  }, []);

  return (
    <div>
      <div>{documentIds.length} document à fournir</div>
      {documentIds.map((documentId) => (
        <div>aaa</div>
      ))}
    </div>
  );
};
