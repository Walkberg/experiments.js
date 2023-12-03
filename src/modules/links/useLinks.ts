import { useContext } from "react";
import { LinkContext, LinkStatus } from "./links-context";
import { Link } from "./links";

interface UseLinks {
  status: LinkStatus;
  links: Link[];
}

export function useLinks(): UseLinks {
  const context = useContext(LinkContext);

  if (context == null) {
    throw new Error();
  }

  return { links: context.links, status: context.status };
}
