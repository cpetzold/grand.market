import cards from './cards';

function sanitize(cards) {
  return cards.map(c => {
    c.set = c.expansion.toLowerCase();
    c.types = c.type.split(' - ').map(s => s.toLowerCase());
    c.image = c.image.substr(7);

    const [$, p] = c.cost.split(' ');

    c.coinCost = parseInt($.substr(1));
    c.potionCost = p && parseInt(p.substr(0, 1));

    delete c.cost;
    delete c.type;
    delete c.expansion;

    return c;
  });
}

console.log(JSON.stringify(sanitize(cards), null, '  '));
