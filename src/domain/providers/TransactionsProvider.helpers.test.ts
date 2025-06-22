import TransactionBuilder from "@data/models/builders/TransactionBuilder";
import { aggregateCategoryPills } from "@domain/providers/TransactionsProvider.helpers";
import type { Transaction } from "types/Transaction";

describe("aggregateCategoryPills", () => {
	it("returns default categories when transactions is empty", () => {
		const result = aggregateCategoryPills([]);
		expect(result).toEqual(
			expect.arrayContaining([
				{ id: "food", label: "Food" },
				{ id: "transport", label: "Transport" },
				{ id: "entertainment", label: "Entertainment" },
				{ id: "utilities", label: "Utilities" },
				{ id: "rent", label: "Rent" },
			])
		);
		expect(result.length).toBe(5);
	});

	it("aggregates unique categories from transactions", () => {
		const transactions: Transaction[] = [
			new TransactionBuilder().withId("1").withAmount(10).withCategory("Groceries").build(),
			new TransactionBuilder().withId("2").withAmount(20).withCategory("Transport").build(),
			new TransactionBuilder().withId("3").withAmount(30).withCategory("Groceries").build(),
			new TransactionBuilder().withId("4").withAmount(40).withCategory("Utilities").build(),
		];
		const result = aggregateCategoryPills(transactions);
		// Should include unique categories from transactions and default ones, but no duplicates
		expect(result).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ label: "Groceries" }),
				expect.objectContaining({ label: "Transport" }),
				expect.objectContaining({ label: "Utilities" }),
				{ id: "food", label: "Food" },
				{ id: "entertainment", label: "Entertainment" },
				{ id: "rent", label: "Rent" },
			])
		);
		// No duplicate labels
		const labels = result.map((r) => r.label);
		expect(new Set(labels).size).toBe(labels.length);
	});

	it("generates ids correctly for custom categories", () => {
		const transactions: Transaction[] = [
			new TransactionBuilder()
				.withId("1")
				.withAmount(10)
				.withCategory("My Custom Category")
				.build(),
			new TransactionBuilder()
				.withId("2")
				.withAmount(20)
				.withCategory("Another-Category!")
				.build(),
		];
		const result = aggregateCategoryPills(transactions);
		expect(result).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: "my_custom_category_0",
					label: "My Custom Category",
				}),
				expect.objectContaining({
					id: "anothercategory_1",
					label: "Another-Category!",
				}),
			])
		);
	});

	it("does not add duplicate default categories if present in transactions", () => {
		const transactions: Transaction[] = [
			new TransactionBuilder().withId("1").withAmount(10).withCategory("Food").build(),
			new TransactionBuilder().withId("2").withAmount(20).withCategory("Rent").build(),
		];
		const result = aggregateCategoryPills(transactions);
		// Only one "Food" and one "Rent"
		const food = result.filter((r) => r.label === "Food");
		const rent = result.filter((r) => r.label === "Rent");
		expect(food.length).toBe(1);
		expect(rent.length).toBe(1);
	});

	it("ignores transactions without a category", () => {
		const transactions: Transaction[] = [
			new TransactionBuilder().withId("1").withAmount(10).build(),
			new TransactionBuilder()
				.withId("2")
				.withAmount(20)
				.withCategory("Entertainment")
				.build(),
		];
		const result = aggregateCategoryPills(transactions);

		// Should contain all 5 default categories (including Entertainment)
		expect(result).toEqual([
			{ id: "food_0", label: "Food" },
			{ id: "entertainment_1", label: "Entertainment" },
			{ id: "transport", label: "Transport" },
			{ id: "utilities", label: "Utilities" },
			{ id: "rent", label: "Rent" },
		]);

		// Should have exactly 5 items (all defaults, no duplicates, no empty categories)
		expect(result.length).toBe(5);

		// Verify no empty/undefined categories are included
		const labels = result.map((r) => r.label);
		expect(labels.every((label) => label && label.trim().length > 0)).toBe(true);
	});
});
