import { Button } from "@/components/ui/button";
import { ChangeEvent } from "react";

interface FileUploadAreaProps {
  onFileUploaded: (fileId: string) => void;
}

export const FileUpload = ({ onFileUploaded }: FileUploadAreaProps) => {
  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      console.log(event.target.files);
      for (const file in event.target.files) {
        try {
          const id = "uplaod file";
          onFileUploaded(id);
        } catch (e) {
          // display error
        }
      }
    }
  };

  return (
    <div>
      <Button>
        <label htmlFor="fileInput">
          Upplaoder
          <input
            type="file"
            id="fileInput"
            onChange={handleUpload}
            style={{
              display: "none",
            }}
          />
        </label>
      </Button>
    </div>
  );
};
