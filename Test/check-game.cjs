// Lightweight DOM simulation: game logic and settings, not browser layout/audio.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
class Element {
  constructor() { this.value = ''; this.children = []; this.handlers = {}; this.style = {setProperty() {}}; this.dataset = {}; }
  addEventListener(name, fn) { this.handlers[name] = fn; }
  setAttribute(name, value) { this[name] = value; }
  append(child) { this.children.push(child); }
  replaceChildren() { this.children = []; }
  reportValidity() { return true; }
}
const elements = {};
const document = {querySelector: id => elements[id] ||= new Element(), createElement: () => new Element(), body: new Element()};
const context = vm.createContext({document, window: {}, console});
vm.runInContext(fs.readFileSync(__dirname + '/game/script.js', 'utf8'), context);
const run = code => vm.runInContext(code, context);
assert.equal(run('cells.length'), 81);
for (const size of [2, 9, 16, 30]) {
  for (const mines of [0, Math.floor(size * size / 2)]) {
    elements['#size'].value = String(size);
    elements['#mines'].value = String(mines);
    elements['#settings'].handlers.submit({preventDefault() {}, currentTarget: elements['#settings']});
    assert.equal(run('cells.length'), size * size);
    run('reveal(0)');
    assert.equal(run('cells.filter(c => c.mine).length'), mines);
    assert.equal(run('cells[0].mine'), false);
    if (!mines) {
      assert.equal(run('ended'), true);
      assert.equal(run('cells.filter(c => c.open).length'), size * size);
    } else {
      run('reveal(cells.findIndex(c => c.mine))');
      assert.equal(run('ended'), true);
      const count = run('cells.filter(c => c.open).length');
      run('reveal(cells.findIndex(c => !c.open && !c.mine))');
      assert.equal(run('cells.filter(c => c.open).length'), count);
    }
  }
}
elements['#size'].value = '9';
elements['#standard'].handlers.click();
assert.equal(Number(elements['#mines'].value), 10);
elements['#mines'].value = '400';
elements['#size'].value = '2';
elements['#size'].handlers.input();
assert.equal(Number(elements['#mines'].value), 2);
run('reset(); toggleFlag(0); reveal(0)');
assert.equal(run('cells[0].open'), false);
run('toggleFlag(0); reveal(0)');
assert.equal(run('cells[0].open'), true);
elements['#theme'].handlers.change({target: {value: 'ocean'}});
assert.equal(document.body.dataset.theme, 'ocean');
console.log('PASS: size, mine bounds, zero mines, safe start, loss lock, flags, preset, theme');
