import LinkButton from "@/components/Buttons/LinkButton";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import SearchForm from "@/components/Forms/SearchForm";
import { requireAdmin } from "@/lib/server-auth";
import DeleteButton from "./ta-bort/delete-button";
import RoleSelect from "@/components/Admin/RoleSelect";

export default async function AdminAnvandarePage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const q = params?.q ?? "";
  const where = q
    ? {
        OR: [{ email: { contains: q } }, { name: { contains: q } }],
      }
    : undefined;

  const users = await prisma.user.findMany({
    where,
    select: { id: true, name: true, email: true, role: true },
  });

  return (
    <>
      <Navbar />
      <main className="flex grow pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6">Admin: Användare</h1>
          <div className="flex gap-4 mb-6 items-center">
            <SearchForm
              defaultValue={q}
              placeholder="Sök användare (namn eller e-post)..."
              className="flex gap-2"
            />
            <div className="ml-auto flex gap-2">
              {/* Optionellt: länk till skapa användare om du vill implementera det */}
              <LinkButton href="/admin/anvandare/skapa" variant="primary">
                Skapa
              </LinkButton>
            </div>
          </div>

          <ul className="space-y-4">
            {users.map((u) => (
              <li key={u.id} className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{u.name ?? u.email}</div>
                  <div className="text-sm text-muted-foreground">
                    {u.email} • {u.role}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <LinkButton
                    href={`/admin/anvandare/redigera/${u.id}`}
                    variant="primary"
                  >
                    Redigera
                  </LinkButton>
                  {/* Dropdown för att ändra roll */}
                  <RoleSelect id={u.id} initialRole={u.role ?? "USER"} />

                  <DeleteButton id={u.id} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
