import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Member, MemberNew } from "../members";
import { MembersProvider, useMembers } from "../providers/MemberProvider";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useMemberClient } from "../providers/MemberClientProvider";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useKey } from "@/modules/mynotary-clone/hooks/useKey";
import { useForm } from "react-hook-form";

export function MembersPage() {
  return (
    <MembersProvider>
      <div className="flex flex-grow flex-col gap-2">
        <div>
          <MemberAdd />
        </div>
        <div>
          <MemberList />
        </div>
      </div>
    </MembersProvider>
  );
}

type FormValues = {
  email: string;
};

export function MemberAdd() {
  const [open, setOpen] = useState<boolean>(false);

  const { organizationId } = useCurrentMember();

  const { addMember } = useMembers();
  const { createMember } = useMemberCreation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  useKey(["a"], () => setOpen(true));

  const handleMemberCreated = (member: Member) => {
    addMember(member);
    //setEmail("");
    setOpen(false);
  };

  const onSubmit = async (data: FormValues) => {
    createMember(
      { email: data.email, organizationId },
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
            <Button disabled={false} type="submit">
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
  return <Card className="p-2">{member.email}</Card>;
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
