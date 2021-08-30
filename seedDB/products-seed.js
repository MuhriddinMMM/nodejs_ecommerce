const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const Product = require("../models/product");
const Category = require("../models/category");
const mongoose = require("mongoose");
const faker = require("faker");
const connectDB = require("./../config/db");
connectDB();

async function seedDB() {
  faker.seed(0);

  //----------------------Backpacks
  const backpacks_titles = [
    "Classic Blue Backpack",
    "Black Fjallraven Backpack",

  ];
  const backpacks_imgs = [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
    "https://images.unsplash.com/photo-1562546106-b9cb3a76a206?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1534&q=80"
  ];



  //--------------------Briefcases
  const briefcases_titles = [
    "Aluminium Metal Suitcase",
    "Black Leather Durable Suitcase",
  ];

  const briefcases_imgs = [
    "https://upload.wikimedia.org/wikipedia/commons/6/6d/Aluminium_Briefcase.jpg",
    "http://res.freestockphotos.biz/pictures/1/1751-black-leather-briefcase-on-a-white-background-pv.jpg",
  ];

  //--------------------Mini Bags
  const miniBags_titles = [
    "Pink Leather Crossbody Bag",
    "Stylish Pink Crossbody Bag",

  ];
  const miniBags_imgs = [
    "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1502&q=80",
    "https://upload.wikimedia.org/wikipedia/commons/b/bc/DKNY_Mini_Flap_Crossbody_W_-_SS_Crossbody_R1513004_Kalbsleder_beige_%281%29_%2816080518124%29.jpg",

  ];

  async function seedProducts(titlesArr, imgsArr, categStr) {
    try {
      const categ = await Category.findOne({ title: categStr });
      for (let i = 0; i < titlesArr.length; i++) {
        let prod = new Product({
          productCode: faker.helpers.replaceSymbolWithNumber("####-##########"),
          title: titlesArr[i],
          imagePath: imgsArr[i],
          description: faker.lorem.paragraph(),
          price: faker.random.number({ min: 10, max: 50 }),
          manufacturer: faker.company.companyName(0),
          available: true,
          category: categ._id,
        });
        await prod.save();
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async function closeDB() {
    console.log("CLOSING CONNECTION");
    await mongoose.disconnect();
  }

  await seedProducts(backpacks_titles, backpacks_imgs, "Backpacks");
  await seedProducts(briefcases_titles, briefcases_imgs, "Briefcases");

  await seedProducts(miniBags_titles, miniBags_imgs, "Mini Bags");


  await closeDB();
}

seedDB();
