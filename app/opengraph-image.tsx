import { ImageResponse } from "next/og";

export const alt = "Hospo Creative | Hospitality marketing and creative agency";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#002c5d",
          color: "#ffffff",
          display: "flex",
          height: "100%",
          overflow: "hidden",
          padding: "58px 66px 54px",
          position: "relative",
          width: "100%"
        }}
      >
        <div
          style={{
            border: "2px solid #ffcc53",
            borderRadius: "999px",
            height: "500px",
            opacity: 0.95,
            position: "absolute",
            right: "-110px",
            top: "-165px",
            width: "500px"
          }}
        />
        <div
          style={{
            background: "#ffcc53",
            bottom: "-125px",
            height: "330px",
            position: "absolute",
            right: "92px",
            transform: "rotate(32deg)",
            width: "120px"
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", width: "100%" }}>
          <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "Arial", fontSize: 58, fontWeight: 800, letterSpacing: "-5px" }}>
              hospo<span style={{ color: "#ffcc53" }}>.</span>
            </div>
            <div style={{ border: "1px solid rgba(255,255,255,0.48)", borderRadius: "999px", fontFamily: "Arial", fontSize: 16, fontWeight: 700, letterSpacing: "3px", padding: "12px 18px" }}>
              HOSPITALITY MARKETING
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: "830px" }}>
            <div style={{ color: "#ffcc53", fontFamily: "Arial", fontSize: 17, fontWeight: 800, letterSpacing: "4px", marginBottom: "22px" }}>
              MARKETING, CONTENT & DIGITAL GROWTH
            </div>
            <div style={{ fontFamily: "Georgia", fontSize: 78, fontWeight: 700, letterSpacing: "-3px", lineHeight: 0.98 }}>
              Helping places stand out and get chosen.
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.36)", display: "flex", fontFamily: "Arial", fontSize: 19, justifyContent: "space-between", letterSpacing: "1px", paddingTop: "18px" }}>
            <span>PHOTOGRAPHY · CONTENT · STRATEGY · WEBSITES</span>
            <span style={{ color: "#ffcc53", fontWeight: 700 }}>HOSPOAGENCY.COM</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
