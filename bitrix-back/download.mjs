import axios from "axios";
import { createHmac } from "crypto";
import { B24, BACKEND_URL } from "./index.mjs";

const SECRET = process.env.LINK_SECRET;
const b64 = (s) => Buffer.from(s, "utf8").toString("base64url");
const ub64 = (s) => Buffer.from(s, "base64url").toString("utf8");
const sign = (payload) =>
  createHmac("sha256", SECRET).update(payload).digest("base64url");

export function getLink(docId, type) {
  const payload = `${docId}|${type}`;
  const token = `${b64(payload)}.${sign(payload)}`;
  return `${BACKEND_URL}/download?t=${token}`;
}
function verifyToken(token) {
  const [p64, mac] = String(token).split(".");
  if (!p64 || !mac) throw new Error("Bad token");
  const payload = ub64(p64);
  const expected = sign(payload);
  if (mac !== expected) throw new Error("Bad signature");
  const [docId, type] = payload.split("|");
  if (!docId || !type) throw new Error("Bad payload");
  return { docId, type };
}
export async function download(req, res) {
  try {
    const { t } = req.query;
    const { docId, type } = verifyToken(t);
    const doc = await axios.get(
      `${B24}/crm.documentgenerator.document.get.json`,
      {
        params: {
          id: docId,
        },
      },
    );
    if (doc.error) {
      throw new Error(`${doc.error}: ${doc.error_description}`);
    }
    switch (
      type // Скачиваем в зависимости от типа файла
    ) {
      case "image":
        await downloadImage(doc.data.result.document.imageUrlMachine, res);
        break;
      case "file":
        await downloadFile(doc.data.result.document.downloadUrlMachine, res);
        break;
      case "pdf":
        await downloadFile(doc.data.result.document.pdfUrlMachine, res);
    }
  } catch (e) {
    console.log(e);
  }
}

async function downloadFile(docUrl, res) {
  try {
    const upstream = await axios.get(docUrl, {
      responseType: "stream",
      timeout: 15000,
    });
    const TypeOfFile_header =
      upstream.headers["content-type"] || "application/octet-stream"; //входщие заголовки
    const PositionOfFile_header = upstream.headers["content-disposition"];
    res.setHeader("Content-Type", TypeOfFile_header); // тип
    res.setHeader("Cache-Control", "public, max-age=60"); //кэш
    res.setHeader("Content-Disposition", PositionOfFile_header); // скачиваем
    upstream.data.pipe(res); // проводим соединение между bitrix и клиентом
    upstream.data.on("error", (err) => {
      if (!res.headersSent) {
        res.status(502).end();
        throw new Error(`Ошибка: ${err.message}`);
      }
    });
  } catch (e) {
    console.log(e);
    if (!res.headersSent) {
      res.status(500).json({ error: "Не удалось загрузить файл" });
    }
  }
}

async function downloadImage(docImageUrl, res) {
  try {
    const upstream = await axios.get(docImageUrl, {
      responseType: "stream",
      timeout: 15000,
    });
    const headrs = upstream.headers["Content-Type"] || "image/jpeg";
    res.setHeader("Content-Type", headrs); // тип - изображение
    res.setHeader("Content-Disposition", "inline"); // встроено, а не скачано
    res.setHeader("Cache-Control", "public, max-age=60"); //кэш
    upstream.data.pipe(res); // проводим соединение между bitrix и клиентом
    upstream.data.on("error", (err) => {
      if (!res.headersSent) {
        res.status(502).end();
        throw new Error(`Ошибка: ${err.message}`);
      }
    });
  } catch (e) {
    if (!res.headersSent) {
      res.status(500).json({ error: "Не удалось загрузить файл" });
    }
  }
}
