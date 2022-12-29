import { DotEnvParser } from "../DotEnvParser";
import { readFile } from "../FileManager";

function DotEnvFileLoader(FilePath: string, charEncoding: BufferEncoding = "utf-8") {
  try {
    const FileData = readFile(FilePath, charEncoding);
    return DotEnvParser(FileData);
  } catch (e) {
    return {};
  }
}

export { DotEnvFileLoader };
