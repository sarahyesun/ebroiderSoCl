import {DefaultCtx, SessionContext} from 'blitz';
import {SimpleRolesIsAuthorized} from '@blitzjs/server';
import {User} from 'db';
import {Role} from '@prisma/client';

export {Role};

declare module 'blitz' {
	export interface Ctx extends DefaultCtx {
		session: SessionContext;
	}
	export interface Session {
		isAuthorized: SimpleRolesIsAuthorized<Role>;
		PublicData: {
			userId: User['id'];
			roles: Role;
		};
	}
}
