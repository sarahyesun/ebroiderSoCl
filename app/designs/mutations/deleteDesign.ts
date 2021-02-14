import { Ctx } from "blitz";
import db, { Prisma } from "db";

type DeleteDesignInput = Pick<Prisma.DesignDeleteArgs, "where">;

export default async function deleteDesign(
  { where }: DeleteDesignInput,
  ctx: Ctx
) {
  ctx.session.authorize();

  const design = await db.design.delete({ where });

  return design;
}
