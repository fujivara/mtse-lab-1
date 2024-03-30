const { argv } = require('node:process');
const { mdProcessor } = require("./mdProcessor");

const fileName = argv[2];
const [key, format] = argv[3]?.split('=');

mdProcessor(fileName, format).then((data) => {
  data.forEach((chunk) => {
    console.log(chunk);
  });
})
