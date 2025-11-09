// Compatibility re-export: some files import from `@/components/Logo/ThemeLogo`
// while the implementation lives under `components/layout/ThemeLogo.tsx`.
// Export the default implementation from the layout path so imports resolve.
export { default } from "@/components/layout/ThemeLogo";
