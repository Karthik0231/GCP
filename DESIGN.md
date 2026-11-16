# DESIGN.md — GCP Forge Design System

## 1. Aesthetic Direction: Premium Technical Workbench
GCP Forge is built as a precision developer tool, inspired by high-end cloud control planes and roadmap.sh. It avoids frivolous gradients, cartoon illustrations, and decorative bloat. Every element communicates technical intent, hierarchy, and state.

## 2. Color Palette & Theming
- **Canvas / Background**:
  - Dark Canvas Primary: `#090d16` (Deep space navy)
  - Dark Canvas Secondary / Surfaces: `#0f172a` (Slate navy)
  - Dark Panel / Card Surface: `#131d33`
  - Dark Card Hover / Active: `#1a2744`
  - Subtle Grid Overlay: `rgba(56, 189, 248, 0.04)` on 24px grid
- **Borders & Dividers**:
  - Border Subtlest: `rgba(255, 255, 255, 0.07)`
  - Border Default: `#1e293b`
  - Border Interactive / Focus: `#38bdf8`
- **Accents & Semantic Roles**:
  - Primary Brand / GCP Blue: `#3b82f6` / `#60a5fa`
  - Cyan Accent (Active/Path): `#06b6d4` / `#38bdf8`
  - Success / Completed: `#10b981` (Emerald)
  - Warning / Cost Alert: `#f59e0b` (Amber)
  - Destructive / Cleanup: `#ef4444` (Rose)
  - Recommended Next Glow: `#38bdf8`
- **Text & Foreground**:
  - Text Primary: `#f8fafc` (Slate 50)
  - Text Secondary: `#94a3b8` (Slate 400)
  - Text Muted: `#64748b` (Slate 500)
  - Text Inverse: `#0f172a`

## 3. Typography
- **Interface & Prose**: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Code, Commands, CIDR & Metrics**: "JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace
- Contrast ratio strictly exceeds 4.5:1 for body and 3:1 for large display elements.

## 4. UI Components
- **Visual Roadmap Canvas**:
  - Vertical multi-stage connected graph with SVG curved connectors.
  - Interactive zoom (+ / - / reset) and pan support, plus responsive stacked fallback.
  - Branch filter pills (All, Core, Networking, Compute, Storage & DBs, Containers, DevOps, Security, AI & Advanced).
  - Node status badges: Not Started, In Progress, Completed, Recommended Next.
- **Topic Drawer / Detail View**:
  - Header with breadcrumbs, status toggle, time estimate, prerequisites.
  - Dual implementation tabs: Google Cloud Console, gcloud CLI, Terraform.
  - Interactive SVG architecture diagram with clickable components.
  - Cost warning box & common mistakes callout.
  - 5-point Quick Revision.
  - Interactive Knowledge Check (Quiz with explanation).
  - Practical Lab Exercise checklist.
- **Global Command Center**:
  - Searchable CLI reference with copy buttons, flag explanations, and destructive command warnings.
- **Interactive Architecture Explorer**:
  - System diagrams with clickable nodes detailing role, protocol, and security implications.
- **Hands-on Labs & Real-World Projects**:
  - Progressive problem statements, architectures, step-by-step guides, and explicit cleanup commands.
- **Search Dialog (Cmd/Ctrl + K)**:
  - Instant fuzzy search across curriculum topics, CLI commands, labs, and projects.

