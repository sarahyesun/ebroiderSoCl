import {DefaultCtx, SessionContext, SimpleRolesIsAuthorized} from 'blitz';
import {User, Role} from 'db';

export {Role};

declare module 'blitz' {
	export interface Ctx extends DefaultCtx {
		session: SessionContext;
	}
	export interface Session {
		isAuthorized: SimpleRolesIsAuthorized<Role>;
		PublicData: {
			userId: User['id'];
			roles: Role[];
		};
	}
}
