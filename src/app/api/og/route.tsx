import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const score = searchParams.get("score") ?? "0";
  const total = searchParams.get("total") ?? "10";
  const category = searchParams.get("category") ?? "からだ冒険クイズ";
  const icon = searchParams.get("icon") ?? "🧬";
  const xp = searchParams.get("xp") ?? "0";

  const accuracy = Math.round((Number(score) / Number(total)) * 100);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e0f2fe 0%, #ffffff 50%, #f3e8ff 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "60px",
            borderRadius: "32px",
            border: "3px solid #e5e7eb",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            maxWidth: "900px",
          }}
        >
          <div style={{ fontSize: 80, marginBottom: 16 }}>{icon}</div>
          <div
            style={{
              fontSize: 28,
              color: "#6b7280",
              marginBottom: 8,
            }}
          >
            {category}
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              marginBottom: 8,
              color: accuracy >= 80 ? "#059669" : accuracy >= 50 ? "#d97706" : "#dc2626",
            }}
          >
            {score}/{total} 正解！
          </div>
          <div
            style={{
              display: "flex",
              gap: "40px",
              marginTop: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 40, fontWeight: 700 }}>
                {accuracy}%
              </div>
              <div style={{ fontSize: 18, color: "#9ca3af" }}>
                正答率
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{ fontSize: 40, fontWeight: 700, color: "#6366f1" }}
              >
                +{xp}
              </div>
              <div style={{ fontSize: 18, color: "#9ca3af" }}>
                XP獲得
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 32,
              fontSize: 20,
              color: "#9ca3af",
            }}
          >
            からだ冒険クイズ - Dr.おかもん監修
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
