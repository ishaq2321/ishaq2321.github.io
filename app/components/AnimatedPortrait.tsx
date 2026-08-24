"use client";

import type { MotionValue } from "framer-motion";
import { motion, useMotionValue, useTransform } from "framer-motion";

export interface PortraitParams {
  asset?: string;
  eyelid?: string;
  lips?: string;
  outfit?: string;
  outfitShadow?: string;
}

const DEFAULTS: Required<PortraitParams> = {
  asset: "/portrait-traced.svg",
  eyelid: "#93625f",
  lips: "#b06a55",
  outfit: "#26304a",
  outfitShadow: "#1d2538",
};

const STYLE = `
.ap-style { display: block; width: 100%; height: 100%; }
.ap-breathe { animation: ap-breathe 4.2s ease-in-out infinite; transform-origin: 256px 512px; }
.ap-bob { animation: ap-bob 4.2s ease-in-out infinite; transform-origin: 256px 330px; }
.ap-eye-open { animation: ap-eye-open 5.4s infinite; }
.ap-eye-closed { animation: ap-eye-closed 5.4s infinite; }
@keyframes ap-breathe { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(3px) } }
@keyframes ap-bob { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(2px) } }
@keyframes ap-eye-open { 0%, 91.5%, 94.5%, 100% { opacity: 1 } 92.5%, 93.5% { opacity: 0 } }
@keyframes ap-eye-closed { 0%, 91.5%, 94.5%, 100% { opacity: 0 } 92.5%, 93.5% { opacity: 1 } }
@media (prefers-reduced-motion: reduce) {
  .ap-breathe, .ap-bob, .ap-eye-open, .ap-eye-closed { animation: none; }
  .ap-eye-closed { opacity: 0; }
}
`;

function Eye({
  cx,
  cy,
  eyes,
  hair,
  eyelid,
  pupilX,
  pupilY,
}: {
  cx: number;
  cy: number;
  eyes: string;
  hair: string;
  eyelid: string;
  pupilX: MotionValue<number>;
  pupilY: MotionValue<number>;
}) {
  return (
    <g>
      {/* patch: hides the traced eye smudge, provides the socket tone */}
      <ellipse cx={cx} cy={cy} rx={15} ry={8} fill={eyelid} />
      <g className="ap-eye-open">
        <path
          d={`M ${cx - 13.5} ${cy + 1} Q ${cx} ${cy - 6.5} ${cx + 13.5} ${cy + 0.5} Q ${cx} ${cy + 6} ${cx - 13.5} ${cy + 1} Z`}
          fill="#f4ece2"
        />
        <motion.g style={{ x: pupilX, y: pupilY }}>
          <circle cx={cx} cy={cy} r={5.6} fill={eyes} />
          <circle cx={cx} cy={cy} r={2.3} fill="#0d0a08" />
          <circle cx={cx + 1.6} cy={cy - 2} r={0.9} fill="#f4ece2" opacity={0.85} />
        </motion.g>
        <path
          d={`M ${cx - 14.5} ${cy + 0.5} Q ${cx} ${cy - 7.5} ${cx + 14.5} ${cy}`}
          fill="none"
          stroke={hair}
          strokeWidth={3.2}
          strokeLinecap="round"
        />
      </g>
      <g className="ap-eye-closed">
        <path
          d={`M ${cx - 14} ${cy + 1} Q ${cx} ${cy + 5.5} ${cx + 14} ${cy + 0.5}`}
          fill="none"
          stroke={hair}
          strokeWidth={2.8}
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

export function AnimatedPortrait({
  params = {},
  px,
  py,
  label,
}: {
  params?: PortraitParams;
  px?: MotionValue<number>;
  py?: MotionValue<number>;
  label?: string;
}) {
  const p = { ...DEFAULTS, ...params };

  const fallbackX = useMotionValue(0);
  const fallbackY = useMotionValue(0);
  const mx = px ?? fallbackX;
  const my = py ?? fallbackY;
  const headX = useTransform(mx, [-0.5, 0.5], [-7, 7]);
  const headY = useTransform(my, [-0.5, 0.5], [-4, 4]);
  const pupilX = useTransform(mx, [-0.5, 0.5], [-4.5, 4.5]);
  const pupilY = useTransform(my, [-0.5, 0.5], [-2.8, 2.8]);

  return (
    <svg
      className="ap-style"
      viewBox="0 0 512 512"
      role="img"
      aria-label={label ?? "Animated portrait illustration"}
    >
      <style>{STYLE}</style>
      <defs>
        <radialGradient id="ap-glow" cx="50%" cy="32%" r="72%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.14" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="512" height="512" fill="var(--surface)" />
      <rect width="512" height="512" fill="url(#ap-glow)" />
      <circle cx="256" cy="230" r="200" fill="none" stroke="var(--line)" strokeWidth="1.5" opacity="0.6" />
      <circle cx="256" cy="230" r="228" fill="none" stroke="var(--line)" strokeWidth="1" opacity="0.35" />

      <g className="ap-breathe">
        {/* outfit — navy quarter-zip */}
        <path
          d="M 258 330 C 184 330 116 368 102 430 L 96 512 L 420 512 L 414 430 C 400 368 332 330 258 330 Z"
          fill={p.outfit}
        />
        <path
          d="M 258 330 C 224 330 194 338 172 352 L 196 406 L 258 364 L 320 406 L 344 352 C 322 338 292 330 258 330 Z"
          fill={p.outfitShadow}
          opacity="0.55"
        />
        <path d="M 240 338 L 258 364 L 276 338 L 266 332 L 258 348 L 250 332 Z" fill={p.outfitShadow} />
        <rect x="255" y="342" width="6" height="92" rx="3" fill="#97a0b3" opacity="0.9" />
        <rect x="250.5" y="416" width="15" height="20" rx="5" fill="#97a0b3" />
        <rect x="252" y="418.5" width="12" height="4.5" rx="2.2" fill={p.outfitShadow} />
        <path d="M 198 334 C 214 356 238 366 258 366 C 240 372 214 364 196 346 Z" fill="var(--surface)" opacity="0.12" />
        <path d="M 318 334 C 302 356 278 366 258 366 C 276 372 302 364 320 346 Z" fill="var(--surface)" opacity="0.12" />

        <g className="ap-bob">
          <motion.g style={{ x: headX, y: headY }}>
            <g transform="translate(38,-8) scale(1.06)">
              {/* traced head — generated from reference photo via scripts/generate-portrait.py */}
              <image href={p.asset} x="0" y="0" width="512" height="512" />

              {/* subtle lower lip over the traced mouth region */}
              <path
                d="M 208 237 Q 222 245 238 238 Q 233 251 222 251.5 Q 211 251 208 237 Z"
                fill={p.lips}
                opacity="0.85"
              />

              <Eye cx={192} cy={136} eyes="#33231a" hair="#17110c" eyelid={p.eyelid} pupilX={pupilX} pupilY={pupilY} />
              <Eye cx={253} cy={131} eyes="#33231a" hair="#17110c" eyelid={p.eyelid} pupilX={pupilX} pupilY={pupilY} />
            </g>
          </motion.g>
        </g>
      </g>
    </svg>
  );
}
