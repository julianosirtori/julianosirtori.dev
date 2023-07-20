import type { Meta, StoryObj } from '@storybook/react';

import { IconsMaps } from "./Icons";
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Shared/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: {
        type: 'select',
        options: Object.keys(IconsMaps)
      }
    }
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    name: 'IconLogo',
  },
};
