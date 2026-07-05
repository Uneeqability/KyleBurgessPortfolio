/* eslint-disable @next/next/no-img-element */
import { Fragment } from "react";
import Reveal from "@/components/Reveal";
import { BlurTextEffect } from "@/components/ui/blur-text-effect";

/**
 * BidBud case-study body (Figma 528:656). Same shell as the other case studies:
 * a centered flex column of text sections (mono eyebrow + mono body) interleaved
 * with media cards. Each mockup is imported as its designed layers (not one flat
 * image): the brand lockup, the "Uploading" card and the bento boxes are their
 * own elements, the pipeline dogs are individual illustrations, and the outcome
 * laptop keeps its screen + frame as separate layers. The color palette is built
 * from the design's hex tokens.
 */

const eyebrow =
  "font-mono text-[min(1.5625vw,30px)] font-bold uppercase tracking-[0.1em] text-[#141414]";
const body = "font-roboto text-[min(1.146vw,22px)] leading-[1.4] text-[#353536]";

/** Centered heading + paragraph section (blur-in eyebrow, fade-up body). */
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="w-[48.4vw] text-center">
      <h2 className={eyebrow}>
        <BlurTextEffect>{label}</BlurTextEffect>
      </h2>
      <Reveal className="mt-[2.6vw]" delay={120}>
        <div className={body}>{children}</div>
      </Reveal>
    </div>
  );
}

/* ---------------------------------------------------------- brand palette -- */

// label: true = dark text (#5f2711) on a light swatch; false = light text on a dark swatch
const PALETTE = [
  { hex: "#F1E5D7", darkText: true },
  { hex: "#FEF9ED", darkText: true },
  { hex: "#E1DBC6", darkText: true },
  { hex: "#72675B", darkText: false },
  { hex: "#FBCFB9", darkText: true },
  { hex: "#E68863", darkText: true },
  { hex: "#CC653C", darkText: false },
  { hex: "#5F2711", darkText: false },
];

function Palette({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-4 gap-[0.68vw] ${className}`}>
      {PALETTE.map((c) => (
        <div
          key={c.hex}
          className="flex items-center justify-center rounded-[0.52vw] aspect-[150/88]"
          style={{ background: c.hex }}
        >
          <span
            className={`font-serif text-[min(3vw,16px)] font-medium tracking-[0.05em] ${
              c.darkText ? "text-[#5f2711]" : "text-[#fef9ed]"
            }`}
          >
            {c.hex}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Compact BidBud lockup for the bento logo box (Figma 642:1056, 492×189). */
function MiniLockup({ className = "" }: { className?: string }) {
  return (
    <div className={`relative aspect-[492/189] [container-type:inline-size] ${className}`}>
      <span
        className="absolute left-0 top-0 leading-none text-[27.97cqw] text-[#cc653c]"
        style={{ fontFamily: "var(--font-dm-serif)" }}
      >
        Bid
      </span>
      <span
        className="absolute left-[52.26%] top-0 leading-none text-[27.97cqw] text-[#cc653c]"
        style={{ fontFamily: "var(--font-dm-serif)" }}
      >
        Bud
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/bidbud/dog.svg"
        alt=""
        className="absolute left-[35.73%] top-0 w-[22.48%]"
      />
    </div>
  );
}

/* ------------------------------------------------ what-I-did "uploading" card -- */

/**
 * The "Uploading your blueprints" card (Figma 642:725) rebuilt as live markup so
 * it can animate (progress fill / spinner) rather than ship as a flat image.
 * Container-query sized off the 383px design width.
 */
function UploadCard({ className = "" }: { className?: string }) {
  return (
    <div className={`[container-type:inline-size] ${className}`} data-upload-card>
      <div className="flex flex-col items-center rounded-[2.6cqw] border-[0.7cqw] border-dashed border-[#c5bb99] bg-[#fcf9f8] p-[8.6cqw] text-center shadow-[1.5cqw_1.5cqw_3cqw_rgba(0,0,0,0.15)]">
        <div className="flex size-[13.8cqw] items-center justify-center rounded-[2.6cqw] bg-[#ede0c8]">
          <svg viewBox="0 0 24 24" fill="none" stroke="#cc653c" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="size-[6.9cqw]">
            <path d="M12 19V6M6 12l6-6 6 6" />
          </svg>
        </div>
        <p className="mt-[4.3cqw] font-sans text-[4.3cqw] font-bold tracking-tight text-[#42352b]">
          Uploading your blueprints...
        </p>
        <p className="mt-[1cqw] font-sans text-[3cqw] text-[#bca085]">
          Securely transferring your PDF.
        </p>
        <div className="mt-[4.2cqw] h-[1.72cqw] w-[69cqw] overflow-hidden rounded-full bg-[#f3ede8]">
          <div className="h-full w-[28%] rounded-full bg-[#cc653c]" data-upload-progress />
        </div>
        <p className="mt-[0.9cqw] font-sans text-[2.6cqw] text-[#42352b]">28%</p>
        <div className="mt-[4.2cqw] flex items-center gap-[1.7cqw] rounded-[1.72cqw] bg-[#cc653c]/60 px-[6.9cqw] py-[2.6cqw]">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" className="size-[3.4cqw] animate-spin">
            <path d="M12 3a9 9 0 1 0 9 9" />
          </svg>
          <span className="font-sans text-[3.4cqw] font-bold tracking-tight text-white">
            Uploading...
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------- what-I-built pipe -- */

type PipeStep = {
  label: string;
  img: string;
  bg: string;
  color: string;
  imgW: string;
  grow: number;
  dashed?: boolean;
  italic?: boolean;
  border?: string;
};

const PIPELINE: PipeStep[] = [
  { label: "Upload Blueprints", img: "upload", bg: "#fef9ed", dashed: true, italic: true, color: "#42352b", imgW: "37%", grow: 1 },
  { label: "Classify\n& Extract", img: "classify", bg: "#fbcfb9", color: "#5f2711", imgW: "57%", grow: 1 },
  { label: "Inventory", img: "inventory", bg: "#fbcfb9", color: "#5f2711", imgW: "49%", grow: 1 },
  { label: "Measurements", img: "measurements", bg: "#f1e5d7", color: "#42352b", imgW: "49%", grow: 1 },
  { label: "Verify", img: "verify", bg: "#f1e5d7", color: "#42352b", imgW: "52%", grow: 1 },
  { label: "Report", img: "report", bg: "#c7d4c2", color: "#443d36", imgW: "92%", grow: 1, border: "#fef9ed" },
];

/** Arrow(s) between pipeline steps — double at the two ends, single in the middle. */
function PipelineArrows({ double }: { double?: boolean }) {
  return (
    <div className="flex shrink-0 flex-col gap-[0.4vw] self-center font-mono text-[min(1.1vw,21px)] leading-none text-[#42352b]/75">
      <span>&rarr;</span>
      {double && <span>&rarr;</span>}
    </div>
  );
}

function Pipeline() {
  return (
    <div className="w-[74.1vw]">
      <div className="flex items-stretch gap-[0.7vw]">
        {PIPELINE.map((step, i) => {
          const isReport = step.img === "report";
          return (
            <Fragment key={step.label}>
              <div
                data-pipeline-step={step.label.replace(/\n/g, " ")}
                className="relative flex aspect-[224/270] flex-1 flex-col items-center overflow-hidden rounded-[0.92vw] pt-[1.6vw]"
                style={{
                  background: step.bg,
                  border: step.dashed
                    ? "1px dashed #42352b"
                    : step.border
                      ? `0.735px solid ${step.border}`
                      : undefined,
                }}
              >
                <span
                  className={`whitespace-pre-line px-[0.3vw] text-center text-[min(1.32vw,26px)] leading-[1.05] ${
                    step.italic ? "italic" : ""
                  }`}
                  style={{ fontFamily: "var(--font-dm-serif)", color: step.color }}
                >
                  {step.label}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/bidbud/pipeline/${step.img}.svg`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={
                    isReport
                      ? "absolute left-[28.7%] top-[26%]"
                      : "absolute bottom-[16%] left-1/2 -translate-x-1/2"
                  }
                  style={{ width: step.imgW }}
                />
              </div>
              {i < PIPELINE.length - 1 && <PipelineArrows double={i === 0 || i === 4} />}
            </Fragment>
          );
        })}
      </div>
      {/* AI / CODE annotations (Figma 647:366-369) — dashed brackets under the pairs */}
      <div className="relative mt-[1vw] h-[2.6vw] font-mono text-[min(0.66vw,13px)] font-bold">
        <div className="absolute left-[18.2%] top-0 flex w-[31.9%] flex-col items-center gap-[0.5vw]">
          <span className="h-[0.55vw] w-full rounded-b-[0.25vw] border-x border-b border-dashed border-[#c05a2e]/60" />
          <span className="text-[#c05a2e]">AI: recognition &amp; counting</span>
        </div>
        <div className="absolute left-[51.85%] top-0 flex w-[33.3%] flex-col items-center gap-[0.5vw]">
          <span className="h-[0.55vw] w-full rounded-b-[0.25vw] border-x border-b border-dashed border-[#42352b]/50" />
          <span className="text-[#42352b]">CODE: measurement &amp; verification</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- desktop -- */

function BodyDesktop() {
  return (
    <section className="hidden sm:block">
      <div className="mx-auto flex w-full flex-col items-center gap-[7.8vw] pb-[7.8vw] pt-[7.8vw]">
        {/* The Role */}
        <Section label="The Role:">
          Creative Director &amp; Product Architect. Brand, product, and AI
          pipeline, start to finish.
        </Section>

        {/* The Challenge — card with left text + right screenshot (Figma 641:557,
            1412×604; the laptop image overflows the card bottom and is clipped). */}
        <div className="relative h-[30.46vw] w-[71.2vw] overflow-hidden rounded-[0.78vw] bg-[#F7ECD9]">
          <div className="absolute left-[3.49vw] top-1/2 w-[27.24vw] -translate-y-1/2 text-left">
            <h2 className={eyebrow}>
              <BlurTextEffect>The Challenge:</BlurTextEffect>
            </h2>
            <Reveal className="mt-[2.6vw] space-y-[1.25vw]" delay={120}>
              <p className={body}>
                Before bidding a job, a contractor has to measure every wall on
                the blueprints, hours of tracing lines by hand, even with
                today&rsquo;s software. And they only win one job in five.
              </p>
              <p className={body}>
                So it&rsquo;s never worth measuring every bid, and they skip jobs
                they might&rsquo;ve won.
              </p>
              <p className={body}>
                I wanted to make it fast enough to bid on everything.
              </p>
            </Reveal>
          </div>
          <img
            src="/images/bidbud/challenge.png"
            alt="BidBud marketing site — Stop choosing which jobs to bid on. Bid on all of them."
            loading="lazy"
            decoding="async"
            className="absolute left-[45.82%] top-[11.59%] w-[72.23%] max-w-none"
          />
        </div>

        {/* What I Did */}
        <Section label="What I Did:">
          <p>
            I built BidBud end to end, the brand, the product, and the AI system
            that does the work. A contractor uploads their blueprints and gets
            back every measurement they need to price the job, in minutes instead
            of hours.
          </p>
          <p className="mt-[1.2vw]">
            I&rsquo;m the non-technical founder, so I owned the why and the what.
            I designed how it works, set the bar for how accurate it had to be,
            and directed AI tools to build it, turning the problem into precise
            instructions, checking every result against real contractor bids, and
            running that loop until the numbers held.
          </p>
        </Section>

        {/* What-I-did dashboard mockup (Figma 641:589, 1412×604). Dashboard is one
            screenshot (clipped at the bottom); the "Uploading" card is rebuilt as
            live, animatable markup floating over it. */}
        <div className="relative h-[30.46vw] w-[71.2vw] overflow-hidden rounded-[0.78vw] bg-[#efe2d1]">
          <img
            src="/images/bidbud/whatidid.png"
            alt="BidBud contractor dashboard — Harmony at Brandywine project"
            loading="lazy"
            decoding="async"
            className="absolute left-[20.96%] top-[8.96%] w-[74.67%] max-w-none"
          />
          <UploadCard className="absolute left-[8.14%] top-[43.54%] w-[27.12%]" />
        </div>

        {/* The Idea Behind It */}
        <Section label="The Idea Behind It:">
          The brand had one job: earn trust from people rightly suspicious of
          &ldquo;AI for construction.&rdquo; So BidBud is a buddy, not an
          enterprise tool, plainspoken and honest about exactly what it is.
          Transparency is the product, not the fine print: confidence scores,
          traceable numbers, and a built-in safety margin that tell a contractor
          what to trust and what to go verify. For an audience that&rsquo;s been
          burned by overpromised software, that candor is the difference.
        </Section>

        {/* Brand bento (Figma 650:492, 1455×537) — each box its own layer. */}
        <div className="relative w-[73.4vw] aspect-[1455/537]">
          {/* Logo box (top-left) */}
          <div className="absolute left-0 top-0 h-[62.2%] w-[43.3%] overflow-hidden rounded-[1.15vw] bg-[#fef9ed]">
            <MiniLockup className="absolute left-[10.95%] top-[26.35%] w-[78.1%]" />
          </div>
          {/* BREAKDOWN table (top-right) */}
          <div className="absolute left-[44.26%] top-0 h-[40.6%] w-[55.74%] overflow-hidden rounded-[0.52vw] bg-[#f7ecd9]">
            <img
              src="/images/bidbud/bento-breakdown.png"
              alt="BidBud breakdown table — categorized measurements with confidence scores"
              loading="lazy"
              decoding="async"
              className="absolute left-[4%] top-[4%] w-[92%]"
            />
          </div>
          {/* Dashboard (mid) */}
          <div className="absolute left-[44.26%] top-[43%] h-[55.87%] w-[34.16%] overflow-hidden rounded-[0.52vw] bg-[#f7ecd9]">
            <img
              src="/images/bidbud/bento-dashboard.png"
              alt="BidBud project dashboard"
              loading="lazy"
              decoding="async"
              className="absolute left-[-6.24%] top-[7%] w-[112.68%] max-w-none"
            />
          </div>
          {/* Analysis (mid-right) */}
          <div className="absolute left-[79.18%] top-[43%] h-[55.87%] w-[20.82%] overflow-hidden rounded-[0.52vw] bg-[#f7ecd9]">
            <img
              src="/images/bidbud/bento-analysis.png"
              alt="BidBud blueprint analysis"
              loading="lazy"
              decoding="async"
              className="absolute left-[-10.23%] top-[7%] w-[190.76%] max-w-none"
            />
          </div>
          {/* Palette (bottom-left) — swatches span the logo-box width, not the
              full hex-frame width, so they don't run under the dashboard box. */}
          <Palette className="absolute left-0 top-[65.36%] w-[43.3%]" />
        </div>

        {/* What I Built */}
        <Section label="What I Built:">
          A complete product from a single idea: the BidBud brand and mascot, a
          full web app and contractor dashboard, a live marketing site at
          bidbud.pro, and a working multi-model AI pipeline that ingests real
          commercial blueprint sets and returns categorized measurements with a
          branded report and Excel export.
        </Section>

        {/* Pipeline */}
        <Pipeline />

        {/* The Outcome */}
        <Section label="The Outcome:">
          It works. The pipeline runs end to end on real blueprints and produces
          measurements I validated floor by floor against professional ground
          truth. I held it to a deliberately hard bar: for a bidding tool, an
          undercount can cost a contractor their margin, so I refused to ship a
          number they couldn&rsquo;t trust. The architecture is built to get
          sharper as vision models improve, and I&rsquo;m actively driving it to
          launch.
        </Section>

        {/* Outcome laptop mockup (Figma 650:493) — screen screenshot behind, the
            MacBook frame (transparent screen) layered on top. */}
        <div className="relative w-[87.14vw] aspect-[1728/920]">
          <div className="absolute left-[28.29%] top-[8.59%] h-[53.59%] w-[43.35%] overflow-hidden rounded-[0.77vw]">
            <img
              src="/images/bidbud/outcome-screen.png"
              alt="BidBud dashboard — Harmony at Brandywine blueprint analysis"
              loading="lazy"
              decoding="async"
              className="absolute left-0 top-0 h-[130.52%] w-full max-w-none"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <img
              src="/images/bidbud/outcome-laptop.png"
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute left-[-5.5%] top-[-31.96%] h-[139.02%] w-[111.01%] max-w-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- mobile -- */

const mEyebrow =
  "font-mono text-base font-bold uppercase tracking-[0.12em] text-[#141414]";
const mBody = "font-roboto text-[0.9rem] leading-relaxed text-[#353536]";

function MSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="text-center">
      <h2 className={mEyebrow}>
        <BlurTextEffect>{label}</BlurTextEffect>
      </h2>
      <Reveal className="mt-3" delay={120}>
        <div className={mBody}>{children}</div>
      </Reveal>
    </div>
  );
}

function BodyMobile() {
  return (
    <section className="flex flex-col gap-14 px-5 py-14 sm:hidden">
      <MSection label="The Role:">
        Creative Director &amp; Product Architect. Brand, product, and AI
        pipeline, start to finish.
      </MSection>

      <MSection label="The Challenge:">
        <p>
          Before bidding a job, a contractor has to measure every wall on the
          blueprints, hours of tracing lines by hand, even with today&rsquo;s
          software. And they only win one job in five.
        </p>
        <p className="mt-3">
          So it&rsquo;s never worth measuring every bid, and they skip jobs they
          might&rsquo;ve won. I wanted to make it fast enough to bid on everything.
        </p>
      </MSection>
      {/* Fixed-height card (Figma 651:620) — the marketing image is intentionally
          clipped at the bottom. */}
      <div className="relative aspect-[477/289] w-full overflow-hidden rounded-[4.3vw] bg-[#f7ecd9]">
        <img
          src="/images/bidbud/challenge.png"
          alt="BidBud marketing site — Stop choosing which jobs to bid on. Bid on all of them."
          loading="lazy"
          decoding="async"
          className="absolute left-1/2 top-[6.9%] w-[108.8%] max-w-none -translate-x-1/2 rounded-t-[2.17vw]"
        />
      </div>

      <MSection label="What I Did:">
        <p>
          I built BidBud end to end, the brand, the product, and the AI system
          that does the work. A contractor uploads their blueprints and gets back
          every measurement they need to price the job, in minutes instead of
          hours.
        </p>
        <p className="mt-3">
          I&rsquo;m the non-technical founder, so I owned the why and the what. I
          designed how it works, set the bar for how accurate it had to be, and
          directed AI tools to build it, turning the problem into precise
          instructions, checking every result against real contractor bids, and
          running that loop until the numbers held.
        </p>
      </MSection>
      <div className="relative aspect-[477/289] w-full overflow-hidden rounded-[4.34vw] bg-[#efe2d1]">
        <img
          src="/images/bidbud/m-whatidid.png"
          alt="BidBud contractor dashboard — Harmony at Brandywine"
          loading="lazy"
          decoding="async"
          className="absolute left-[10.48%] top-[14.07%] w-[110.48%] max-w-none rounded-t-[2.17vw]"
        />
        <UploadCard className="absolute left-[3.6%] top-[30.7%] w-[31.7%]" />
      </div>

      <MSection label="The Idea Behind It:">
        The brand had one job: earn trust from people rightly suspicious of
        &ldquo;AI for construction.&rdquo; So BidBud is a buddy, not an enterprise
        tool, plainspoken and honest about exactly what it is. Transparency is the
        product, not the fine print: confidence scores, traceable numbers, and a
        built-in safety margin that tell a contractor what to trust and what to go
        verify. For an audience that&rsquo;s been burned by overpromised software,
        that candor is the difference.
      </MSection>
      <div className="flex flex-col gap-3">
        {/* Logo box (Figma 651:766) */}
        <div className="flex aspect-[477/199] w-full items-center justify-center rounded-[4.34vw] bg-[#fef9ed]">
          <MiniLockup className="w-[64%]" />
        </div>
        {/* Breakdown table (651:825) — full-bleed */}
        <div className="aspect-[477/143] w-full overflow-hidden rounded-[3.25vw] bg-[#f7ecd9]">
          <img src="/images/bidbud/m-breakdown.png" alt="BidBud breakdown table" loading="lazy" decoding="async" className="size-full object-cover" />
        </div>
        {/* Dashboard mockup (651:827) */}
        <div className="relative aspect-[477/288] w-full overflow-hidden rounded-[3.25vw] bg-[#f7ecd9]">
          <img src="/images/bidbud/m-bento-dashboard.png" alt="BidBud project dashboard" loading="lazy" decoding="async" className="absolute left-[-4.4%] top-[5.73%] w-[108.8%] max-w-none" />
        </div>
        {/* Analysis mockup (651:829) */}
        <div className="relative aspect-[477/288] w-full overflow-hidden rounded-[3.25vw] bg-[#f7ecd9]">
          <img src="/images/bidbud/m-bento-analysis.png" alt="BidBud blueprint analysis" loading="lazy" decoding="async" className="absolute left-[-4.61%] top-[8.82%] w-[109.43%] max-w-none" />
        </div>
        <Palette className="gap-2" />
      </div>

      <MSection label="What I Built:">
        A complete product from a single idea: the BidBud brand and mascot, a full
        web app and contractor dashboard, a live marketing site at bidbud.pro, and
        a working multi-model AI pipeline that ingests real commercial blueprint
        sets and returns categorized measurements with a branded report and Excel
        export.
      </MSection>
      <div className="flex flex-col gap-2">
        {[[0, 1, 2], [3, 4, 5]].map((row) => (
          <div key={row[0]} className="flex items-stretch gap-1.5">
            {row.map((idx, ci) => {
              const step = PIPELINE[idx];
              const isReport = step.img === "report";
              return (
                <Fragment key={step.label}>
                  <div
                    className="relative flex aspect-[224/270] flex-1 flex-col items-center overflow-hidden rounded-[3vw] pt-[4vw]"
                    style={{
                      background: step.bg,
                      border: step.dashed
                        ? "1px dashed #42352b"
                        : step.border
                          ? `1px solid ${step.border}`
                          : undefined,
                    }}
                  >
                    <span
                      className={`whitespace-pre-line px-1 text-center text-[3.3vw] leading-[1.05] ${step.italic ? "italic" : ""}`}
                      style={{ fontFamily: "var(--font-dm-serif)", color: step.color }}
                    >
                      {step.label}
                    </span>
                    <img
                      src={`/images/bidbud/pipeline/${step.img}.svg`}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className={
                        isReport
                          ? "absolute left-[28.7%] top-[26%]"
                          : "absolute bottom-[16%] left-1/2 -translate-x-1/2"
                      }
                      style={{ width: step.imgW }}
                    />
                  </div>
                  {ci < 2 && (
                    <span className="flex shrink-0 items-center font-mono text-[4vw] leading-none text-[#42352b]/70">
                      &rarr;
                    </span>
                  )}
                </Fragment>
              );
            })}
          </div>
        ))}
      </div>

      <MSection label="The Outcome:">
        It works. The pipeline runs end to end on real blueprints and produces
        measurements I validated floor by floor against professional ground truth.
        I held it to a deliberately hard bar: for a bidding tool, an undercount can
        cost a contractor their margin, so I refused to ship a number they
        couldn&rsquo;t trust. The architecture is built to get sharper as vision
        models improve, and I&rsquo;m actively driving it to launch.
      </MSection>
      {/* Blown up beyond the viewport width for legibility (clipped by main's
          overflow-x-clip); layers keep their Figma positions. */}
      <div className="relative left-1/2 aspect-[1728/920] w-[112vw] max-w-none -translate-x-1/2">
        <div className="absolute left-[28.29%] top-[8.59%] h-[53.59%] w-[43.35%] overflow-hidden rounded-[1.5vw]">
          <img
            src="/images/bidbud/outcome-screen.png"
            alt="BidBud dashboard — Harmony at Brandywine blueprint analysis"
            loading="lazy"
            decoding="async"
            className="absolute left-0 top-0 h-[130.52%] w-full max-w-none"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            src="/images/bidbud/outcome-laptop.png"
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute left-[-5.5%] top-[-31.96%] h-[139.02%] w-[111.01%] max-w-none"
          />
        </div>
      </div>
    </section>
  );
}

export default function BidBudBody() {
  return (
    <>
      <BodyMobile />
      <BodyDesktop />
    </>
  );
}
