import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';
import { UPLOAD_DIR } from 'utils/config';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {query: { id }} = req;

  if (req.query.type) {
    res.setHeader('Content-Type', req.query.type)
  }

  const uploadPath = path.join(UPLOAD_DIR, id as string);

  try {
    await fs.promises.access(uploadPath)
  } catch {
    res.status(404).end();
    return;
  }

  fs.createReadStream(uploadPath).pipe(res);
}
