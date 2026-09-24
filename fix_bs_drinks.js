const fs = require('fs');
const p = JSON.parse(fs.readFileSync('src/data/products.json'));

p.forEach(x => {
  if (x.businessId === 'BS' && x.category === 'Bebidas') {
    const name = x.name.toLowerCase();
    if (name.includes('frappé') || name.includes('frappe')) {
      x.subcategory = 'Frappé';
    } else if (name.includes('helado') || name.includes('smoothie') || name.includes('malteada')) {
      x.subcategory = 'Frías';
    } else if (name.includes('caliente')) {
      x.subcategory = 'Calientes';
    } else {
      x.subcategory = 'Otros';
    }
  }
});

fs.writeFileSync('src/data/products.json', JSON.stringify(p, null, 2));
