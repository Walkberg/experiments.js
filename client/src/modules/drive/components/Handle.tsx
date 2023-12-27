import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";

export const Handle = () => {
  return (
    <Button className="relative" variant="ghost" size="sm">
      <GripVertical className="h-4 w-4" />
    </Button>
  );
};
