import { ReactNode, useState } from "react";

interface FileUploadAreaProps {
  children: ReactNode;
  onFileUploaded: (fileId: string) => void;
}

export const FileUploadArea = ({
  children,
  onFileUploaded,
}: FileUploadAreaProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('on drag enter')
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('on drag leave')
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);

    for (const file in files) {
      try {
        const id = "uplaod file";
        onFileUploaded(id);
      } catch (e) {
        // display error
      }
    }
  };

  return (
    <div
      style={{
        border: isDragOver ? "2px dashed #aaa" : "2px solid transparent",
        borderRadius: "8px",
        textAlign: "center",
        cursor: "pointer",
      }}
      onDragEnter={handleDragEnter}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
};
