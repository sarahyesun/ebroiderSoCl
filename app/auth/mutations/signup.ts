import { Ctx, SecurePassword } from "blitz"
import db from "db"
import { SignupInput, SignupInputType } from "app/auth/validations"

export default async function signup(input: SignupInputType, { session }: Ctx) {
  // This throws an error if input is invalid
  const { email, password } = SignupInput.parse(input)

  try {
    const hashedPassword = await SecurePassword.hash(password)
    const user = await db.user.create({
      data: { email: email.toLowerCase(), hashedPassword, role: "user" },
      select: { id: true, name: true, email: true, role: true },
    })

    await session.create({ userId: user.id, roles: [user.role] })

    return user
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      throw new Error("This email is already being used.")
    } else {
      throw error
    }
  }
}
