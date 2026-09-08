import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeading = ({
  kicker,
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeadingProps) => (
  <div
    className={cn(
      "mb-10 flex flex-col gap-3 md:mb-14",
      align === "center" && "items-center text-center",
      className,
    )}
  >
    {kicker ? <span className="kicker">{kicker}</span> : null}
    <h2 className="headline-l max-w-2xl">{title}</h2>
    {subtitle ? (
      <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
        {subtitle}
      </p>
    ) : null}
  </div>
);
