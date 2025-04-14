import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { isExistingMember, Member, MemberNew } from "../members";
import { MembersProvider, useMembers } from "../providers/MemberProvider";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { useMemberClient } from "../providers/MemberClientProvider";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useKey } from "@/modules/mynotary-clone/hooks/useKey";
import { useForm } from "react-hook-form";
import { OrganizationPicker } from "../../organizations/components/OrganizationPicker";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarIcon, UserIcon } from "lucide-react";
import { format } from "date-fns";

export function MembersPage() {
  return (
    <MembersProvider>
      <div className="flex flex-grow flex-col gap-2 h-full">
        <div>
          <MemberAdd />
        </div>
        <div className=" overflow-y-scroll">
          <MemberList />
        </div>
      </div>
    </MembersProvider>
  );
}

type FormValues = {
  email: string;
  organizationId: string;
};

export function MemberAdd() {
  const [open, setOpen] = useState<boolean>(false);

  const { addMember } = useMembers();
  const { createMember } = useMemberCreation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>();

  useKey(["a"], () => setOpen(true));

  const handleMemberCreated = (member: Member) => {
    addMember(member);
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: FormValues) => {
    createMember(
      { email: data.email, organizationId: data.organizationId },
      {
        onMemberCreated: handleMemberCreated,
      }
    );
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button>Ajouter un membre</Button>
        </DialogTrigger>
        <DialogContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <OrganizationPicker control={control} name="organizationId" />
            <Input
              autoFocus
              placeholder="email"
              {...register("email", {
                required: "L'email est requis",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Adresse email invalide",
                },
              })}
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
            <Button disabled={!isValid} type="submit">
              Creer
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function MemberList() {
  const { organizationId } = useCurrentMember();
  const { fetchMembers } = useFetchMembers();
  const { members, setMembers } = useMembers();

  useEffect(() => {
    fetchMembers(organizationId, {
      onMemberFetched: setMembers,
    });
  }, [fetchMembers, organizationId]);

  return (
    <div>
      MemberList
      <div className="flex flex-col gap-2">
        {members.map((member) => {
          return <MemberTile key={member.id} member={member} />;
        })}
      </div>
    </div>
  );
}

interface MemberTileProps {
  member: Member;
}

export function MemberTile({ member }: MemberTileProps) {
  const name = isExistingMember(member)
    ? `${member.user.firstname} ${member.user.lastname}`
    : "Invité";

  const initials = isExistingMember(member)
    ? `${member.user.firstname[0]}${member.user.lastname[0]}`
    : member.email[0]?.toUpperCase();

  return (
    <Card className="flex items-center p-4 gap-4">
      <Avatar className="h-12 w-12">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="text-base font-medium">{name}</div>
        <div className="text-sm text-muted-foreground">{member.email}</div>
        <div className="text-sm text-muted-foreground">
          Organisation :{" "}
          <span className="font-semibold">{member.organizationId}</span>
        </div>
      </div>
      <div className="flex flex-col items-end text-sm text-muted-foreground gap-1">
        <div className="flex items-center gap-1">
          <CalendarIcon className="w-4 h-4" />
          {format(new Date(member.creationDate), "dd/MM/yyyy")}
        </div>
        <div className="flex items-center gap-1">
          <UserIcon className="w-4 h-4" />
          {isExistingMember(member) ? "Utilisateur existant" : "Invité"}
        </div>
      </div>
    </Card>
  );
}

type Status = "idle" | "loading" | "error" | "success";

type FetchMemberOption = {
  onFetchMembers?: () => Promise<void>;
  onMemberFetched?: (members: Member[]) => void;
  onMemberFetchedError?: () => Promise<void>;
};

export function useFetchMembers() {
  const [status, setStatus] = useState<Status>("idle");

  const client = useMemberClient();

  const fetchMembers = useCallback(
    async (organizationId: string, options?: FetchMemberOption) => {
      try {
        setStatus("loading");
        options?.onFetchMembers?.();
        const members = await client.getMembers(organizationId);
        setStatus("success");
        options?.onMemberFetched?.(members);
      } catch (error) {
        options?.onMemberFetchedError?.();
        setStatus("error");
      }
    },
    []
  );

  return { fetchMembers, status };
}

type Option = {
  onCreateMembers?: () => Promise<void>;
  onMemberCreated?: (member: Member) => void;
  onMemberCreateError?: () => Promise<void>;
};

export function useMemberCreation() {
  const [status, setStatus] = useState<Status>("idle");

  const client = useMemberClient();

  const createMember = useCallback(
    async (memberNew: MemberNew, options?: Option) => {
      try {
        setStatus("loading");
        options?.onCreateMembers?.();
        const member = await client.createMember(memberNew);
        setStatus("success");
        options?.onMemberCreated?.(member);
      } catch (error) {
        options?.onMemberCreateError?.();
        setStatus("error");
      }
    },
    []
  );

  return { createMember, status };
}

export function useCurrentMember() {
  return {
    organizationId: "1",
    userId: "1",
  };
}
