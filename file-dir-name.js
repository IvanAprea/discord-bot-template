import { fileURLToPath } from "url";
import { dirname } from "path";

export default function fileDirName() {

	const __filename = fileURLToPath(import.meta.url);

	const __dirname = dirname(__filename);

	return { __dirname, __filename };
}
