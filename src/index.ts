import axios from "axios";
import * as cheerio from "cheerio";
import { JSONFilePreset } from "lowdb/node";

const url = "https://konachan.com/post?page=";
const apikey = process.env.ZENROWS;
let page = 1;

const fetchData = async (page: number) => {
  const { data } = await axios({
    url: "https://api.zenrows.com/v1/",
    method: "GET",
    params: {
      url: url + page.toString(),
      apikey: apikey,
    },
  });
  return data;
};

const scrapping = async () => {
  try {
    console.log("Scraping page", page);
    const data = await fetchData(page);
    const $ = cheerio.load(data);

    const result: any[] = [];

    $("#post-list-posts > li > a.largeimg").each((index, el) => {
      result.push($(el).attr("href"));
    });

    const db = await JSONFilePreset("result.json", { images: [] });

    result.map((image) => {
      db.data.images.push({ image });
      db.write();
    });

    page++;

    await scrapping();
  } catch (error) {
    console.error(error);
  }
};

scrapping();
