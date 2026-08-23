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
  skin: "#c78c60",
  skinShadow: "#a26843",
  skinLight: "#d6a173",
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
          d={`M ${cx - 14} 137 Q ${cx} 129.5 ${cx + 14} 136 Q ${cx} 142.5 ${cx - 14} 137 Z`}
          fill="#f4ece2"
        />
        <motion.g style={{ x: pupilX, y: pupilY }}>
          <circle cx={cx} cy={136} r={6} fill={eyes} />
          <circle cx={cx} cy={136} r={2.5} fill="#0d0a08" />
          <circle cx={cx + 1.7} cy={133.8} r={1} fill="#f4ece2" opacity={0.85} />
        </motion.g>
        <path
          d={`M ${cx - 15} 136.5 Q ${cx} 128.5 ${cx + 15} 135.5`}
          fill="none"
          stroke={hair}
          strokeWidth={3.6}
          strokeLinecap="round"
        />
        <path
          d={`M ${cx - 15} 135 Q ${cx} 128 ${cx + 15} 134.5`}
          fill="none"
          stroke={hair}
          strokeWidth={2.6}
          strokeLinecap="round"
          opacity={0.85}
        />
      </g>
      <g className="ap-eye-closed">
        <path
          d={`M ${cx - 15} 137 Q ${cx} 142 ${cx + 15} 136`}
          fill="none"
          stroke={hair}
          strokeWidth={3}
          strokeLinecap="round"
        />
      </g>
      <path
        d={`M ${cx - 13} 143 Q ${cx} 146 ${cx + 13} 142`}
        fill="none"
        stroke={skinShadow}
        strokeWidth={1.3}
        strokeLinecap="round"
        opacity={0.4}
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
          d="M 160 246 C 106 246 58 274 48 318 L 44 340 L 276 340 L 272 318 C 262 274 214 246 160 246 Z"
          fill={p.outfit}
        />
        <path
          d="M 160 246 C 137 246 118 252 104 262 L 121 298 L 160 270 L 199 298 L 216 262 C 202 252 183 246 160 246 Z"
          fill={p.outfitShadow}
          opacity="0.55"
        />
        <path d="M 147 252 L 160 270 L 173 252 L 167 248 L 160 258 L 153 248 Z" fill={p.outfitShadow} />
        <rect x="158.4" y="254" width="3.2" height="58" rx="1.6" fill="#97a0b3" opacity="0.9" />
        <rect x="156.4" y="302" width="7.2" height="11" rx="2.4" fill="#97a0b3" />
        <rect x="157" y="303.4" width="6" height="2.4" rx="1.2" fill={p.outfitShadow} />
        <path d="M 130 248 C 139 260 152 266 160 266 C 149 270 136 264 128 254 Z" fill="var(--surface)" opacity="0.12" />
        <path d="M 190 248 C 181 260 168 266 160 266 C 171 270 184 264 192 254 Z" fill="var(--surface)" opacity="0.12" />
        <path
          d="M 134 238 L 134 256 C 134 264 146 270 160 270 C 174 270 186 264 186 256 L 186 238 Z"
          fill={p.skin}
        />
        <path d="M 134 242 C 141 254 151 260 160 260 C 169 260 179 254 186 242 L 186 250 C 179 260 169 264 160 264 C 151 264 141 260 134 250 Z" fill={p.skinShadow} opacity="0.5" />

        <g className="ap-bob">
          <motion.g style={{ x: headX, y: headY }}>
            <path d="M 96 134 C 88 134 84 144 86 152 C 88 160 96 166 102 164 L 102 134 Z" fill={p.skin} />
            <path d="M 96 134 C 92 136 90 144 91 150" fill="none" stroke={p.skinShadow} strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
            <path d="M 224 134 C 232 134 236 144 234 152 C 232 160 224 166 218 164 L 218 134 Z" fill={p.skin} />
            <path d="M 224 134 C 228 136 230 144 229 150" fill="none" stroke={p.skinShadow} strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />

            <path
              d="M 160 60 C 116 60 97 92 97 130 C 97 162 104 192 118 213 C 130 230 144 241 160 243 C 176 241 190 230 202 213 C 216 192 223 162 223 130 C 223 92 204 60 160 60 Z"
              fill={p.skin}
            />

            <path d="M 160 60 C 116 60 97 92 97 130 L 97 134 C 103 100 127 84 160 84 C 193 84 217 100 223 134 L 223 130 C 223 92 204 60 160 60 Z" fill={p.skinLight} opacity="0.45" />

            <path d="M 118 213 C 127 224 136 233 144 237 C 134 232 125 223 121 210 Z" fill={p.skinShadow} opacity="0.4" />
            <path d="M 202 213 C 193 224 184 233 176 237 C 186 232 195 223 199 210 Z" fill={p.skinShadow} opacity="0.4" />

            <path d="M 168 136 C 171 149 172 162 170 173" fill="none" stroke={p.skinShadow} strokeWidth="2.8" strokeLinecap="round" opacity="0.5" />
            <path d="M 147 177 C 150.5 172 169.5 172 173 177" fill="none" stroke={p.skinShadow} strokeWidth="2.6" strokeLinecap="round" opacity="0.65" />
            <ellipse cx="148" cy="178.5" rx="2.6" ry="1.7" fill={p.skinShadow} />
            <ellipse cx="172" cy="178.5" rx="2.6" ry="1.7" fill={p.skinShadow} />

            <path d="M 116 125 C 123 117 138 115 148 119 C 149.5 121.5 149.5 125 148 127.5 C 139 123 127 124 119 129 C 117 128 116.2 126.5 116 125 Z" fill={p.hair} />
            <path d="M 204 125 C 197 117 182 115 172 119 C 170.5 121.5 170.5 125 172 127.5 C 181 123 193 124 201 129 C 203 128 203.8 126.5 204 125 Z" fill={p.hair} />
            <path d="M 117 124.5 C 124 118 138 116.5 148 120.5" fill="none" stroke={p.hair} strokeWidth="3" strokeLinecap="round" opacity="0.9" />
            <path d="M 203 124.5 C 196 118 182 116.5 172 120.5" fill="none" stroke={p.hair} strokeWidth="3" strokeLinecap="round" opacity="0.9" />

            <Eye cx={134} eyes={p.eyes} hair={p.hair} skinShadow={p.skinShadow} pupilX={pupilX} pupilY={pupilY} />
            <Eye cx={186} eyes={p.eyes} hair={p.hair} skinShadow={p.skinShadow} pupilX={pupilX} pupilY={pupilY} />

            {p.mole && <circle cx="194" cy="155" r="1.7" fill={p.skinShadow} />}
            <circle cx="127" cy="170" r="1.1" fill={p.skinShadow} opacity="0.7" />

            <path
              d="M 141 187 Q 151 183 160 185 Q 169 183 179 187 Q 177.5 196.5 160 198 Q 142.5 196.5 141 187 Z"
              fill={p.beard}
            />
            <path d="M 149 205.5 Q 160 210 171 205.5" fill="none" stroke={p.beard} strokeWidth="2.4" strokeLinecap="round" />
            <path
              d="M 153 208.5 Q 160 213.5 167 208.5 Q 164.5 215 160 215 Q 155.5 215 153 208.5 Z"
              fill={p.lips}
            />

            <path
              d="M 99 162 C 100 194 112 220 132 236 C 141 243 150 246 160 246.5 C 170 246 179 243 188 236 C 208 220 220 194 221 162 L 210 166 C 208 190 196 208 178 220 C 172 224.5 165 226.5 160 227 C 155 226.5 148 224.5 142 220 C 124 208 112 190 110 166 Z"
              fill={p.beard}
              opacity="0.94"
            />
            <path
              d="M 102 156 C 103 172 110 188 122 198 L 127 191 C 117 182 111 171 110 157 Z"
              fill={p.beard}
              opacity="0.28"
            />
            <path
              d="M 218 156 C 217 172 210 188 198 198 L 193 191 C 203 182 209 171 210 157 Z"
              fill={p.beard}
              opacity="0.28"
            />

            {fringe ? (
              <g className="ap-fringe">
                <path
                  d="M 160 50 C 113 50 94 86 96 128 C 100 110 109 99 122 94 C 139 87 181 87 198 94 C 211 99 220 110 224 128 C 226 86 207 50 160 50 Z"
                  fill={p.hair}
                />
                <ellipse cx="112" cy="95" rx="14" ry="10" fill={p.hair} />
                <ellipse cx="137" cy="88" rx="16" ry="11" fill={p.hair} />
                <ellipse cx="164" cy="86" rx="17" ry="11" fill={p.hair} />
                <ellipse cx="190" cy="90" rx="16" ry="11" fill={p.hair} />
                <ellipse cx="213" cy="98" rx="13" ry="9" fill={p.hair} />
                <path
                  d="M 122 94 C 130 99 140 101 148 100 M 150 87 C 160 92 172 93 182 91 M 198 94 C 205 97 211 101 215 106"
                  fill="none"
                  stroke="#000"
                  strokeWidth="1.1"
                  opacity="0.25"
                  strokeLinecap="round"
                />
                <path
                  d="M 98 112 C 96 138 98 168 103 192 L 111 189 C 105 166 104 138 105 114 Z"
                  fill={p.hair}
                />
                <path
                  d="M 222 112 C 224 138 222 168 217 192 L 209 189 C 215 166 216 138 215 114 Z"
                  fill={p.hair}
                />
                <path
                  d="M 96 128 C 94 132 93 136 93.5 139 M 224 128 C 226 132 227 136 226.5 139"
                  fill="none"
                  stroke={p.hair}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            ) : (
              <g className="ap-fringe">
                <path
                  d="M 160 50 C 113 50 94 86 96 126 C 101 106 110 94 123 88 C 137 82 150 80 160 80 C 170 80 183 82 197 88 C 210 94 219 106 224 126 C 226 86 207 50 160 50 Z"
                  fill={p.hair}
                />
                <path
                  d="M 98 110 C 96 138 98 168 103 192 L 110 189 C 104 166 103 138 104 112 Z"
                  fill={p.hair}
                />
                <path
                  d="M 222 110 C 224 138 222 168 217 192 L 210 189 C 216 166 217 138 216 112 Z"
                  fill={p.hair}
                />
                <path
                  d="M 123 88 C 140 81 180 81 197 88 M 112 102 C 122 92 136 87 150 86"
                  fill="none"
                  stroke="#000"
                  strokeWidth="1.1"
                  opacity="0.25"
                  strokeLinecap="round"
                />
              </g>
            )}
          </motion.g>
        </g>
      </g>
    </svg>
  );
}
