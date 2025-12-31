// prisma/seed.ts
import { prisma } from "../lib/prisma"; // if you do NOT have /src

async function main() {
  const myEmail = "hasanhuda037@gmail.com"; // <-- change this

  const user = await prisma.user.findUnique({
    where: { email: myEmail },
  });

  if (!user) {
    throw new Error(
      `No user found with email ${myEmail}. Sign in once first so NextAuth creates the User row.`
    );
  }

  // 1) Upsert workspace
  const workspace = await prisma.workspace.upsert({
    where: { name: "Demo High School" }, // requires Workspace.name to be unique (see note below)
    update: {},
    create: { name: "Demo High School" },
  });

  // 2) Upsert schedule (unique per workspace)
  const schedule = await prisma.schedule.upsert({
    where: {
      workspaceId_name: {
        workspaceId: workspace.id,
        name: "HS 2025–26 Demo",
      },
    },
    update: {
      daysOfWeek: "Mon,Tue,Wed,Thu,Fri",
      periods: 8,
    },
    create: {
      workspaceId: workspace.id,
      name: "HS 2025–26 Demo",
      daysOfWeek: "Mon,Tue,Wed,Thu,Fri",
      periods: 8,
    },
  });

  // 3) Upsert membership
  await prisma.userWorkspaceRole.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: user.id,
      },
    },
    update: { role: "ADMIN" },
    create: {
      workspaceId: workspace.id,
      userId: user.id,
      role: "ADMIN",
    },
  });

  console.log("✅ Seed complete:", {
    workspaceId: workspace.id,
    scheduleId: schedule.id,
    userId: user.id,
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
