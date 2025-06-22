import type { Transaction } from "types/Transaction";

// Helper function to aggregate category pills
export function aggregateCategoryPills(transactions: Transaction[]) {
	const uniqueCategories = new Set<string>();
	transactions.forEach((transaction) => {
		if (transaction.category) {
			uniqueCategories.add(transaction.category);
		}
	});
	const aggregate = Array.from(uniqueCategories).map((category, index) => ({
		id: `${category
			.replace(/\s+/g, "_")
			.toLowerCase()
			.replace(/[^a-z0-9_]/g, "")}_${index}`,
		label: category,
	}));
	// make unique categories
	const uniqueAggregate = [
		...aggregate,
		{ id: "food", label: "Food" },
		{ id: "transport", label: "Transport" },
		{ id: "entertainment", label: "Entertainment" },
		{ id: "utilities", label: "Utilities" },
		{ id: "rent", label: "Rent" },
	].filter((item, index, self) => index === self.findIndex((t) => t.label === item.label));
	return uniqueAggregate;
}
