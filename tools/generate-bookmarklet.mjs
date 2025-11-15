import fs from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function readEnv() {
  const dotenvPath = path.join(root, '.env.local');
  let env = {};
  if (fs.existsSync(dotenvPath)) {
    const txt = fs.readFileSync(dotenvPath, 'utf-8');
    txt.split(/\r?\n/).forEach((line) => {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) env[m[1]] = m[2];
    });
  }
  return env;
}

function minify(js) {
  return js
    .replace(/\n+/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*\{\s*/g, '{')
    .replace(/\s*\}\s*/g, '}')
    .replace(/\s*\(\s*/g, '(')
    .replace(/\s*\)\s*/g, ')')
    .trim();
}

function buildBookmarklet(selectors, values) {
  const code = `
(function(){
  var p='${values.PROPERTY_VALUE}',a='${values.APARTMENT}',l='${values.PLATE}',m='${values.MAKE}',md='${values.MODEL}',c='${values.COLOR}',s='${values.STATE_LABEL}';
  function f(sel,val){var e=document.querySelector(sel);if(!e)return!1;e.value=val;e.dispatchEvent(new Event('input',{bubbles:!0}));return!0}
  function btn(t){return Array.from(document.querySelectorAll('button,input[type=button],input[type=submit],a')).find(function(e){return ((e.innerText||e.value||'')+'').trim().toLowerCase()===t.toLowerCase()})}
  function b(t){var e=btn(t);if(e){e.click();return!0}return!1}
  function w(sel,to){to=to||7e3;return new Promise(function(r,j){var st=Date.now(),i=setInterval(function(){var e=document.querySelector(sel);if(e){clearInterval(i);r(e)}else if(Date.now()-st>to){clearInterval(i);j(new Error('Timeout '+sel))}},100)})}
  (async function(){try{
    var prop=await w('${selectors.propertySelect}',7000);prop.value=p;prop.dispatchEvent(new Event('change',{bubbles:!0}));
    var apt=await w('${selectors.apartmentInput}',7000);apt.value=a;apt.dispatchEvent(new Event('input',{bubbles:!0}));
    b('${selectors.nextButtonText}');
    await new Promise(function(r){setTimeout(r,1200)});
    f('${selectors.plateInput}',l);f('${selectors.makeInput}',m);f('${selectors.modelInput}',md);f('${selectors.colorInput}',c);
    var state=document.querySelector('${selectors.stateSelect}');
    if(state){var opt=Array.from(state.options).find(function(o){return ((o.textContent||'')+'').trim().toLowerCase()===s.toLowerCase()});if(opt){state.value=opt.value;state.dispatchEvent(new Event('change',{bubbles:!0}))}}
    b('${selectors.nextButtonText}');
    await new Promise(function(r){setTimeout(r,1200)});
    b('${selectors.nextButtonText}');
    await new Promise(function(r){setTimeout(r,1200)});
    var review=document.querySelector('${selectors.reviewPlateInput}');if(review){review.value=l;review.dispatchEvent(new Event('input',{bubbles:!0}))}
    var cb=document.querySelector('${selectors.confirmCheckbox}');if(cb&&!cb.checked)cb.click();
    b('${selectors.submitButtonText}');
  }catch(e){/* silent */}})();
})();
`;
  return 'javascript:' + minify(code);
}

function main() {
  const selectorsPath = path.join(root, 'selectors-marq.json');
  if (!fs.existsSync(selectorsPath)) throw new Error('selectors-marq.json not found. Run tests first.');
  const selectors = JSON.parse(fs.readFileSync(selectorsPath, 'utf-8'));
  const values = readEnv();

  const bookmarklet = buildBookmarklet(selectors, values);
  const outDir = path.join(root, 'dist');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  fs.writeFileSync(path.join(outDir, 'bookmarklet.txt'), bookmarklet, 'utf-8');
  console.log('Bookmarklet written to dist/bookmarklet.txt');
}

main();


