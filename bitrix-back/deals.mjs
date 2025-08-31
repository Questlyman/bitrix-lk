import axios from "axios";
import { stageDict } from "./statuses.js";
import { B24 } from "./index.mjs";
export async function getDeals(req, res) {
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Yekaterinburg",
  });
  try {
    const companyId = Number(req.params.id);
    const select = [
      "ID",
      "TITLE",
      "STAGE_ID",
      "OPPORTUNITY",
      "DATE_CREATE",
      "DATE_MODIFY",
      "COMMENTS",
    ];
    let start = 0;
    const deals = [];
    for (;;) {
      const { data } = await axios.get(`${B24}/crm.deal.list.json`, {
        params: {
          "filter[COMPANY_ID]": companyId,
          "select[]": select,
          "order[DATE_CREATE]": "DESC",
          start,
        },
      });
      if (data.error)
        throw new Error(`${data.error}: ${data.error_description}`);
      deals.push(...data.result);
      if (data.next == null) break;
      start = data.next;
    }
    for (let i = 0; i < deals.length; i++) {
      const mod_date = new Date(deals[i].DATE_MODIFY);
      const create_date = new Date(deals[i].DATE_CREATE);
      deals[i].STAGE_ID = stageDict[deals[i].STAGE_ID];
      deals[i].DATE_CREATE = formatter.format(create_date);
      deals[i].DATE_MODIFY = formatter.format(mod_date);
    }
    return res.json(deals);
  } catch (e) {
    console.error(
      "getDeals error →",
      e.response?.status,
      e.response?.data || e.message,
    );
    const status = e.response?.status || 500;
    const body = e.response?.data || { error: e.message };
    return res.status(status).json(body);
  }
}
