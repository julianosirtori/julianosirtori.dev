import { I18n } from "@/common/types"
import { TagBox } from "@/components/TagBox"

export const Presentation = ({ i18n }: I18n) => {
  return (
    <section className="bg-bgPrimary h-screen flex items-center px-32">
      <main>
        <TagBox withOutTagClose text="html">
          <TagBox withOutTagClose text="body" container={{ className: 'pt-5 pl-12' }}>
            <TagBox text="h1" container={{ className: 'pl-14' }} className="mb-12 max-w-xl w-full">
              <h1 className="text-primary font-darker text-6xl leading-none">{i18n.title}</h1>
            </TagBox>
            <TagBox text="p" container={{ className: 'pl-14' }} className="mb-12 max-w-2xl w-full">
              <p className="font-spaceMono text-base text-primary">{i18n.subtitleLine1}</p>
              <p className="font-spaceMono text-base text-primary">{i18n.subtitleLine2}</p>
            </TagBox>
            <TagBox text="button" container={{ className: 'pl-14 py-1' }}>
              <button className="bg-primary rounded-md text-xl px-4 py-2 font-spaceMono text-white flex flex-row items-center">
                <span className="mr-4">{i18n.button}</span>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="animate-bounce">
                  <path d="M10 20L0 10L1.75 8.21875L8.75 15.2187V0H11.25V15.2187L18.25 8.21875L20 10L10 20Z" fill="#F4F5FB" />
                  <path d="M10 20L0 10L1.75 8.21875L8.75 15.2187V0H11.25V15.2187L18.25 8.21875L20 10L10 20Z" stroke="#F4F5FB" />
                </svg>


              </button>
            </TagBox>
          </TagBox>
        </TagBox>
      </main>
    </section>
  )
}