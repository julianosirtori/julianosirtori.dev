import { Icon } from "@/components/atoms/Icon"
import * as Page from "@/components/templates/Page/Page"

export const Contact = () => {
  return (
    <Page.Root title="contacts" subtitle="Who am i?" >
      <Page.Section>
        <div className="flex flex-col lg:flex-row w-full justify-between ">
          <p className="text-gray mb-8 lg:max-w-lg">I’m interested in freelance opportunities. However, if you have other request or question, don’t hesitate to contact me</p>
          <div className="border border-gray p-4">
            <span className="text-white font-semibold ">Message me here</span>
            <a href="https://discordapp.com/users/juliano_sirtori" target="_blank" className="flex gap-1 mb-2 mt-4">
              <Icon name="IconDiscord" />
              <span className="text-gray">juliano_sirtori</span>
            </a>
            <a href="mailto:julianosirtori@gmail.com" target="_blank" className="flex gap-1 mb-2">
              <Icon name="IconEmail" />
              <span className="text-gray">julianosirtori@gmail.com</span>
            </a>
          </div>
        </div>
      </Page.Section>
      <Page.Section title="all-media">
        <div className="flex flex-row gap-5 w-full flex-wrap">
          <a href="https://discordapp.com/users/juliano_sirtori" target="_blank" className="flex gap-1 items-center">
            <Icon name="IconDiscord" />
          </a>
          <a href="mailto:julianosirtori@gmail.com" target="_blank" className="flex gap-1 items-center">
            <Icon name="IconEmail" />
          </a>
          <a href="mailto:julianosirtori@gmail.com" target="_blank" className="flex gap-1 items-center">
            <Icon name="IconGithub" />
          </a>
          <a href="mailto:julianosirtori@gmail.com" target="_blank" className="flex gap-1 items-center">
            <Icon name="IconLinkedin" />
          </a>
          <a href="mailto:julianosirtori@gmail.com" target="_blank" className="flex gap-1 items-center">
            <Icon name="IconTwitter" />
          </a>
        </div>
      </Page.Section>
    </Page.Root>

  )
}