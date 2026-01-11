const path = require('path');
const fs = require('fs');
const filename = process.argv[2] || '1767820357523-345659020.jpg';
const p = path.join(__dirname, 'uploads', filename);
console.log('Checking file:', p);
try {
  const st = fs.statSync(p);
  console.log('Exists:', true);
  console.log('Size:', st.size, 'bytes');
  console.log('Mode:', (st.mode & 0o777).toString(8));
} catch (e) {
  console.error('Exists: false');
  console.error(e.message);
  process.exitCode = 2;
}
