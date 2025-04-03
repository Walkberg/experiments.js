import { useSelection } from "../providers/DocumentSelectionProvider";

export const DocumentsSelected = () => {
  const { isSelectable } = useSelection();

  return (
    <div className=" flex">

    </div>
  )
};
