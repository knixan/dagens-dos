import { prisma } from "@/lib/prisma";
import DeleteButton from "./delete-button";
import { requireAdminOrEditor } from "@/lib/server-auth";

export default async function DeleteCategoryPage() {

    await requireAdminOrEditor();
    const categories = await prisma.category.findMany();
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Delete Category</h1>
            <ul className="space-y-4">
                {categories.map((category) => (
                    <li key={category.id} className="flex items-center gap-4">
                        <span>{category.name}</span>
                        <DeleteButton id={category.id} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
