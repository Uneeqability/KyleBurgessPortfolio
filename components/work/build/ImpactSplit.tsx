/* eslint-disable @next/next/no-img-element */

/**
 * The impact split (Figma 623:421): "the work" (two static keynote stills, left)
 * beside "the rollout" (the same assets as muted looping clips, right). Layout is
 * % of the 1412×1083 frame; type/radius use cqw so it scales at any width. The
 * two rollout clips are muted per the brief.
 *
 *   frontier-tuning clip  ↔  "Microsoft Frontier Tuning" still (top row)
 *   in-video models clip  ↔  "7 New Microsoft AI Models" still (bottom row)
 */
export default function ImpactSplit() {
  return (
    <div className="relative size-full [container-type:inline-size]">
      {/* Column headings + rules */}
      <span className="absolute left-[23.72%] top-[1.34%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-roboto text-[1.56cqw] text-[#353536]">
        the work
      </span>
      <span className="absolute left-[75.64%] top-[1.34%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-roboto text-[1.56cqw] text-[#353536]">
        the rollout
      </span>
      <div className="absolute left-[1.42%] top-[5.17%] h-px w-[43.98%] bg-[#353536]/30" />
      <div className="absolute left-[53.68%] top-[5.17%] h-px w-[43.98%] bg-[#353536]/30" />

      {/* the work — static stills */}
      <div className="absolute left-0 top-[11.26%] h-[41.27%] w-[47.45%] overflow-hidden rounded-[2.11cqw]">
        <img
          src="/images/build/work-frontier.jpg"
          alt="Keynote still — Microsoft Frontier Tuning layer stack"
          className="absolute inset-0 size-full object-cover"
        />
      </div>
      <div className="absolute left-0 top-[58.73%] h-[41.27%] w-[47.45%] overflow-hidden rounded-[1.72cqw]">
        <img
          src="/images/build/work-models.jpg"
          alt="Keynote still — 7 New Microsoft AI Models"
          className="absolute inset-0 size-full object-cover"
        />
      </div>

      {/* the rollout — muted looping clips */}
      <div className="absolute left-[51.35%] top-[10.89%] h-[42.11%] w-[48.65%] overflow-hidden rounded-[2cqw] bg-[#E7E0CF]">
        <video
          className="size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/videos/build-frontier-tuning.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute left-[51.35%] top-[58.73%] h-[41.27%] w-[48.65%] overflow-hidden rounded-[2cqw] bg-[#E7E0CF]">
        <video
          className="size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/videos/build-models.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
