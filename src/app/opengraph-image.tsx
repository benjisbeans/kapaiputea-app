import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ka Pai Pūtea – Financial Literacy for Young Kiwis";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #FDE047 0%, #FACC15 50%, #EAB308 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            borderRadius: "32px",
            padding: "60px 80px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: 900,
              color: "#111827",
              lineHeight: 1.1,
              textAlign: "center",
            }}
          >
            Ka Pai Pūtea
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#6B7280",
              marginTop: "16px",
              textAlign: "center",
            }}
          >
            Financial literacy for young Kiwis
          </div>
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "32px",
            }}
          >
            <div
              style={{
                backgroundColor: "#FDE047",
                borderRadius: "9999px",
                padding: "8px 24px",
                fontSize: "18px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Gamified
            </div>
            <div
              style={{
                backgroundColor: "#FDE047",
                borderRadius: "9999px",
                padding: "8px 24px",
                fontSize: "18px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Free for NZ Schools
            </div>
            <div
              style={{
                backgroundColor: "#FDE047",
                borderRadius: "9999px",
                padding: "8px 24px",
                fontSize: "18px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Years 11–13
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
