import {PassThrough} from 'stream';
import fs from 'fs';
import path from 'path';
import executeScript from './execute-python';
import {UPLOAD_DIR} from './config';

const processImageUpload = async (fileId: string) => {
	const binaryImageStream = new PassThrough();

	await Promise.all([
		executeScript('binarize', fs.createReadStream(path.join(UPLOAD_DIR, fileId)), binaryImageStream),
		executeScript('generate_stitches', binaryImageStream, fs.createWriteStream(path.join(UPLOAD_DIR, `${fileId}.svg`)))
	]);
};

export default processImageUpload;
