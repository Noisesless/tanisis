import fs from 'fs';
import vm from 'vm';

const filePath = 'dist/assets/default-CAKe9ffW.js';
const code = fs.readFileSync(filePath, 'utf8');

console.log('Testing evaluation of', filePath);

// Create strict browser-like context
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

// Create synthetic module for imports
const module = new vm.SourceTextModule(code, { context });

await module.link(async (specifier) => {
  return new vm.SyntheticModule(
    ['a', 'c', 'd', 'f', 'i', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'C', 'b', 'g', 'v', 'default'],
    function () {
      this.setExport('a', (type, children) => ({ type, children }));
      this.setExport('c', (type, children) => ({ type, children }));
      this.setExport('d', (type, children) => ({ type, children }));
      this.setExport('f', (type, children) => ({ type, children }));
      this.setExport('i', (type, children) => ({ type, children }));
      this.setExport('l', (type, children) => ({ type, children }));
      this.setExport('m', () => ({ useState: () => [false, () => {}], useEffect: () => {} }));
      this.setExport('n', (type, children) => ({ type, children }));
      this.setExport('o', (type, children) => ({ type, children }));
      this.setExport('p', () => ({ jsx: () => {}, jsxs: () => {}, Fragment: 'Fragment' }));
      this.setExport('r', (name, paths) => (props) => ({ name, paths, props }));
      this.setExport('s', (type, children) => ({ type, children }));
      this.setExport('t', { navGroups: [], navItems: [] });
      this.setExport('u', (type, children) => ({ type, children }));
      this.setExport('C', (fn, flag) => ({ useState: () => [false, () => {}], useEffect: () => {} }));
      this.setExport('b', () => ({}));
      this.setExport('g', () => ({ pathname: '/' }));
      this.setExport('v', () => ({ jsx: () => {}, jsxs: () => {}, Fragment: 'Fragment' }));
      this.setExport('default', {});
    },
    { context }
  );
});

await module.evaluate();
console.log('SUCCESS! Module evaluated completely without ReferenceError or syntax errors!');
