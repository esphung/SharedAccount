import { Money } from "ts-money";

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(new Money(amount, "USD").getAmount() / 100);
};

const MoneyFunctions = {
  formatMoney,
};

export default MoneyFunctions;
