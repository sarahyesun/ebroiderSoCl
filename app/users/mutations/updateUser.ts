import {Ctx} from 'blitz';
import db, {Prisma} from 'db';

type UpdateUserInput = Pick<Prisma.UserUpdateArgs, 'where' | 'data'>;

export default async function updateUser({where, data}: UpdateUserInput, ctx: Ctx) {
	ctx.session.$authorize('ADMIN');

	const user = await db.user.update({
		where,
		data,
		select: {id: true, name: true, email: true, role: true}
	});

	return user;
}
