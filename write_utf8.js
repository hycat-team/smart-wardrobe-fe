const fs = require('fs');

function main() {
  const targetPath = process.argv[2];
  const b64File = process.argv[3];
  if (!targetPath || !b64File) {
    console.error('Usage: node write_utf8.js <targetPath> <b64File>');
    process.exit(1);
  }
  const b64 = fs.readFileSync(b64File, 'utf8').trim();
  const buffer = Buffer.from(b64, 'base64');
  fs.writeFileSync(targetPath, buffer);
  console.log('Successfully wrote', targetPath, buffer.length, 'bytes');
}

main();
