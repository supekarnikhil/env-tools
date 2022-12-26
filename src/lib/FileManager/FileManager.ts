import fs from "fs";

const appendFile = (filePath: string, fileData: string) => {
  fs.appendFileSync(filePath, fileData);
};

const copyFile = (sourceFilePath: string, destinationFilePath: string) => {
  fs.copyFileSync(sourceFilePath, destinationFilePath);
};

const renameFile = (sourceFilePath: string, destinationFilePath: string) => {
  fs.renameSync(sourceFilePath, destinationFilePath);
};

const readFile = (FilePath: string, charEncoding: BufferEncoding) =>
  fs.readFileSync(FilePath, { encoding: charEncoding });

const writeFile = (FilePath: string, fileData: string) => {
  fs.writeFileSync(FilePath, fileData);
};

const fileExists = (filePath: string) => fs.existsSync(filePath);

const deleteFile = (filePath: string) => fs.rmSync(filePath);

export { appendFile, copyFile, renameFile, writeFile, fileExists, readFile, deleteFile };
