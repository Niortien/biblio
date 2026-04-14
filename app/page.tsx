import DocumentBrowser from "@/components/common/document-browser";
import HeroSection from "@/components/common/hero-section";
import Header from "@/components/common/Header";

export default function Home() {
  return (
    <div className="">
      <Header/>
      <HeroSection/>
      <DocumentBrowser/>
    </div>
  );
}
