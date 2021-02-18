import { Ctx, NotFoundError } from "blitz";
import db, { Prisma } from "db";

type GetDesignInput = Pick<Prisma.FindFirstDesignArgs, "where">;

export default async function getDesign({ where }: GetDesignInput, ctx: Ctx) {
  ctx.session.$authorize();

  const design = await db.design.findFirst({ where });

  if (!design) {
    throw new NotFoundError();
  }

  return design;
}
