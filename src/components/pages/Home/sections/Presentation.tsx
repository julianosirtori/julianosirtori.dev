"use client";
import { Button } from "@/components/atoms/Button";
import { ImageSVG } from "@/components/atoms/ImageSVG";
import { palletColor } from "@/utils/theme/pallet";
import { useReducedMotion, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export const Presentation = () => {
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations("home");

  const childVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="mt-5 flex w-full flex-col gap-6 overflow-hidden px-4 lg:m-auto lg:mt-16 lg:max-w-5xl lg:flex-row lg:items-center">
      <motion.div
        initial="initial"
        animate="visible"
        variants={{
          initial: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
        className="flex w-full flex-col gap-6 pb-8"
      >
        <motion.h1
          variants={childVariants}
          className="text-primary max-w-sm text-2xl font-semibold "
        >
          {t.rich("title", {
            span: (children) => (
              <span className="text-highlight">{children}</span>
            ),
          })}
        </motion.h1>
        <motion.p variants={childVariants} className="text-secondary ">
          {t("subtitle")}
        </motion.p>
        <Link href={`/files/${t("linkCurriculum")}`} target="_blank">
          <Button variant="highlight" className="max-w-max	">
            {t("buttonCurriculum")}
          </Button>
        </Link>
      </motion.div>
      <motion.div className="flex w-full flex-col items-center overflow-hidden">
        <div className="relative h-80 w-full max-w-sm">
          <ImageSVG
            name="logo"
            width="104px"
            height="104px"
            className="absolute left-[-1px] top-10 z-0 text-highlight"
          />
          <Image
            src={`/images/juliano_${palletColor}.png`}
            width="0"
            height="0"
            sizes="100vw"
            alt="Juliano`s photo"
            className="z-1 absolute h-auto w-full"
          />
          <ImageSVG
            name="dots"
            width="60px"
            height="60px"
            className="z-2 absolute bottom-8 right-4 text-black dark:text-white"
          />
        </div>
        <div className="border-gray bg-primary z-10 flex w-full max-w-sm flex-row items-center gap-2 border p-2">
          <div className="h-4 w-4 bg-highlight" />
          <div className="flex flex-col lg:flex-row">
            <span className="text-secondary mr-2 font-semibold">
              {t("currentlyWork")}
            </span>
            <a href={t("currentlyCompanyLink")} target="_blank">
              <span className="text-primary font-bold">
                {t("currentlyCompany")}
              </span>
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
