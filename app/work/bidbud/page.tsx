import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HeroBidBud from "@/components/work/bidbud/HeroBidBud";
import BidBudBody from "@/components/work/bidbud/BidBudBody";

export default function BidBud() {
  return (
    <>
      <Nav tone="bar" />
      <main className="overflow-x-clip">
        <HeroBidBud />
        <BidBudBody />
      </main>
      <Footer moreProjects />
    </>
  );
}
