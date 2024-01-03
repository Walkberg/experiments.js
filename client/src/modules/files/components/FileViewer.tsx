import { useEffect, useState } from "react";
import { FileInfo } from "../file";

interface FileViewerProps {
  fileId: string;
}

export const FileViewer = ({ fileId }: FileViewerProps) => {
  const [file, setFile] = useState<FileInfo | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        setFile(null);
      } catch (e) {}
    };

    fetchFile();
  }, [fileId]);

  if (file == null) {
    return null;
  }

  return <img src={`URL_DE_TON_API/${fileId}`} alt={file?.name} />;
};
