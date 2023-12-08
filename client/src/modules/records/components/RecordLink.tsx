import { RecordProvider } from "../record-context";
import { Record } from "./Record";
import { useLinks } from "@/modules/links/useLinks";

export const RecordLink = () => {
  const { links, status } = useLinks();

  if (status === "loading") {
    return <div>...loading</div>;
  }

  return (
    <div className="flex flex-col gap-2 pt-2">
      {links.map((link) => (
        <RecordProvider recordId={link.toId}>
          <Record />
        </RecordProvider>
      ))}
    </div>
  );
};
