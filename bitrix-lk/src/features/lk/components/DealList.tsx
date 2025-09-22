import type { DealListProps } from "../../../models/Models";
import docIcon from "../../../assets/Document-icon.png";
import { Link } from "react-router-dom";
const DealList = ({ deals, error }: DealListProps) => {
  if (deals !== null) {
    return (
      <section className="space-y-4">
        {deals.length === 0 ? (
          <div className="text-center text-gray-500">Сделок нет</div>
        ) : (
          deals.map((deal, index) => (
            <div
              key={deal.ID ?? index}
              className="bg-[#f2fcff] rounded-xl p-4 shadow flex flex-col gap-2 border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-[#0CBEF1]">
                  {deal.TITLE || "Без названия"}
                </h3>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                <span>
                  Стоимость:{" "}
                  {deal.OPPORTUNITY !== null ? `${deal.OPPORTUNITY} ₽` : "-"}
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
              {deal.documents && (
                <div className="mt-4">
                  <h3 className="text-[#0CBEF1] font-semibold">Документы</h3>
                  {deal.documents.map((document, index) => (
                    <div
                      className="p-4 flex items-center h-[90px] hover:bg-[#d7f3fa] w-fit mt-2"
                      key={document.id ?? index}
                    >
                      <img
                        src={document.imageUrlMachine ?? docIcon}
                        className="w-[60px] mr-2.5"
                      ></img>
                      {document.downloadUrlMachine && (
                        <Link
                          to={document.downloadUrlMachine}
                          className="text-md hover:text-blue-300"
                        >
                          <p>{document.title}</p>
                          <p className="text-gray-500">
                            от {document.updateTime ?? document.createTime}
                          </p>
                        </Link>
                      )}
                    </div>
                  ))}
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
};

export default DealList;
