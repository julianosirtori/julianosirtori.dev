import { Button } from "@/components/atoms/Button/Button"
import { ImageSVG } from "@/components/atoms/ImageSVG"
import { Title } from "@/components/molecules/Title"

export const AboutMe = () => {
  return (
    <section className="relative overflow-hidden">
      <ImageSVG name="rectangle" width="155px" height="155px" className="absolute left-[-70px] top-12 hidden lg:block" />
      <ImageSVG name="dots" width="103px" height="103px" className="absolute right-[-20px] bottom-12 hidden lg:block" />
      <div className="w-full px-4 lg:max-w-screen-lg lg:m-auto">
        <Title level={2} variant="secondary" className="mb-4" >
          about-me
        </Title>
        <div className="w-full flex flex-row">
          <div className="flex flex-col gap-4 w-full max-w-lg">
            <p className="text-gray ">
              Hello, I’m Juliano!
            </p>
            <p className="text-gray ">
              I am a web developer specialized in large-scale international projects. My expertise includes the development of robust and scalable web applications, as well as the integration with different technologies.

            </p>
            <p className="text-gray ">
              I am highly skilled in working in multidisciplinary teams and agile environments, which allows me to deliver high-quality solutions within the established deadlines.
            </p>
            <p className="text-gray">
              As a professional, I am always seeking to learn and update myself to stay at the forefront of new technologies and market trends. With my vast experience in web development, I am able to create efficient and customized solutions to meet the specific needs of my clients. My goal is always to exceed expectations and ensure total customer satisfaction.
            </p>
            <Button variant="primary" className="max-w-[160px]">
              {`Read more ->`}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}