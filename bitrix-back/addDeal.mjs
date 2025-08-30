import { B24 } from "./index.mjs";
import axios from "axios";
export async function addDeal(req, res) {
  try {
    const { title, meterCount, job_type, comment, meterType, companyId } =
      req.body || {};
    console.log(title, meterCount, job_type, comment, meterType, companyId);
    if (!title) {
      return res
        .status(400)
        .json({ error: "Необходим адрес проведения работ" });
    }
    const { data } = await axios.post(`${B24}/crm.deal.add.json`, {
      fields: {
        TITLE: title,
        UF_CRM_1734635661340: Number(meterCount),
        UF_CRM_1734635614379: Number(job_type),
        COMMENTS: comment ?? "",
        CATEGORY_ID: Number(meterType),
        COMPANY_ID: Number(companyId),
      },
      headers: { "Content-Type": "application/json" },
    });
    if (data.error) throw new Error(`${data.error}: ${data.error_description}`);
    console.log(data);
    return res.json(data);
  } catch (e) {
    const status = e.response?.status || 500;
    const body = e.response?.data || { error: e.message };
    return res.status(status).json(body);
  }
}
