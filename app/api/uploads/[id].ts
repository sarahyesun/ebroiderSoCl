import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';
import { UPLOAD_DIR } from 'utils/config';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const {query: { id }} = req;

  // TODO: add auth

  if (req.query.type) {
    res.setHeader('Content-Type', req.query.type)
  }

  fs.createReadStream(path.join(UPLOAD_DIR, id as string)).pipe(res);
}
