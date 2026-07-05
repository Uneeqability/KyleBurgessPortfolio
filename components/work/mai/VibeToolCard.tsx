/**
 * "Vibe Code" row 1, left card (Figma frame 481:1299): the MAI-Transcribe
 * self-serve chart tool screenshot on a beige card, with a "Vibe coded app"
 * label. Each piece is its own layer.
 */
export default function VibeToolCard() {
  return (
    <div className="relative aspect-[780/559] w-full overflow-hidden rounded-[8px] bg-[#E1DBC6] [container-type:inline-size] sm:rounded-[1.47vw]">
      <span className="absolute left-[71.5%] top-[11.1%] z-10 font-serif text-[min(2.85cqw,22.3px)] font-light italic text-black">
        Vibe-coded app
      </span>
      {/* Screenshot export carries its own rounded corners + drop shadow, so it
          sits flush with no extra rounding/shadow (which caused a double edge). */}
      <img
        src="/images/mai/build-pms.png"
        alt="MAI-Transcribe self-serve tool where PMs enter model data"
        loading="lazy"
        decoding="async"
        className="absolute left-[1.15%] top-[13.24%] w-[97.7%]"
      />
    </div>
  );
}
