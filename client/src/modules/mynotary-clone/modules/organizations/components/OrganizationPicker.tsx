import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  OrganizationsProvider,
  useOrganizations,
} from "../providers/OrganizationPersistenceProvider";
import { useFetchOrganizations } from "../pages/OrganizationPage";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Control, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface OrganizationPickerProps {
  control: Control<any>;
  name: string;
}

export function OrganizationPicker({ name, control }: OrganizationPickerProps) {
  return (
    <OrganizationsProvider>
      <OrganizationPickerContent name={name} control={control} />
    </OrganizationsProvider>
  );
}

function OrganizationPickerContent({ name, control }: OrganizationPickerProps) {
  const [search, setSearch] = useState<string>();

  const { organizations, setOrganizations } = useOrganizations();
  const { fetchOrganizations, status } = useFetchOrganizations();

  useEffect(() => {
    fetchOrganizations(search, { onOrganizationFetched: setOrganizations });
  }, [fetchOrganizations, search]);

  return (
    <div className="flex flex-col gap-2">
      <Label>Organisation</Label>
      {status === "loading" ? (
        <Skeleton className="h-10 w-full rounded-md" />
      ) : (
        <Controller
          name={name}
          control={control}
          rules={{ required: "L'organisation est requise" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir une organisation" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      )}
    </div>
  );
}
