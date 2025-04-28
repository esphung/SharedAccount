import { Money } from "ts-money";

type FormatMoneyFunc = (amount: number, precision?: number, currency?: "USD", style?: "currency" | "decimal") => string;

const formatMoney: FormatMoneyFunc = (
  amount,
  precision = 0,
  currency = "USD",
  style: "currency" | "decimal" = "currency",
) => {
  const amountDollars = new Money(amount, "USD").getAmount() / 100;

  return new Intl.NumberFormat("en-US", {
    style,
    currency,
    maximumFractionDigits: precision,
  }).format(amountDollars);
};

const MoneyFunctions = {
  formatMoney,
};

export default MoneyFunctions;
