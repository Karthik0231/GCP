# GCP Forge product audit

Audit date: 2026-11-16

## Scope

Reviewed the application shell, navigation, roadmap flow, topic reader, search, persistence store, topic explorer, labs, projects, commands, architecture, and interview surfaces. Existing curriculum and feature architecture remain in place.

## Findings

### Responsive UX

| Area | Status | Finding |
| --- | --- | --- |
| Header navigation | Partially complete | Desktop navigation was hidden below `lg`; mobile users had no equivalent route navigation. |
| Roadmap | Partially complete | The desktop canvas used a centered spine and dense layout that was unsuitable for narrow screens. |
| Topic nodes | Partially complete | Desktop canvas nodes were not touch-optimized on mobile. |
| Search modal | Needs verification | Modal has a bounded viewport height but needs viewport testing at 320–430px. |
| Topic reader | Needs verification | Content is scrollable, but code, tabs, and bottom actions need device-level testing. |
| Labs, projects, commands | Needs verification | Grid breakpoints exist; interactive rows use click handlers and require keyboard/device testing. |

### Content model

| Surface | Status | Missing or risky coverage |
| --- | --- | --- |
| Curriculum topics | Needs technical verification | The model supports console, CLI, Terraform, security, cost, quiz, and lab fields. Each record still needs per-topic freshness and command verification. |
| Labs | Partially complete | `HandsOnLab` has no first-class fields for permissions, troubleshooting, expected output, or billing requirements. Existing text must not imply that a lab is free or that budget alerts prevent charges. |
| Commands | Partially complete | `CommandLineItem` has purpose, syntax, output, warnings, prerequisites, and permissions, but no structured common-error or troubleshooting field. |
| Projects | Partially complete | Project records have implementation steps and cleanup, but no structured Console, Terraform, rollback, logs, secrets, or networking sections. |
| Architecture diagrams | Needs technical verification | Diagrams have nodes and flows. Service names, protocol claims, and production recommendations require source verification before being marked current. |
| Interview prep | Needs technical verification | Answers and comparison tables require current service behavior and terminology checks. |

## Implemented in this pass

- Added mobile bottom navigation with access to every application view.
- Added a mobile “More” menu for Commands, Architectures, and Revision without causing horizontal overflow.
- Added a vertical mobile roadmap with stage grouping, branch filtering, completion state, in-progress state, prerequisite indicators, and recommended-next-topic action.
- Preserved the existing desktop roadmap canvas and all existing data/state flows.
- Added mobile bottom safe-area spacing in the application shell.

## Prioritized remaining work

1. Run a production build and browser checks at 320, 360, 375, 390, 430, 768, 1024, 1280, 1440, and 1920px.
2. Convert click-only cards and accordion triggers to keyboard-accessible buttons.
3. Add structured lab and project metadata for permissions, billing, troubleshooting, verification, rollback, and cleanup.
4. Verify every command and service claim against current Google Cloud documentation.
5. Add content fixtures or tests that reject empty instructional fields and invalid topic prerequisites.

## Acceptance note

This audit does not mark educational content complete merely because records exist. Current content remains “needs technical verification” until commands, pricing, service status, and deployment workflows are checked against official documentation.

## Sprint 2 audit notes

- The four labs expose cleanup and checklist arrays, but the previous model could not represent billing requirements, permissions, possible charges, setup, troubleshooting, or source status.
- Lab 02 previously described an e2-micro exercise as Free Tier. It now warns that billing is required and that VM, disk, and egress charges are possible.
- Lab 01 now documents service-account impersonation permissions and avoids treating IAM-only work as a guaranteed billing-free workload.
- Lab 03 now treats Cloud Run traffic splitting as potentially billable and requires explicit revision-name verification. The traffic workflow remains marked `needs-review` until run in a real project.
- Content validation now checks duplicate IDs, empty core fields, reference integrity, prerequisite cycles, cleanup presence, and verification metadata.
- Topic and project cards now support keyboard activation; lab selectors and verification rows expose keyboard semantics.

Official documentation remains the source of truth for all unstable service behavior, pricing, model IDs, and CLI syntax. No real Google Cloud deployment was executed in this environment.
