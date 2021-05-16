const { writeFile } = require('fs');
// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.prod.ts';
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
console.log('The file `environment.prod.ts` will be written with the following content: \n');
console.log(envConfigFile);
writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
  }
});
