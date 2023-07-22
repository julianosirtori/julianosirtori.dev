export interface IPageProps extends React.HTMLAttributes<HTMLDivElement> {
  hideHeader?: boolean;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export interface IPageSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children?: React.ReactNode;
}