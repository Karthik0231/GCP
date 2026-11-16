# Sprint 2.1 technical correctness report

## Scope completed

- Corrected lab data is now the source used by Labs, search, and validation.
- Legacy `src/data/labs.ts` import path re-exports corrected records.
- Added validation for lab objectives, implementation steps, prerequisite references, cleanup, billing caveats, verification, secrets, and documentation metadata.
- Existing lab records remain `needs-review`. Content metadata never claims real-cloud execution.

## Lab verification contract

| Lab | Required proof | Execution status |
| --- | --- | --- |
| IAM impersonation | Token creation, identity subject, log principal, no key | Source workflow corrected; not run in GCP |
| Private VM and IAP | No external IP, IAP SSH, OS Login, Private Google Access | Source workflow corrected; not run in GCP |
| Cloud Run canary | Explicit revision names, ready revisions, 90/10 traffic, version responses, rollback | Source workflow corrected; not run in GCP |
| Pub/Sub DLQ | Four resources, service-agent IAM, nack retries, DLQ message, monitoring, cleanup | Source workflow corrected; not run in GCP |

## Documentation checked

- IAM service-account impersonation and service-account roles.
- IAP TCP forwarding and Compute Engine OS Login.
- Private Google Access.
- Cloud Run revisions and traffic migration.
- Pub/Sub dead-letter topics and monitoring.
- Google Gen AI SDK migration, embedding models, and Vector Search references.

## Remaining work

- Full curriculum, 12-project, and command-by-command technical review remains open.
- Vertex AI lesson rewrite remains open; current validation reports legacy SDK references for review.
- Browser viewport testing and screenshots remain unavailable.
- `npm run build` and automated test execution remain blocked by the local `context-mode: NODE_TOO_OLD` pre-tool hook.
- No lab was executed against a real Google Cloud project.
