import {Ctx} from 'blitz';
import db, {Prisma} from 'db';

type UpdateDesignInput = Pick<Prisma.DesignUpdateArgs, 'where' | 'data'>;

export default async function updateDesign(
	{where, data}: UpdateDesignInput,
	ctx: Ctx
) {
	ctx.session.$authorize();

	const design = await db.design.update({where, data});

	return design;
}
