import { Icon } from "@/components/shared/Icon"

export const Footer = () => {
  return (
    <footer className="border-t border-gray bg-background text-white w-full flex justify-center">
      <div className="flex p-3 gap-8 flex-col items-start w-full max-w-5xl lg:py-8 lg:px-8">
        <div className="flex gap-8 flex-col items-start lg:flex-row lg:justify-between w-full">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row">
              <span className="font-medium mr-6">Juliano</span>
              <span className="text-gray">julianosirtori@gmail.com</span>
            </div>
            <span>Front-end developer</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-medium">Media</span>
            <div className="flex flex-row gap-2">
              <a href="https://github.com/julianosirtori/julianosirtori.dev" target="_blank">
                <Icon name="IconGithub" />
              </a>
              <a href="https://discordapp.com/users/juliano_sirtori" target="_blank">
                <Icon name="IconDiscord" />
              </a>
              <a href="https://www.linkedin.com/in/juliano-sirtori/" target="_blank">
                <Icon name="IconLinkedin" />
              </a>
            </div>
          </div>
        </div>

        <div className="w-full flex lg:justify-center">
          <span className="text-gray">© Copyright 2023. Made by Juliano</span>
        </div>
      </div>
    </footer>
  )
}
