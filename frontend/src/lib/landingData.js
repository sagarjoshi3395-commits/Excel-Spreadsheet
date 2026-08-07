const A = "https://customer-assets-wrfwihn1.emergentagent.net/job_biz-mgmt-sheet/artifacts";

export const IMAGES = {
  hero: `${A}/tyi8kvok_Custom%20Dashboard.png`,
  monthly: `${A}/rezn6pi3_Monthly%20Dashboard.png`,
  income: `${A}/x0cig2j6_Income%20section.png`,
  expenses: `${A}/zhwuec90_Expance%20Tab.png`,
  setup: `${A}/5lmbl8gu_Setup%20Tab.png`,
  annual: `${A}/u8yuw5gm_Annual%20Dashboard.png`,
  fiveYear: `${A}/5ee56iz3_5%20Year%20Dashboard.png`,
  comparison: `${A}/h0k2esgl_Comparison%20Dashboard.png`,
  balance: `${A}/djyvlqsl_Balance%20Sheet.png`,
  salesTax: `${A}/6k2a9ub5_Sales%20Tax%20Tracker.png`,
};

export const TABS = [
  { label: "Setup", desc: "Set your currency, categories & profit goals in one click.", img: IMAGES.setup },
  { label: "Income", desc: "Log every income source with tax, fees & net amount.", img: IMAGES.income },
  { label: "Expenses", desc: "Track all spending with categories, accounts & remarks.", img: IMAGES.expenses },
  { label: "Monthly", desc: "A full monthly overview with breakdowns & top sources.", img: IMAGES.monthly },
  { label: "Annual", desc: "Yearly income, expenses, profit margin & goal progress.", img: IMAGES.annual },
  { label: "5-Year", desc: "See five years of growth side by side, automatically.", img: IMAGES.fiveYear },
  { label: "Comparison", desc: "Compare any three date ranges across your business.", img: IMAGES.comparison },
  { label: "Custom", desc: "Build your own dashboard for any period you choose.", img: IMAGES.hero },
  { label: "Balance", desc: "A clean balance sheet of assets over five years.", img: IMAGES.balance },
  { label: "Sales Tax", desc: "Tax collected vs paid, tracked month by month.", img: IMAGES.salesTax },
];

export const DOWNLOAD_FILE = "/business-management-toolkit.xlsx";
export const PRICE = "290";
