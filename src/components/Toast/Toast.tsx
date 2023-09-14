"use client";
import {
  Close,
  Description,
  Provider,
  Root,
  Title,
  Viewport,
} from "@radix-ui/react-toast";
import { CheckIcon, Cross2Icon, CrossCircledIcon } from "@radix-ui/react-icons";

type TToastProps = {
  title: string;
  description: string;
  isSuccess: boolean;
  showToast: boolean;
  setShowToast: (state: boolean) => void;
  children?: React.ReactNode;
};

export const Toast = ({
  title,
  description,
  isSuccess,
  showToast,
  setShowToast,
  children,
}: TToastProps) => {
  return (
    <Provider swipeDirection="right">
      {children}
      <Root
        className="data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=end]:animate-swipeOut z-30 m-0 flex items-center gap-2 overflow-hidden rounded border border-gray-600 bg-hover p-3 text-sm text-gray-500 data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
        open={showToast}
        onOpenChange={setShowToast}
      >
        {isSuccess ? (
          <CheckIcon className="text-[#4cb782]" />
        ) : (
          <CrossCircledIcon className="text-[#b75c4c]" />
        )}
        <div>
          <Title className="leading-7 text-primary">{title}</Title>
          <Description asChild className="-mt-1 leading-7">
            {description}
          </Description>
        </div>

        <Close
          aria-label="close"
          className="absolute right-0 top-0 h-8 w-8 rounded-full bg-background text-lg text-gray-500 duration-200 ease-out hover:text-primary"
        >
          <Cross2Icon />
        </Close>
      </Root>
      <Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
    </Provider>
  );
};
