import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Member, MemberNew } from "../members";
import { MembersProvider, useMembers } from "../providers/MemberProvider";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useMemberClient } from "../providers/MemberClientProvider";
import { Input } from "@/components/ui/input";

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

export function MemberAdd() {
  const [email, setEmail] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const { addMember } = useMembers();
  const { createMember } = useMemberCreation();

  const handleMemberCreated = (member: Member) => {
    addMember(member);
    setEmail("");
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMember(
      { email, organizationId: "1" },
      {
        onMemberCreated: handleMemberCreated,
      }
    );
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button>Ajouter un membre</Button>
        </DialogTrigger>
        <DialogContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              autoFocus
              placeholder="nom"
              onChange={handleInputChange}
              value={email}
            />
            <Button disabled={email.length === 0} type="submit">
              Creer
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function MemberList() {
  const { fetchMembers } = useFetchMembers();
  const { members, setMembers } = useMembers();

  useEffect(() => {
    fetchMembers("1", {
      onMemberFetched: setMembers,
    });
  }, []);

  return (
    <div>
      MemberList
      {members.map((member) => {
        return <MemberTile key={member.id} member={member} />;
      })}
    </div>
  );
}

interface MemberTileProps {
  member: Member;
}

export function MemberTile({ member }: MemberTileProps) {
  return <div>{member.id}</div>;
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
