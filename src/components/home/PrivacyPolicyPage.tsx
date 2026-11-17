"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Cookie,
  Database,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Trash2,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { SUPPORT_EMAIL } from "@/lib/constants";

const sections = [
  { id: "information", icon: Database },
  { id: "how-we-use", icon: UserRound },
  { id: "sharing", icon: UsersRound },
  { id: "security", icon: LockKeyhole },
  { id: "cookies", icon: Cookie },
  { id: "your-rights", icon: Trash2 },
];

export function PrivacyPolicyPage() {
  const { lang } = useLanguage();
  const bn = lang === "bn";

  const copy = bn
    ? {
        back: "হোমে ফিরুন",
        eyebrow: "আইনি তথ্য",
        title: "গোপনীয়তা নীতি",
        intro:
          "আপনার ব্যক্তিগত তথ্য আমাদের কাছে গুরুত্বপূর্ণ। HelpHub BD কীভাবে তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত রাখে—এ পৃষ্ঠায় তা স্পষ্টভাবে ব্যাখ্যা করা হয়েছে।",
        updated: "সর্বশেষ হালনাগাদ",
        date: "১৮ নভেম্বর ২০২৬",
        toc: "এই নীতিতে",
        introTitle: "আমাদের প্রতিশ্রুতি",
        introText:
          "HelpHub BD ব্যবহার করার জন্য ধন্যবাদ। এই নীতি বাংলাদেশের স্থানীয় পরিষেবা বাজারে আপনার গোপনীয়তা রক্ষা করার জন্য আমাদের পদ্ধতি ব্যাখ্যা করে।",
        informationTitle: "আমরা কোন তথ্য সংগ্রহ করি",
        informationText:
          "পরিষেবা খোঁজা, অনুরোধ করা বা প্রদানকারী হিসাবে তালিকাভুক্ত হওয়ার সময় আপনি যেসব তথ্য স্বেচ্ছায় দেন, সেগুলো আমরা সংগ্রহ করতে পারি:",
        informationItems: [
          "নাম, ফোন নম্বর, ইমেইল এবং প্রোফাইল ছবি",
          "ঠিকানা, এলাকা বা পরিষেবা প্রদানের অবস্থান",
          "পরিষেবা অনুরোধ, বার্তা, পর্যালোচনা এবং রেটিং",
          "প্রদানকারীর যোগ্যতা, পরিচয় বা প্রয়োজনীয় যাচাইকরণ তথ্য",
        ],
        useTitle: "তথ্য কীভাবে ব্যবহার করি",
        useItems: [
          "অ্যাকাউন্ট তৈরি এবং পরিচালনা করতে",
          "গ্রাহক ও প্রদানকারীর মধ্যে অনুরোধের যোগাযোগ সহজ করতে",
          "বৈধতা যাচাই, প্রতারণা প্রতিরোধ এবং নিরাপত্তা নিশ্চিত করতে",
          "সেবা উন্নত করতে এবং সাপোর্ট প্রদান করতে",
        ],
        sharingTitle: "তথ্য কার সঙ্গে শেয়ার করা হতে পারে",
        sharingText:
          "আপনার স্পষ্ট সম্মতি বা বৈধ অনুরোধ ব্যতীত বিপণনকারীকে ব্যক্তিগত তথ্য বিক্রি করি না। প্রয়োজনভেদে শেয়ার হতে পারে:",
        sharingItems: [
          "আপনি যে নির্দিষ্ট প্রদানকারীর অনুরোধ করেছেন, তাঁর সঙ্গে যোগাযোগের তথ্য",
          "হোস্টিং, ডাটাবেস, ছবি বা বিজ্ঞপ্তি সংক্রান্ত বিশ্বস্ত প্রযুক্তি সরবরাহকারীর সঙ্গে",
          "আইনগত প্রয়োজন বা নিরাপত্তা ও প্রতারণা তদন্তের ক্ষেত্রে",
        ],
        securityTitle: "তথ্যের নিরাপত্তা",
        securityText:
          "আমরা তথ্যের অননুমোদিত প্রবেশ বা পরিবর্তন থেকে রক্ষা করতে যুক্তিসঙ্গত প্রশাসনিক ও প্রযুক্তিগত ব্যবস্থা ব্যবহার করি। তবে ইন্টারনেটে কোনও পদ্ধতিই একেবারে নিশ্চিতভাবে নিরাপদ নয়।",
        cookiesTitle: "কুকি ও স্থানীয় স্টোরেজ",
        cookiesText:
          "আমরা ভাষা পছন্দ, সেশন এবং মৌলিক সাইট কার্যকারিতা মনে রাখতে কুকি ও ব্রাউজার স্টোরেজ ব্যবহার করতে পারি। ব্রাউজারের সেটিং থেকে এগুলো নিয়ন্ত্রণ করা যেতে পারে।",
        rightsTitle: "আপনার অধিকার",
        rightsText:
          "আপনার তথ্য দেখতে, সংশোধন করতে, মুছে দিতে অথবা কিছু প্রসেসিংয়ের সম্মতি প্রত্যাহার করতে চাইলে আমাদের সঙ্গে যোগাযোগ করুন। বৈধ আইনি শর্ত অনুযায়ী অনুরোধসমূহ পূরণ করা হবে।",
        retentionTitle: "তথ্য সংরক্ষণ",
        retentionText:
          "পরিষেবার জন্য প্রয়োজন, বৈধ হিসাব ও নিরাপত্তার চাহিদা অনুযায়ী তথ্য সংরক্ষণ করা হয়। প্রয়োজন শেষ হলে যুক্তিসঙ্গতভাবে সরিয়ে ফেলা হয়।",
        childrenTitle: "শিশুর গোপনীয়তা",
        childrenText:
          "এই পরিষেবা ১৮ বছরের নিচের ব্যক্তিদের জন্য তৈরি নয়। আমরা সচেতনভাবে শিশুদের ব্যক্তিগত তথ্য সংগ্রহ করি না।",
        changesTitle: "নীতির পরিবর্তন",
        changesText:
          "এই নীতি সময়ে সময়ে হালনাগাদ হতে পারে। গুরুত্বপূর্ণ পরিবর্তন হলে এই পৃষ্ঠায় নতুন তারিখসহ জানানো হবে।",
        contactTitle: "প্রশ্ন আছে?",
        contactText:
          "আমাদের গোপনীয়তা অনুশীলন সম্পর্কে জানতে চান? আমাদের সাপোর্ট দল সাহায্য করতে প্রস্তুত।",
        contactButton: "ইমেইল পাঠান",
      }
    : {
        back: "Back to home",
        eyebrow: "Legal information",
        title: "Privacy Policy",
        intro:
          "Your personal information matters to us. This page explains how HelpHub BD collects, uses and protects information across its local services marketplace.",
        updated: "Last updated",
        date: "November 18, 2026",
        toc: "On this page",
        introTitle: "Our commitment",
        introText:
          "Thank you for using HelpHub BD. This policy explains how we handle privacy while helping people in Bangladesh discover trusted local service providers.",
        informationTitle: "Information we collect",
        informationText:
          "We may collect information that you voluntarily provide when browsing, making a service request or registering as a provider:",
        informationItems: [
          "Name, phone number, email address and profile photo",
          "Address, locality or service area",
          "Service requests, messages, reviews and ratings",
          "Provider qualifications, identity or required verification details",
        ],
        useTitle: "How we use information",
        useItems: [
          "Create and manage your account",
          "Connect customers with suitable service providers",
          "Verify listings, prevent fraud and keep the platform safe",
          "Improve services and provide customer support",
        ],
        sharingTitle: "When information may be shared",
        sharingText:
          "We do not sell personal information to marketers. Limited sharing may occur with:",
        sharingItems: [
          "The specific provider you request or communicate with",
          "Trusted technology providers for hosting, database, media or notifications",
          "Authorities or investigators when required by law or to address safety concerns",
        ],
        securityTitle: "How we protect data",
        securityText:
          "We use reasonable administrative and technical safeguards to protect information from unauthorized access or alteration. However, no internet transmission or storage method is completely secure.",
        cookiesTitle: "Cookies and local storage",
        cookiesText:
          "We may use cookies and browser storage to remember language preferences, sessions and basic site functionality. You can control these through your browser settings.",
        rightsTitle: "Your choices and rights",
        rightsText:
          "You may request to view, correct or delete your information, or withdraw consent for certain processing. Contact us and we will respond where required by applicable law.",
        retentionTitle: "Data retention",
        retentionText:
          "We retain information for as long as needed to provide the service, meet legal obligations and protect legitimate safety and fraud-prevention interests.",
        childrenTitle: "Children’s privacy",
        childrenText:
          "HelpHub BD is not directed to children under 18. We do not knowingly collect personal information from children.",
        changesTitle: "Changes to this policy",
        changesText:
          "We may update this policy as the service evolves. Material changes will be posted on this page with a revised effective date.",
        contactTitle: "Have a question?",
        contactText:
          "Want to know more about our privacy practices? Our support team is ready to help.",
        contactButton: "Send an email",
      };

  const toc = bn
    ? [
        ["information", "আমরা কোন তথ্য সংগ্রহ করি"],
        ["how-we-use", "তথ্য কীভাবে ব্যবহার করি"],
        ["sharing", "তথ্য শেয়ার"],
        ["security", "তথ্যের নিরাপত্তা"],
        ["cookies", "কুকি ও স্থানীয় স্টোরেজ"],
        ["your-rights", "আপনার অধিকার"],
      ]
    : [
        ["information", "Information we collect"],
        ["how-we-use", "How we use information"],
        ["sharing", "When information is shared"],
        ["security", "How we protect data"],
        ["cookies", "Cookies and local storage"],
        ["your-rights", "Your choices and rights"],
      ];

  const sectionHeading = (id: string, title: string) => {
    const section = sections.find((item) => item.id === id);
    const Icon = section?.icon ?? ShieldCheck;
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
            <ShieldCheck className="size-4" />
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
            <h2 className="text-xl font-bold sm:text-2xl">{copy.introTitle}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              {copy.introText}
            </p>
          </section>

          <section id="information" className="scroll-mt-24">
            {sectionHeading("information", copy.informationTitle)}
            <p className="mt-4 leading-7 text-muted-foreground">
              {copy.informationText}
            </p>
            <ul className="mt-5 grid gap-3">
              {copy.informationItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-muted/50 px-4 py-3 text-sm leading-6"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section id="how-we-use" className="scroll-mt-24">
            {sectionHeading("how-we-use", copy.useTitle)}
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {copy.useItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-border p-4 text-sm leading-6"
                >
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section id="sharing" className="scroll-mt-24">
            {sectionHeading("sharing", copy.sharingTitle)}
            <p className="mt-4 leading-7 text-muted-foreground">
              {copy.sharingText}
            </p>
            <ul className="mt-5 space-y-3">
              {copy.sharingItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section id="security" className="scroll-mt-24">
            {sectionHeading("security", copy.securityTitle)}
            <p className="mt-4 leading-7 text-muted-foreground">
              {copy.securityText}
            </p>
          </section>

          <section id="cookies" className="scroll-mt-24">
            {sectionHeading("cookies", copy.cookiesTitle)}
            <p className="mt-4 leading-7 text-muted-foreground">
              {copy.cookiesText}
            </p>
          </section>

          <section id="your-rights" className="scroll-mt-24">
            {sectionHeading("your-rights", copy.rightsTitle)}
            <p className="mt-4 leading-7 text-muted-foreground">
              {copy.rightsText}
            </p>

            <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
              <div>
                <h3 className="font-bold">{copy.retentionTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {copy.retentionText}
                </p>
              </div>
              <div>
                <h3 className="font-bold">{copy.childrenTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {copy.childrenText}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-muted/30 p-6 sm:p-8">
            <h2 className="text-xl font-bold">{copy.changesTitle}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              {copy.changesText}
            </p>
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
