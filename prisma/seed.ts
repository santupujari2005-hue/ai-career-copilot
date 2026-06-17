import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const skills = [
  { name: "JavaScript", category: "Frontend", difficulty: "beginner" },
  { name: "TypeScript", category: "Frontend", difficulty: "intermediate" },
  { name: "React", category: "Frontend", difficulty: "intermediate" },
  { name: "Next.js", category: "Frontend", difficulty: "intermediate" },
  { name: "Node.js", category: "Backend", difficulty: "intermediate" },
  { name: "Python", category: "Backend", difficulty: "beginner" },
  { name: "PostgreSQL", category: "Database", difficulty: "intermediate" },
  { name: "Docker", category: "DevOps", difficulty: "intermediate" },
  { name: "AWS", category: "Cloud", difficulty: "advanced" },
  { name: "Machine Learning", category: "AI", difficulty: "advanced" },
  { name: "TensorFlow", category: "AI", difficulty: "advanced" },
  { name: "Data Analysis", category: "Data", difficulty: "intermediate" },
  { name: "Git", category: "Tools", difficulty: "beginner" },
  { name: "System Design", category: "Architecture", difficulty: "advanced" },
  { name: "CI/CD", category: "DevOps", difficulty: "intermediate" },
];

async function main() {
  console.log("Seeding skills...");

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: skill,
      create: skill,
    });
  }

  console.log(`Seeded ${skills.length} skills`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
