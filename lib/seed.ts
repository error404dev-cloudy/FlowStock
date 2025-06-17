import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const categories = [
        {id: "f", name: "Fruits" },
        {id: "fl", name: "Féculents" },
        {id: "l", name: "Lait" },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { id: cat.id },
            update: {},
            create: cat,
        });
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());