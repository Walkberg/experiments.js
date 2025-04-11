import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useCallback, useEffect, useState } from "react";
import { useKey } from "@/modules/mynotary-clone/hooks/useKey";
import { useForm } from "react-hook-form";
import { User, UserNew } from "../user";
import { UsersProvider, useUsers } from "../providers/UserPersistenceProvider";
import { useUserClient } from "../providers/UserClientProvider";
import { CalendarIcon, MailIcon, UserIcon } from "lucide-react";
import { format } from "date-fns";

export function UsersPage() {
  return (
    <UsersProvider>
      <div className="flex flex-grow flex-col gap-2">
        <div>
          <UserAdd />
        </div>
        <div>
          <UserList />
        </div>
      </div>
    </UsersProvider>
  );
}

type FormValues = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export function UserAdd() {
  const [open, setOpen] = useState<boolean>(false);

  const { addUser } = useUsers();
  const { createUser } = useUserCreation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: "onChange" });

  useKey(["u"], () => setOpen(true));

  const handleUserCreated = (user: User) => {
    addUser(user);
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    createUser(
      { email: data.email, firstname: data.firstName, lastname: data.lastName },
      {
        onUserCreated: handleUserCreated,
      }
    );
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button>Ajouter un utilisateur</Button>
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
            <Input
              placeholder="Prénom"
              {...register("firstName", {
                required: "Le prénom est requis",
              })}
            />
            {errors.firstName && (
              <span className="text-sm text-red-500">
                {errors.firstName.message}
              </span>
            )}
            <Input
              placeholder="Nom"
              {...register("lastName", {
                required: "Le nom est requis",
              })}
            />
            {errors.lastName && (
              <span className="text-sm text-red-500">
                {errors.lastName.message}
              </span>
            )}

            <Button disabled={!isValid} type="submit">
              Créer
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function UserList() {
  const { fetchUsers } = useFetchUsers();
  const { users, setUsers } = useUsers();

  useEffect(() => {
    fetchUsers({
      onUserFetched: setUsers,
    });
  }, [fetchUsers]);

  return (
    <div>
      UserList
      <div className="flex flex-col gap-2">
        {users.map((user) => {
          return <UserTile key={user.id} user={user} />;
        })}
      </div>
    </div>
  );
}

interface UserTileProps {
  user: User;
}

export function UserTile({ user }: UserTileProps) {
  return (
    <Card className="flex items-center justify-between p-4 hover:shadow-md transition-shadow rounded-xl">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 text-primary p-2 rounded-full">
          <UserIcon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-lg font-semibold">
            {user.firstname} {user.lastname}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MailIcon className="w-4 h-4" />
            {user.email}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarIcon className="w-4 h-4" />
        {format(new Date(user.creationDate), "dd/MM/yyyy")}
      </div>
    </Card>
  );
}

type Status = "idle" | "loading" | "error" | "success";

type FetchUserOption = {
  onFetchUsers?: () => Promise<void>;
  onUserFetched?: (users: User[]) => void;
  onUserFetchedError?: () => Promise<void>;
};

export function useFetchUsers() {
  const [status, setStatus] = useState<Status>("idle");
  const client = useUserClient();

  const fetchUsers = useCallback(async (options?: FetchUserOption) => {
    try {
      setStatus("loading");
      options?.onFetchUsers?.();
      const users = await client.getUsers();
      setStatus("success");
      options?.onUserFetched?.(users);
    } catch (error) {
      options?.onUserFetchedError?.();
      setStatus("error");
    }
  }, []);

  return { fetchUsers, status };
}

type CreateOption = {
  onCreateUsers?: () => Promise<void>;
  onUserCreated?: (user: User) => void;
  onUserCreateError?: () => Promise<void>;
};

export function useUserCreation() {
  const [status, setStatus] = useState<Status>("idle");
  const client = useUserClient();

  const createUser = useCallback(
    async (userNew: UserNew, options?: CreateOption) => {
      try {
        setStatus("loading");
        options?.onCreateUsers?.();
        const user = await client.createUser(userNew);
        setStatus("success");
        options?.onUserCreated?.(user);
      } catch (error) {
        options?.onUserCreateError?.();
        setStatus("error");
      }
    },
    []
  );

  return { createUser, status };
}
