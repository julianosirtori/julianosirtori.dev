// Static-render stub for framer-motion. In headless capture, entrance
// animations driven from initial={{opacity:0}} don't always settle before the
// screenshot, leaving motion elements invisible (ProjectCard's motion.a is the
// clearest case). This renders each motion.<tag> as the plain element at its
// FINAL visual state (animation props stripped, so no opacity:0), which is
// exactly what a static design-system card should show. motion(Component) and
// the common hooks are supported as inert passthroughs.
import * as React from "react";

const STRIP = new Set([
  "initial",
  "animate",
  "exit",
  "transition",
  "variants",
  "custom",
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileInView",
  "whileDrag",
  "viewport",
  "layout",
  "layoutId",
  "layoutDependency",
  "layoutScroll",
  "drag",
  "dragConstraints",
  "dragElastic",
  "dragMomentum",
  "dragSnapToOrigin",
  "onDrag",
  "onDragStart",
  "onDragEnd",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onHoverStart",
  "onHoverEnd",
  "onTap",
  "onTapStart",
  "onTapCancel",
  "onViewportEnter",
  "onViewportLeave",
  "transformTemplate",
  "inherit",
]);

function clean(props: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const k in props) if (!STRIP.has(k)) out[k] = props[k];
  return out;
}

const cache = new Map<unknown, unknown>();
function motionComponent(tag: unknown) {
  if (!cache.has(tag)) {
    const C = React.forwardRef<unknown, Record<string, unknown>>((props, ref) =>
      React.createElement(tag as React.ElementType, { ref, ...clean(props) }),
    );
    cache.set(tag, C);
  }
  return cache.get(tag);
}

export const motion: any = new Proxy(function () {}, {
  get: (_t, tag) => motionComponent(typeof tag === "string" ? tag : "div"),
  apply: (_t, _this, args) => motionComponent(args[0]),
});
export const m = motion;

export function AnimatePresence({ children }: { children?: React.ReactNode }) {
  return React.createElement(React.Fragment, null, children);
}
export function MotionConfig({ children }: { children?: React.ReactNode }) {
  return React.createElement(React.Fragment, null, children);
}
export function LazyMotion({ children }: { children?: React.ReactNode }) {
  return React.createElement(React.Fragment, null, children);
}
export const domAnimation = {};
export const domMax = {};

function motionValue(initial: unknown) {
  return {
    get: () => initial,
    set: () => {},
    on: () => () => {},
    destroy: () => {},
    isAnimating: () => false,
  };
}
export const useReducedMotion = () => true;
export const useAnimation = () => ({
  start: () => Promise.resolve(),
  stop: () => {},
  set: () => {},
});
export const useAnimationControls = useAnimation;
export const useMotionValue = (v: unknown) => motionValue(v);
export const useTransform = () => motionValue(0);
export const useSpring = (v: unknown) =>
  motionValue(typeof v === "object" ? 0 : v);
export const useScroll = () => ({
  scrollX: motionValue(0),
  scrollY: motionValue(0),
  scrollXProgress: motionValue(0),
  scrollYProgress: motionValue(0),
});
export const useInView = () => true;
export const useMotionValueEvent = () => {};
export const useMotionTemplate = () => "";
export const useAnimationFrame = () => {};
export const useVelocity = () => motionValue(0);

export default { motion, m, AnimatePresence, MotionConfig, LazyMotion };
