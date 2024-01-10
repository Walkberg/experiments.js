import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { DocumentNew, DriveDocument, DriveDocumentMove } from "../drive";
import { useDriveClient } from "./DriveClientProvider";

interface DriveDocumentContextType {
  documents: DriveDocument[];
  createDocument: (newDocument: DocumentNew) => Promise<void>;
  moveDocument: (documentMove: DriveDocumentMove) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}

const DriveContext = createContext<DriveDocumentContextType | null>(null);

interface DriveDocumentProviderProps {
  driveId: string;
  children: ReactNode;
}

export const DriveProvider = ({
  children,
  driveId,
}: DriveDocumentProviderProps) => {
  const [documents, setDocuments] = useState<DriveDocument[]>([]);

  const client = useDriveClient();

  useEffect(() => {
    const fetchDocuments = async () => {
      const documents = await client.getDocuments({ driveId });
      setDocuments(documents);
    };

    fetchDocuments();
  }, []);

  const createDocument = async (documentNew: DocumentNew) => {
    try {
      const newDocument = await client.createDocument(documentNew);
      setDocuments((prev) => [
        ...prev,
        {
          ...documentNew,
          id: newDocument.id,
          filename: "vcfvx",
          size: 1,
        },
      ]);
    } catch (e) {
      //catch erro
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      await client.deleteDocument(documentId);
      setDocuments((prev) =>
        prev.filter((document) => document.id !== documentId)
      );
    } catch (e) {
      //catch erro
    }
  };

  const moveDocument = async (documentMove: DriveDocumentMove) => {
    try {
      await client.updateDocument({
        id: documentMove.documentId,
        folderId: documentMove.folderId,
      });
      setDocuments((prev) =>
        prev.map((document) =>
          document.id === documentMove.documentId
            ? { ...document, folderId: documentMove.folderId }
            : { ...document }
        )
      );
    } catch (e) {
      //catch erro
    }
  };

  return (
    <DriveContext.Provider
      value={{
        documents,
        deleteDocument,
        moveDocument,
        createDocument,
      }}
    >
      {children}
    </DriveContext.Provider>
  );
};

export function useCreateDocument() {
  const context = useContext(DriveContext);

  if (context == null) {
    throw new Error();
  }

  return context.createDocument;
}

export function useMoveDocument() {
  const context = useContext(DriveContext);

  if (context == null) {
    throw new Error();
  }

  return context.moveDocument;
}

export function useDeleteDocument() {
  const context = useContext(DriveContext);

  if (context == null) {
    throw new Error();
  }

  return context.deleteDocument;
}

type UseDocumentsCallBack = (doc: DriveDocument[]) => DriveDocument[];

export function useDocuments(callBack?: UseDocumentsCallBack): DriveDocument[] {
  const context = useContext(DriveContext);

  if (context == null) {
    throw new Error();
  }

  if (callBack != null) {
    return callBack(context.documents);
  }

  return context.documents;
}

export function useDocument(documentId: string): DriveDocument | undefined {
  const context = useContext(DriveContext);

  if (context == null) {
    throw new Error();
  }

  return context.documents.find((document) => document.id === documentId);
}
