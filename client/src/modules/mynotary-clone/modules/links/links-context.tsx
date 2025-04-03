import { ReactNode, createContext, useEffect, useState } from "react";
import { Link } from "./links";
import { LinkApiImpl } from "./links.api.impls";

const linkApi = new LinkApiImpl();

export type LinkStatus = "pending" | "loading" | "success" | "error";

interface LinksResponse {
  links: Link[];
  status: LinkStatus;
}

export const LinkContext = createContext<LinksResponse | null>(null);

interface BranchProviderProps {
  recordId: string;
  children: ReactNode;
}

export const LinkProvider = ({ recordId, children }: BranchProviderProps) => {
  const [status, setStatus] = useState<LinkStatus>("loading");

  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setStatus("loading");
        const links = await linkApi.getLinks({ fromId: recordId });
        setLinks(links);
        setStatus("success");
      } catch (e) {
        setStatus("error");
      }
    };

    fetchLinks();
  }, []);

  return (
    <LinkContext.Provider value={{ status, links }}>
      {children}
    </LinkContext.Provider>
  );
};
