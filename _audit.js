const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const f of files) {
  const t = fs.readFileSync(f, 'utf8');
  const css = [...t.matchAll(/href="css\/([^"]+)"/g)].map(m => m[1]);
  const js = [...t.matchAll(/src="js\/([^"]+)"/g)].map(m => m[1]);
  console.log(f.padEnd(22) + ' CSS[' + css.join(',') + ']');
  console.log(' '.repeat(22) + ' JS[' + js.join(',') + ']');
}
