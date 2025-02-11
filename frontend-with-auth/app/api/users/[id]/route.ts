import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await prisma.account.findMany({
    where: { providerAccountId: params.id },
  });

  const currentUser = user[0];

  const selectedUser = await prisma.user.findUnique({
    where: { id: currentUser?.userId },
  });

  return NextResponse.json(selectedUser);
}
