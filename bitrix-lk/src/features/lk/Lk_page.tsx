import { useContext, useEffect, useState, type FormEvent } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
type Deal = {
  ID: string | null;
  TITLE: string | null;
  STAGE_ID: string | null;
  OPPORTUNITY: string | null;
  DATE_CREATE: string | null;
  DATE_MODIFY: string | null;
  COMMENTS: string | null;
};
const Lk = () => {
  const { company, setCompany } = useContext(AuthContext);
  const [state, setState] = useState(0);
  const [error, setError] = useState<null | string>(null);
  const [deals, setDeals] = useState<null | Array<Deal>>(null);
  const navbar = ["Общие", "Сделки", "Оставить заявку"];
  const url = import.meta.env.VITE_BACKERND_URL;
  const ACCENT = "#0CBEF1";
  const labelCls = "block text-base font-semibold mb-1";
  const inputBase =
    "w-full bg-transparent border-b outline-none py-2 text-base placeholder-gray-400 transition";
  const inputFocus = "focus:border-[var(--accent)]";
  const inputColor = "border-emerald-700 text-black";
  const navigate = useNavigate();
  function Logout() {
    setCompany(null);
    navigate("/");
  }
  function fetchData(): void;
  function fetchData(controller: AbortController): void; // Перегрузка функции
  async function fetchData(controller?: AbortController) {
    try {
      const response = await fetch(`${url}/getdeals/${company?.companyId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller?.signal,
      });
      if (!response.ok) {
        const texterror = await response.json();
        setError(texterror?.error);
      } else {
        const data: Deal[] = await response.json();
        setDeals(data);
      }
    } catch (e) {
      if (e instanceof Error) {
        if (e.name !== "AbortError") {
          setError(e.message);
        }
      } else {
        setError("error");
      }
    }
  }
  useEffect(() => {
    if (!company?.companyId) {
      navigate("/");
      return;
    }
    const controller = new AbortController();
    fetchData(controller);
    return () => controller.abort();
  }, [company?.companyId]);
  const SubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const meterType: string = String(
      form.get("meterType") == "Теплосчетчик" ? 3 : 1,
    );
    let job_type: string = String(form.get("jobType"));
    const meterCount: string = String(form.get("count"));
    const title: string = String(form.get("address"));
    const comment: string = String(form.get("comment"));
    const url = import.meta.env.VITE_BACKERND_URL;
    switch (job_type) {
      case "Поверка":
        job_type = meterType == "1" ? "51" : "55"; // id типа работы - Поверка водосчетчика / Поверка теплосчетчика
        break;
      case "Замена":
        job_type = meterType == "1" ? "53" : "4539"; // id типа работы - Замена водосчетчика / Замена теплосчетчика
        break;
      default:
        break;
    }
    try {
      const res = await fetch(`${url}/createdeal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          meterCount: meterCount,
          job_type: job_type,
          comment: comment,
          meterType: meterType,
          companyId: company?.companyId,
        }),
      });
      if (!res.ok) {
        const texterror = await res.json();
        setError(texterror?.error);
      } else {
        fetchData();
        setState(3);
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  };
  return (
    <div className="min-h-screen bg-white text-black p-6">
      {/* Заголовок */}
      <div className="mb-6 ml-4 flex">
        <h1 className="text-2xl font-bold text-[#0CBEF1]">Личный кабинет</h1>
        <button
          className="bg-[#0CBEF1] ml-auto text-white px-4 py-2 rounded-lg shadow hover:bg-white hover:text-[#0CBEF1] border border-[#0CBEF1] transition-colors"
          onClick={Logout}
        >
          Выйти
        </button>
      </div>

      {/* Навигация */}
      <div className="flex gap-6 border-b border-gray-300 pb-2 mb-6 text-sm items-center">
        <div className="flex gap-6"></div>
        {navbar.map((tab, index) => (
          <button
            key={tab}
            className={`transition-colors ${state == index ? "text-[#0CBEF1] font-medium" : "text-gray-500 hover:text-[#38b7da] cursor-pointer"}`}
            onClick={() => {
              setState(index);
            }}
          >
            {tab}
          </button>
        ))}
        <p className="ml-auto font-medium">{company?.companyName}</p>
      </div>

      {/* Раздел: О компании */}

      {(() => {
        switch (state) {
          case 0:
            return (
              <section className="bg-gray-100 rounded-2xl p-6 shadow mb-6">
                <h2 className="text-lg font-semibold mb-4 text-[#0CBEF1]">
                  О компании
                </h2>
                <div className="space-y-3 text-sm">
                  <p>
                    <span className="text-gray-500">Сфера деятельности:</span>{" "}
                    {company?.industry}
                  </p>
                  <p>
                    <span className="text-gray-500">Телефон:</span>{" "}
                    <span className="tracking-wider">
                      {company?.companyPhone}
                    </span>
                  </p>
                </div>
              </section>
            );
          case 1:
            if (deals !== null) {
              return (
                <section className="space-y-4">
                  {deals.length === 0 ? (
                    <div className="text-center text-gray-500">Сделок нет</div>
                  ) : (
                    deals.map((deal, index) => (
                      <div
                        key={deal.ID ?? index}
                        className="bg-gray-50 rounded-xl p-4 shadow flex flex-col gap-2 border border-gray-200"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-semibold text-[#0CBEF1]">
                            {deal.TITLE || "Без названия"}
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                          <span>
                            Стоимость:{" "}
                            {deal.OPPORTUNITY !== null
                              ? `${deal.OPPORTUNITY} ₽`
                              : "-"}
                          </span>
                          <span>Создана: {deal.DATE_CREATE || "-"}</span>
                          <span>Изменена: {deal.DATE_MODIFY || "-"}</span>
                          <span>Статус сделки: {deal.STAGE_ID || "-"}</span>
                        </div>
                        {deal.COMMENTS && (
                          <div className="text-xs text-gray-500 mt-2">
                            <span className="font-medium">Комментарий:</span>{" "}
                            {deal.COMMENTS}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </section>
              );
            } else {
              return <h3 className="flex justify-center">{error}</h3>;
            }
          case 2:
            return (
              <div className="min-h-screen bg-white text-black">
                <form
                  className="max-w-2xl mx-auto px-6 pt-8 pb-16 space-y-8"
                  onSubmit={SubmitForm}
                >
                  {/* Заголовок */}
                  <h1 className="text-2xl font-bold mb-2">
                    Заявка на обслуживание
                  </h1>
                  {/* Тип счётчика */}
                  <div>
                    <label className={labelCls}>Выберите тип счётчика</label>
                    <select
                      name="meterType"
                      className={`${inputBase} ${inputColor} ${inputFocus} appearance-none`}
                    >
                      <option>Счётчик воды</option>
                      <option>Счётчик газа</option>
                      <option>Теплосчетчик</option>
                    </select>
                  </div>

                  {/* Вид работ */}
                  <div>
                    <label className={labelCls}>Выберите вид работ</label>
                    <select
                      name="jobType"
                      className={`${inputBase} ${inputColor} ${inputFocus} appearance-none`}
                    >
                      <option>Поверка</option>
                      <option>Замена</option>
                    </select>
                  </div>

                  {/* Адрес */}
                  <div>
                    <label className={labelCls}>Адрес</label>
                    <input
                      name="address"
                      placeholder="г. Тюмень, ул. Ленина, д. 1, кв. 10"
                      className={`${inputBase} ${inputColor} ${inputFocus}`}
                      autoComplete="street-address"
                    />
                  </div>

                  {/* Количество счётчиков */}
                  <div>
                    <label className={labelCls}>Количество счётчиков</label>
                    <select
                      name="count"
                      className={`${inputBase} ${inputColor} ${inputFocus} appearance-none`}
                    >
                      {Array.from({ length: 8 }, (_, i) => String(i + 1)).map(
                        (n) => (
                          <option key={n}>{n}</option>
                        ),
                      )}
                    </select>
                  </div>
                  {/* Комментарий (необязательно) */}
                  <div>
                    <label className={labelCls}>
                      Комментарий (необязательно)
                    </label>
                    <textarea
                      name="comment"
                      placeholder="Удобное время, домофон, подъезд…"
                      className={`${inputBase} ${inputColor} ${inputFocus} resize-none`}
                    />
                  </div>
                  <p className="text-center text-[#f56767] font-bold">
                    {error}
                  </p>
                  {/* Подвал формы */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-10 py-4 rounded-2xl font-extrabold tracking-widest text-white shadow hover:opacity-95 active:opacity-90 transition"
                      style={{ backgroundColor: ACCENT }}
                    >
                      ЗАКАЗАТЬ
                    </button>
                  </div>
                </form>
              </div>
            );
          case 3:
            return (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="bg-green-100 border border-green-300 rounded-2xl px-8 py-6 shadow text-center max-w-md">
                  <h2 className="text-2xl font-bold text-green-700 mb-2">
                    Заявка отправлена успешно!
                  </h2>
                  <p className="text-gray-700 mb-6">
                    Ваша заявка принята и будет обработана в ближайшее время.
                  </p>
                  <button
                    className="bg-[#0CBEF1] text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-white hover:text-[#0CBEF1] border border-[#0CBEF1] transition-colors"
                    onClick={() => {
                      setState(1);
                    }}
                  >
                    Перейти к сделкам
                  </button>
                </div>
              </div>
            );
          default:
            return null;
        }
      })()}
    </div>
  );
};

export default Lk;
