import { Money } from "ts-money";

const formatMoney = (amount: number, precision = 0) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: precision,
  }).format(new Money(amount, "USD").getAmount() / 100);
};

const MoneyFunctions = {
  formatMoney,
};

export default MoneyFunctions;
