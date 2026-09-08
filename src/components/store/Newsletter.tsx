import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Newsletter = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (subscribed) {
    return (
      <p className="text-center text-base text-foreground md:text-lg">
        {t("home.newsletter.success")}
      </p>
    );
  }

  return (
    <form
      className="mx-auto flex w-full max-w-md flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        if (email.trim()) setSubscribed(true);
      }}
    >
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("home.newsletter.placeholder")}
        className="h-12 rounded-none border-border bg-card px-4"
      />
      <Button
        type="submit"
        size="xl"
        variant="cta"
        className="shrink-0"
      >
        {t("home.newsletter.cta")}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
};
