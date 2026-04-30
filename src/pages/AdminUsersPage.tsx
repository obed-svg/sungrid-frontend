import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { useUsers } from "@/hooks/useUsers";
import type { Role } from "@/api/types";

interface UserForm {
  username: string;
  email: string;
  password: string;
  role: Role;
}

export function AdminUsersPage(): JSX.Element {
  const { users, create, deactivate } = useUsers();
  const { register, handleSubmit, reset } = useForm<UserForm>({
    defaultValues: { role: "viewer" },
  });

  const submit = handleSubmit((values) => {
    create.mutate(values, { onSuccess: () => reset({ username: "", email: "", password: "", role: "viewer" }) });
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form onSubmit={submit} className="panel p-4">
        <h2 className="text-lg font-semibold">Create User</h2>
        <label className="mt-4 block"><span className="label">Username</span><input className="field mt-2" {...register("username", { required: true })} /></label>
        <label className="mt-4 block"><span className="label">Email</span><input className="field mt-2" type="email" {...register("email")} /></label>
        <label className="mt-4 block"><span className="label">Password</span><input className="field mt-2" type="password" {...register("password", { required: true, minLength: 12 })} /></label>
        <label className="mt-4 block">
          <span className="label">Role</span>
          <select className="field mt-2" {...register("role")}>
            <option value="viewer">Viewer</option>
            <option value="operator">Operator</option>
            <option value="superadmin">SuperAdmin</option>
          </select>
        </label>
        <Button className="mt-5 w-full" disabled={create.isPending}>Create</Button>
      </form>
      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="border-b border-zinc-800 text-xs uppercase text-zinc-500">
            <tr><th className="px-3 py-3">Username</th><th>Email</th><th>Role</th><th>Active</th><th /></tr>
          </thead>
          <tbody>
            {users.data?.results.map((user) => (
              <tr key={user.id} className="border-b border-zinc-900">
                <td className="px-3 py-3">{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.is_active ? "yes" : "no"}</td>
                <td className="pr-3 text-right"><Button variant="ghost" onClick={() => deactivate.mutate(user.id)}>Deactivate</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

