import { Ctx } from "blitz"
import db, { Prisma } from "db"

export default async function createDesign(
  { name, description, isPublic }: { name: string; description: string; isPublic: boolean },
  ctx: Ctx
) {
  ctx.session.authorize()

  const design = await db.design.create({
    data: {
      name,
      description,
      isPublic,
      price: 0,
      user: {
        connect: {
          id: ctx.session.userId,
        },
      },
    },
  })

  return design
}
