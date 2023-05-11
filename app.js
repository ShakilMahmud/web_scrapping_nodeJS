const axios = require('axios');
const cheerio = require('cheerio');
const pretty = require('pretty');

const fs = require('fs');

// URL of the page we want to scrape
// const url =
//   'https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-+2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc';

// Async function which scrapes the data

async function scrapeTruckItem(url) {
  try {
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    const listItems = $('article');
    // console.log(pretty($.html()));
    // const rol = $(listItems).attr('role');
    // console.log(listItems.length);
    const trucks = [];

    listItems.each((idx, el) => {
      const truck = {
        id: '',
        title: '',
        price: '',
        date: '',
        mileage: '',
        power: '',
      };

      truck.id = $(el).attr('id');
      truck.title = $(el)
        .children('div')
        .children('h2')
        .children('a')
        .text();
      truck.price = $(el)
        .children('div')
        .children('div')
        .children('span')
        .text();

      truck.date = $(el)
        .children('div')
        .children('div')
        .children('ul')
        .children('li:eq(0)')
        .text();

      //   console.log(
      //     $(el)
      //       .children('div')
      //       .children('div')
      //       .children('ul')
      //       .children('li:eq(0)')
      //       .text()
      //   );

      truck.mileage = $(el)
        .children('div')
        .children('div')
        .children('ul')
        .children('li:eq(1)')
        .text();

      truck.power = $(el)
        .children('div')
        .children('div')
        .children('ul')
        .children('li:eq(2)')
        .text();

      trucks.push(truck);
    });

    // console.log(trucks);

    return trucks;

    // console.dir(trucks);

    // Write Trucks array in countries.json file
  } catch (err) {
    console.error(err);
  }
}

async function getTotalAdsCount() {
  try {
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    const listItems = $('article');
    // console.log(pretty($.html()));
    // const rol = $(listItems).attr('role');
    console.log(listItems.length);
    // const countries = [];

    // listItems.each((idx, el) => {
    //   const country = { role: '', url: '' };

    //   const role = $(el).attr('id');
    //   if (role === 'google-center-div') {
    //     country.url = 1;
    //     countries.push(country);
    //   }
    //   country.url = $(el)
    //     .children('div')
    //     .children('h2')
    //     .children('a')
    //     .attr('href');

    //   countries.push(country);
    // });

    // console.dir(countries);
  } catch (err) {
    console.error(err);
  }
}

async function addItems() {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line

    // console.log(data);

    const $ = cheerio.load(data);

    // Select all the list items in plainlist class
    // const listItems = $('.ooa-1hab6wx');
    const listItems = $('article');
    console.log(listItems.length);
    const countries = [];
    // Use .each method to loop through the li we selected
    listItems.each((idx, el) => {
      // Object holding data for each country/jurisdiction
      const country = { id: '', url: '' };
      // Select the text content of a and span elements
      // Store the textcontent in the above object
      country.id = $(el).attr('id');
      country.url = $(el)
        .children('div')
        .children('h2')
        .children('a')
        .attr('href');
      // Populate countries array with country data
      countries.push(country);
    });
    // Logs countries array to the console
    console.dir(countries);
    // Write countries array in countries.json file
    // fs.writeFile(
    //   'coutries.json',
    //   JSON.stringify(countries, null, 2),
    //   (err) => {
    //     if (err) {
    //       console.error(err);
    //       return;
    //     }
    //     console.log('Successfully written data to file');
    //   }
    // );
  } catch (err) {
    console.error(err);
  }
}
// Invoke the above function
// addItems();
// getTotalAdsCount();

async function getNextPageUrl() {
  try {
    const url =
      'https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-+2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc';

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const trucks1 = [];
    const listItems = $('.pagination-list')
      .children('li:eq(5)')
      .text();
    const trr = await scrapeTruckItem(url);
    trucks1.push(trr);
    for (let i = 2; i <= parseInt(listItems); i++) {
      const murl = `https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-+2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc&page=${i}`;
      const truck1 = await scrapeTruckItem(murl);
      console.log(truck1);
      trucks1.push(truck1);
    }

    fs.writeFile(
      'trucks.json',
      JSON.stringify(trucks1, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('Successfully written data to file');
      }
    );

    // console.log(listItems);
  } catch (err) {
    console.error(err);
  }
}

// scrapeTruckItem();

getNextPageUrl();
