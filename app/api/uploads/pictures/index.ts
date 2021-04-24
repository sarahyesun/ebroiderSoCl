import {NextApiRequest, NextApiResponse} from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import {nanoid} from 'nanoid';
import {promises as fs} from 'fs';
import path from 'path';
import {UPLOAD_DIR} from 'utils/config';
import db from 'db';

const route = nextConnect<NextApiRequest, NextApiResponse>();

route.use(multer().array('picture'));

route.post(async (request, response) => {
  const ids = await Promise.all((request as any).files.map(async (file: any, i: number) => {
    const id = nanoid();

    await fs.writeFile(path.join(UPLOAD_DIR, id), file.buffer);

    await db.picture.create({
      data: {
        id,
        order: i
      }
    });

    return id;
  }))

	response.status(200).json({ids});
});

export default route;

export const config = {
	api: {
		bodyParser: false // Disallow body parsing, consume as stream
	}
};
