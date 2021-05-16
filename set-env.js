const { writeFile } = require('fs');
// Configure Angular `environment.ts` file path
const targetProdPath = './src/environments/environment.prod.ts';
const targetBlankPath = './src/environments/environment.ts';
// Load node modules
require('dotenv').config();
// `environment.ts` file structure
const envConfigFile = `export const environment = {
  production: true,
  secretMessage: '${process.env.SECRET_MESSAGE}',
  backURL: '${process.env.BACK_URL}',
  captchaKey: '${process.env.CAPTCHA_KEY}'
};
`;

const blankConfigFile = `export const environment = {
  production: false
};
`;
console.log('The file `environment.prod.ts` will be written with the following content: \n');
console.log(envConfigFile);
writeFile(targetProdPath, envConfigFile, function (err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(`Angular environment.prod.ts file generated correctly at ${targetProdPath} \n`);
  }
});

writeFile(targetBlankPath, blankConfigFile, function (err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(`Angular environment.ts file generated correctly at ${targetBlankPath} \n`);
  }
});
