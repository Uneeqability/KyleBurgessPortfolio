import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import CreativeDirection from "@/components/home/CreativeDirection";
import Intro from "@/components/home/Intro";
import RecentProjects from "@/components/home/RecentProjects";
import FullRange from "@/components/home/FullRange";

export default function Home() {
  return (
    <>
      <Nav tone="cream" />
      <main>
        <Hero />
        <CreativeDirection />
        <Intro />
        <RecentProjects />
        <FullRange />
      </main>
      <Footer />
    </>
  );
}
