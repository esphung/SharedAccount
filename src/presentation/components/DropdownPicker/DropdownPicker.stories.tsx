import DropdownPicker from "@components/DropdownPicker/DropdownPicker";

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const RenderComponent = () => {
	const items: {
		label: string;
		value: string;
	}[] = [
		{ label: "Food", value: "Food" },
		{ label: "Transportation", value: "Transportation" },
		{ label: "Entertainment", value: "Entertainment" },
		{ label: "Bills", value: "Bills" },
		{ label: "Other", value: "Other" },
	];
	const [selectedValue, setSelectedValue] = React.useState<string>("Food");
	return (
		<DropdownPicker items={items} selectedValue={selectedValue} onChange={setSelectedValue} />
	);
};

const meta = {
	title: "DropdownPicker",
	component: DropdownPicker,
	decorators: [(Story: React.FC) => <Story />],
} satisfies Meta<typeof DropdownPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		items: [
			{ label: "Food", value: "Food" },
			{ label: "Transportation", value: "Transportation" },
			{ label: "Entertainment", value: "Entertainment" },
			{ label: "Bills", value: "Bills" },
			{ label: "Other", value: "Other" },
		],
		selectedValue: "Food",
		onChange: (_: string) => {},
	},
	render: RenderComponent,
};
