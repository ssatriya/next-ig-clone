import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

const Container = ({ children, className }: ContainerProps) => {
  return <div className={cn("pl-4 pr-1 py-[14px]", className)}>{children}</div>;
};
export default Container;
