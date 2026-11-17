"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Ban,
  BriefcaseBusiness,
  CircleAlert,
  FileCheck2,
  Gavel,
  Mail,
  Scale,
  ShieldAlert,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { SUPPORT_EMAIL } from "@/lib/constants";

const sections = [
  { id: "using-help-hub", icon: FileCheck2 },
  { id: "accounts", icon: UserRoundCheck },
  { id: "marketplace", icon: UsersRound },
  { id: "provider", icon: BriefcaseBusiness },
  { id: "rules", icon: Ban },
  { id: "payments", icon: BadgeCheck },
  { id: "liability", icon: Scale },
  { id: "changes", icon: Gavel },
];

export function TermConditions() {
  const { lang } = useLanguage();
  const bn = lang === "bn";

  const copy = bn
    ? {
        back: "হোমে ফিরুন",
        eyebrow: "আইনি চুক্তি",
        title: "শর্তাবলি",
        intro:
          "HelpHub BD ব্যবহার করে আপনি এই শর্তাবলি মেনে চলতে সম্মত হন। পরিষেবা অনুরোধ করার আগে, প্রদানকারীর তালিকা দেখা এবং অ্যাকাউন্ট ব্যবহারের নিয়মগুলো পড়ুন।",
        updated: "সর্বশেষ হালনাগাদ",
        date: "১৮ নভেম্বর ২০২৬",
        toc: "এই চুক্তিতে",
        summaryTitle: "চুক্তির সংক্ষিপ্তকরণ",
        summaryText:
          "HelpHub BD গ্রাহক ও স্থানীয় পরিষেবা প্রদানকারীদের সংযুক্ত করার একটি মিডিয়াম। নির্দিষ্ট কাজের ফলাফল, মূল্য বা কোন পক্ষের আচরণের জন্য আমরা সরাসরি দায়ী নই।",
        usingTitle: "সেবা ব্যবহারের শর্ত",
        usingText:
          "HelpHub BD বৈধ ব্যক্তিগত বা ব্যবসায়িক উদ্দেশ্যে ব্যবহার করতে হবে। অ্যাকাউন্ট তৈরি, অনুরোধ পাঠানো বা প্রদানের সব দিকের জন্য আপনি উত্তরদায়ী থাকবেন।",
        accountsTitle: "অ্যাকাউন্ট ও যাচাইকরণ",
        accountsText:
          "সঠিক ও বর্তমান তথ্য দিন। আপনার লগইন তথ্য সুরক্ষিত রাখুন। প্রতারণামূলক তথ্য বা অন্য কারো অ্যাকাউন্ট ব্যবহার করলে অ্যাকাউন্ট স্থগিত হতে পারে।",
        marketplaceTitle: "মার্কেটপ্লেস সম্পর্ক",
        marketplaceText:
          "HelpHub BD প্রকাশিত তালিকা বা অনুরোধের নিশ্চয়তা দেয় না। গ্রাহক ও প্রদানকারীই কাজের বিবরণ, সময়, মূল্য ও ফলাফল সরাসরি সম্মত হন।",
        providerTitle: "পরিষেবা প্রদানকারীর দায়িত্ব",
        providerText:
          "প্রদানকারীদের সত্য তথ্য দিতে, প্রয়োজনীয় অনুমতি ও দক্ষতা রাখতে এবং সম্মত কাজ নিরাপদ ও professionally সম্পন্ন করতে হবে।",
        rulesTitle: "গ্রহণযোগ্য ব্যবহার",
        rulesItems: [
          "কোনো মিথ্যা, বিভ্রান্তিকর বা অবৈধ তালিকা প্রকাশ নয়",
          "হয়রানি, গোপনীয়তা লঙ্ঘন বা ব্যবহারকারীর ক্ষতি করা নয়",
          "প্রতারণা, স্প্যাম বা অনুমোদন ছাড়া স্বয়ংক্রিয় কার্যকলাপ নয়",
          "অননুমোদিতভাবে ডেটা সংগ্রহ বা প্ল্যাটফর্মে প্রবেশ করা নয়",
        ],
        paymentsTitle: "মূল্য, অর্থপ্রদান ও রিফান্ড",
        paymentsText:
          "কোনো ফি বা অর্থপ্রদানের প্রক্রিয়া এই শর্তে তালিকাভুক্ত থাকলে তা ব্যবহারের আগে স্পষ্ট করা হবে। সরাসরি প্রদত্ত মূল্যের আলোচনায় HelpHub BD অংশগ্রহণ বা নিশ্চয়তা প্রদান করে না। রিফান্ড সংক্রান্ত দাবিগুলো প্রযোজ্য আইন ও সংশ্লিষ্ট পক্ষের চুক্তি অনুযায়ী নির্ধারিত হয়।",
        liabilityTitle: "দায়সীমা",
        liabilityText:
          "আইন দ্বারা নিষিদ্ধ না হলে, স্থানীয় পরিষেবা প্রদানের জন্য বহিরাগত পক্ষের কাজ, কোনো ক্ষতি, বিরতি বা তথ্য হারের জন্য HelpHub BD দায়বদ্ধ থাকবে না। অপ্রাপ্তিযোগ্যতার ক্ষেত্রে সাপোর্ট ও যুক্তিসঙ্গত প্রতিকার দেওয়ার চেষ্টা করা হবে।",
        terminationTitle: "স্থগিতকরণ ও সমাপ্তি",
        terminationText:
          "শর্ত লঙ্ঘন, প্রতারণামূলক কার্যকলাপ, নিরাপত্তা ঝুঁকি বা আইনি বাধ্যবাধকতার জন্য আমরা অ্যাকাউন্ট বা প্রবেশাধিকার সীমিত, স্থগিত বা বন্ধ করতে পারি।",
        changesTitle: "শর্ত পরিবর্তন",
        changesText:
          "প্রয়োজন অনুযায়ী এই শর্ত হালনাগাদ হতে পারে। গুরুত্বপূর্ণ পরিবর্তনের পর সেবা চালিয়ে গেলে সংশোধিত শর্ত গ্রহণ করা হয়েছে বলে বিবেচিত হবে।",
        contactTitle: "কোনো প্রশ্ন আছে?",
        contactText:
          "এই শর্তাবলি নিয়ে পরিষ্কারতা চাইলে আমাদের সাপোর্ট দলের সঙ্গে যোগাযোগ করুন।",
        contactButton: "সাপোর্টে ইমেইল করুন",
      }
    : {
        back: "Back to home",
        eyebrow: "Legal agreement",
        title: "Terms & Conditions",
        intro:
          "By using HelpHub BD, you agree to these terms. Please review the rules for browsing listings, requesting services and maintaining an account.",
        updated: "Last updated",
        date: "November 18, 2026",
        toc: "On this page",
        summaryTitle: "A simple summary",
        summaryText:
          "HelpHub BD connects customers with local service providers. We are a marketplace, not the employer or direct provider of every listing or service request.",
        usingTitle: "Using HelpHub BD",
        usingText:
          "Use the platform only for lawful personal or business purposes. You are responsible for the information submitted through your account and for every request you make or accept.",
        accountsTitle: "Accounts and verification",
        accountsText:
          "Provide accurate, current information and protect your login credentials. Accounts may be restricted if they contain false details, are used without authorization or threaten platform safety.",
        marketplaceTitle: "Marketplace relationship",
        marketplaceText:
          "Listings, availability and reviews do not guarantee a provider’s result or conduct. Customers and providers are responsible for agreeing on scope, timing, price and the completion of each service.",
        providerTitle: "Provider responsibilities",
        providerText:
          "Providers must provide truthful information, hold required qualifications or permits, communicate clearly and complete agreed work safely and professionally.",
        rulesTitle: "Acceptable use",
        rulesItems: [
          "Do not publish false, misleading or unlawful listings",
          "Do not harass users or misuse another person’s private information",
          "Do not send spam, commit fraud or run unauthorized automated activity",
          "Do not attempt to bypass security or collect platform data without permission",
        ],
        paymentsTitle: "Pricing, payments and refunds",
        paymentsText:
          "Any applicable platform fee or payment process will be presented clearly. HelpHub BD does not participate in or guarantee private arrangements, advance payments or refund decisions unless an applicable feature states otherwise.",
        liabilityTitle: "Limitation of liability",
        liabilityText:
          "To the maximum extent allowed by law, HelpHub BD is not responsible for third-party provider conduct, interrupted access, service outcomes or indirect losses. Reasonable support will be provided for safety and platform issues.",
        terminationTitle: "Suspension and termination",
        terminationText:
          "We may restrict, suspend or close accounts that breach these terms, create safety risks, involve fraud or require action for legal compliance.",
        changesTitle: "Changes to these terms",
        changesText:
          "We may revise these terms as the service evolves. Continued use after a material update means you accept the revised terms.",
        contactTitle: "Need clarification?",
        contactText:
          "Our support team can help answer questions about these terms and conditions.",
        contactButton: "Email support",
      };

  const toc = bn
    ? [
        ["using-help-hub", "সেবা ব্যবহারের শর্ত"],
        ["accounts", "অ্যাকাউন্ট ও যাচাইকরণ"],
        ["marketplace", "মার্কেটপ্লেস সম্পর্ক"],
        ["provider", "পরিষেবা প্রদানকারীর দায়িত্ব"],
        ["rules", "গ্রহণযোগ্য ব্যবহার"],
        ["payments", "মূল্য ও অর্থপ্রদান"],
        ["liability", "দায়সীমা"],
        ["changes", "শর্ত পরিবর্তন"],
      ]
    : [
        ["using-help-hub", "Using HelpHub BD"],
        ["accounts", "Accounts and verification"],
        ["marketplace", "Marketplace relationship"],
        ["provider", "Provider responsibilities"],
        ["rules", "Acceptable use"],
        ["payments", "Pricing and payments"],
        ["liability", "Limitation of liability"],
        ["changes", "Changes to terms"],
      ];

  const heading = (id: string, title: string) => {
    const section = sections.find((item) => item.id === id);
    const Icon = section?.icon ?? CircleAlert;

    return (
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
          <Icon className="size-5" />
        </span>
        <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        {copy.back}
      </Link>

      <header className="relative mt-6 overflow-hidden rounded-3xl border border-brand-100 bg-linear-to-br from-brand-50 via-background to-brand-100/50 px-6 py-10 sm:px-10 sm:py-12 dark:border-brand-800/40 dark:from-brand-950/40 dark:via-background dark:to-brand-900/20">
        <div className="absolute -right-16 -top-20 size-56 rounded-full border border-brand-200/50 dark:border-brand-700/20" />
        <div className="absolute -bottom-24 right-12 size-44 rounded-full border border-brand-200/40 dark:border-brand-700/20" />
        <div className="relative max-w-2xl">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">
            <ShieldAlert className="size-4" />
            {copy.eyebrow}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            {copy.intro}
          </p>
          <p className="mt-6 text-xs text-muted-foreground">
            {copy.updated}:{" "}
            <span className="font-semibold text-foreground">{copy.date}</span>
          </p>
        </div>
      </header>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[220px_minmax(0,680px)] lg:justify-center">
        <aside className="lg:sticky lg:top-24">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="px-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {copy.toc}
            </p>
            <nav className="mt-3 grid gap-1">
              {toc.map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-900/20 dark:hover:text-brand-300"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <article className="min-w-0 space-y-10">
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold sm:text-2xl">
              {copy.summaryTitle}
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              {copy.summaryText}
            </p>
          </section>

          <section id="using-help-hub" className="scroll-mt-24">
            {heading("using-help-hub", copy.usingTitle)}
            <p className="mt-4 leading-7 text-muted-foreground">
              {copy.usingText}
            </p>
          </section>

          <section id="accounts" className="scroll-mt-24">
            {heading("accounts", copy.accountsTitle)}
            <p className="mt-4 leading-7 text-muted-foreground">
              {copy.accountsText}
            </p>
          </section>

          <section id="marketplace" className="scroll-mt-24">
            {heading("marketplace", copy.marketplaceTitle)}
            <p className="mt-4 leading-7 text-muted-foreground">
              {copy.marketplaceText}
            </p>
          </section>

          <section id="provider" className="scroll-mt-24">
            {heading("provider", copy.providerTitle)}
            <p className="mt-4 leading-7 text-muted-foreground">
              {copy.providerText}
            </p>
          </section>

          <section id="rules" className="scroll-mt-24">
            {heading("rules", copy.rulesTitle)}
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {copy.rulesItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-border p-4 text-sm leading-6"
                >
                  <Ban className="mt-0.5 size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section id="payments" className="scroll-mt-24">
            {heading("payments", copy.paymentsTitle)}
            <p className="mt-4 leading-7 text-muted-foreground">
              {copy.paymentsText}
            </p>
          </section>

          <section id="liability" className="scroll-mt-24">
            {heading("liability", copy.liabilityTitle)}
            <p className="mt-4 leading-7 text-muted-foreground">
              {copy.liabilityText}
            </p>

            <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
              <div>
                <h3 className="font-bold">{copy.terminationTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {copy.terminationText}
                </p>
              </div>
              <div>
                <h3 className="font-bold">{copy.changesTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {copy.changesText}
                </p>
              </div>
            </div>
          </section>

          <section className="flex flex-col items-start justify-between gap-5 rounded-3xl bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center sm:p-8">
            <div>
              <h2 className="text-xl font-bold">{copy.contactTitle}</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-primary-foreground/75">
                {copy.contactText}
              </p>
            </div>
            <Link
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-background px-5 py-2.5 text-sm font-bold text-foreground shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <Mail className="size-4" />
              {copy.contactButton}
            </Link>
          </section>
        </article>
      </div>
    </div>
  );
}
