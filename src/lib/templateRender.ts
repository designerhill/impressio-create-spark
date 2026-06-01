import { Rect, Circle, Triangle, Line, Textbox, type Canvas as FabricCanvas } from "fabric";

export type TemplateObjectSpec =
  | { kind: "rect"; left: number; top: number; width: number; height: number; fill?: string; stroke?: string; strokeWidth?: number; rx?: number; ry?: number; opacity?: number; angle?: number; selectable?: boolean }
  | { kind: "circle"; left: number; top: number; radius: number; fill?: string; stroke?: string; strokeWidth?: number; opacity?: number; selectable?: boolean }
  | { kind: "triangle"; left: number; top: number; width: number; height: number; fill?: string; angle?: number; opacity?: number; selectable?: boolean }
  | { kind: "line"; points: [number, number, number, number]; stroke?: string; strokeWidth?: number; selectable?: boolean }
  | { kind: "text"; text: string; left: number; top: number; width?: number; fontSize?: number; fontFamily?: string; fill?: string; fontWeight?: string | number; fontStyle?: string; textAlign?: "left" | "center" | "right"; originX?: "left" | "center" | "right"; charSpacing?: number; selectable?: boolean };

export const renderTemplateObjects = (canvas: FabricCanvas, objects: TemplateObjectSpec[]) => {
  for (const o of objects) {
    const selectable = o.selectable !== false;
    if (o.kind === "rect") {
      canvas.add(new Rect({
        left: o.left, top: o.top, width: o.width, height: o.height,
        fill: o.fill ?? "transparent",
        stroke: o.stroke, strokeWidth: o.strokeWidth ?? 0,
        rx: o.rx ?? 0, ry: o.ry ?? 0,
        opacity: o.opacity ?? 1, angle: o.angle ?? 0,
        selectable,
      }));
    } else if (o.kind === "circle") {
      canvas.add(new Circle({
        left: o.left, top: o.top, radius: o.radius,
        fill: o.fill ?? "transparent",
        stroke: o.stroke, strokeWidth: o.strokeWidth ?? 0,
        opacity: o.opacity ?? 1,
        selectable,
      }));
    } else if (o.kind === "triangle") {
      canvas.add(new Triangle({
        left: o.left, top: o.top, width: o.width, height: o.height,
        fill: o.fill ?? "#000", angle: o.angle ?? 0, opacity: o.opacity ?? 1,
        selectable,
      }));
    } else if (o.kind === "line") {
      canvas.add(new Line(o.points, {
        stroke: o.stroke ?? "#000", strokeWidth: o.strokeWidth ?? 2,
        selectable,
      }));
    } else if (o.kind === "text") {
      canvas.add(new Textbox(o.text, {
        left: o.left, top: o.top, width: o.width ?? 400,
        fontSize: o.fontSize ?? 24,
        fontFamily: o.fontFamily ?? "Georgia",
        fill: o.fill ?? "#1f2937",
        fontWeight: o.fontWeight ?? "normal",
        fontStyle: o.fontStyle ?? "normal",
        textAlign: o.textAlign ?? "left",
        originX: o.originX ?? "left",
        charSpacing: o.charSpacing ?? 0,
        selectable,
      }));
    }
  }
};