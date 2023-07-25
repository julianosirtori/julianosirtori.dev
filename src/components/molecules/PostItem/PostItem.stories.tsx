import type { Meta, StoryObj } from '@storybook/react';
import { IntlProvider } from "next-intl";

import { PostItem } from './PostItem';
import { Post } from 'contentlayer/generated';

const meta: Meta<typeof PostItem> = {
  title: 'Molecules/PostItem',
  component: PostItem,
  decorators: [
    (Story) => (
      <IntlProvider locale="en">
        <Story />
      </IntlProvider>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {

  },
};

export default meta;
type Story = StoryObj<typeof PostItem>;

const mockPost: Post = {
  title: "Becoming an Open Source Project Maintainer",
  slug: "test-post",
  description: "Some tips and tricks that have worked for me",
  date: "2017-11-20",
  bannerCloudinaryId: "unsplash/photo-1496355723323-30286a0b340d",
  bannerCredit: "Photo by rawpixel.com on Unsplash",
  urlImage: "https://images.unsplash.com/photo-1496355723323-30286a0b340d",
  readTime: 5,
} as Post;

export const Default: Story = {
  args: {
    post: mockPost,
  },
};
