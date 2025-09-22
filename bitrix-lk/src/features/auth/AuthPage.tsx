import logo from "../../assets/logo.png";
import { useContext, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import type { Company } from "../../models/Models";
const AuthPage = () => {
  const ACCENT = "#0CBEF1";
  const { setCompany } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const SubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const phone: string = String(form.get("phone") ?? "");
    const password: string = String(form.get("password") ?? "");
    const url = import.meta.env.VITE_BACKEND_URL;

    try {
      const res = await fetch(`${url}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone,
          password: password,
        }),
      });
      if (!res.ok) {
        const texterror = await res.json();
        setError(texterror?.error);
      } else {
        const data = await res.json();
        const currentCompany: Company = {
          companyId: data.company.companyId,
          companyName: data.company.companyName,
          companyPhone: data.company.companyPhone,
          industry: data.company.industry,
        };
        setCompany(currentCompany);
        navigate("/lk");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };
  return (
    <>
      <div
        className="min-h-screen w-full grid lg:grid-cols-2"
        style={{ backgroundColor: "#fff" }}
      >
        <div
          className="hidden lg:flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: ACCENT }}
        >
          <div
            className="absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-20"
            style={{ backgroundColor: "#fff" }}
          />
          <div
            className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full opacity-10"
            style={{ backgroundColor: "#fff" }}
          />

          <div className="relative z-10 max-w-md p-10 text-center text-white">
            <img src={logo} alt="Логотип" />
            <h1 className="text-4xl font-bold tracking-tight">
              Личный кабинет
            </h1>
            <p className="mt-4 text-lg/7 opacity-90">
              Войдите по номеру телефона и паролю, чтобы управлять заявками и
              данными.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold" style={{ color: ACCENT }}>
                Вход
              </h2>
              <p className="mt-2" style={{ color: ACCENT, opacity: 0.8 }}>
                Используйте телефон и пароль из личного кабинета
              </p>
            </div>

            <form className="space-y-5" onSubmit={SubmitForm}>
              <label className="block">
                <span
                  className="mb-2 block font-medium"
                  style={{ color: ACCENT }}
                >
                  Телефон
                </span>
                <input
                  name="phone"
                  placeholder="+7 999 888-77-66"
                  className="w-full rounded-2xl bg-[#f2fcff] px-4 py-3 outline-none ring-2 focus:ring-4 transition ring-offset-0"
                  style={{
                    color: ACCENT,
                    borderColor: ACCENT,
                    boxShadow: `0 0 0 0 rgba(0,0,0,0)`,
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.boxShadow = `0 0 0 4px ${ACCENT}22`)
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.boxShadow = `0 0 0 0 rgba(0,0,0,0)`)
                  }
                />
              </label>

              <label className="block">
                <span
                  className="mb-2 block font-medium"
                  style={{ color: ACCENT }}
                >
                  Пароль
                </span>
                <input
                  name="password"
                  placeholder="Введите пароль"
                  className="w-full rounded-2xl bg-[#f2fcff] px-4 py-3 outline-none transition"
                  style={{ color: ACCENT }}
                  onFocus={(e) =>
                    (e.currentTarget.style.boxShadow = `0 0 0 4px ${ACCENT}22`)
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.boxShadow = `0 0 0 0 rgba(0,0,0,0)`)
                  }
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-2xl px-4 py-3 font-semibold uppercase tracking-wide transition-transform active:scale-[0.98]"
                style={{ backgroundColor: ACCENT, color: "#fff" }}
              >
                Войти
              </button>
              <p className="text-center text-[#f56767] font-bold">{error}</p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default AuthPage;
