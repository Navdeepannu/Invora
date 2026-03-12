import FAQsTwo from "@/components/home/faqs";
import { FeaturesBento } from "@/components/home/features-bento";
import Footer from "@/components/home/footer";
import { HeroSection } from "@/components/home/hero-section";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturesBento />
      <FAQsTwo />
      <Footer />
    </div>
  );
}
