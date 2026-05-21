"use client";

import React from 'react';

interface Props {
  headingHtml: React.ReactNode;
  description: string;
  tags: string[];
}

export default function Hero({ headingHtml, description, tags }: Props) {
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px 100px" }}>
      <div style={{ marginBottom: 64, borderLeft: "3px solid #FF8C42", paddingLeft: 24 }}>
        <div style={{ fontSize: 10, color: "#FF8C42", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>
          PHASE 1 · PART 1 OF 4 · WEEK 1
        </div>
        <h1 style={{ fontSize: "clamp(26px,5vw,46px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.15, letterSpacing: "-0.02em", fontFamily: "Georgia, serif" }}>
          {headingHtml}
        </h1>
        <p style={{ fontSize: 15, color: "#888", lineHeight: 1.8, maxWidth: 560, margin: "0 0 24px" }}>{description}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {tags.map((tag) => (
            <span key={tag} style={{ padding: "4px 12px", background: "rgba(255,140,66,0.08)", border: "1px solid rgba(255,140,66,0.2)", borderRadius: 2, fontSize: 11, color: "#FF8C42" }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
