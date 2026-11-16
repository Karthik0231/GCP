import { ArchitectureItem } from '../types';

export const ARCHITECTURE_CATALOG: ArchitectureItem[] = [
  {
    id: 'arch-web-cloudrun-cloudsql',
    title: 'Production Web App: Cloud Run + Private Cloud SQL + Cloud Armor',
    category: 'Application Hosting',
    summary: 'Enterprise tier-1 web application architecture featuring DDoS mitigation, managed global TLS termination, autoscaling serverless compute, and a private zero-public-IP relational database.',
    nodes: [
      {
        id: 'client',
        label: 'Client Browser',
        role: 'Initiates HTTPS request',
        service: 'End User Device',
        tier: 'Edge',
        techNotes: 'Communicates via HTTP/3 / QUIC or TLS 1.3 over public internet.'
      },
      {
        id: 'cloud-armor',
        label: 'Cloud Armor',
        role: 'DDoS & WAF Protection',
        service: 'Google Cloud Armor',
        tier: 'Security Edge',
        techNotes: 'Filters OWASP Top 10 exploits, SQLi, XSS, and rate limits malicious IP ranges before hitting origin.'
      },
      {
        id: 'https-lb',
        label: 'Global External HTTPS Load Balancer',
        role: 'Anycast Global Routing & SSL Termination',
        service: 'Cloud Load Balancing',
        tier: 'Networking',
        techNotes: 'Google Anycast IP announces globally at 100+ Edge Points of Presence (PoPs), routing requests across Google private fiber.'
      },
      {
        id: 'serverless-neg',
        label: 'Serverless NEG',
        role: 'Routes LB traffic to Cloud Run',
        service: 'Serverless Network Endpoint Group',
        tier: 'Networking Adapter',
        techNotes: 'Binds the global load balancer URL map directly to regional Cloud Run services.'
      },
      {
        id: 'cloud-run',
        label: 'Cloud Run Service',
        role: 'Autoscaling Stateless Application Logic',
        service: 'Cloud Run',
        tier: 'Compute',
        techNotes: 'Scales 0 to 1000 instances in gVisor sandboxes. Direct VPC Egress routes outbound DB traffic into private VPC.'
      },
      {
        id: 'cloud-sql',
        label: 'Cloud SQL (PostgreSQL HA)',
        role: 'Transactional Relational Database',
        service: 'Cloud SQL',
        tier: 'Data Persistence',
        techNotes: 'Private RFC 1918 IP via Private Services Access. Synchronous replication to standby zone for automated failover.'
      }
    ],
    flows: [
      { from: 'client', to: 'cloud-armor', label: '1. HTTPS:443', protocol: 'TLS 1.3 / HTTP/3' },
      { from: 'cloud-armor', to: 'https-lb', label: '2. Inspected Traffic', protocol: 'Internal Google Edge' },
      { from: 'https-lb', to: 'serverless-neg', label: '3. Forward Request', protocol: 'Google Global Backbone' },
      { from: 'serverless-neg', to: 'cloud-run', label: '4. Invoke Container', protocol: 'gVisor MicroVM' },
      { from: 'cloud-run', to: 'cloud-sql', label: '5. Private Query (Port 5432)', protocol: 'Internal VPC / Private IP' }
    ],
    keyPrinciples: [
      'Zero Public IP on database: Cloud SQL has no external exposure, stopping automated internet port scans.',
      'Edge DDoS Mitigation: Cloud Armor absorbs volumetric attacks at Google edge before reaching compute.',
      'Stateless Compute: Cloud Run handles transient spikes elastically with zero idle infrastructure cost.',
      'Least Privilege IAM: Cloud Run service account is restricted solely to needed Cloud SQL and Logging roles.'
    ]
  },
  {
    id: 'arch-event-driven-microservices',
    title: 'Event-Driven Async Pipeline: Storage -> Eventarc -> Pub/Sub -> Cloud Run',
    category: 'Event-Driven Architecture',
    summary: 'Decoupled asynchronous processing pipeline triggered by file uploads, handling image optimization, audit event distribution, and resilient retry queues.',
    nodes: [
      {
        id: 'gcs-bucket',
        label: 'Cloud Storage Bucket',
        role: 'File Upload Ingestion',
        service: 'Cloud Storage',
        tier: 'Storage',
        techNotes: 'Receives customer uploads via direct Signed URLs without passing through API servers.'
      },
      {
        id: 'eventarc',
        label: 'Eventarc Trigger',
        role: 'CloudEvent Routing',
        service: 'Eventarc',
        tier: 'Event Router',
        techNotes: 'Listens for `google.cloud.storage.object.v1.finalized` and packages audit events into standard CloudEvents 1.0 JSON.'
      },
      {
        id: 'pubsub-topic',
        label: 'Cloud Pub/Sub Topic',
        role: 'Durable Message Queue',
        service: 'Cloud Pub/Sub',
        tier: 'Messaging',
        techNotes: 'Buffers events with at-least-once delivery, horizontal partitioning, and dead-letter queue backup.'
      },
      {
        id: 'cloud-run-worker',
        label: 'Cloud Run Worker Service',
        role: 'Background Processing',
        service: 'Cloud Run',
        tier: 'Compute',
        techNotes: 'Push subscription invokes `/process` endpoint. Autoscales dynamically with incoming message backlog.'
      },
      {
        id: 'firestore',
        label: 'Firestore Database',
        role: 'Metadata & State Tracking',
        service: 'Firestore (Native Mode)',
        tier: 'NoSQL Data',
        techNotes: 'Stores processed image metadata and updates job status with real-time UI listeners.'
      }
    ],
    flows: [
      { from: 'gcs-bucket', to: 'eventarc', label: '1. Object Finalized Event', protocol: 'Audit Log Filter' },
      { from: 'eventarc', to: 'pubsub-topic', label: '2. Publish CloudEvent', protocol: 'Internal Pub/Sub' },
      { from: 'pubsub-topic', to: 'cloud-run-worker', label: '3. HTTP Push Delivery', protocol: 'OIDC Authenticated POST' },
      { from: 'cloud-run-worker', to: 'firestore', label: '4. Update Job Document', protocol: 'gRPC' }
    ],
    keyPrinciples: [
      'Decoupled Producers & Consumers: Web frontend does not wait for image resizing; API returns immediate HTTP 202 Accepted.',
      'Idempotency: Processing handlers verify whether object was already processed using unique event IDs to prevent duplicate actions.',
      'Dead-Letter Resiliency: Poison-pill messages that fail 5 consecutive times automatically divert to DLQ topic without blocking the queue.'
    ]
  },
  {
    id: 'arch-genai-rag-vertex',
    title: 'Enterprise GenAI RAG Architecture: Gemini 1.5 Flash + Vector Search',
    category: 'Artificial Intelligence',
    summary: 'Production retrieval-augmented generation architecture grounding Gemini models in verified corporate knowledge with zero hallucination and complete data privacy.',
    nodes: [
      {
        id: 'rag-client',
        label: 'Enterprise User Portal',
        role: 'Submits natural language queries',
        service: 'Frontend Web App',
        tier: 'Client',
        techNotes: 'Encrypted HTTPS connection with corporate SSO authentication.'
      },
      {
        id: 'rag-api',
        label: 'RAG Orchestrator API',
        role: 'Coordinates embedding, retrieval & generation',
        service: 'Cloud Run',
        tier: 'Compute Orchestrator',
        techNotes: 'Lightweight Python/FastAPI service orchestrating the multi-step RAG prompt pipeline.'
      },
      {
        id: 'embeddings-api',
        label: 'Vertex AI Embeddings',
        role: 'Converts text to high-dimensional vectors',
        service: 'Vertex AI text-embedding-004',
        tier: 'AI Model',
        techNotes: 'Transforms input queries into 768-dimensional normalized dense vectors.'
      },
      {
        id: 'vector-search',
        label: 'Vertex AI Vector Search',
        role: 'Approximate Nearest Neighbor (ANN) Index',
        service: 'Vector Search Index Endpoint',
        tier: 'Vector DB',
        techNotes: 'Scans millions of document vectors in <15ms using tree-AH indexing to retrieve top-k relevant context chunks.'
      },
      {
        id: 'gemini-model',
        label: 'Gemini 1.5 Flash Model',
        role: 'Synthesizes grounded response',
        service: 'Vertex AI Foundation Models',
        tier: 'Large Language Model',
        techNotes: 'Infers final answer using strict system prompt instructions: ground answers only in provided context chunks.'
      }
    ],
    flows: [
      { from: 'rag-client', to: 'rag-api', label: '1. User Prompt', protocol: 'HTTPS JSON' },
      { from: 'rag-api', to: 'embeddings-api', label: '2. Generate Query Vector', protocol: 'Vertex AI SDK' },
      { from: 'rag-api', to: 'vector-search', label: '3. Vector Similarity Query', protocol: 'gRPC / Matching Engine' },
      { from: 'vector-search', to: 'rag-api', label: '4. Return Top-5 Chunks', protocol: 'Cosine Similarity > 0.82' },
      { from: 'rag-api', to: 'gemini-model', label: '5. Grounded Prompt Request', protocol: 'Vertex AI GenerateContent' },
      { from: 'gemini-model', to: 'rag-client', label: '6. Streamed Final Answer', protocol: 'Server-Sent Events (SSE)' }
    ],
    keyPrinciples: [
      'Data Privacy Guaranteed: Customer prompts and corporate documents are never used by Google to train foundation models.',
      'Grounded Accuracy: Strictly bounded prompts eliminate model hallucinations by forcing citation of retrieved text.',
      'Sub-Second Performance: Gemini 1.5 Flash delivers low latency and 10x cost savings compared to heavyweight models.'
    ]
  }
];

