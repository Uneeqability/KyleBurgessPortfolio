import Reveal from "@/components/Reveal";
import { BlurTextEffect } from "@/components/ui/blur-text-effect";
import WhatIDidDiagram from "./WhatIDidDiagram";

/**
 * "What I did" block (Figma frame 2147265584): an #F7ECD9 card with the heading
 * + paragraph on the left and, on the right, the collaboration diagram. Desktop
 * layout; the mobile layout reflows the prose + diagram separately.
 */
export default function WhatIDid() {
  return (
    <div className="relative aspect-[1412/667] w-full overflow-hidden rounded-[1.15vw] bg-[#F7ECD9]">
      <h2 className="absolute left-[6.73%] top-[31.78%] font-mono text-[min(1.5625vw,30px)] font-bold uppercase tracking-[0.1em] text-[#141414]">
        <BlurTextEffect>What I did:</BlurTextEffect>
      </h2>
      <Reveal
        className="absolute left-[6.73%] top-[44.08%] w-[28.61%]"
        delay={120}
      >
        <p className="font-roboto text-[min(1.1458vw,22px)] leading-[1.09] text-[#353536]">
          I owned the project end to end, from kickoff through launch, directing
          an external design agency and a development agency and aligning
          multiple model PMs across six product categories.
        </p>
      </Reveal>

      <WhatIDidDiagram className="absolute left-[39.02%] top-[10.34%] w-[52.9%]" />
    </div>
  );
}
