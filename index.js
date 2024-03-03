const { argv } = require('node:process');
const fs = require('node:fs').promises;

const inputFile = argv[2];

const mdProcessor = async (fileName) => {
  const data = await fs.readFile(fileName, 'utf-8');
  console.log(data);
}

mdProcessor(inputFile).catch((error) => {
  console.log(error);
});
