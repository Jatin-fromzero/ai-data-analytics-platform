/* eslint-disable no-unused-vars */
"use client";

import React from 'react';

type TopBarSection = {
  value: string;
  label: string;
};

interface Props {
  sections: TopBarSection[];
  active: string;
  onSelect: (value: string) => void;
}

export default function TopBar({ sections, active, onSelect }: Props) {
  return (
    <div style={{ background: "#0A0A14", borderBottom: "1px solid #16162A", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", gap: 0, overflowX: "auto" }}>
        <div style={{ fontSize: 10, color: "#FF8C42", letterSpacing: "0.2em", textTransform: "uppercase", paddingRight: 20, borderRight: "1px solid #1A1A2E", marginRight: 16, whiteSpace: "nowrap", padding: "14px 20px 14px 0" }}>
          P1 · PART 1
        </div>
        {sections.map((section) => (
          <button
            key={section.value}
            onClick={() => onSelect(section.value)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "14px 14px",
              fontFamily: "inherit",
              fontSize: 11,
              letterSpacing: "0.08em",
              color: active === section.value ? "#FF8C42" : "#444",
              borderBottom: active === section.value ? "2px solid #FF8C42" : "2px solid transparent",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {section.label}
          </button>
        ))}
      </div>
    </div>
  );
}
