import { Skeleton } from "@/components/ui/skeleton";
import { useRedaction } from "../providers/RedactionProvider";
import { OperationLinkConfig } from "./OperationLinkConfig";

interface OperationLinkConfigsProps {}

export const OperationLinkConfigs = ({}: OperationLinkConfigsProps) => {
  const { redaction, status } = useRedaction();

  if (status === "fetching") {
    return <OperationLinkConfigsPlaceHolder />;
  }

  if (status === "error") {
    return <div>Une erreur est survenue</div>;
  }

  return (
    <div className="flex flex-col items-center">
      {redaction?.availableLinks.map((linkConfig) => (
        <OperationLinkConfig operationLinkConfig={linkConfig} />
      ))}
    </div>
  );
};

export const OperationLinkConfigsPlaceHolder = () => {
  return (
    <div className="flex flex-col gap-4 justify-center">
      <Skeleton className="h-12 w-[300px] bg-slate-200" />
      <Skeleton className="h-12 w-[300px] bg-slate-200" />
      <Skeleton className="h-12 w-[300px] bg-slate-200" />
      <Skeleton className="h-12 w-[300px] bg-slate-200" />
    </div>
  );
};
