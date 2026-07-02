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
      <Footer
        moreProjects
        intro="In hindsight, the hard part of this project was the resourcing. When we ran out of people, I put on whatever hat it took, WordPress, tooling, design. Turns out I’d been quietly training for a week like this since I was a dorky teen making MySpace layouts."
      />
    </>
  );
}
