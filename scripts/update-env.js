const fs = require('fs');
const targetPath = './src/environments/environment.ts';

console.log('API2_URL.length='+(`${process.env.API2_URL}`.length));

const envConfigFile = `
export const environment = {
  api: '${process.env.API_URL}',
  api2: '${process.env.API2_URL}'
};
`;

fs.writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    console.error('Erro ao escrever o arquivo de ambiente:', err);
  } else {
    console.log('Arquivo de ambiente criado com sucesso!');
  }
});
