import type { Meta, StoryObj } from '@storybook/react';

import * as Page from './Page';

const meta: Meta<typeof Page.Root> = {
  title: 'Templates/Page',
  component: Page.Root,
  tags: ['autodocs'],
  argTypes: {
    hideHeader: {
      description: 'Hide header',
      defaultValue: false,
      control: {
        type: 'boolean',
      },
      sections: {
        description: 'Sections',
        defaultValue: [],
        control: {
          type: 'object',
        },
      }
    }
  },
  args: {
    title: 'Contacts',
    subtitle: 'Who I am?',
    hideHeader: false
  }
};

export default meta;
type Story = StoryObj<typeof Page>;


export const Default: Story = {
  render: (args) => {
    return (
      <Page.Root title="projects" subtitle='my projects' {...args}>
        <Page.Section title='complete-apps'>
          <p>complete-apps</p>
        </Page.Section>
        <Page.Section title='small-projects'>
          <p>complete-apps</p>
        </Page.Section>
      </Page.Root>
    )
  },
};


