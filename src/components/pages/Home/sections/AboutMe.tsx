import { Button } from "@/components/shared/Button/Button"
import { Title } from "@/components/shared/Title"

export const AboutMe = () => {
  return (
    <section className="w-full px-4 lg:max-w-screen-lg lg:m-auto">
      <Title level={2} variant="secondary" className="mb-4" >
        about-me
      </Title>
      <div className="w-full flex flex-row">
        <div className="flex flex-col gap-4 w-full max-w-lg">
          <p className="text-gray ">
            Hello, i’m Elias!
          </p>
          <p className="text-gray ">
            I’m a self-taught front-end developer based in Kyiv, Ukraine. I can develop responsive websites from scratch and raise them into modern user-friendly web experiences.
          </p>
          <p className="text-gray ">
            Transforming my creativity and knowledge into a websites has been my passion for over a year. I have been helping various clients to establish their presence online. I always strive to learn about the newest technologies and frameworks.
          </p>
          <Button variant="primary" className="max-w-[160px]">
            {`Read more ->`}
          </Button>
        </div>
      </div>



    </section>
  )
}