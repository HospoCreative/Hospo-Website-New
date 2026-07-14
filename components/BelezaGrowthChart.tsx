"use client";

import { motion } from "framer-motion";
import { belezaInstagramGrowth } from "@/data/belezaCaseStudy";

const width = 900;
const height = 390;
const padding = { top: 34, right: 38, bottom: 56, left: 72 };
const min = 5000;
const max = 14000;
const plotWidth = width - padding.left - padding.right;
const plotHeight = height - padding.top - padding.bottom;

const points = belezaInstagramGrowth.map((item, index) => ({
  ...item,
  x: padding.left + (index / (belezaInstagramGrowth.length - 1)) * plotWidth,
  y: padding.top + ((max - item.value) / (max - min)) * plotHeight
}));

const linePath = points
  .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
  .join(" ");
const areaPath = `${linePath} L${points.at(-1)?.x},${height - padding.bottom} L${points[0].x},${height - padding.bottom} Z`;

export function BelezaGrowthChart() {
  return (
    <div className="overflow-hidden rounded-[8px] border border-white/12 bg-white/[0.045] p-4 sm:p-7">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-eyebrow text-yellow">Shared group Instagram account</p>
          <h3 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
            Nine months of continuous growth.
          </h3>
        </div>
        <p className="text-sm leading-6 text-white/60">Raw follower counts, June 2025-February 2026</p>
      </div>

      <div className="overflow-x-auto pb-2" role="img" aria-label="Instagram followers grew from 5,220 in June 2025 to 13,213 in February 2026">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[720px]" aria-hidden="true">
          <defs>
            <linearGradient id="beleza-chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffcc53" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#ffcc53" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[5000, 8000, 11000, 14000].map((tick) => {
            const y = padding.top + ((max - tick) / (max - min)) * plotHeight;
            return (
              <g key={tick}>
                <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="rgba(255,255,255,0.12)" />
                <text x={padding.left - 15} y={y + 5} textAnchor="end" fill="rgba(255,255,255,0.52)" fontSize="14">
                  {(tick / 1000).toFixed(0)}K
                </text>
              </g>
            );
          })}

          <motion.path
            d={areaPath}
            fill="url(#beleza-chart-fill)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
          />
          <motion.path
            d={linePath}
            fill="none"
            stroke="#ffcc53"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />

          {points.map((point, index) => (
            <g key={point.label}>
              <motion.circle
                cx={point.x}
                cy={point.y}
                r="7"
                fill="#002c5d"
                stroke="#ffcc53"
                strokeWidth="4"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ delay: 0.12 * index, duration: 0.35 }}
              />
              <text x={point.x} y={height - 22} textAnchor="middle" fill="rgba(255,255,255,0.66)" fontSize="14">
                {point.label}
              </text>
              {(index === 0 || index === points.length - 1) && (
                <text
                  x={point.x}
                  y={point.y - 18}
                  textAnchor={index === 0 ? "start" : "end"}
                  fill="#ffffff"
                  fontSize="18"
                  fontWeight="800"
                >
                  {point.value.toLocaleString("en-GB")}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
        Total account growth reflects organic content and paid activity. The available evidence does not separate follower acquisition by source.
      </p>
    </div>
  );
}
