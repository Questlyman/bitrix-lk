import type { CompanyCardProps } from "../../../models/Models";

const CompanyInfo = ({company}: CompanyCardProps) => {
  return (
    <section className="bg-[#f2fcff] rounded-2xl p-6 shadow mb-6">
      <h2 className="text-lg font-semibold mb-4 text-[#0CBEF1]">О компании</h2>
      <div className="space-y-3 text-sm">
        <p>
          <span className="text-gray-500">Сфера деятельности:</span>{" "}
          {company?.industry}
        </p>
        <p>
          <span className="text-gray-500">Телефон:</span>{" "}
          <span className="tracking-wider">{company?.companyPhone}</span>
        </p>
      </div>
    </section>
  );
};

export default CompanyInfo;
