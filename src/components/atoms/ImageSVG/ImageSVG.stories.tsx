import type { Meta, StoryObj } from '@storybook/react';

import { SVGMaps } from "./SVGs";
import { ImageSVG } from './ImageSVG';

const meta: Meta<typeof ImageSVG> = {
  title: 'Atoms/ImageSVG',
  component: ImageSVG,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: {
        type: 'select',
        options: Object.keys(ImageSVG)
      }
    }
  },
};

export default meta;
type Story = StoryObj<typeof ImageSVG>;

export const Default: Story = {
  args: {
    name: 'logo',
  },
};
