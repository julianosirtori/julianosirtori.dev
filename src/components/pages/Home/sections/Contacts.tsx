import { Icon } from "@/components/atoms/Icon"
import { ImageSVG } from "@/components/atoms/ImageSVG"
import { Title } from "@/components/molecules/Title"

export const Contacts = () => {
  return (
    <section className="relative overflow-hidden" id="contact">
      <ImageSVG name="dots" width="103px" height="103px" className="absolute left-[-70px] top-12 hidden lg:block" />
      <div className="w-full px-4 lg:max-w-screen-lg lg:m-auto">
        <Title level={2} variant="secondary" className="mb-12" >
          contacts
        </Title>
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
      </div>
    </section>
  )
}