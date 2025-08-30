import { stageDict } from "./statuses.js";
import axios from "axios";
import { B24 } from "./index.mjs";
function normalizePhone(raw) {
  return String(raw)
    .replace(/[^\d+]/g, "") // убираем мусор
    .replace(/^8(\d{10})$/, "+7$1"); // пример для РФ (подгони под свой кейс)
}
async function b24(method, params = {}) {
  const url = `${B24}/${method}.json`;
  const { data } = await axios.get(url, { params });
  if (data.error) throw new Error(`${data.error}: ${data.error_description}`);
  return data.result;
}
// POST /auth/login  { phone, password }
export async function login(req, res) {
  try {
    const phone = normalizePhone(req.body.phone);

    const password = String(req.body.password || "");

    if (!phone || !password) {
      return res.status(400).json({ error: "Введите данные пользователя" });
    }

    // 1) ищем по телефону
    const dup = await b24("crm.duplicate.findbycomm", {
      type: "PHONE",
      "values[]": phone,
    }); // вернёт ids по сущностям

    const companyId = dup?.COMPANY?.[0]; // возьмём первый найденный контакт
    if (!companyId) {
      return res
        .status(401)
        .json({ error: "Неверный номер телефона или пароль" });
    }

    // 2) тянем карточку контакта
    const company = await b24("crm.company.get", { id: companyId });

    const hash = company?.UF_CRM_B24LK_COMPANY_PIN;
    if (!hash) {
      return res
        .status(401)
        .json({ error: "Такой пользователь не зарегистрирован в системе" });
    }

    // 3) сравниваем пароль
    if (password !== hash) {
      return res
        .status(401)
        .json({ error: "Неверный номер телефона или пароль" });
    }

    return res.json({
      ok: true,
      company: {
        companyId: companyId,
        companyName: company?.TITLE,
        companyPhone: company?.PHONE[0]?.VALUE,
        industry: stageDict[company?.INDUSTRY],
      },
    });
  } catch (e) {
    console.error(
      "Login error →",
      e.response?.status,
      e.response?.data || e.message,
    );
    return res
      .status(502)
      .json(e.response?.data || { error: "Auth upstream error" });
  }
}
