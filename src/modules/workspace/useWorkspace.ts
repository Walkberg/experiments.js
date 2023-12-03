import { Workspace } from "./workspace";

type Status = "loading" | "pending" | "success" | "error";

interface UseWorkspace {
  status: Status;
  workspaces: Workspace;
}

export const useWorkspaces = (): UseWorkspace => {


  return  { status: "success", workspaces: {id:'tets', name:'name', spaces:[]} };
};
