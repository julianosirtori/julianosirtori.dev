import { Icon } from "@/components/shared/Icon"
import { Title } from "@/components/shared/Title"

export const Contacts = () => {
  return (
    <section className="w-full px-4 lg:max-w-screen-lg lg:m-auto">
      <Title level={2} variant="secondary" className="mb-12" >
        contacts
      </Title>
      <div className="flex flex-col lg:flex-row w-full justify-between ">
        <p className="text-gray mb-8 lg:max-w-lg">I’m interested in freelance opportunities. However, if you have other request or question, don’t hesitate to contact me</p>
        <div className="border border-gray p-4">
          <span className="text-white font-semibold ">Message me here</span>
          <div className="flex gap-1 mb-2 mt-4">
            <Icon name="IconDiscord" />
            <span className="text-gray">!Elias#3519</span>
          </div>
          <div className="flex gap-1 mb-2">
            <Icon name="IconEmail" />
            <span className="text-gray">elias@elias.me</span>
          </div>
        </div>
      </div>

    </section>
  )
}