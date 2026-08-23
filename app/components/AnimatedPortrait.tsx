"use client";

import type { MotionValue } from "framer-motion";
import { motion, useMotionValue, useTransform } from "framer-motion";

export interface PortraitParams {
  skin?: string;
  skinShadow?: string;
  skinLight?: string;
  hair?: string;
  hairStyle?: "fringe" | "slicked";
  beard?: string;
  eyes?: string;
  mole?: boolean;
  outfit?: string;
  outfitShadow?: string;
  lips?: string;
}

const DEFAULTS: Required<Pick<PortraitParams, "skin" | "skinShadow" | "skinLight" | "hair" | "hairStyle" | "beard" | "eyes" | "mole" | "outfit" | "outfitShadow" | "lips">> = {
  skin: "#c9906b",
  skinShadow: "#a9704c",
  skinLight: "#d8a37e",
  hair: "#17110c",
  hairStyle: "fringe",
  beard: "#1d150e",
  eyes: "#33231a",
  mole: true,
  outfit: "#26304a",
  outfitShadow: "#1d2538",
  lips: "#b06a55",
};

const STYLE = `
.ap-style { display: block; width: 100%; height: 100%; }
.ap-breathe { animation: ap-breathe 4.2s ease-in-out infinite; transform-origin: 160px 340px; }
.ap-bob { animation: ap-bob 4.2s ease-in-out infinite; transform-origin: 160px 240px; }
.ap-fringe { animation: ap-sway 5.6s ease-in-out infinite; transform-origin: 160px 70px; }
.ap-eye-open { animation: ap-eye-open 5.4s infinite; }
.ap-eye-closed { animation: ap-eye-closed 5.4s infinite; }
@keyframes ap-breathe { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(2px) } }
@keyframes ap-bob { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(1.2px) } }
@keyframes ap-sway { 0%, 100% { transform: rotate(0deg) } 50% { transform: rotate(0.7deg) } }
@keyframes ap-eye-open { 0%, 91.5%, 94.5%, 100% { opacity: 1 } 92.5%, 93.5% { opacity: 0 } }
@keyframes ap-eye-closed { 0%, 91.5%, 94.5%, 100% { opacity: 0 } 92.5%, 93.5% { opacity: 1 } }
@media (prefers-reduced-motion: reduce) {
  .ap-breathe, .ap-bob, .ap-fringe, .ap-eye-open, .ap-eye-closed { animation: none; }
  .ap-eye-closed { opacity: 0; }
}
`;

function Eye({
  cx,
  eyes,
  hair,
  skinShadow,
  pupilX,
  pupilY,
}: {
  cx: number;
  eyes: string;
  hair: string;
  skinShadow: string;
  pupilX: MotionValue<number>;
  pupilY: MotionValue<number>;
}) {
  return (
    <g>
      <g className="ap-eye-open">
        <path
          d={`M ${cx - 13} 136 Q ${cx} 127 ${cx + 13} 135 Q ${cx} 143 ${cx - 13} 136 Z`}
          fill="#f4ece2"
        />
        <motion.g style={{ x: pupilX, y: pupilY }}>
          <circle cx={cx} cy={135} r={6.4} fill={eyes} />
          <circle cx={cx} cy={135} r={2.6} fill="#0d0a08" />
          <circle cx={cx + 1.8} cy={132.6} r={1.1} fill="#f4ece2" opacity={0.85} />
        </motion.g>
        <path
          d={`M ${cx - 14} 135 Q ${cx} 125.5 ${cx + 14} 134`}
          fill="none"
          stroke={hair}
          strokeWidth={3.4}
          strokeLinecap="round"
        />
      </g>
      <g className="ap-eye-closed">
        <path
          d={`M ${cx - 14} 136 Q ${cx} 141 ${cx + 14} 135`}
          fill="none"
          stroke={hair}
          strokeWidth={3}
          strokeLinecap="round"
        />
      </g>
      <path
        d={`M ${cx - 15} 129 Q ${cx - 10} 124.5 ${cx - 4} 126`}
        fill="none"
        stroke={skinShadow}
        strokeWidth={1.4}
        strokeLinecap="round"
        opacity={0.55}
      />
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
  const fringe = p.hairStyle === "fringe";

  const fallbackX = useMotionValue(0);
  const fallbackY = useMotionValue(0);
  const mx = px ?? fallbackX;
  const my = py ?? fallbackY;
  const headX = useTransform(mx, [-0.5, 0.5], [-4, 4]);
  const headY = useTransform(my, [-0.5, 0.5], [-2, 2]);
  const pupilX = useTransform(mx, [-0.5, 0.5], [-2.6, 2.6]);
  const pupilY = useTransform(my, [-0.5, 0.5], [-1.6, 1.6]);

  return (
    <svg
      className="ap-style"
      viewBox="0 0 320 340"
      role="img"
      aria-label={label ?? "Animated portrait illustration"}
    >
      <style>{STYLE}</style>
      <defs>
        <radialGradient id="ap-glow" cx="50%" cy="34%" r="70%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.14" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="320" height="340" fill="var(--surface)" />
      <rect width="320" height="340" fill="url(#ap-glow)" />
      <circle cx="160" cy="150" r="128" fill="none" stroke="var(--line)" strokeWidth="1" opacity="0.6" />
      <circle cx="160" cy="150" r="146" fill="none" stroke="var(--line)" strokeWidth="0.6" opacity="0.35" />

      <g className="ap-breathe">
        <path
          d="M 160 244 C 108 244 62 272 52 316 L 48 340 L 272 340 L 268 316 C 258 272 212 244 160 244 Z"
          fill={p.outfit}
        />
        <path
          d="M 160 244 C 138 244 120 250 106 260 L 122 296 L 160 268 L 198 296 L 214 260 C 200 250 182 244 160 244 Z"
          fill={p.outfitShadow}
          opacity="0.55"
        />
        <path d="M 148 250 L 160 268 L 172 250 L 166 246 L 160 256 L 154 246 Z" fill={p.outfitShadow} />
        <rect x="158.4" y="252" width="3.2" height="60" rx="1.6" fill="#97a0b3" opacity="0.9" />
        <rect x="156.4" y="300" width="7.2" height="11" rx="2.4" fill="#97a0b3" />
        <rect x="157" y="301.4" width="6" height="2.4" rx="1.2" fill={p.outfitShadow} />
        <path d="M 132 246 C 140 258 152 264 160 264 C 150 268 138 262 130 252 Z" fill="var(--surface)" opacity="0.12" />
        <path d="M 188 246 C 180 258 168 264 160 264 C 170 268 182 262 190 252 Z" fill="var(--surface)" opacity="0.12" />
        <path
          d="M 136 236 L 136 254 C 136 262 148 268 160 268 C 172 268 184 262 184 254 L 184 236 Z"
          fill={p.skin}
        />
        <path d="M 136 240 C 142 252 152 258 160 258 C 168 258 178 252 184 240 L 184 248 C 178 258 168 262 160 262 C 152 262 142 258 136 248 Z" fill={p.skinShadow} opacity="0.5" />

        <g className="ap-bob">
          <motion.g style={{ x: headX, y: headY }}>
            <path d="M 100 132 C 92 132 88 142 90 150 C 92 158 100 164 106 162 L 106 132 Z" fill={p.skin} />
            <path d="M 100 132 C 96 134 94 142 95 148" fill="none" stroke={p.skinShadow} strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
            <path d="M 220 132 C 228 132 232 142 230 150 C 228 158 220 164 214 162 L 214 132 Z" fill={p.skin} />
            <path d="M 220 132 C 224 134 226 142 225 148" fill="none" stroke={p.skinShadow} strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />

            <path
              d="M 160 60 C 119 60 101 91 101 128 C 101 158 107 188 120 210 C 132 228 145 239 160 241 C 175 239 188 228 200 210 C 213 188 219 158 219 128 C 219 91 201 60 160 60 Z"
              fill={p.skin}
            />

            <path d="M 160 60 C 119 60 101 91 101 128 L 101 132 C 106 100 128 84 160 84 C 192 84 214 100 219 132 L 219 128 C 219 91 201 60 160 60 Z" fill={p.skinLight} opacity="0.5" />

            <path d="M 120 210 C 129 221 139 231 147 235 C 137 230 128 220 124 206 Z" fill={p.skinShadow} opacity="0.45" />
            <path d="M 200 210 C 191 221 181 231 173 235 C 183 230 192 220 196 206 Z" fill={p.skinShadow} opacity="0.45" />

            <path d="M 165 136 C 168 149 169 162 167 173" fill="none" stroke={p.skinShadow} strokeWidth="2.6" strokeLinecap="round" opacity="0.5" />
            <path d="M 149 176 C 152 171.5 168 171.5 171 176" fill="none" stroke={p.skinShadow} strokeWidth="2.4" strokeLinecap="round" opacity="0.65" />
            <ellipse cx="150.5" cy="177" rx="2.4" ry="1.6" fill={p.skinShadow} />
            <ellipse cx="169.5" cy="177" rx="2.4" ry="1.6" fill={p.skinShadow} />

            <path
              d="M 144 186.5 Q 152.5 183 160 185 Q 167.5 183 176 186.5 Q 174.5 195.5 160 197 Q 145.5 195.5 144 186.5 Z"
              fill={p.beard}
            />
            <path d="M 151 205.5 Q 160 209.5 169 205.5" fill="none" stroke={p.beard} strokeWidth="2.2" strokeLinecap="round" />
            <path
              d="M 155 208.5 Q 160 212.5 165 208.5 Q 163 214 160 214 Q 157 214 155 208.5 Z"
              fill={p.lips}
            />

            <path
              d="M 104 168 C 105 196 120 220 140 233 C 148 238.5 155 241 160 241.5 C 165 241 172 238.5 180 233 C 200 220 215 196 216 168 L 206 170 C 204 192 192 207 175 217.5 C 168 222 162 223.5 160 224 C 158 223.5 152 222 145 217.5 C 128 207 116 192 114 170 Z"
              fill={p.beard}
              opacity="0.92"
            />

            {fringe ? (
              <g className="ap-fringe">
                <path
                  d="M 160 52 C 116 52 98 86 100 124 C 104 108 112 98 124 94 C 140 88 180 88 196 94 C 208 98 216 108 220 124 C 222 86 204 52 160 52 Z"
                  fill={p.hair}
                />
                <ellipse cx="114" cy="96" rx="13" ry="8.5" fill={p.hair} />
                <ellipse cx="138" cy="90" rx="15" ry="9.5" fill={p.hair} />
                <ellipse cx="163" cy="88" rx="16" ry="9.5" fill={p.hair} />
                <ellipse cx="188" cy="91" rx="15" ry="9.5" fill={p.hair} />
                <ellipse cx="210" cy="98" rx="13" ry="8.5" fill={p.hair} />
                <path
                  d="M 102 112 C 101 138 102 166 106 190 L 113 187 C 108 164 107 138 108 114 Z"
                  fill={p.hair}
                />
                <path
                  d="M 218 112 C 219 138 218 166 214 190 L 207 187 C 212 164 213 138 212 114 Z"
                  fill={p.hair}
                />
                <path
                  d="M 124 94 C 136 90 150 89 162 90 M 188 95 C 196 97 204 100 210 104 M 138 94 C 148 98 158 99 168 98"
                  fill="none"
                  stroke="#000"
                  strokeWidth="1"
                  opacity="0.22"
                  strokeLinecap="round"
                />
              </g>
            ) : (
              <g className="ap-fringe">
                <path
                  d="M 160 52 C 116 52 98 86 100 124 C 104 104 112 92 124 86 C 136 80 148 78 160 78 C 172 78 184 80 196 86 C 208 92 216 104 220 124 C 222 86 204 52 160 52 Z"
                  fill={p.hair}
                />
                <path
                  d="M 102 116 C 101 136 102 160 106 180 L 112 177 C 108 158 107 136 108 118 Z"
                  fill={p.hair}
                />
                <path
                  d="M 218 116 C 219 136 218 160 214 180 L 208 177 C 212 158 213 136 212 118 Z"
                  fill={p.hair}
                />
                <path
                  d="M 124 86 C 140 78 180 78 196 86 M 116 100 C 128 90 140 86 152 85"
                  fill="none"
                  stroke="#000"
                  strokeWidth="1.1"
                  opacity="0.25"
                  strokeLinecap="round"
                />
              </g>
            )}

            <path d="M 121 121 C 128 114 140 113 148 118 C 149 121 149 124 148 126 C 140 121 129 121 122 126 C 121 124 121 122 121 121 Z" fill={p.hair} />
            <path d="M 199 121 C 192 114 180 113 172 118 C 171 121 171 124 172 126 C 180 121 191 121 198 126 C 199 124 199 122 199 121 Z" fill={p.hair} />
            <path d="M 121 122 C 129 116 140 115.5 148 120" fill="none" stroke={p.hair} strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 199 122 C 191 116 180 115.5 172 120" fill="none" stroke={p.hair} strokeWidth="4.5" strokeLinecap="round" />

            <Eye cx={136} eyes={p.eyes} hair={p.hair} skinShadow={p.skinShadow} pupilX={pupilX} pupilY={pupilY} />
            <Eye cx={184} eyes={p.eyes} hair={p.hair} skinShadow={p.skinShadow} pupilX={pupilX} pupilY={pupilY} />

            {p.mole && <circle cx="192" cy="153" r="1.7" fill={p.skinShadow} />}
            <circle cx="130" cy="168" r="1.1" fill={p.skinShadow} opacity="0.7" />
          </motion.g>
        </g>
      </g>
    </svg>
  );
}
