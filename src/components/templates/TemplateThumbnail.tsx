import { useMemo } from "react";
import type { TemplateObjectSpec } from "@/lib/templateRender";

interface Props {
  type: string;
  data: any;
  className?: string;
}

const parseGradient = (bg: string, id: string) => {
  // very small parser for linear-gradient(<angle>deg, #xxx <pct>%, ...)
  const m = bg.match(/linear-gradient\(([^,]+),(.+)\)/i);
  if (!m) return null;
  const angleStr = m[1].trim();
  const angle = angleStr.endsWith("deg") ? parseFloat(angleStr) : 135;
  const stops = m[2].split(/,(?![^()]*\))/).map((s) => {
    const parts = s.trim().split(/\s+/);
    return { color: parts[0], offset: parts[1] ?? "" };
  });
  // Convert CSS angle to SVG x1,y1,x2,y2
  const rad = ((angle - 90) * Math.PI) / 180;
  const x1 = 50 - Math.cos(rad) * 50;
  const y1 = 50 - Math.sin(rad) * 50;
  const x2 = 50 + Math.cos(rad) * 50;
  const y2 = 50 + Math.sin(rad) * 50;
  return { id, x1, y1, x2, y2, stops };
};

export const TemplateThumbnail = ({ type, data, className }: Props) => {
  const width = data?.width ?? (type === "certificate" ? 800 : 600);
  const height = data?.height ?? (type === "certificate" ? 600 : 400);
  const bg = data?.background as string | undefined;
  const objects: TemplateObjectSpec[] = data?.objects ?? [];
  const gradientId = useMemo(() => `g-${Math.random().toString(36).slice(2, 9)}`, []);
  const gradient = bg?.startsWith("linear-gradient") ? parseGradient(bg, gradientId) : null;
  const bgFill = gradient ? `url(#${gradientId})` : bg && !bg.startsWith("linear-gradient") ? bg : "#ffffff";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {gradient && (
        <defs>
          <linearGradient
            id={gradient.id}
            x1={`${gradient.x1}%`}
            y1={`${gradient.y1}%`}
            x2={`${gradient.x2}%`}
            y2={`${gradient.y2}%`}
          >
            {gradient.stops.map((s, i) => (
              <stop key={i} offset={s.offset || `${(i / Math.max(1, gradient.stops.length - 1)) * 100}%`} stopColor={s.color} />
            ))}
          </linearGradient>
        </defs>
      )}
      <rect x={0} y={0} width={width} height={height} fill={bgFill} />
      {objects.map((o, i) => {
        if (o.kind === "rect") {
          return (
            <rect
              key={i}
              x={o.left}
              y={o.top}
              width={o.width}
              height={o.height}
              fill={o.fill ?? "transparent"}
              stroke={o.stroke ?? "none"}
              strokeWidth={o.strokeWidth ?? 0}
              rx={o.rx ?? 0}
              ry={o.ry ?? 0}
              opacity={o.opacity ?? 1}
              transform={o.angle ? `rotate(${o.angle} ${o.left + o.width / 2} ${o.top + o.height / 2})` : undefined}
            />
          );
        }
        if (o.kind === "circle") {
          return (
            <circle
              key={i}
              cx={o.left + o.radius}
              cy={o.top + o.radius}
              r={o.radius}
              fill={o.fill ?? "transparent"}
              stroke={o.stroke ?? "none"}
              strokeWidth={o.strokeWidth ?? 0}
              opacity={o.opacity ?? 1}
            />
          );
        }
        if (o.kind === "triangle") {
          const x = o.left;
          const y = o.top;
          const w = o.width;
          const h = o.height;
          const pts = `${x + w / 2},${y} ${x + w},${y + h} ${x},${y + h}`;
          return (
            <polygon
              key={i}
              points={pts}
              fill={o.fill ?? "#000"}
              opacity={o.opacity ?? 1}
              transform={o.angle ? `rotate(${o.angle} ${x + w / 2} ${y + h / 2})` : undefined}
            />
          );
        }
        if (o.kind === "line") {
          const [x1, y1, x2, y2] = o.points;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={o.stroke ?? "#000"}
              strokeWidth={o.strokeWidth ?? 2}
            />
          );
        }
        if (o.kind === "text") {
          const anchor = o.originX === "center" ? "middle" : o.originX === "right" ? "end" : "start";
          // Approximate Fabric Textbox top -> SVG baseline
          const fontSize = o.fontSize ?? 24;
          return (
            <text
              key={i}
              x={o.left}
              y={o.top + fontSize * 0.85}
              fill={o.fill ?? "#1f2937"}
              fontSize={fontSize}
              fontFamily={o.fontFamily ?? "Georgia"}
              fontWeight={o.fontWeight as any ?? "normal"}
              fontStyle={o.fontStyle ?? "normal"}
              textAnchor={anchor}
              letterSpacing={o.charSpacing ? (o.charSpacing / 1000) * fontSize : undefined}
            >
              {o.text}
            </text>
          );
        }
        return null;
      })}
    </svg>
  );
};