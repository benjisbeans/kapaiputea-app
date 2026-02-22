import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") || "achievement";
  const name = searchParams.get("name") || "Ka Pai Pūtea";
  const xp = searchParams.get("xp") || "0";
  const streak = searchParams.get("streak") || "0";
  const level = searchParams.get("level") || "1";
  const emoji = searchParams.get("emoji") || "💰";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#111827",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            position: "absolute",
            top: "40px",
            left: "60px",
          }}
        >
          <span style={{ fontSize: "32px" }}>💰</span>
          <span
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#FDE047",
            }}
          >
            Ka Pai Pūtea
          </span>
        </div>

        {/* Emoji */}
        <div style={{ fontSize: "80px", marginBottom: "16px" }}>{emoji}</div>

        {/* Achievement */}
        <div
          style={{
            fontSize: "48px",
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.2,
          }}
        >
          {type === "module" ? `Completed ${name}!` : name}
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: "40px",
            marginTop: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span style={{ fontSize: "32px", fontWeight: 700, color: "#FDE047" }}>
              {xp}
            </span>
            <span style={{ fontSize: "14px", color: "#9CA3AF" }}>XP Earned</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span style={{ fontSize: "32px", fontWeight: 700, color: "#F97316" }}>
              {streak}
            </span>
            <span style={{ fontSize: "14px", color: "#9CA3AF" }}>Day Streak</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span style={{ fontSize: "32px", fontWeight: 700, color: "#A855F7" }}>
              Lvl {level}
            </span>
            <span style={{ fontSize: "14px", color: "#9CA3AF" }}>Level</span>
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#9CA3AF",
            fontSize: "18px",
          }}
        >
          Learn money skills that actually matter — kapaiputea.co.nz
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
