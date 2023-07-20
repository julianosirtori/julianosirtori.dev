import type { Meta, StoryObj } from '@storybook/react';

import { CardSkills } from './CardSkills';

const meta: Meta<typeof CardSkills> = {
  title: 'Molecules/CardSkills',
  component: CardSkills,
  tags: ['autodocs'],
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<typeof CardSkills>;

export const Default: Story = {
  render: (args) => (
    <div className='bg-background p-10'>
      <CardSkills {...args} />
    </div>
  ),
  args: {
    title: 'Languages',
    skills: ['JavaScript', 'TypeScript', 'HTML', 'CSS'],
  },
};
