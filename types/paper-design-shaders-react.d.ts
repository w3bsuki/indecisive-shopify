declare module "@paper-design/shaders-react" {
  import type { ComponentType, HTMLAttributes } from "react";

  export interface MeshGradientProps extends HTMLAttributes<HTMLDivElement> {
    colors?: string[];
    speed?: number;
    wireframe?: boolean | string;
    backgroundColor?: string;
  }

  export interface PulsingBorderProps extends HTMLAttributes<HTMLDivElement> {
    color?: string;
    duration?: number;
    thickness?: number;
    radius?: number | string;
  }

  export const MeshGradient: ComponentType<MeshGradientProps>;
  export const PulsingBorder: ComponentType<PulsingBorderProps>;
}

