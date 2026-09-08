import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  size?: string;
  className?: string;
}

export const RatingStars = ({
  rating,
  size = "h-4 w-4",
  className,
}: RatingStarsProps) => {
  const rounded = Math.round(rating);
  return (
    <div
      role="img"
      aria-label={`Rated ${rating} out of 5`}
      className={cn("flex items-center gap-0.5", className)}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(
            size,
            i < rounded
              ? "fill-foreground text-foreground"
              : "fill-border text-border",
          )}
        />
      ))}
    </div>
  );
};
