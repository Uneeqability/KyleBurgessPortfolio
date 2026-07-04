import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HeroProd from "@/components/work/prod/HeroProd";
import ProdBody from "@/components/work/prod/ProdBody";

export default function Production() {
  return (
    <>
      <Nav tone="bar" />
      <main className="overflow-x-clip">
        <HeroProd />
        <ProdBody />
      </main>
      <Footer moreProjects />
    </>
  );
}
