/**
 * "Vibe Code" row 2 (Figma frame 481:1337): the MAI Create-a-chart tool
 * screenshot on a beige card, a "Vibe coded app" label + arrow, and a card of
 * Download Code / Download PNG / Copy for Figma buttons. Each piece is its own
 * layer. (The overlapping duplicate voiceover player in the Figma file is
 * omitted — it isn't visible in the rendered design.)
 */
function IconSquare({
  dark = false,
  children,
}: {
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`flex aspect-square h-full items-center justify-center rounded-[0.35cqw] ${dark ? "bg-[#5D524B]" : "bg-[#FEF9ED]"}`}
    >
      <svg viewBox="0 0 16 16" className="h-[60%] w-[60%]" fill="none" aria-hidden>
        {children}
      </svg>
    </span>
  );
}

export default function VibeChartCard() {
  const stroke = "#5D524B";
  return (
    <div className="relative aspect-[1412/559] w-full overflow-hidden rounded-[8px] bg-[#E1DBC6] [container-type:inline-size] sm:rounded-[1.47vw]">
      {/* Screenshot export carries its own rounded corners + drop shadow, so it
          sits flush with no extra rounding/shadow (which caused a double edge). */}
      <img
        src="/images/mai/create-a-chart.png"
        alt="MAI Create-a-chart tool building an on-brand chart"
        className="absolute left-[6.52%] top-[7.33%] w-[64.8%]"
      />

      {/* Label + arrow */}
      <span className="absolute left-[76.4%] top-[19.1%] z-10 rotate-[-11.96deg] font-serif text-[min(1.58cqw,22.3px)] font-light italic text-black">
        Vibe-coded app
      </span>
      {/* Arrow 21, the real Figma vector (rotation baked into the export),
          placed at its Figma coords: 132×56 box centred at (1035, 119) in the
          1412×559 card. */}
      <img
        src="/images/mai/arrow-vibe.svg"
        alt=""
        aria-hidden
        className="absolute left-[68.6%] top-[16.3%] w-[9.35%]"
      />

      {/* Download buttons card */}
      <div className="absolute left-[66.8%] top-[43.5%] aspect-[276/232] w-[19.55%] rounded-[1.56cqw] bg-[#F7ECD9] shadow-[0.71cqw_0.71cqw_0.71cqw_rgba(0,0,0,0.1)]">
        <div className="absolute inset-x-[14.5%] inset-y-[17.2%] flex flex-col justify-between font-mono text-[min(0.92cqw,13px)] tracking-[0.2px]">
          {/* Download Code — dark */}
          <div className="flex h-[26%] items-center gap-[6%]">
            <span className="flex h-full flex-1 items-center justify-center rounded-full bg-[#5D524B] text-[#FEF9ED]">
              Download Code
            </span>
            <IconSquare dark>
              <path d="M8 2V9M8 9L5.5 6.5M8 9L10.5 6.5M3 11V13H13V11" stroke="#FEF9ED" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </IconSquare>
          </div>
          {/* Download PNG — light */}
          <div className="flex h-[26%] items-center gap-[6%]">
            <span className="flex h-full flex-1 items-center justify-center rounded-full bg-[#FEF9ED] text-[#5D524B]">
              Download PNG
            </span>
            <IconSquare>
              <path d="M2.5 2.5H13.5V13.5H2.5V2.5Z M2.5 10.5L6 7.5L9 10M9.5 5.5A1 1 0 1 1 9.5 5.4" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </IconSquare>
          </div>
          {/* Copy for Figma — light */}
          <div className="flex h-[26%] items-center gap-[6%]">
            <span className="flex h-full flex-1 items-center justify-center rounded-full bg-[#FEF9ED] text-[#5D524B]">
              Copy for Figma
            </span>
            <IconSquare>
              <path d="M6 6H13V13H6V6Z M3 3H10V5M3 3V10H5" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </IconSquare>
          </div>
        </div>
      </div>
    </div>
  );
}
