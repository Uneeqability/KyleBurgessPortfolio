import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HeroTwain from "@/components/work/twain/HeroTwain";
import TwainBody from "@/components/work/twain/TwainBody";

export default function TwainDatingApp() {
  return (
    <>
      <Nav tone="bar" />
      <main>
        <HeroTwain />
        <TwainBody />
      </main>
      <Footer moreProjects />
    </>
  );
}
