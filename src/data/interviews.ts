import { InterviewPrepItem } from '../types';

export const INTERVIEW_PREP_DATA: InterviewPrepItem[] = [
  {
    id: 'int-01-cloudrun-vs-gke',
    category: 'Compute & Containers',
    level: 'Architect',
    question: 'When should you choose Google Cloud Run versus Google Kubernetes Engine (GKE) for running containerized workloads?',
    shortAnswer: 'Choose Cloud Run for stateless HTTP services, APIs, and event-driven microservices with zero cluster management and automatic scaling to zero. Choose GKE when you require complex container orchestration, stateful persistent volume sets, custom networking daemons, non-HTTP protocols, or fine-grained cluster control.',
    deepDive: 'Cloud Run abstracts the entire cluster layer away. You do not manage Kubernetes nodes, control plane upgrades, or pod scheduling. Cloud Run scales from 0 to thousands of instances in milliseconds, billing only per 100ms of CPU consumed during active request processing. However, Cloud Run limits requests to 60 minutes max and requires containers to be stateless.\n\nGKE (especially GKE Autopilot) is necessary when your application needs daemon sets, ingress meshes (Istio/Envoy), GPU acceleration clusters with custom drivers, persistent multi-zone volumes, or background workers that maintain long-lived stateful TCP/WebSocket connections across days.',
    comparisonTable: {
      title: 'Cloud Run vs Google Kubernetes Engine (GKE)',
      colA: 'Cloud Run',
      colB: 'GKE (Autopilot / Standard)',
      rows: [
        { feature: 'Infrastructure Management', valA: 'Zero (Serverless, fully managed)', valB: 'Kubernetes API (Google manages node provisioning in Autopilot)' },
        { feature: 'Scale to Zero', valA: 'Native out-of-the-box (Zero idle cost)', valB: 'Possible with KEDA; cluster base nodes typically remain' },
        { feature: 'Billing Metric', valA: 'Per 100ms request CPU/RAM allocation', valB: 'Per-Pod resource request (Autopilot) or VM node hours (Standard)' },
        { feature: 'Maximum Execution Timeout', valA: '60 minutes per HTTP request', valB: 'Unlimited long-running Pod execution' },
        { feature: 'Protocols Supported', valA: 'HTTP/1.1, HTTP/2, gRPC, WebSockets', valB: 'Any TCP, UDP, SCTP, custom protocols' },
        { feature: 'Operational Complexity', valA: 'Very Low (Developer friendly)', valB: 'Moderate to High (Requires Kubernetes knowledge)' }
      ]
    },
    commonMistake: 'Defaulting to GKE for simple web microservices because "Kubernetes is industry standard". This adds immense operational complexity, node upgrades, and baseline cluster costs that Cloud Run completely eliminates.'
  },
  {
    id: 'int-02-cloudsql-vs-spanner',
    category: 'Databases',
    level: 'Architect',
    question: 'How do you decide between Cloud SQL and Cloud Spanner for an enterprise relational database architecture?',
    shortAnswer: 'Choose Cloud SQL for standard regional workloads with up to a few terabytes of data and standard PostgreSQL/MySQL requirements. Choose Cloud Spanner when your system requires horizontal write scaling, multi-region high availability (99.999% SLA), and globally distributed ACID consistency with zero downtime maintenance.',
    deepDive: 'Cloud SQL is a traditional single-primary relational database engine. To scale reads, you add read replicas, but write throughput is fundamentally bottlenecked by the CPU/IOPS of the single primary VM. If that primary VM fails, multi-zone failover takes 30-60 seconds.\n\nCloud Spanner is a revolutionary globally distributed database that shards data automatically across nodes using Paxos consensus and TrueTime (hardware atomic clocks and GPS receivers in Google data centers). Spanner scales writes horizontally by simply adding more processing units or nodes, delivering 99.999% availability (less than 5 minutes of downtime per year) across multi-region configurations with zero failover downtime.',
    comparisonTable: {
      title: 'Cloud SQL vs Cloud Spanner',
      colA: 'Cloud SQL',
      colB: 'Cloud Spanner',
      rows: [
        { feature: 'Architecture', valA: 'Single primary instance with read replicas', valB: 'Globally distributed, horizontally sharded cluster' },
        { feature: 'Write Scalability', valA: 'Vertical scaling only (upgrade instance tier)', valB: 'Horizontal scaling (add Spanner compute nodes)' },
        { feature: 'SLA Availability', valA: '99.95% (Multi-zone HA)', valB: '99.999% (Multi-region enterprise)' },
        { feature: 'Consistency', valA: 'ACID on single primary; eventual on replicas', valB: 'External Consistency (Strict serializable ACID worldwide)' },
        { feature: 'Starting Cost', valA: '~$10 - $50 / month (e2-micro to standard)', valB: '~$65 / month (100 Processing Units minimum)' }
      ]
    },
    commonMistake: 'Selecting Cloud Spanner for a simple startup project with low traffic, incurring high baseline costs ($65+/month) when a $15 Cloud SQL instance would handle the workload effortlessly.'
  },
  {
    id: 'int-03-wif-vs-sa-keys',
    category: 'Security & DevOps',
    level: 'Advanced',
    question: 'Why does Google Cloud security guidance strictly prohibit long-lived Service Account JSON keys in external CI/CD pipelines?',
    shortAnswer: 'Service account JSON keys are static credentials that never expire automatically. If committed to Git, cached in build logs, or exfiltrated, attackers gain permanent unmonitored access. Workload Identity Federation replaces static keys with short-lived tokens derived from verifiable OpenID Connect (OIDC) identity exchanges.',
    deepDive: 'A downloaded service account key is a 2048-bit RSA private key with a default validity period of up to 10 years. In contrast, Workload Identity Federation uses the Google Cloud Security Token Service (STS). When a GitHub Actions workflow executes, GitHub generates an ephemeral JWT signed by GitHub OIDC authority. STS validates the token claims (e.g. verifying `repository == "my-company/production-app"` and `ref == "refs/heads/main"`), and issues a temporary Google access token valid for only 60 minutes.',
    comparisonTable: {
      title: 'Service Account JSON Keys vs Workload Identity Federation',
      colA: 'Service Account JSON Keys (Legacy / Banned)',
      colB: 'Workload Identity Federation (Modern Standard)',
      rows: [
        { feature: 'Credential Lifespan', valA: 'Permanent (up to 10 years until manual revocation)', valB: 'Ephemeral (60 minutes maximum validity)' },
        { feature: 'Storage Requirement', valA: 'Must be stored as static secret in GitHub/GitLab', valB: 'Zero secrets stored anywhere in CI/CD platform' },
        { feature: 'Leak Blast Radius', valA: 'Catastrophic permanent project takeover', valB: 'Zero (cannot be used outside active OIDC workflow context)' },
        { feature: 'Auditability', valA: 'Key operations appear generic in audit logs', valB: 'Exact GitHub repository, actor, and workflow run logged in Cloud Audit' }
      ]
    },
    commonMistake: 'Generating a service account key and pasting it into GitHub Secrets because "it takes 2 minutes less than configuring OIDC". This is the #1 vector for AWS and GCP crypto-mining breaches.'
  },
  {
    id: 'int-04-vpc-peering-vs-psc',
    category: 'Networking',
    level: 'Architect',
    question: 'What is the architectural difference between VPC Network Peering and Private Service Connect (PSC)?',
    shortAnswer: 'VPC Peering joins two entire VPC networks at Layer 3, requiring non-overlapping RFC 1918 CIDR IP ranges. Private Service Connect (PSC) exposes ONLY a specific service endpoint (single internal IP address via Layer 4 proxy), functioning seamlessly even when both VPCs share identical overlapping IP CIDRs.',
    deepDive: 'VPC Peering is bidirectional and non-transitive: if VPC A peers with VPC B, and VPC B peers with VPC C, VPC A cannot communicate with VPC C. Furthermore, if VPC A uses 10.0.0.0/16 and VPC B also uses 10.0.0.0/16, peering will fail.\n\nPrivate Service Connect (PSC) uses Software Defined Networking (Andromeda NAT) to publish a producer service behind an internal load balancer. The consumer VPC assigns a single forwarding rule with an internal IP inside its own subnet. Consumer packets are translated across networks without routing table modifications or CIDR conflicts.',
    commonMistake: 'Attempting to peer two enterprise networks that have overlapping 10.0.0.0/16 ranges, causing project-halting re-IP redesigns instead of simply adopting Private Service Connect.'
  }
];

