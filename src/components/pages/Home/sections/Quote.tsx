import { Icon } from "@/components/shared/Icon"

export const Quote = () => {
  return (
    <section className="m-auto">
      <div className="flex flex-col items-end mx-4  relative ">
        <Icon name="IconQuote" className="absolute left-3 top-[-14px]" />
        <div className="border border-gray ">
          <p className="text-white font-medium p-8 lg:text-2xl">
            With great power comes great
            electricity bill
          </p>

        </div>
        <Icon name="IconQuote" className="absolute right-3 bottom-12" />
        <div className="max-w-max border-b border-r border-l border-gray p-4">
          <span className="text-white text-xl">
            - Dr. Who
          </span>
        </div>
      </div>

    </section>
  )
}