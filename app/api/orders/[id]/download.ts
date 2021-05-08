import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import {UPLOAD_DIR} from 'utils/config';
import prisma from 'db';
import mimeToExtension from 'utils/mime-to-extension';
import {BlitzApiHandler, getSession} from 'blitz';

const handleDownloadRequest: BlitzApiHandler = async (request, response) => {
	const {userId, roles} = await getSession(request, response);

	const {query: {id}} = request;

	const order = await prisma.order.findUnique({
		where: {
			id: id as string
		},
		include: {
			cart: {
				include: {
					items: {
						include: {
							design: {
								include: {
									files: true
								}
							}
						}
					}
				}
			}
		}
	});

	if (!order) {
		response.status(404).end();
		return;
	}

	if (!(order.cart.userId === userId || order.assignedToId === userId || roles?.includes('ADMIN'))) {
		response.status(401).end();
		return;
	}

	response.setHeader('Content-Disposition', `attachment; filename=${order.id}.zip`);

	const archive = archiver('zip', {zlib: {level: 9}});

	for (const design of order.cart.items.map(i => i.design)) {
		const pathPrefix = design.name;

		for (const f of design.files) {
			archive.append(
				fs.createReadStream(path.join(UPLOAD_DIR, f.id)),
				{name: `${pathPrefix}/${design.name}.${mimeToExtension(f.type)}`}
			);
		}
	}

	archive.pipe(response);
	await archive.finalize();
};

export default handleDownloadRequest;
