import { RealWorldProject } from '../types';

const PROJECTS: RealWorldProject[] = [
  {
    id: 'project-01-react-gcs-cdn',
    number: 1,
    title: 'Deploy a Production React Static Application with Cloud Storage & Cloud CDN',
    description: 'Build, optimize, and deploy a high-performance React + Vite Single Page Application (SPA) served via Cloud Storage and distributed globally with Cloud CDN and Global HTTPS Load Balancing.',
    architectureSummary: 'Client Browser -> Global External HTTPS Load Balancer (SSL Termination + HTTP/3) -> Cloud CDN Edge Caches -> Cloud Storage Bucket (SPA index.html fallback for client-side routing).',
    servicesUsed: ['Cloud Storage', 'Cloud CDN', 'Cloud Load Balancing', 'Certificate Manager', 'Cloud DNS'],
    difficulty: 'Beginner',
    productionRequirements: [
      'Automatic HTTP-to-HTTPS redirect on port 443.',
      'Google-managed SSL/TLS certificate with automated 90-day renewal.',
      'Cloud CDN caching static JS/CSS chunks for 365 days while serving index.html with no-cache.',
      'Custom error response routing 404s back to index.html for React Router compatibility.'
    ],
    folderStructure: `frontend-app/
├── dist/
│   ├── index.html
│   └── assets/
│       ├── index-24a1.js
│       └── style-98b2.css
├── src/
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts`,
    implementationSteps: [
      {
        step: 1,
        title: 'Build the Production React Artifacts',
        detail: 'Run standard production bundling with Vite to generate static HTML, JS, and CSS chunks.',
        snippet: 'npm run build',
        lang: 'bash'
      },
      {
        step: 2,
        title: 'Create and Configure the Storage Bucket',
        detail: 'Provision a Cloud Storage bucket with Uniform Bucket-Level Access and public read permissions on objects.',
        snippet: `gcloud storage buckets create gs://forge-react-prod-2026 --location=US --uniform-bucket-level-access
gcloud storage buckets update gs://forge-react-prod-2026 --web-main-page-suffix=index.html --web-error-page=index.html
gcloud storage buckets add-iam-policy-binding gs://forge-react-prod-2026 --member=allUsers --role=roles/storage.objectViewer`,
        lang: 'bash'
      },
      {
        step: 3,
        title: 'Upload Assets with Optimal Cache Headers',
        detail: 'Upload hashed JS/CSS assets with immutable 1-year cache headers, and upload index.html with zero-cache headers to ensure immediate updates upon release.',
        snippet: `gcloud storage cp -r ./dist/assets/* gs://forge-react-prod-2026/assets/ --cache-control="public, max-age=31536000, immutable"
gcloud storage cp ./dist/index.html gs://forge-react-prod-2026/index.html --cache-control="no-cache, no-store, must-revalidate"`,
        lang: 'bash'
      }
    ],
    costEstimation: '~ $0.05 - $0.50 / month (Cloud Storage static storage is pennies; Cloud CDN egress covered by free tier at moderate traffic).',
    cleanupCommand: 'gcloud storage rm -r gs://forge-react-prod-2026'
  },
  {
    id: 'project-02-nodejs-cloudrun',
    number: 2,
    title: 'Deploy an Autoscaling Node.js REST API on Cloud Run with Secret Manager',
    description: 'Containerize an Express/Fastify TypeScript REST API, inject database secrets securely at runtime via Secret Manager, and deploy to Cloud Run with automated TLS.',
    architectureSummary: 'Public HTTPS Request -> Cloud Run Global Proxy (TLS Termination) -> Autoscaling Container Instance (gVisor Sandbox) -> Secret Manager (Dynamic Runtime Injection).',
    servicesUsed: ['Cloud Run', 'Artifact Registry', 'Secret Manager', 'Cloud Logging'],
    difficulty: 'Intermediate',
    productionRequirements: [
      'Zero static secrets or environment credentials in Docker images or Git.',
      'Autoscaling from 0 instances during idle to 20 instances under load.',
      'Structured JSON logging with severity levels mapped to Cloud Logging.',
      'Graceful SIGTERM shutdown handling to finish in-flight requests.'
    ],
    folderStructure: `api-service/
├── src/
│   ├── index.ts
│   └── routes.ts
├── Dockerfile
├── .dockerignore
├── package.json
└── tsconfig.json`,
    implementationSteps: [
      {
        step: 1,
        title: 'Author Multi-Stage Dockerfile',
        detail: 'Build the Node application in a compiler stage, then copy only production node_modules and compiled JS into a minimal Alpine runtime image.',
        snippet: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
USER node
ENV PORT=8080
EXPOSE 8080
CMD ["node", "dist/index.js"]`,
        lang: 'dockerfile'
      },
      {
        step: 2,
        title: 'Store Database Secret in Secret Manager',
        detail: 'Create a versioned secret in Secret Manager rather than using plaintext environment variables.',
snippet: `read -r -s DB_CONNECTION_URL
printf '%s' "$DB_CONNECTION_URL" | gcloud secrets create db-connection-url --data-file=-
gcloud secrets add-iam-policy-binding db-connection-url --member="serviceAccount:api-sa@my-proj.iam.gserviceaccount.com" --role="roles/secretmanager.secretAccessor"`,
        lang: 'bash'
      },
      {
        step: 3,
        title: 'Deploy to Cloud Run with Secret Binding',
        detail: 'Deploy container image while binding the secret directly to an environment variable in container memory.',
        snippet: `gcloud run deploy api-service \\
  --image=us-central1-docker.pkg.dev/my-proj/repo/api:latest \\
  --region=us-central1 \\
  --allow-unauthenticated \\
  --set-secrets="DATABASE_URL=db-connection-url:latest" \\
  --min-instances=0 \\
  --max-instances=10 \\
  --concurrency=80`,
        lang: 'bash'
      }
    ],
    costEstimation: '$0.00 within Cloud Run monthly free tier (2 million requests/month free).',
    cleanupCommand: 'gcloud run services delete api-service --region=us-central1 --quiet; gcloud secrets delete db-connection-url --quiet'
  },
  {
    id: 'project-04-cloudrun-cloudsql-private',
    number: 4,
    title: 'Connect Serverless Cloud Run to Private Cloud SQL PostgreSQL',
    description: 'Architect secure private connectivity between serverless Cloud Run containers and a private Cloud SQL instance using Serverless VPC Access connector or Direct VPC Egress.',
    architectureSummary: 'Cloud Run Service -> Direct VPC Egress -> VPC Network -> Private Services Access (Service Networking Peering) -> Managed PostgreSQL Instance (Private RFC 1918 IP, No Public IP).',
    servicesUsed: ['Cloud Run', 'Cloud SQL', 'VPC Network', 'Private Services Access', 'IAM'],
    difficulty: 'Advanced',
    productionRequirements: [
      'Cloud SQL instance has ZERO public IP addresses assigned.',
      'Cloud Run connects privately using Direct VPC Egress or Serverless VPC Connector.',
      'IAM database authentication with Cloud SQL Auth Proxy to eliminate static database passwords.',
      'Automated daily backups with 7-day point-in-time recovery (PITR).'
    ],
    folderStructure: `backend-service/
├── src/
│   ├── db.ts # pg pool using Cloud SQL connector
│   └── server.ts
├── Dockerfile
└── package.json`,
    implementationSteps: [
      {
        step: 1,
        title: 'Reserve Private IP Range and Peer with Google Services',
        detail: 'Allocate an internal IP range in your VPC and peer it with Google Cloud Service Networking.',
        snippet: `gcloud compute addresses create google-managed-services-default \\
  --global --purpose=VPC_PEERING --prefix-length=16 --network=prod-vpc
gcloud services vpc-peerings connect \\
  --service=servicenetworking.googleapis.com --ranges=google-managed-services-default --network=prod-vpc`,
        lang: 'bash'
      },
      {
        step: 2,
        title: 'Provision Private Cloud SQL Instance',
        detail: 'Create a PostgreSQL instance bound to the peered VPC with no public IPv4 address.',
        snippet: `gcloud sql instances create prod-pg-instance \\
  --database-version=POSTGRES_15 \\
  --tier=db-custom-1-3840 \\
  --region=us-central1 \\
  --network=prod-vpc \\
  --no-assign-ip`,
        lang: 'bash'
      },
      {
        step: 3,
        title: 'Deploy Cloud Run with Direct VPC Egress',
        detail: 'Direct all outbound traffic through the private VPC subnet to route directly to PostgreSQL.',
        snippet: `gcloud run deploy private-api \\
  --image=us-central1-docker.pkg.dev/my-proj/repo/api:v1 \\
  --region=us-central1 \\
  --network=prod-vpc \\
  --subnet=prod-subnet-us \\
  --vpc-egress=private-ranges-only`,
        lang: 'bash'
      }
    ],
    costEstimation: 'Cloud SQL db-custom-1-3840 costs ~$50/month; terminate lab instances immediately after verification.',
    cleanupCommand: 'gcloud run services delete private-api --region=us-central1 --quiet; gcloud sql instances delete prod-pg-instance --quiet'
  },
  {
    id: 'project-07-github-actions-wif',
    number: 7,
    title: 'Zero-Secret CI/CD Pipeline with GitHub Actions & Workload Identity Federation',
    description: 'Eliminate compromised service account JSON keys by configuring cryptographic OpenID Connect (OIDC) token exchange between GitHub Actions runners and Google Cloud IAM.',
    architectureSummary: 'GitHub Actions Job -> Requests GitHub OIDC JWT -> Calls Google Cloud Security Token Service (STS) -> Exchanges for Ephemeral Google IAM Access Token -> Authenticates gcloud/Docker -> Deploys to Cloud Run.',
    servicesUsed: ['IAM Workload Identity Federation', 'Cloud Run', 'Artifact Registry', 'GitHub Actions'],
    difficulty: 'Advanced',
    productionRequirements: [
      'No long-lived JSON service account keys stored in GitHub Secrets.',
      'OIDC token validation restricts access to specific repository owner and main branch.',
      'Tokens expire automatically in 60 minutes.',
      'Zero manual console intervention required to ship new software versions.'
    ],
    folderStructure: `.github/
└── workflows/
    └── deploy.yml
src/
Dockerfile
package.json`,
    implementationSteps: [
      {
        step: 1,
        title: 'Create Workload Identity Pool and OIDC Provider',
        detail: 'Configure Google Cloud to trust GitHub token issuer `https://token.actions.githubusercontent.com`.',
        snippet: `gcloud iam workload-identity-pools create "github-pool" \\
  --project="$(gcloud config get-value project)" --location="global" --display-name="GitHub Actions Pool"

gcloud iam workload-identity-pools providers create-oidc "github-provider" \\
  --project="$(gcloud config get-value project)" --location="global" \\
  --workload-identity-pool="github-pool" --display-name="GitHub Actions Provider" \\
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \\
  --issuer-uri="https://token.actions.githubusercontent.com"`,
        lang: 'bash'
      },
      {
        step: 2,
        title: 'Bind IAM Service Account to GitHub Repository',
        detail: 'Allow only your specific GitHub repository to impersonate the deployment service account.',
        snippet: `gcloud iam service-accounts add-iam-policy-binding "ci-deployer@my-proj.iam.gserviceaccount.com" \\
  --role="roles/iam.workloadIdentityUser" \\
  --member="principalSet://iam.googleapis.com/projects/$(gcloud projects describe my-proj --format='value(projectNumber)')/locations/global/workloadIdentityPools/github-pool/attribute.repository/my-org/my-repo"`,
        lang: 'bash'
      },
      {
        step: 3,
        title: 'Configure GitHub Actions Workflow File',
        detail: 'Use official Google Cloud auth action to exchange OIDC token without secrets.',
        snippet: `name: Production Deploy
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write # Required for requesting OIDC token
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: 'projects/12345/locations/global/workloadIdentityPools/github-pool/providers/github-provider'
          service_account: 'ci-deployer@my-proj.iam.gserviceaccount.com'
      - name: Deploy to Cloud Run
        run: gcloud run deploy prod-api --image=us-central1-docker.pkg.dev/my-proj/repo/api:\${{ github.sha }} --region=us-central1`,
        lang: 'yaml'
      }
    ],
    costEstimation: 'Workload Identity Federation API calls are completely free of charge.',
    cleanupCommand: 'gcloud iam workload-identity-pools delete github-pool --location=global --quiet'
  },
  {
    id: 'project-12-vertex-ai-rag',
    number: 12,
    title: 'Enterprise Document Q&A RAG System with Vertex AI, Vector Search & Gemini 1.5',
    description: 'Build a production-grade Retrieval-Augmented Generation (RAG) system that processes internal PDF documentation, generates vector embeddings, stores them in Vertex AI Vector Search, and streams grounded answers via Gemini 1.5 Flash.',
    architectureSummary: 'User Question -> Cloud Run API -> Vertex AI Text Embeddings (text-embedding-004) -> Vertex AI Vector Search (Top-5 Chunks Retrieved) -> Gemini 1.5 Flash (Grounded Prompt Context) -> Streaming Answer to Client.',
    servicesUsed: ['Vertex AI Studio', 'Vector Search', 'Cloud Run', 'Cloud Storage', 'Cloud KMS'],
    difficulty: 'Architect',
    productionRequirements: [
      'Strict grounding: Gemini answers only based on retrieved company chunks, refusing to hallucinate.',
      'Customer prompts and indexed documentation are never retained for model training.',
      'Sub-800ms end-to-end response latency using Gemini 1.5 Flash.',
      'Customer-Managed Encryption Keys (CMEK) via Cloud KMS for regulatory compliance.'
    ],
    folderStructure: `rag-service/
├── ingestion/
│   ├── chunker.py
│   └── embedder.py
├── api/
│   ├── main.py
│   └── rag_engine.py
├── Dockerfile
└── requirements.txt`,
    implementationSteps: [
      {
        step: 1,
        title: 'Generate Text Embeddings for Ingested Documents',
        detail: 'Read documents from Cloud Storage, chunk into 500-token paragraphs with 50-token overlap, and invoke Vertex AI text-embedding-004 model.',
        snippet: `from vertexai.language_models import TextEmbeddingModel

model = TextEmbeddingModel.from_pretrained("text-embedding-004")
embeddings = model.get_embeddings(["Cloud VPC subnets are regional constructs..."])
print(f"Dimension: {len(embeddings[0].values)}") # 768 dimensions`,
        lang: 'python'
      },
      {
        step: 2,
        title: 'Query Vertex AI Vector Search Index',
        detail: 'Convert the user query to vector space and retrieve nearest neighbor document chunks with high cosine similarity.',
        snippet: `from google.cloud import aiplatform

my_index_endpoint = aiplatform.MatchingEngineIndexEndpoint(index_endpoint_name='123456789')
response = my_index_endpoint.find_neighbors(
    deployed_index_id="enterprise_knowledge_deployed",
    queries=[query_vector],
    num_neighbors=5
)`,
        lang: 'python'
      },
      {
        step: 3,
        title: 'Synthesize Grounded Answer with Gemini 1.5 Flash',
        detail: 'Pass retrieved document text inside system instructions to Gemini 1.5 Flash with strict anti-hallucination guardrails.',
        snippet: `import vertexai
from vertexai.generative_models import GenerativeModel

vertexai.init(project="my-proj", location="us-central1")
model = GenerativeModel(
    "gemini-1.5-flash",
    system_instruction=["Answer the user question using ONLY the provided context chunks. If the answer is not in context, state: 'Information not found in documentation.'"]
)
response = model.generate_content(f"Context: {retrieved_chunks}\\n\\nQuestion: {user_query}")
print(response.text)`,
        lang: 'python'
      }
    ],
    costEstimation: 'Gemini 1.5 Flash: $0.075 per 1 million input tokens. Vector Search index endpoint: ~$0.20/hour for standard e2-highmem node.',
    cleanupCommand: 'gcloud ai index-endpoints delete <ENDPOINT_ID> --region=us-central1 --quiet'
  }
];

export const REAL_WORLD_PROJECTS: RealWorldProject[] = PROJECTS.map(project => {
  if (project.id === 'project-01-react-gcs-cdn') {
    return {
      ...project,
      title: 'Deploy a React Static Application to Cloud Storage',
      description: 'Build and publish a React + Vite static site to Cloud Storage. This scoped exercise does not claim to configure an external HTTPS load balancer, Cloud CDN, DNS, or certificates.',
      architectureSummary: 'Client Browser -> Cloud Storage bucket website configuration -> React SPA assets.',
      servicesUsed: ['Cloud Storage'],
      productionRequirements: ['Use a globally unique bucket name.', 'Keep index.html and hashed assets cache policies distinct.', 'Treat public object access as a deliberate trade-off; use a private backend bucket for production HTTPS delivery.'],
      costEstimation: 'Variable. Storage, operations, and network egress depend on region and traffic. No fixed monthly price is guaranteed.'
    };
  }
  if (project.id === 'project-02-nodejs-cloudrun') {
    return { ...project, costEstimation: 'Variable. Cloud Run free quotas are conditional. Compute, memory, CPU allocation, requests, network egress, Artifact Registry, Secret Manager, build, and logging usage may incur charges.' };
  }
  if (project.id === 'project-04-cloudrun-cloudsql-private') {
    return {
      ...project,
      architectureSummary: 'Cloud Run -> Direct VPC Egress or Serverless VPC Access -> VPC -> Private Services Access -> Cloud SQL private IP. Cloud SQL Auth Proxy/connectors provide connection handling; IAM database authentication controls database identity. These are separate choices.',
      productionRequirements: [...project.productionRequirements, 'Choose either a Cloud SQL connector/Auth Proxy connection path or direct driver configuration explicitly.', 'Configure IAM database authentication separately from private IP connectivity.'],
      costEstimation: 'Variable. Cloud SQL instance tier, storage, backups, IP/networking, Cloud Run, logging, and egress charges depend on configuration and usage.'
    };
  }
  if (project.id === 'project-07-github-actions-wif') {
    return {
      ...project,
      productionRequirements: project.productionRequirements.map(requirement => requirement.includes('Tokens expire') ? 'Use short-lived credentials; token lifetime and provider behavior follow current IAM and GitHub OIDC configuration.' : requirement),
      implementationSteps: project.implementationSteps.map(step => step.title.includes('Create Workload Identity') ? {
        ...step,
        snippet: `${step.snippet?.replace('attribute.repository=assertion.repository', 'attribute.repository=assertion.repository,attribute.ref=assertion.ref')}\n--attribute-condition="attribute.repository == \'my-org/my-repo\' && attribute.ref == \'refs/heads/main\'"`
      } : step)
    };
  }
  return project;
});
