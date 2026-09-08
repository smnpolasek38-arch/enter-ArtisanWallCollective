import { Frame, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";

const ICONS = [Truck, Frame, RotateCcw, ShieldCheck];

export const TrustBadges = () => {
  const { t } = useTranslation();
  const badges = [
    {
      title: t("trust.freeShipping.title"),
      text: t("trust.freeShipping.text"),
    },
    { title: t("trust.framed.title"), text: t("trust.framed.text") },
    { title: t("trust.returns.title"), text: t("trust.returns.text") },
    { title: t("trust.secure.title"), text: t("trust.secure.text") },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {badges.map((badge, i) => {
        const Icon = ICONS[i];
        return (
          <div key={badge.title} className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{badge.title}</p>
              <p className="text-sm text-muted-foreground">{badge.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
