export type Doc = {
  id: string | null;
  title: string | null;
  createTime: string | null;
  updateTime: string | null;
  downloadUrlMachine: string | null;
  pdfUrlMachine: string | null;
  imageUrlMachine: string | null;
};
export type Company = {
  companyId: number | null;
  companyName: string | null;
  companyPhone: string | null;
  industry: string | null;
};
export type CompanyCardProps = {
  company: Company | null
}
export type Deal = {
  ID: string | null;
  TITLE: string | null;
  STAGE_ID: string | null;
  OPPORTUNITY: string | null;
  DATE_CREATE: string | null;
  DATE_MODIFY: string | null;
  COMMENTS: string | null;
  documents: Array<Doc>;
};
export type DealListProps = {
  deals: Deal[] | null;
  error: string | null;
};
