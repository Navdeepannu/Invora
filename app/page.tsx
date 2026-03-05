import FAQsTwo from "@/components/home/faqs";
import { Features } from "@/components/home/features";
import Footer from "@/components/home/footer";
import { HeroSection } from "@/components/home/hero-section";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Features />
      <FAQsTwo />
      <Footer />
    </div>
  );
}
