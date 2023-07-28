import type { Meta, StoryObj } from '@storybook/react';

import { FeaturedPost } from './FeaturedPost';
import { Post } from 'contentlayer/generated';
import { IntlProvider } from 'next-intl';

const meta: Meta<typeof FeaturedPost> = {
  title: 'Molecules/FeaturedPost',
  component: FeaturedPost,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <IntlProvider locale="en">
        <Story />
      </IntlProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FeaturedPost>;

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