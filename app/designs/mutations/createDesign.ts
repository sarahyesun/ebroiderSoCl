import {Ctx} from 'blitz';
import db from 'db';
import processImageUpload from 'utils/process-image-upload';

export default async function createDesign(
	{
		name,
		description,
		isPublic,
		pictureIds,
		fileIds
	}: { name: string; description: string; isPublic: boolean; pictureIds: string[]; fileIds: string[] },
	ctx: Ctx
) {
	ctx.session.$authorize();

	const files = await db.file.findMany({
		where: {
			id: {
				in: fileIds
			}
		}
	});

	const design = await db.design.create({
		data: {
			name,
			description,
			isPublic,
			price: 0,
			user: {
				connect: {
					id: ctx.session.userId
				}
			},
			pictures: {
				connectOrCreate: pictureIds.map((id, i) => ({
					where: {id},
					create: {
						id,
						order: i
					}
				}))
			},
			files: {
				connect: fileIds.map(id => ({id}))
			}
		}
	});

	await processImageUpload(design, files[0].id);

	return design;
}
