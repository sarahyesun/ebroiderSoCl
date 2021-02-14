import { Ctx, SecurePassword } from "blitz";
import db from "db";
import { SignupInput, SignupInputType } from "app/auth/validations";
import { PrismaClientKnownRequestError } from "@prisma/client";

export default async function signup(input: SignupInputType, { session }: Ctx) {
  // This throws an error if input is invalid
  const { email, password } = SignupInput.parse(input);

  try {
    const hashedPassword = await SecurePassword.hash(password);
    const user = await db.user.create({
      data: { email: email.toLowerCase(), hashedPassword, role: "user" },
      select: { id: true, name: true, email: true, role: true },
    });

    await session.create({ userId: user.id, roles: [user.role] });

    return user;
  } catch (error: unknown) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      (error.meta as any)?.target?.includes("email")
    ) {
      throw new Error("This email is already being used.");
    }

    throw error;
  }
}
