export const Rectangle = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="86"
      height="86"
      viewBox="0 0 86 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="0.5" y="0.5" width="85" height="85" stroke="currentColor" />
    </svg>
  );
};
