import { DotEnvParser } from "@root/lib/DotEnvParser";
import { readFile } from "@root/lib/FileManager";

function DotEnvFileLoader(FilePath: string, charEncoding: BufferEncoding = "utf-8") {
  try {
    const FileData = readFile(FilePath, charEncoding);
    return DotEnvParser(FileData);
  } catch (e) {
    return {};
  }
}

export { DotEnvFileLoader };
