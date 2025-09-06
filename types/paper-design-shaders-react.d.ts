declare module "@paper-design/shaders-react" {
  import type { ComponentType } from "react";

  // Loosely typed components to avoid strict prop mismatches in CI
  export const MeshGradient: ComponentType<any>;
  export const PulsingBorder: ComponentType<any>;
}
