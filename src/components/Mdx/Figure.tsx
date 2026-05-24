import Image from "next/image";

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export function Figure({ src, alt, caption, width, height }: FigureProps) {
  return (
    <figure className="my-8">
      <div className="border-border overflow-hidden rounded-lg border">
        {width && height ? (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="h-auto w-full"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={src} alt={alt} className="h-auto w-full" />
        )}
      </div>
      {caption && (
        <figcaption className="text-fg-subtle mt-2 text-center text-xs">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
