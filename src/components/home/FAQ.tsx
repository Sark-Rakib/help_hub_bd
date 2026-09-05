"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

export function FAQ() {
  const { t } = useLanguage();
  return (
    <section id="faq" className="scroll-mt-20 border-t border-border/60 bg-muted/30 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-balance sm:text-3xl">
            {t("Easy questions — easy answers")}
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            {t("Answers to common questions are all here")}
          </p>
        </div>

        <Accordion className="mt-8 rounded-2xl border border-border bg-card px-4 sm:px-6">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={item.question} value={`item-${i}`}>
              <AccordionTrigger>{t(item.question)}</AccordionTrigger>
              <AccordionContent>{t(item.answer)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}