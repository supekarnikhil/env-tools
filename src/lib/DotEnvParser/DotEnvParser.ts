import dotenv from "dotenv";

const DotEnvParser = (FileData: string) => dotenv.parse(FileData);

export { DotEnvParser };
