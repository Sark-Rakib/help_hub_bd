import { HomeSearchSection } from "@/components/home/HomeSearchSection";
import { PopularServices } from "@/components/home/PopularServices";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedProviders } from "@/components/home/FeaturedProviders";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { EmergencyBanner } from "@/components/home/EmergencyBanner";
import { BecomeProviderCTA } from "@/components/home/BecomeProviderCTA";
import { FAQ } from "@/components/home/FAQ";

export default function HomePage() {
  return (
    <>
      <HomeSearchSection />
      <PopularServices />
      <HowItWorks />
      <FeaturedProviders />
      <WhyChooseUs />
      <EmergencyBanner />
      <BecomeProviderCTA />
      <FAQ />
    </>
  );
}