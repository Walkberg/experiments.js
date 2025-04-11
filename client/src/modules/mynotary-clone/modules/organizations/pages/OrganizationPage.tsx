import { Organization, OrganizationNew } from "../organization";
import {
  OrganizationsProvider,
  useOrganizations,
} from "../providers/OrganizationPersistenceProvider";
import { useOrganizationClient } from "../providers/OrganizationClientProvider";
import { useKey } from "@/modules/mynotary-clone/hooks/useKey";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Building2Icon, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export function OrganizationsPage() {
  return (
    <OrganizationsProvider>
      <div className="flex flex-grow flex-col gap-2">
        <div>
          <OrganizationAdd />
        </div>
        <div>
          <OrganizationList />
        </div>
      </div>
    </OrganizationsProvider>
  );
}

type FormValues = {
  name: string;
};

export function OrganizationAdd() {
  const [open, setOpen] = useState<boolean>(false);
  const { addOrganization } = useOrganizations();
  const { createOrganization } = useOrganizationCreation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormValues>({ mode: "onChange" });

  useKey(["o"], () => setOpen(true));

  const handleOrganizationCreated = (organization: Organization) => {
    addOrganization(organization);
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    createOrganization(
      { name: data.name },
      {
        onOrganizationCreated: handleOrganizationCreated,
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>Ajouter une organisation</Button>
      </DialogTrigger>
      <DialogContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            autoFocus
            placeholder="Nom de l'organisation"
            {...register("name", {
              required: "Le nom est requis",
              minLength: { value: 2, message: "Trop court" },
            })}
          />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
          <Button type="submit" disabled={!isValid}>
            Créer
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function OrganizationList() {
  const { fetchOrganizations } = useFetchOrganizations();
  const { organizations, setOrganizations } = useOrganizations();

  useEffect(() => {
    fetchOrganizations(undefined, {
      onOrganizationFetched: setOrganizations,
    });
  }, []);

  return (
    <div>
      OrganizationList
      <div className="flex flex-col gap-2">
        {organizations.map((org) => {
          return <OrganizationTile key={org.id} organization={org} />;
        })}
      </div>
    </div>
  );
}

interface OrganizationTileProps {
  organization: Organization;
}

export function OrganizationTile({ organization }: OrganizationTileProps) {
  return (
    <Card className="flex items-center justify-between p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 text-primary rounded-full p-2">
          <Building2Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-lg font-semibold">{organization.name}</div>
          <div className="text-sm text-muted-foreground">
            ID: <span className="font-mono text-xs">{organization.id}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarIcon className="w-4 h-4" />
        {format(new Date(organization.creationDate), "dd/MM/yyyy")}
      </div>
    </Card>
  );
}

type Status = "idle" | "loading" | "error" | "success";

type Option = {
  onCreateOrganizations?: () => Promise<void>;
  onOrganizationCreated?: (organization: Organization) => void;
  onOrganizationCreateError?: () => Promise<void>;
};

export function useOrganizationCreation() {
  const [status, setStatus] = useState<Status>("idle");
  const client = useOrganizationClient();

  const createOrganization = useCallback(
    async (orgNew: OrganizationNew, options?: Option) => {
      try {
        setStatus("loading");
        options?.onCreateOrganizations?.();
        const org = await client.createOrganization(orgNew);
        setStatus("success");
        options?.onOrganizationCreated?.(org);
      } catch (error) {
        options?.onOrganizationCreateError?.();
        setStatus("error");
      }
    },
    []
  );

  return { createOrganization, status };
}

type FetchOrgOption = {
  onFetchOrganizations?: () => Promise<void>;
  onOrganizationFetched?: (organizations: Organization[]) => void;
  onOrganizationFetchedError?: () => Promise<void>;
};

export function useFetchOrganizations() {
  const [status, setStatus] = useState<Status>("idle");
  const client = useOrganizationClient();

  const fetchOrganizations = useCallback(
    async (search?: string, options?: FetchOrgOption) => {
      try {
        setStatus("loading");
        options?.onFetchOrganizations?.();
        const orgs = await client.getOrganizations(search);
        setStatus("success");
        options?.onOrganizationFetched?.(orgs);
      } catch (error) {
        options?.onOrganizationFetchedError?.();
        setStatus("error");
      }
    },
    []
  );

  return { fetchOrganizations, status };
}
