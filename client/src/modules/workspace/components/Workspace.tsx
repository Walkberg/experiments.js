


import { Space, Workspace } from "../workspace";
import { useWorkspaces } from "../useWorkspace";

export const Workspaces = () => {
  const { status, workspaces } = useWorkspaces();

  if (status === "loading") {
    return <div>... loading</div>;
  }

  return (
    <div>
      <div>List de favories</div>
      {workspaces.spaces.map((space) => (
        <SpaceItem space={space} />
      ))}
    </div>
  );
};

interface WorkspaceIconProps {
  space: Space;
}

const SpaceItem = ({}: WorkspaceIconProps) => {
  return <div>Space</div>;
};
