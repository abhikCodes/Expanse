import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  const users = await prisma.user.findMany({ where: { role: "student" } });
  const providers = await prisma.account.findMany();

  const commonUsers = users
    // .filter((user) => providers.some((provider) => provider.userId === user.id))
    .map((user) => {
      const provider = providers.find((p) => p.userId === user.id);
      return {
        name: user.name,
        id: provider?.providerAccountId,
      };
    });
  return NextResponse.json(commonUsers);
}
