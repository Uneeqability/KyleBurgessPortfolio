import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HeroPresentation from "@/components/work/presentation/HeroPresentation";
import PresentationBody from "@/components/work/presentation/PresentationBody";

export default function Presentation() {
  return (
    <>
      <Nav tone="bar" />
      <main className="overflow-x-clip">
        <HeroPresentation />
        <PresentationBody />
      </main>
      <Footer moreProjects />
    </>
  );
}
