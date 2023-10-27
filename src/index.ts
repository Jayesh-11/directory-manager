#! /usr/bin/env node

import { Command } from "commander";
import figlet from "figlet";
import path, { dirname } from "path";
import fs from "fs";
import chalk from 'chalk'
import { fileURLToPath } from "url";

const program = new Command()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

program
  .version('1.0.0')
  .description("Very simple directory manager")
  .option("-l, --ls  [value]", "List directory contents")
  .option("-m, --mkdir <value>", "Create a directory")
  .option("-t, --touch <value>", "Create a file")
  .parse(process.argv);

const options = program.opts();

const listDirContent = async (filePath: string) => {
  try {
    const files = await fs.promises.readdir(filePath);
    const filesData = files.map(async (file: string) => {
      const fileDetails = await fs.promises.lstat(path.resolve(filePath, file))
      const { size, birthtime } = fileDetails
      return { fileName: file, size, createdAt: birthtime }
    })
    const filesToTable = await Promise.all(filesData)
    console.log(filesToTable)
  } catch (e) {
    console.error("Error occurred while reading the directory!", e)
  }
}

const makeDir = (filestring: string) => {
  if (!fs.existsSync(filestring)) {
    fs.mkdirSync(filestring)
    console.log("The directory has been created successfully");
  }
}

const makeFile = (filestring: string) => {
  fs.openSync(filestring, "w");
  console.log("An empty file has been created");
}

if (options.ls) {
  const filepath = typeof options.ls === 'string' ? options.ls : __dirname
  listDirContent(filepath)
}

if (options.mkdir) {
  makeDir(path.resolve(__dirname, options.mkdir))
}

if (options.touch) {
  makeFile(path.resolve(__dirname, options.touch))
}

console.log(chalk.white(figlet.textSync("Dir-manager", {
  font: "Ghost",
  horizontalLayout: "default",
  verticalLayout: "default",
  width: 80,
  whitespaceBreak: true,
})))

if (!process.argv.slice(2).length) {
  program.outputHelp();
}