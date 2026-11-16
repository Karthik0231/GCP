# GCP Forge Sprint 2 test report

## Environment

- Static source audit: completed with CodeGraph.
- Browser automation: unavailable in this workspace.
- Real Google Cloud project: not used.
- Production build: blocked by the repository command hook because `context-mode` reports `NODE_TOO_OLD`.

## Viewport matrix

| Width | Mobile roadmap/nav source review | Browser execution |
| ---: | :--- | :--- |
| 320 | Passed source review | Not run |
| 360 | Passed source review | Not run |
| 375 | Passed source review | Not run |
| 390 | Passed source review | Not run |
| 430 | Passed source review | Not run |
| 768 | Passed source review; mobile layout remains active below `lg` | Not run |
| 1024 | Desktop layout breakpoint | Not run |
| 1280 | Desktop layout breakpoint | Not run |
| 1440 | Desktop layout breakpoint | Not run |
| 1920 | Desktop layout breakpoint | Not run |

## Source-level checks

- Mobile navigation exposes Map, Topics, Labs, Build, More, and Search.
- More exposes Commands, Architectures, and Revision.
- Mobile roadmap uses vertical stage sections and touch-sized buttons.
- Topic and project cards support Enter and Space activation.
- Lab selectors and verification rows support keyboard activation.
- Content validator covers duplicate IDs, empty core fields, invalid references, prerequisite cycles, cleanup presence, and verified-source metadata.

## Not proven

No claim is made for screenshots, pixel-level overflow, browser console cleanliness, production build success, current command execution, or real-cloud lab completion until browser and build tooling are available.
