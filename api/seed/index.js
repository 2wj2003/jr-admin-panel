const fs = require('fs');
const data = require('./thai_provinces.json');
var slugify = require('slugify');

const options = {
  replacement: '-', // replace spaces with replacement character, defaults to `-`
  remove: undefined, // remove characters that match regex, defaults to `undefined`
  lower: true, // convert to lower case, defaults to `false`
  strict: false, // strip special characters except replacement, defaults to `false`
  locale: 'en', // language code of the locale to use
  trim: true // trim leading and trailing replacement chars, defaults to `true`
};

async function start(){
  const provinces = data.provinces;

  const formated = provinces.map(p => ({
    name_th: p.name_th,
    name_en: p.name_en,
    slug: slugify(p.name_en, options)
  }));

        await fs.writeFile(`./format_province.json`, JSON.stringify(formated), err => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(' => File has been created');
    });
};

start();
