import fs from 'fs';
import vm from 'vm';

const filePath = 'dist/assets/admin-C9Dakcgq.js';
const code = fs.readFileSync(filePath, 'utf8');

console.log('Testing evaluation of', filePath);

const context = vm.createContext({
  window: {
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {}
  },
  document: {},
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  },
  sessionStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  },
  Event: class Event {},
  console
});

const module = new vm.SourceTextModule(code, { context });

await module.link(async (specifier) => {
  return new vm.SyntheticModule(
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'default'],
    function () {
      const dummy = () => ({});
      ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'default'].forEach(k => {
        this.setExport(k, dummy);
      });
    },
    { context }
  );
});

await module.evaluate();
console.log('SUCCESS! Admin module evaluated cleanly without errors!');
