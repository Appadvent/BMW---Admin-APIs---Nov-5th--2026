const fs = require('fs');
const filePath = 'src/components/about.tsx';

let text = fs.readFileSync(filePath, 'utf-8');

text = text.replace(
  'className="flex flex-wrap gap-x-8 gap-y-12"',
  'className="flex flex-wrap justify-center sm:justify-start gap-x-8 gap-y-12"'
);

fs.writeFileSync(filePath, text, 'utf-8');
console.log('Success');
