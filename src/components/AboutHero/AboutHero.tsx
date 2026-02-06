"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ReactNode } from "react";

interface AboutHeroProps {
  title: string;
  bioPhrase1: ReactNode;
  bioPhrase2: ReactNode;
  bioPhrase3: ReactNode;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function AboutHero({
  title,
  bioPhrase1,
  bioPhrase2,
  bioPhrase3,
}: AboutHeroProps) {
  return (
    <section className="relative">
      {/* Decorative gradient blobs */}
      <div className="from-pink/20 via-purple/10 absolute -top-20 -left-20 h-72 w-72 rounded-full bg-gradient-to-br to-transparent blur-3xl" />
      <div className="from-cyan/20 via-green/10 absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-gradient-to-br to-transparent blur-3xl" />

      <motion.div
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h1
          variants={itemVariants}
          className="text-primary mb-8 text-5xl font-bold"
        >
          <span className="from-pink to-purple bg-gradient-to-r bg-clip-text text-transparent">
            {title}
          </span>
        </motion.h1>

        <div className="flex w-full flex-col gap-8 md:flex-row md:justify-start">
          <motion.div
            variants={itemVariants}
            className="border-hover relative h-[400px] w-full overflow-hidden rounded-xl border shadow-[0_0_40px_-10px_rgba(149,128,255,0.3)] lg:w-[40%]"
          >
            <Image
              fill
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAP0lEQVQImQE0AMv/AFBQUJKSkqmpqaOjowCurq7v7+/Jycm5ubkA////jIyMn5+fg4ODADAwMD09PWlpaQAAAApRGnEHblMWAAAAAElFTkSuQmCC"
              priority
              className="object-cover"
              src="/images/juliano2.jpg"
              alt="juliano"
            />
          </motion.div>

          <div className="w-full lg:w-[50%]">
            <motion.p
              variants={itemVariants}
              className="text-secondary mb-4 text-base leading-8"
            >
              {bioPhrase1}
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-secondary mb-4 text-base leading-8"
            >
              {bioPhrase2}
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-secondary text-base leading-8"
            >
              {bioPhrase3}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
