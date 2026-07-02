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
      <Footer intro="Thanks for scrolling this far. I built this site from scratch, which is more or less how I’m built, concept to something real. If that’s who you’re looking for, drop me a line and let’s get to work." />
    </>
  );
}
