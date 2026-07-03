import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HeroBuild from "@/components/work/build/HeroBuild";
import BuildBody from "@/components/work/build/BuildBody";

export default function MicrosoftBuild() {
  return (
    <>
      <Nav tone="bar" />
      <main>
        <HeroBuild />
        <BuildBody />
      </main>
      <Footer moreProjects />
    </>
  );
}
