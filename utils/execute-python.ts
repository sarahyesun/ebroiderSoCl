import execa from 'execa';
import {WriteStream} from 'fs';
import {Stream} from 'stream';
import {SCRIPTS_DIR} from './config';

const executeScript = async (scriptName: string, inStream: Stream, outStream: WriteStream) => {
	const spawnedChild = execa(`python3 ${SCRIPTS_DIR}/${scriptName}.py`, {shell: true});

	inStream.pipe(spawnedChild.stdin!);
	spawnedChild.stdout?.pipe(outStream);

	await spawnedChild;
};

export default executeScript;
