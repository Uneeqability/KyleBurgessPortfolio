import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HeroMAI from "@/components/work/mai/HeroMAI";
import MaiBody from "@/components/work/mai/MaiBody";

export default function MicrosoftAIWebsite() {
  return (
    <>
      <Nav tone="bar" />
      <main>
        <HeroMAI />
        <MaiBody />
      </main>
      <Footer moreProjects />
    </>
  );
}
