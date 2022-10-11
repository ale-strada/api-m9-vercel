import Airtable from "airtable";

export const airtableBase = new Airtable({
  apiKey: process.env.AT_APIKEY,
}).base(process.env.AT_BASE);
