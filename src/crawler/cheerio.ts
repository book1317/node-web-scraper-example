import axios from "axios";
import { load } from "cheerio";

export const getCheerio = async(url:string) => {
    const html = await axios.get(url);
    const selector = load(html.data);
    return selector;
};