import { NextApiRequest, NextApiResponse } from "next";
import { airtableBase } from "lib/airtable";
import { productsIndex } from "lib/algolia";
import { getOffsetAndLimitFromReq } from "lib/requests";

//aca se sincroniza airtablo con algolia, este endpoint es invocado cada 15 minutos por cronos
export default function (req: NextApiRequest, res: NextApiResponse) {
  const { offset, limit } = getOffsetAndLimitFromReq(req, 10, 10000);
  airtableBase("Furniture")
    .select({
      pageSize: limit,
    })
    .eachPage(
      async function page(records, fetchNextPage) {
        const objects = records.map((r) => {
          return {
            objectID: r.id,
            ...r.fields,
          };
        });
        await productsIndex.saveObjects(objects);

        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
        res.send("termino");
      }
    );
}
