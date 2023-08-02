import type { Meta, StoryObj } from "@storybook/react";
import { Title } from "./Title";

const meta: Meta<typeof Title> = {
  title: "Molecules/Title",
  component: Title,
  tags: ["autodocs"],
  argTypes: {
    children: {
      description: "Title text",
      control: {
        type: "text",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Title>;

export const Default: Story = {
  render: (args) => (
    <div className="bg-primary p-8">
      <Title {...args} />
    </div>
  ),
  args: {
    children: "title",
  },
};

export const Primary: Story = {
  render: (args) => (
    <div className="bg-primary p-8">
      <Title {...args} />
    </div>
  ),
  args: {
    children: "Primary",
    variant: "primary",
    level: 1,
  },
};

export const Secondary: Story = {
  render: (args) => (
    <div className="bg-primary p-8">
      <Title {...args} />
    </div>
  ),
  args: {
    children: "Secondary",
    variant: "secondary",
    level: 2,
  },
};
