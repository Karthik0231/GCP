import { RoadmapStage, TopicNode } from '../types';

export const TOPIC_NODES: TopicNode[] = [
  // ==========================================
  // STAGE 0: CLOUD FOUNDATIONS
  // ==========================================
  {
    id: 'cloud-foundations',
    stage: 0,
    stageName: 'Stage 00 — Cloud Computing Foundations',
    branch: 'core',
    title: 'Cloud Computing Foundations',
    subtitle: 'From Bare Metal & Data Centers to Elastic Virtualized Cloud',
    level: 'Beginner',
    estimatedTime: '25 min',
    prerequisites: [],
    freeTierEligible: true,
    simpleExplanation: 'Cloud computing is renting computing power, storage, and networking over the internet from hyperscalers like Google instead of purchasing, racking, and cooling physical servers in your own facility.',
    analogy: 'Think of traditional on-prem servers like owning and maintaining a personal power generator with fuel and repairs, whereas cloud computing is plugging into the city electrical grid and paying only for the kilowatt-hours you consume.',
    whyItExists: 'Traditional hardware acquisition takes weeks, requires large upfront Capital Expenditure (CapEx), and forces companies to over-provision for peak traffic that sits idle 90% of the time. Cloud converts this into flexible Operating Expense (OpEx) with near-instant provisioning.',
    howItWorks: 'Google maintains dozens of secure hyperscale data centers worldwide connected by a private global fiber backbone. Software virtualization (KVM, hypervisors) abstracts compute, storage pools (Colossus), and software-defined networking (Andromeda) into API-addressable resources.',
    internalDetails: 'Under the hood, Google Cloud runs on custom hardware, Titan security chips, Jupiter network switches, and Borg cluster management (the predecessor of Kubernetes). All communication across regions travels on Google private fiber rather than the public internet transit.',
    consoleSteps: [
      { step: 1, title: 'Explore GCP Global Infrastructure', instruction: 'Navigate to cloud.google.com/about/locations to inspect Google global network topology, regions, zones, and subsea cables.' },
      { step: 2, title: 'Understand Shared Responsibility', instruction: 'Review the security division: Google secures the physical facilities, hardware, and hypervisor; you secure guest OS, IAM, data encryption, and application code.' }
    ],
    cliCommands: [
      {
        command: 'gcloud compute regions list',
        explanation: 'Lists all available Google Cloud geographical regions worldwide along with their operational status and available quotas.',
        flags: [{ flag: '--format="table(name, status, quotas[0].limit)"', purpose: 'Format output as a clean table with key metrics' }],
        output: 'NAME                  STATUS\nus-central1           UP\neurope-west1          UP\nasia-east1            UP'
      }
    ],
    terraformSnippet: `# Example Terraform showing regional provider configuration
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = "my-company-prod"
  region  = "us-central1"
  zone    = "us-central1-a"
}`,
    commonMistakes: [
      { mistake: 'Assuming cloud is automatically cheaper without architecture optimization.', fix: 'Idle VMs, unattached persistent disks, and uncompressed egress accumulate costs rapidly; implement FinOps, autoscale to zero, and set budget alerts.' },
      { mistake: 'Treating the cloud as an on-prem data center clone (lift-and-shift anti-pattern).', fix: 'Modernize toward managed services like Cloud Run and Cloud SQL rather than running unmanaged monoliths on raw VMs.' }
    ],
    securityImplications: 'The Shared Responsibility Model governs all cloud security. In IaaS (Compute Engine), you are fully responsible for OS patches, firewall rules, and runtime security. In PaaS/Serverless (Cloud Run), Google manages OS hardening and container runtimes.',
    quickRevision: [
      'CapEx (upfront capital) transitions to OpEx (pay-as-you-go elastic operational expense).',
      'IaaS gives maximum OS control; PaaS / Serverless eliminates infrastructure maintenance.',
      'Google private global backbone interconnects all regions with low latency.',
      'A Region contains 3 or more physically separated, low-latency fault domains called Zones.',
      'Shared Responsibility Model dictates customer owns data, IAM, and application security.'
    ],
    quiz: [
      {
        question: 'In the Cloud Shared Responsibility Model for Google Cloud Run (Serverless), who is responsible for operating system security patches?',
        options: [
          'The customer application developer',
          'Google Cloud Platform',
          'Third-party container image provider',
          'Both customer and Google share OS kernel patching'
        ],
        answerIndex: 1,
        explanation: 'In Serverless PaaS architectures like Cloud Run, Google manages the host infrastructure, hypervisor, host OS, and security patches entirely.'
      }
    ],
    labTask: {
      title: 'Inspect Google Cloud Global Regions',
      objective: 'Query active Google Cloud regions and verify regional vs zonal scope.',
      tasks: [
        'Open Cloud Shell or local gcloud CLI.',
        'Run `gcloud compute regions list` to identify your geographically closest low-latency region.',
        'Run `gcloud compute zones list --filter="region:(us-central1)"` to view zonal fault domains.'
      ],
      cleanupCommand: '# Read-only inspection; no billable resources created.'
    },
    relatedTopics: ['gcp-fundamentals', 'resource-hierarchy', 'billing-cost'],
    docUrl: 'https://cloud.google.com/docs/overview',
    lastVerified: '2026-11'
  },

  // ==========================================
  // STAGE 1: GCP FUNDAMENTALS & RESOURCE HIERARCHY
  // ==========================================
  {
    id: 'gcp-fundamentals',
    stage: 1,
    stageName: 'Stage 01 — Google Cloud Fundamentals',
    branch: 'core',
    title: 'Resource Hierarchy & Projects',
    subtitle: 'Organizations, Folders, Projects, and Resource Container Architecture',
    level: 'Beginner',
    estimatedTime: '30 min',
    prerequisites: ['cloud-foundations'],
    freeTierEligible: true,
    simpleExplanation: 'Every resource you create in Google Cloud (VM, bucket, database) belongs to exactly one Project. Projects are organized hierarchically under Folders and a top-level Organization, forming a tree where IAM permissions and policies inherit downwards.',
    analogy: 'Imagine a corporate skyscraper. The Organization is the entire corporate building, Folders are company divisions (e.g., Engineering, Finance), and Projects are secure rooms where specific project equipment is placed.',
    whyItExists: 'Without a strict hierarchy, enterprise security policies, billing separation, and access control would have to be configured independently on millions of individual cloud resources.',
    howItWorks: 'Policy inheritance flows strictly downwards from Organization -> Folders -> Projects -> Resources. If you grant `roles/viewer` at the Organization node, that identity can view resources in all subordinate folders and projects.',
    internalDetails: 'A Google Cloud Project has three identifiers: Project Name (user-friendly, mutable), Project ID (globally unique string, permanent, used in CLI and APIs), and Project Number (assigned by Google, immutable numeric ID used in internal IAM bindings).',
    consoleSteps: [
      { step: 1, title: 'Open Google Cloud Console', instruction: 'Navigate to console.cloud.google.com and log in with your Google account.' },
      { step: 2, title: 'Select Project Dropdown', instruction: 'Click the Project picker in the top blue header bar.' },
      { step: 3, title: 'Create New Project', instruction: 'Click "New Project", enter a globally unique project name, and verify the generated Project ID.' }
    ],
    cliCommands: [
      {
        command: 'gcloud projects list',
        explanation: 'Lists all Google Cloud projects your currently authenticated identity has permissions to view.',
        flags: [{ flag: '--format="table(projectId, name, projectNumber)"', purpose: 'Display clean tabular summary' }],
        output: 'PROJECT_ID            NAME              PROJECT_NUMBER\nforge-production-01   Forge Production  482910482910\nforge-staging-01      Forge Staging     948291048291'
      },
      {
        command: 'gcloud config set project <PROJECT_ID>',
        explanation: 'Sets the default active project in your local gcloud CLI configuration context.',
        flags: [],
        output: 'Updated property [core/project].'
      }
    ],
    terraformSnippet: `resource "google_project" "app_project" {
  name       = "Forge Production App"
  project_id = "forge-prod-app-2026"
  billing_account = var.billing_account_id
  org_id     = var.org_id
}`,
    commonMistakes: [
      { mistake: 'Confusing Project Name with Project ID.', fix: 'Project ID is globally unique across all Google Cloud users worldwide and cannot be changed once created. Always use Project ID in CLI, scripts, and Terraform.' },
      { mistake: 'Granting developer permissions at the Organization root level.', fix: 'Violates the principle of least privilege. Grant permissions at the specific Project or Folder level instead.' }
    ],
    securityImplications: 'Permissions granted at parent nodes cannot be restricted or revoked at lower nodes. If you grant a user `roles/editor` at a Folder, you cannot revoke it for a specific Project inside that folder.',
    quickRevision: [
      'Resource Hierarchy: Organization -> Folders -> Projects -> Resources.',
      'Every GCP resource lives inside exactly one Project.',
      'Project ID is globally unique, permanent, and used in all APIs and CLI commands.',
      'Policies and IAM roles inherit strictly downwards and cannot be blocked at child levels.',
      'Service APIs must be explicitly enabled per project before resources can be created.'
    ],
    quiz: [
      {
        question: 'Which Google Cloud Project identifier cannot be changed after creation and must be globally unique across all of Google Cloud?',
        options: [
          'Project Name',
          'Project ID',
          'Project Alias',
          'Billing Account Display Name'
        ],
        answerIndex: 1,
        explanation: 'Project ID is globally unique and immutable across the entirety of Google Cloud Platform.'
      }
    ],
    labTask: {
      title: 'Configure Your Project Context via gcloud',
      objective: 'Verify your authenticated account and set your working project ID.',
      tasks: [
        'Run `gcloud auth list` to inspect your active Google credentials.',
        'Run `gcloud projects list` to find your target project ID.',
        'Run `gcloud config set project <YOUR_PROJECT_ID>` to set your active context.',
        'Run `gcloud config get-value project` to verify the active configuration.'
      ],
      cleanupCommand: '# Configuration change only; no billable resources created.'
    },
    relatedTopics: ['cloud-foundations', 'billing-cost', 'iam-foundations'],
    docUrl: 'https://cloud.google.com/resource-manager/docs/creating-managing-projects',
    lastVerified: '2026-11'
  },

  // ==========================================
  // STAGE 2: BILLING & COST MANAGEMENT
  // ==========================================
  {
    id: 'billing-cost',
    stage: 1,
    stageName: 'Stage 01 — Google Cloud Fundamentals',
    branch: 'finops',
    title: 'Billing, Budgets & Cost Engineering',
    subtitle: 'Free Tier, Cloud Billing Accounts, Budget Alerts & Preventing Bill Shock',
    level: 'Beginner',
    estimatedTime: '25 min',
    prerequisites: ['gcp-fundamentals'],
    freeTierEligible: true,
    costWarning: 'Budget alerts do NOT automatically shut down running cloud resources. Without programmatic Cloud Functions/PubSub actions, a budget threshold alert only sends warning emails while charges continue accumulating.',
    simpleExplanation: 'A Cloud Billing Account is attached to your projects to pay for resource consumption. Google Cloud offers a Free Tier ($300 credit for 90 days plus perpetual Always Free services), but configuring automated budget alerts is mandatory to prevent unexpected charges.',
    analogy: 'A billing account is like a credit card linked to your household utility meter. Budget alerts are text notifications sent when electricity usage crosses $50, but the power keeps flowing unless you install a circuit breaker.',
    whyItExists: 'Cloud resources can scale automatically to hundreds of instances. Without billing guardrails, rogue infinite loops, distributed DDoS attacks, or forgotten benchmark clusters can generate catastrophic bills.',
    howItWorks: 'Every billable API call reports SKU usage to Google Billing. Billing data is exported continuously to BigQuery for SQL analysis. Budgets trigger notification webhooks through Cloud Pub/Sub at 50%, 90%, and 100% of target spend.',
    internalDetails: 'Google Always Free Tier includes 1 e2-micro VM in select US regions (with 30 GB standard persistent disk), 5 GB Cloud Storage (Standard class), 2 million Cloud Run function invocations/month, and 1 TB BigQuery queries/month.',
    consoleSteps: [
      { step: 1, title: 'Open Billing Console', instruction: 'In Google Cloud Console, navigate to Navigation Menu > Billing.' },
      { step: 2, title: 'Create a Budget', instruction: 'Under "Budgets & alerts", click "Create Budget". Enter a budget name (e.g., "Monthly Dev Cap $20").' },
      { step: 3, title: 'Set Threshold Percentages', instruction: 'Set alert thresholds at 50%, 80%, and 100% of your budget amount. Ensure your email is selected as an alert recipient.' },
      { step: 4, title: 'Verify Email Alert Delivery', instruction: 'Check the box to send email alerts to billing administrators and Cloud IAM users.' }
    ],
    cliCommands: [
      {
        command: 'gcloud beta billing accounts list',
        explanation: 'Lists billing accounts accessible to the current user along with their active open/closed status.',
        flags: [],
        output: 'ACCOUNT_ID            NAME                OPEN  MASTER_ACCOUNT_ID\n01A2B3-4C5D6E-7F8A9B  Company Main Card   True'
      },
      {
        command: 'gcloud billing projects describe <PROJECT_ID>',
        explanation: 'Checks which Cloud Billing account is currently linked to the specified project.',
        flags: [],
        output: 'billingAccountName: billingAccounts/01A2B3-4C5D6E-7F8A9B\nbillingEnabled: true\nname: projects/forge-production-01/billingInfo'
      }
    ],
    terraformSnippet: `resource "google_billing_budget" "dev_budget" {
  billing_account = var.billing_account_id
  display_name    = "Dev Environment Monthly Budget"

  budget_filter {
    projects = ["projects/\${var.project_number}"]
  }

  amount {
    specified_amount {
      currency_code = "USD"
      units         = "25"
    }
  }

  threshold_rules {
    threshold_percent = 0.5
  }
  threshold_rules {
    threshold_percent = 0.9
  }
  threshold_rules {
    threshold_percent = 1.0
  }
}`,
    commonMistakes: [
      { mistake: 'Believing that setting a $10 budget automatically halts spending when $10 is reached.', fix: 'Budgets are purely advisory notifications. To halt workloads, connect the budget Pub/Sub topic to a Cloud Run Function that revokes project billing or disables VMs.' },
      { mistake: 'Deleting a project VM while leaving its unattached Persistent Disk or static external IP active.', fix: 'Static IP addresses and unattached disks incur ongoing hourly charges when idle. Always clean up disks and release reserved IPs.' }
    ],
    securityImplications: 'Only trusted FinOps/admin personnel should hold the `roles/billing.admin` role. Compromised developer credentials with billing permissions could spin up unauthorized GPU crypto-mining clusters.',
    quickRevision: [
      'Cloud Billing Account links payment methods to one or more Google Cloud Projects.',
      'Google Always Free Tier includes 1 e2-micro VM in US regions and 2M Cloud Run invocations.',
      'Budget alerts send emails; they DO NOT shut down resources automatically.',
      'Cloud Billing export to BigQuery enables granular SQL reporting of all infrastructure costs.',
      'Unattached disks and idle reserved external IPs incur ongoing charges if not deleted.'
    ],
    quiz: [
      {
        question: 'What occurs by default when a Google Cloud project exceeds 100% of its configured budget alert?',
        options: [
          'All Compute Engine VMs are immediately shut down',
          'Google Cloud automatically pauses project billing and blocks API calls',
          'An email notification is dispatched to billing administrators while resources continue running',
          'Traffic is rerouted to a static maintenance page'
        ],
        answerIndex: 2,
        explanation: 'Default budget alerts only send notification emails and Pub/Sub messages; they never terminate running resources without custom automated scripting.'
      }
    ],
    labTask: {
      title: 'Inspect Project Billing Status & Setup Budget Guardrails',
      objective: 'Verify your project billing link and understand the billing console interface.',
      tasks: [
        'Run `gcloud billing projects describe $(gcloud config get-value project)` to confirm billing is active.',
        'Open Cloud Console > Billing > Cost Table to inspect current month SKU breakdown.',
        'Set up a $10 test budget with 50%, 80%, and 100% threshold email notifications.'
      ],
      cleanupCommand: '# Billing budgets do not incur costs. Keep your budget active as a safety measure.'
    },
    relatedTopics: ['gcp-fundamentals', 'iam-foundations', 'finops-optimization'],
    docUrl: 'https://cloud.google.com/billing/docs/how-to/budgets',
    lastVerified: '2026-11'
  },

  // ==========================================
  // STAGE 3: IAM & SECURITY FOUNDATIONS
  // ==========================================
  {
    id: 'iam-foundations',
    stage: 2,
    stageName: 'Stage 02 — IAM & Security Foundations',
    branch: 'security',
    title: 'Cloud IAM & Least Privilege Architecture',
    subtitle: 'Principals, Predefined Roles, Service Accounts, and Policy Inheritance',
    level: 'Beginner',
    estimatedTime: '35 min',
    prerequisites: ['gcp-fundamentals'],
    freeTierEligible: true,
    simpleExplanation: 'Google Cloud Identity & Access Management (IAM) controls WHO (Identity/Principal) has WHAT ACCESS (Role/Permissions) to WHICH RESOURCE. Instead of granting permissions directly, permissions are bundled into Roles.',
    analogy: 'Imagine a secure research lab. The Principal is an employee, the Role is their security badge classification ("Database Technician"), and Permissions are the specific doors and instruments that classification is authorized to unlock.',
    whyItExists: 'Hardcoding database passwords or granting developers unrestricted root access (`roles/owner`) guarantees security breaches. IAM provides centralized, auditable, granular access governance.',
    howItWorks: 'An IAM Policy is a JSON document attached to a resource defining bindings between principals (Google Accounts, Google Groups, Service Accounts) and roles. Policies evaluate hierarchically: if allowed at an upper level, access is granted.',
    internalDetails: 'Google Cloud distinguishes between: Basic Roles (Owner, Editor, Viewer — legacy, overly broad, banned in production), Predefined Roles (granular Google-managed, e.g. `roles/storage.objectViewer`), and Custom Roles (user-authored collections of specific permissions).',
    consoleSteps: [
      { step: 1, title: 'Open IAM & Admin', instruction: 'In Google Cloud Console, navigate to Navigation Menu > IAM & Admin > IAM.' },
      { step: 2, title: 'Inspect Existing Members', instruction: 'View the table of principals and their assigned roles at the project level.' },
      { step: 3, title: 'Grant Least-Privilege Access', instruction: 'Click "Grant Access", enter the principal email, and select a specific Predefined Role (e.g. `Cloud Run Viewer`). Never select Basic Owner or Editor.' }
    ],
    cliCommands: [
      {
        command: 'gcloud projects get-iam-policy <PROJECT_ID> --format=json',
        explanation: 'Retrieves the complete active IAM policy document for the specified Google Cloud project.',
        flags: [],
        output: '{\n  "bindings": [\n    {\n      "members": ["user:lead-dev@company.com"],\n      "role": "roles/viewer"\n    }\n  ]\n}'
      },
      {
        command: 'gcloud projects add-iam-policy-binding <PROJECT_ID> --member="serviceAccount:api-runner@<PROJECT_ID>.iam.gserviceaccount.com" --role="roles/datastore.user"',
        explanation: 'Grants a specific service account granular read/write access to Firestore/Datastore without granting broad project editor rights.',
        flags: [
          { flag: '--member', purpose: 'The principal identity receiving the role' },
          { flag: '--role', purpose: 'The exact predefined IAM role identifier' }
        ],
        output: 'Updated IAM policy for project [forge-production-01].'
      }
    ],
    terraformSnippet: `resource "google_project_iam_member" "api_datastore_user" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:\${google_service_account.api_sa.email}"
}`,
    commonMistakes: [
      { mistake: 'Granting `roles/editor` or `roles/owner` to developers or CI/CD pipelines.', fix: 'Always use fine-grained Predefined Roles (e.g. `roles/run.developer`, `roles/storage.admin`) or Custom Roles adhering to Principle of Least Privilege.' },
      { mistake: 'Downloading JSON service account keys and committing them into Git repositories.', fix: 'Never store long-lived service account keys. Use Workload Identity Federation for CI/CD and IAM Service Account Impersonation for local development.' }
    ],
    securityImplications: 'Service Account Keys are one of the #1 attack vectors in cloud security breaches. In modern Google Cloud architecture, keys should be disabled via Organization Policy (`constraints/iam.disableServiceAccountKeyCreation`).',
    quickRevision: [
      'IAM formula: Principal (WHO) + Role (WHAT CAN BE DONE) + Resource (WHERE).',
      'Basic Roles (Owner, Editor, Viewer) are legacy and should never be used in production.',
      'Predefined Roles offer least-privilege access curated and maintained by Google.',
      'Service Accounts are machine identities for workloads, APIs, and VMs.',
      'Never generate long-lived JSON keys; adopt Workload Identity and Service Account Impersonation.'
    ],
    quiz: [
      {
        question: 'Which IAM role approach is recommended by Google Cloud security best practices for production enterprise systems?',
        options: [
          'Grant all team members roles/editor so no deployment is blocked',
          'Use specific Predefined Roles and Custom Roles following Least Privilege',
          'Assign roles/owner at the Organization level',
          'Download root JSON service account keys to local developer workstations'
        ],
        answerIndex: 1,
        explanation: 'Least Privilege mandates assigning only the exact Predefined or Custom roles required for an identity to complete its responsibilities.'
      }
    ],
    labTask: {
      title: 'Create a Service Account and Bind Granular Predefined Role',
      objective: 'Create a dedicated machine service account and verify its IAM bindings.',
      tasks: [
        'Run `gcloud iam service-accounts create backend-worker --display-name="Backend Worker SA"`',
        'Run `gcloud projects add-iam-policy-binding $(gcloud config get-value project) --member="serviceAccount:backend-worker@$(gcloud config get-value project).iam.gserviceaccount.com" --role="roles/logging.logWriter"`',
        'Verify the binding in the IAM policy output.'
      ],
      cleanupCommand: 'gcloud iam service-accounts delete backend-worker@$(gcloud config get-value project).iam.gserviceaccount.com --quiet'
    },
    relatedTopics: ['gcp-fundamentals', 'workload-identity', 'cloud-security-engineering'],
    docUrl: 'https://cloud.google.com/iam/docs/overview',
    lastVerified: '2026-11'
  },

  // ==========================================
  // STAGE 4: NETWORKING & GOOGLE CLOUD VPC
  // ==========================================
  {
    id: 'vpc-networking',
    stage: 3,
    stageName: 'Stage 03 — Google Cloud Networking',
    branch: 'networking',
    title: 'Virtual Private Cloud (VPC) & Subnets',
    subtitle: 'Global VPC Architecture, Regional Subnets, Firewall Rules, and Andromeda SDN',
    level: 'Intermediate',
    estimatedTime: '40 min',
    prerequisites: ['iam-foundations'],
    freeTierEligible: true,
    simpleExplanation: 'A VPC is your private, isolated virtual network inside Google Cloud. Unlike AWS where VPCs are regional, Google Cloud VPCs are GLOBAL: a single VPC can span all Google Cloud regions worldwide without VPN tunnels or complex peering.',
    analogy: 'Imagine your company owns a private, secure global highway network. Each city (Google Region) has its own local regional off-ramp (Subnet), but all traffic between your company branches drives on your private highway without passing through public toll booths.',
    whyItExists: 'Isolated network boundaries are mandatory to prevent unauthorized internet traffic from reaching private application databases, internal microservices, and management interfaces.',
    howItWorks: 'Google Software Defined Network (Andromeda) encapsulates all packet routing in software. Subnets are Regional constructs with private RFC 1918 CIDR IP ranges (e.g., `10.10.0.0/24`). Instances across different regions in the same VPC communicate privately via internal IP addresses with high bandwidth.',
    internalDetails: 'Google Cloud VPC operates in two modes: Auto mode (creates one subnet in every Google region automatically with `/20` CIDR, convenient for experiments but hazardous for enterprise due to overlapping CIDRs) and Custom mode (best practice, where network engineers explicitly define subnets and IP ranges).',
    consoleSteps: [
      { step: 1, title: 'Open VPC Networks', instruction: 'Navigate to Navigation Menu > VPC network > VPC networks.' },
      { step: 2, title: 'Create VPC Network', instruction: 'Click "Create VPC Network". Enter name `prod-vpc-custom` and select "Custom" subnet creation mode.' },
      { step: 3, title: 'Add Regional Subnet', instruction: 'Click "Add subnet", name it `subnet-us-central1`, select region `us-central1`, and assign IPv4 CIDR range `10.100.0.0/24`.' },
      { step: 4, title: 'Configure Firewall Rules', instruction: 'Create an ingress firewall rule allowing internal VPC communication (`10.100.0.0/16`) and specific SSH via IAP (`35.235.240.0/20`).' }
    ],
    cliCommands: [
      {
        command: 'gcloud compute networks create prod-vpc --subnet-mode=custom',
        explanation: 'Creates an enterprise-grade Custom-mode Virtual Private Cloud network.',
        flags: [{ flag: '--subnet-mode=custom', purpose: 'Disables automatic subnet creation to prevent IP conflicts' }],
        output: 'Created [https://www.googleapis.com/compute/v1/projects/.../networks/prod-vpc].'
      },
      {
        command: 'gcloud compute networks subnets create prod-subnet-us --network=prod-vpc --region=us-central1 --range=10.10.0.0/24 --enable-private-ip-google-access',
        explanation: 'Creates a regional subnet with Private Google Access enabled, allowing private VMs without external IPs to reach Google APIs (Cloud Storage, BigQuery).',
        flags: [
          { flag: '--range', purpose: 'Defines the private IPv4 CIDR address block' },
          { flag: '--enable-private-ip-google-access', purpose: 'Enables private connectivity to Google APIs' }
        ],
        output: 'Created [https://www.googleapis.com/compute/v1/projects/.../subnets/prod-subnet-us].'
      },
      {
        command: 'gcloud compute firewall-rules create allow-iap-ssh --network=prod-vpc --allow=tcp:22 --source-ranges=35.235.240.0/20 --target-tags=allow-iap',
        explanation: 'Creates a secure firewall rule allowing SSH only through Identity-Aware Proxy (IAP) without exposing VMs to public internet.',
        flags: [
          { flag: '--source-ranges=35.235.240.0/20', purpose: 'Google Cloud IAP proxy IP range' },
          { flag: '--target-tags=allow-iap', purpose: 'Applies rule only to instances carrying this network tag' }
        ],
        output: 'Created [https://www.googleapis.com/compute/v1/projects/.../firewall-rules/allow-iap-ssh].'
      }
    ],
    terraformSnippet: `resource "google_compute_network" "custom_vpc" {
  name                    = "enterprise-prod-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "app_subnet" {
  name                     = "app-subnet-us-east1"
  ip_cidr_range            = "10.10.1.0/24"
  region                   = "us-east1"
  network                  = google_compute_network.custom_vpc.id
  private_ip_google_access = true
}`,
    commonMistakes: [
      { mistake: 'Using Auto-mode VPCs in production.', fix: 'Auto-mode uses pre-assigned `/20` CIDR blocks in every region, which makes VPC Peering or hybrid VPN connections fail due to CIDR overlap. Always use Custom mode.' },
      { mistake: 'Opening port 22 (SSH) or 3389 (RDP) to `0.0.0.0/0`.', fix: 'Never expose management ports to the public internet. Use Identity-Aware Proxy (IAP) tunnel (`35.235.240.0/20`) for secure zero-trust SSH access.' }
    ],
    securityImplications: 'Firewall rules are stateful and default to: deny all incoming (ingress) traffic, allow all outgoing (egress) traffic. Private Google Access ensures your VM payloads never traverse public internet when calling Cloud Storage or Vertex AI.',
    quickRevision: [
      'Google Cloud VPCs are GLOBAL; subnets are REGIONAL.',
      'Auto-mode creates subnets in all regions; Custom mode is mandatory for production.',
      'Private Google Access lets VMs without public IPs reach Google APIs securely.',
      'Cloud NAT allows private VMs to download outbound packages without accepting incoming internet traffic.',
      'Identity-Aware Proxy (IAP) eliminates the need for public IP addresses or bastion hosts.'
    ],
    quiz: [
      {
        question: 'What is a fundamental difference between a Google Cloud VPC and an AWS VPC?',
        options: [
          'Google Cloud VPCs are global resources spanning all regions, whereas AWS VPCs are regional',
          'Google Cloud VPCs do not support private subnets',
          'Google Cloud VPCs require an internet gateway for inter-subnet communication',
          'Google Cloud VPCs only support IPv6'
        ],
        answerIndex: 0,
        explanation: 'Google Cloud VPC is a global software-defined construct. A single VPC can contain regional subnets across US, Europe, and Asia that communicate privately without gateways.'
      }
    ],
    labTask: {
      title: 'Provision Custom VPC & Inspect Route Table',
      objective: 'Create a custom VPC and inspect Google Cloud Andromeda default routes.',
      tasks: [
        'Run `gcloud compute networks create lab-custom-vpc --subnet-mode=custom`',
        'Create a subnet: `gcloud compute networks subnets create lab-sub --network=lab-custom-vpc --region=us-central1 --range=10.0.1.0/24`',
        'Run `gcloud compute routes list --filter="network:lab-custom-vpc"` to observe default internet gateway route.'
      ],
      cleanupCommand: 'gcloud compute networks subnets delete lab-sub --region=us-central1 --quiet; gcloud compute networks delete lab-custom-vpc --quiet'
    },
    relatedTopics: ['cloud-foundations', 'compute-engine', 'cloud-run'],
    docUrl: 'https://cloud.google.com/vpc/docs/vpc',
    lastVerified: '2026-11'
  },

  // ==========================================
  // STAGE 5: COMPUTE ENGINE & VIRTUAL MACHINES
  // ==========================================
  {
    id: 'compute-engine',
    stage: 4,
    stageName: 'Stage 04 — Compute Engine & Virtual Machines',
    branch: 'compute',
    title: 'Compute Engine & Managed Instance Groups',
    subtitle: 'Machine Families, Persistent Disks, Autoscaling MIGs, and Spot VMs',
    level: 'Intermediate',
    estimatedTime: '35 min',
    prerequisites: ['vpc-networking'],
    freeTierEligible: true,
    costWarning: 'Compute Engine instances accrue hourly costs while in RUNNING state. Disks continue accruing costs even when the VM is STOPPED unless the disk is deleted.',
    simpleExplanation: 'Compute Engine provides scalable Virtual Machines (VMs) running on Google global infrastructure. You pick the operating system (Debian, Ubuntu, Rocky, Windows), vCPU, memory, and persistent storage.',
    analogy: 'Compute Engine is like leasing an apartment. You choose the square footage (vCPUs and RAM) and bring your own furniture and software, but you are responsible for interior cleaning and lock maintenance.',
    whyItExists: 'Legacy applications, monolithic enterprise systems, custom kernel modules, and specialized database engines cannot always run in containers or serverless environments and require full operating system access.',
    howItWorks: 'Google KVM hypervisor runs on physical host machines. Disks (Persistent Disk, Hyperdisk) are network-attached block devices replicated across hardware for durability. Managed Instance Groups (MIGs) automatically add/remove VMs based on CPU or metric targets.',
    internalDetails: 'Compute Engine machine families include: General-Purpose (E2 cost-optimized, N2 balanced, C3 high-performance Intel Sapphire Rapids), Compute-Optimized (C2/C2D), Memory-Optimized (M2/M3), and Accelerator-Optimized (A3/G2 for NVIDIA H100/L4 GPUs).',
    consoleSteps: [
      { step: 1, title: 'Navigate to VM Instances', instruction: 'In Google Cloud Console, open Navigation Menu > Compute Engine > VM instances.' },
      { step: 2, title: 'Create Instance', instruction: 'Click "Create Instance". Name it `web-server-01`, select region `us-central1`, and machine series `e2-micro` (Free Tier eligible).' },
      { step: 3, title: 'Configure Boot Disk & Network', instruction: 'Choose Debian 12 Minimal. Under Networking, attach to your custom VPC subnet and disable external IP to keep it private.' },
      { step: 4, title: 'Connect via IAP SSH', instruction: 'Click the "SSH" button on the instance row. Google Cloud Console opens an in-browser terminal tunneled securely via Cloud IAP.' }
    ],
    cliCommands: [
      {
        command: 'gcloud compute instances create dev-vm-01 --zone=us-central1-a --machine-type=e2-micro --image-family=debian-12 --image-project=debian-cloud --network=default --tags=http-server',
        explanation: 'Deploys an e2-micro Debian VM instance with network tag `http-server` in zone `us-central1-a`.',
        flags: [
          { flag: '--machine-type=e2-micro', purpose: 'Cost-optimized machine with 2 shared vCPUs and 1GB RAM' },
          { flag: '--image-family=debian-12', purpose: 'Always pulls latest stable Debian 12 base image' }
        ],
        output: 'Created [https://www.googleapis.com/compute/v1/projects/.../instances/dev-vm-01].'
      },
      {
        command: 'gcloud compute ssh dev-vm-01 --zone=us-central1-a --tunnel-through-iap',
        explanation: 'Opens an SSH session to the VM tunneled through Identity-Aware Proxy without requiring a public IP.',
        flags: [{ flag: '--tunnel-through-iap', purpose: 'Tunnels port 22 traffic through Google Cloud IAP bastion' }],
        output: 'Linux dev-vm-01 6.1.0-18-cloud-amd64 ... \nuser@dev-vm-01:~$'
      }
    ],
    terraformSnippet: `resource "google_compute_instance" "vm_instance" {
  name         = "prod-web-server"
  machine_type = "e2-medium"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
      size  = 30
      type  = "pd-balanced"
    }
  }

  network_interface {
    network    = "default"
    # Omit access_config to ensure instance has no public IP
  }

  metadata_startup_script = "apt-get update && apt-get install -y nginx"
}`,
    commonMistakes: [
      { mistake: 'Leaving development VMs running 24/7.', fix: 'Use Cloud Scheduler + Cloud Run Functions to automatically stop dev VMs at 7 PM and start them at 8 AM, cutting 65% of VM costs.' },
      { mistake: 'Using static public IPs for every backend VM.', fix: 'Place VMs in private subnets behind Cloud NAT and Cloud Load Balancing to reduce IP costs and eliminate internet attack surfaces.' }
    ],
    securityImplications: 'Enable OS Login (`enable-os-login=TRUE`) to manage SSH access via Google IAM rather than manually managing and rotating SSH public/private keys in instance metadata.',
    quickRevision: [
      'Compute Engine provides IaaS virtual machines with full administrative OS access.',
      'Machine types: E2 (cost-effective), N2 (standard enterprise), C3 (high performance), G2 (GPU/AI).',
      'Persistent Disks are durable network-attached storage independent of VM life cycle.',
      'Managed Instance Groups (MIGs) provide auto-healing, multi-zone replication, and autoscaling.',
      'Spot VMs provide up to 60-91% discount for fault-tolerant batch or containerized workloads.'
    ],
    quiz: [
      {
        question: 'Which Compute Engine feature allows secure SSH connections to private VMs without assigning external public IP addresses or managing bastion hosts?',
        options: [
          'Cloud Armor Edge Proxy',
          'Identity-Aware Proxy (IAP) TCP forwarding',
          'VPC Flow Logs Direct Connect',
          'Cloud NAT Ingress forwarding'
        ],
        answerIndex: 1,
        explanation: 'IAP TCP forwarding allows authorized IAM users to establish SSH/RDP connections to private instances over Google encrypted proxy infrastructure.'
      }
    ],
    labTask: {
      title: 'Deploy e2-micro VM with Nginx Startup Script',
      objective: 'Deploy a VM with automated startup script configuration and test connectivity.',
      tasks: [
        'Run `gcloud compute instances create lab-vm --zone=us-central1-a --machine-type=e2-micro --metadata=startup-script="apt update && apt install -y nginx"`',
        'Verify instance creation and examine internal and external IP addresses.',
        'SSH into instance using `gcloud compute ssh lab-vm --zone=us-central1-a` and run `curl http://localhost`.'
      ],
      cleanupCommand: 'gcloud compute instances delete lab-vm --zone=us-central1-a --quiet'
    },
    relatedTopics: ['vpc-networking', 'cloud-storage', 'cloud-run'],
    docUrl: 'https://cloud.google.com/compute/docs/instances',
    lastVerified: '2026-11'
  },

  // ==========================================
  // STAGE 6: CLOUD STORAGE & OBJECT STORAGE
  // ==========================================
  {
    id: 'cloud-storage',
    stage: 5,
    stageName: 'Stage 05 — Cloud Storage & File Management',
    branch: 'storage-db',
    title: 'Cloud Storage (GCS) Architecture',
    subtitle: 'Buckets, Storage Classes, Object Lifecycle Management & Signed URLs',
    level: 'Beginner',
    estimatedTime: '30 min',
    prerequisites: ['iam-foundations'],
    freeTierEligible: true,
    simpleExplanation: 'Cloud Storage is Google global, infinitely scalable, highly durable (99.999999999% / 11 9s) object store for unstructured data such as images, videos, backups, static websites, and analytics datasets.',
    analogy: 'Unlike a hierarchical hard drive file system with folders, Cloud Storage is like a giant digital coat check: you hand it an item (file), get back a ticket (unique URI), and Google stores it safely in their automated warehouse.',
    whyItExists: 'Traditional block and file storage systems have hard capacity limits, require filesystem sizing, and fail when scaling to petabytes. Cloud Storage has no size limits and delivers global HTTP access.',
    howItWorks: 'Data is stored in Buckets (globally unique namespace). Objects consist of raw data bytes and key-value metadata. GCS encrypts all data at rest automatically with AES-256 before writing to disk.',
    internalDetails: 'GCS offers four storage classes: Standard (frequent access, website assets), Nearline (accessed < once/month, backups), Coldline (accessed < once/quarter, disaster recovery), and Archive (accessed < once/year, regulatory compliance).',
    consoleSteps: [
      { step: 1, title: 'Open Cloud Storage', instruction: 'Navigate to Navigation Menu > Cloud Storage > Buckets.' },
      { step: 2, title: 'Create Bucket', instruction: 'Click "Create". Enter a globally unique bucket name (e.g., `forge-assets-company-2026`).' },
      { step: 3, title: 'Select Location & Storage Class', instruction: 'Select Region (e.g. `us-central1`) for low latency or Multi-region for high availability. Choose "Standard" default class.' },
      { step: 4, title: 'Enforce Uniform Bucket-Level Access', instruction: 'Check "Uniform" access control to manage permissions exclusively through IAM rather than legacy per-object ACLs.' }
    ],
    cliCommands: [
      {
        command: 'gcloud storage buckets create gs://<UNIQUE_BUCKET_NAME> --location=us-central1 --uniform-bucket-level-access',
        explanation: 'Creates a new Cloud Storage bucket with Uniform Bucket-Level Access enforced.',
        flags: [
          { flag: '--location=us-central1', purpose: 'Stores bucket data in Iowa datacenter' },
          { flag: '--uniform-bucket-level-access', purpose: 'Enforces modern IAM access control and blocks legacy ACLs' }
        ],
        output: 'Creating gs://forge-assets-company-2026/...\nCreated gs://forge-assets-company-2026/'
      },
      {
        command: 'gcloud storage cp ./app-build.zip gs://<UNIQUE_BUCKET_NAME>/builds/',
        explanation: 'Uploads a local file to the specified GCS bucket path.',
        flags: [],
        output: 'Copying file://./app-build.zip to gs://.../builds/app-build.zip\nAverage throughput: 42.1MiB/s'
      }
    ],
    terraformSnippet: `resource "google_storage_bucket" "app_bucket" {
  name          = "mycompany-secure-storage-prod"
  location      = "US-CENTRAL1"
  force_destroy = false

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }
}`,
    commonMistakes: [
      { mistake: 'Leaving Public Access Prevention disabled on private data buckets.', fix: 'Always enable "Public Access Prevention" (Enforced) on buckets containing proprietary or confidential assets.' },
      { mistake: 'Using Fine-Grained access control instead of Uniform Bucket-Level Access.', fix: 'Uniform access simplifies auditing and eliminates the risk of an individual object inadvertently having a public ACL.' }
    ],
    securityImplications: 'Signed URLs grant temporary, time-bounded read or write access (e.g., 15 minutes) to a specific GCS object without requiring the client to hold a Google account or IAM credentials.',
    quickRevision: [
      'GCS delivers 11 9s (99.999999999%) durability across all storage classes.',
      'Bucket names are globally unique across all Google Cloud accounts worldwide.',
      'Four classes: Standard, Nearline (30 days), Coldline (90 days), Archive (365 days).',
      'Uniform Bucket-Level Access manages security cleanly via IAM, retiring legacy ACLs.',
      'Signed URLs allow secure direct client browser uploads and downloads.'
    ],
    quiz: [
      {
        question: 'Which Cloud Storage feature moves objects to colder storage classes or deletes expired files automatically after a designated number of days?',
        options: [
          'Cloud Storage Transfer Service',
          'Object Lifecycle Management',
          'Cloud Armor CDN Policies',
          'Cloud Tasks Retention Schedule'
        ],
        answerIndex: 1,
        explanation: 'Object Lifecycle Management lets you define automated rules (e.g., transition to Nearline after 30 days, delete after 365 days) without writing custom cron jobs.'
      }
    ],
    labTask: {
      title: 'Create Bucket with Lifecycle Rule & Upload Asset',
      objective: 'Create a Cloud Storage bucket, upload a sample file, and verify metadata.',
      tasks: [
        'Create bucket: `gcloud storage buckets create gs://lab-bucket-$RANDOM --location=us-central1 --uniform-bucket-level-access`',
        'Create a test file: `echo "Hello GCP Forge" > test.txt`',
        'Upload to bucket: `gcloud storage cp test.txt gs://<YOUR_BUCKET>/test.txt`',
        'View bucket objects: `gcloud storage ls gs://<YOUR_BUCKET>/`'
      ],
      cleanupCommand: 'gcloud storage rm -r gs://<YOUR_BUCKET>'
    },
    relatedTopics: ['gcp-fundamentals', 'cloud-run', 'databases-overview'],
    docUrl: 'https://cloud.google.com/storage/docs',
    lastVerified: '2026-11'
  },

  // ==========================================
  // STAGE 7: GOOGLE CLOUD DATABASES
  // ==========================================
  {
    id: 'databases-overview',
    stage: 6,
    stageName: 'Stage 06 — Google Cloud Databases',
    branch: 'storage-db',
    title: 'Cloud SQL, AlloyDB & Cloud Spanner',
    subtitle: 'Relational vs NoSQL Decision Matrix, Connection Pooling & High Availability',
    level: 'Intermediate',
    estimatedTime: '40 min',
    prerequisites: ['vpc-networking', 'iam-foundations'],
    freeTierEligible: false,
    costWarning: 'Managed relational databases (Cloud SQL, AlloyDB, Spanner) incur continuous hourly charges while running. There is NO perpetual Always Free tier for Cloud SQL instances; delete lab instances immediately after testing.',
    simpleExplanation: 'Google Cloud offers fully managed databases so you never have to patch database operating systems, execute manual backup scripts, or manage replication failover. Choices range from standard relational engines (Cloud SQL) to planet-scale globally consistent databases (Cloud Spanner).',
    analogy: 'Running a database on a raw VM is like building your own car engine from raw parts. Cloud SQL is leasing a luxury vehicle with a dedicated pit crew that automatically changes oil, rotates tires, and swaps in a replacement vehicle if anything stalls.',
    whyItExists: 'Database management (backups, cross-AZ failover, read replicas, storage auto-resize, SSL termination) is operationally hazardous. Fully managed services automate resilience.',
    howItWorks: 'Cloud SQL manages PostgreSQL, MySQL, and SQL Server. AlloyDB adds a custom columnar engine and disaggregated storage for 4x transactional throughput. Cloud Spanner uses TrueTime (atomic clocks and GPS receivers) to deliver external consistency (ACID) across worldwide distributed multi-region clusters.',
    internalDetails: 'For microservices and mobile apps, Firestore provides serverless NoSQL document storage with real-time listeners. Bigtable provides petabyte-scale low-latency (<10ms) key-value/wide-column storage for IoT and time-series.',
    consoleSteps: [
      { step: 1, title: 'Navigate to Cloud SQL', instruction: 'In Google Cloud Console, open Navigation Menu > Databases > SQL.' },
      { step: 2, title: 'Create Instance', instruction: 'Click "Create Instance" and select PostgreSQL. Enter Instance ID `prod-pg-db` and set an administrative password.' },
      { step: 3, title: 'Configure Private IP', instruction: 'Under "Connections", uncheck Public IP and enable "Private IP". Select your custom VPC to allocate a private RFC 1918 range via Private Services Access.' },
      { step: 4, title: 'Enable High Availability', instruction: 'Under Configuration Options > Data Protection, verify Automated Backups and select Regional (High Availability) for automated multi-zone failover.' }
    ],
    cliCommands: [
      {
        command: 'gcloud sql instances create dev-postgres --database-version=POSTGRES_15 --tier=db-custom-1-3840 --region=us-central1 --no-assign-ip --network=prod-vpc',
        explanation: 'Provisions a private PostgreSQL 15 instance without public IP access on the custom VPC.',
        flags: [
          { flag: '--tier=db-custom-1-3840', purpose: 'Custom machine tier with 1 vCPU and 3.75 GB RAM' },
          { flag: '--no-assign-ip', purpose: 'Ensures instance has zero exposure to public internet' }
        ],
        output: 'Creating Cloud SQL instance... done.\nCreated [https://sqladmin.googleapis.com/.../instances/dev-postgres].'
      },
      {
        command: 'gcloud sql databases create app_db --instance=dev-postgres',
        explanation: 'Creates a relational database catalog named `app_db` inside the Cloud SQL instance.',
        flags: [],
        output: 'Creating database app_db... done.'
      }
    ],
    terraformSnippet: `resource "google_sql_database_instance" "main_db" {
  name             = "prod-postgres-ha"
  database_version = "POSTGRES_16"
  region           = "us-central1"

  settings {
    tier              = "db-custom-2-7680"
    availability_type = "REGIONAL" # Multi-zone HA failover
    disk_autoresize   = true

    ip_configuration {
      ipv4_enabled    = false
      private_network = var.vpc_network_id
    }

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = true
    }
  }
}`,
    commonMistakes: [
      { mistake: 'Connecting application containers directly without connection pooling.', fix: 'PostgreSQL creates a new OS process per connection. Direct connections from serverless Cloud Run instances will exhaust DB connections. Use Cloud SQL Auth Proxy with built-in connection pooling.' },
      { mistake: 'Opening Cloud SQL to public internet (`0.0.0.0/0`) with authorized networks.', fix: 'Always use Private IP via Private Services Access or Cloud SQL Auth Proxy with IAM authentication.' }
    ],
    securityImplications: 'Cloud SQL Auth Proxy secures connections by generating dynamic ephemeral SSL certificates validated through Google Cloud IAM, eliminating the need to manage static SSL certs or expose public IP addresses.',
    quickRevision: [
      'Cloud SQL = Managed PostgreSQL, MySQL, SQL Server for standard relational workloads.',
      'AlloyDB = PostgreSQL-compatible database optimized for demanding enterprise transactions.',
      'Cloud Spanner = Globally distributed, horizontally scalable, strongly consistent ACID database.',
      'Firestore = Serverless NoSQL document database with offline sync and real-time triggers.',
      'Bigtable = Petabyte-scale NoSQL wide-column database for high-throughput time-series & telemetry.'
    ],
    quiz: [
      {
        question: 'When an application requires a relational SQL database with global horizontal write scaling, high availability (99.999% SLA), and strict multi-region ACID consistency, which service must be chosen?',
        options: [
          'Cloud SQL with cross-region read replicas',
          'Cloud Spanner',
          'Firestore in Datastore mode',
          'Cloud Bigtable'
        ],
        answerIndex: 1,
        explanation: 'Cloud Spanner is Google unique globally distributed relational database that delivers horizontal scale and external consistency across multiple regions with 99.999% availability.'
      }
    ],
    labTask: {
      title: 'Inspect Cloud SQL Architecture & Auth Proxy Concept',
      objective: 'Understand how Cloud SQL handles private connectivity and automatic backups.',
      tasks: [
        'Explore Cloud SQL configuration parameters in Google Cloud Console.',
        'Review the difference between Zonal (development) and Regional (HA production) failover.',
        'Verify point-in-time recovery (PITR) retention settings.'
      ],
      cleanupCommand: '# If a test instance was created, terminate it immediately via: gcloud sql instances delete <INSTANCE_NAME> --quiet'
    },
    relatedTopics: ['vpc-networking', 'cloud-run', 'real-world-projects'],
    docUrl: 'https://cloud.google.com/sql/docs',
    lastVerified: '2026-11'
  },

  // ==========================================
  // STAGE 8: CLOUD RUN & SERVERLESS CONTAINERS
  // ==========================================
  {
    id: 'cloud-run',
    stage: 7,
    stageName: 'Stage 07 — Cloud Run & Serverless Architecture',
    branch: 'containers',
    title: 'Cloud Run & Serverless Containers',
    subtitle: 'Containerized Microservices, Autoscaling to Zero, Revisions & Traffic Splitting',
    level: 'Intermediate',
    estimatedTime: '35 min',
    prerequisites: ['iam-foundations'],
    freeTierEligible: true,
    simpleExplanation: 'Cloud Run is Google premier fully managed serverless platform. You give it a container image, and Cloud Run runs it on top of Google infrastructure, automatically scaling from zero instances during idle periods up to thousands of instances in response to incoming HTTP requests or events.',
    analogy: 'Traditional servers are like leasing an entire fleet of buses that run empty all night. Cloud Run is like an on-demand robot taxi service: a vehicle manifests the instant a passenger taps "ride", and disappears the instant the trip concludes.',
    whyItExists: 'Managing Kubernetes clusters (control planes, nodes, worker pools, OS upgrades) introduces massive overhead for microservices. Cloud Run gives you the power of standard Docker containers without any cluster management.',
    howItWorks: 'Cloud Run runs standard OCI containers on gVisor (a secure application kernel sandbox). When an HTTP request arrives, the Cloud Run load balancer routes it to an active instance or cold-starts a new container in milliseconds. Each deployment creates an immutable Revision.',
    internalDetails: 'Key knobs: Concurrency (number of concurrent requests a single container instance processes, default 80), Minimum Instances (`--min-instances=1` to eliminate cold starts for latency-critical APIs), and CPU allocation (throttled during request idle vs always allocated).',
    consoleSteps: [
      { step: 1, title: 'Open Cloud Run Console', instruction: 'Navigate to Navigation Menu > Serverless > Cloud Run.' },
      { step: 2, title: 'Deploy Service', instruction: 'Click "Deploy Container" > "Service". Select your container image from Artifact Registry.' },
      { step: 3, title: 'Configure Authentication', instruction: 'Choose "Allow unauthenticated invocations" for public web APIs or "Require authentication" for internal microservices.' },
      { step: 4, title: 'Set Autoscaling Limits', instruction: 'Under "Container, Networking, Security", set Minimum instances to 0 and Maximum instances to 10 to establish cost control.' }
    ],
    cliCommands: [
      {
        command: 'gcloud run deploy api-service --image=us-docker.pkg.dev/cloudrun/container/hello --region=us-central1 --allow-unauthenticated --port=8080 --memory=512Mi --concurrency=80',
        explanation: 'Deploys a public microservice to Cloud Run with automatic SSL and autoscaling.',
        flags: [
          { flag: '--allow-unauthenticated', purpose: 'Allows public internet users to invoke the HTTP endpoint' },
          { flag: '--concurrency=80', purpose: 'Allows each container to handle up to 80 simultaneous requests' },
          { flag: '--memory=512Mi', purpose: 'Allocates 512 MB of RAM per container instance' }
        ],
        output: 'Deploying container to Cloud Run service [api-service]...\nService URL: https://api-service-4x82a-uc.a.run.app'
      },
      {
        command: 'gcloud run services update-traffic api-service --region=us-central1 --to-revisions=api-service-00002-xyz=10,api-service-00001-abc=90',
        explanation: 'Splits production traffic between two revisions for canary testing (10% to new revision, 90% to stable).',
        flags: [{ flag: '--to-revisions', purpose: 'Specifies percentage distribution across active revisions' }],
        output: 'Updated traffic for service [api-service].'
      }
    ],
    terraformSnippet: `resource "google_cloud_run_v2_service" "api_service" {
  name     = "forge-api-service"
  location = "us-central1"
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    scaling {
      min_instance_count = 0
      max_instance_count = 10
    }
    containers {
      image = "us-central1-docker.pkg.dev/my-proj/repo/api:v1.0.0"
      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
      env {
        name  = "NODE_ENV"
        value = "production"
      }
    }
  }
}`,
    commonMistakes: [
      { mistake: 'Writing stateful data to local container filesystem expecting it to persist across requests.', fix: 'Containers are stateless and ephemeral; instances can be terminated at any time. Store state in Cloud SQL, Firestore, or Cloud Storage.' },
      { mistake: 'Setting concurrency to 1 without understanding performance impacts.', fix: 'Concurrency=1 forces Cloud Run to spin up a whole new container for every concurrent request, inflating cold starts and costs. Tune concurrency to 40-100 for async runtimes like Node.js and Go.' }
    ],
    securityImplications: 'For internal microservice communication, use IAM service-to-service authentication. The calling service requests an OpenID Connect (OIDC) identity token and passes it in the `Authorization: Bearer <TOKEN>` header.',
    quickRevision: [
      'Cloud Run runs any container image that listens on an HTTP port (default $PORT=8080).',
      'True serverless: automatically scales from 0 to thousands of instances based on traffic.',
      'Immutable Revisions allow instant rollbacks and zero-downtime canary traffic splitting.',
      'Cloud Run Jobs execute finite batch tasks (data migrations, nightly exports) to completion.',
      'Generous Free Tier: 2 million requests and 360,000 vCPU-seconds free per month.'
    ],
    quiz: [
      {
        question: 'How do you prevent cold starts for a latency-critical customer-facing API deployed on Google Cloud Run?',
        options: [
          'Increase the container memory to 32 GB',
          'Set the minimum instance count (--min-instances) to 1 or higher',
          'Deploy the container exclusively in a Multi-region bucket',
          'Disable HTTP/2 compression'
        ],
        answerIndex: 1,
        explanation: 'Setting --min-instances to 1 or higher guarantees that at least one warm instance is kept running continuously, eliminating cold-start latency.'
      }
    ],
    labTask: {
      title: 'Deploy Sample Container to Cloud Run and Inspect Revisions',
      objective: 'Deploy a container service, verify HTTPS endpoint, and examine traffic splitting.',
      tasks: [
        'Deploy sample image: `gcloud run deploy lab-service --image=us-docker.pkg.dev/cloudrun/container/hello --region=us-central1 --allow-unauthenticated`',
        'Curl the generated service URL to verify HTTP 200 response.',
        'Inspect revision history: `gcloud run revisions list --service=lab-service --region=us-central1`'
      ],
      cleanupCommand: 'gcloud run services delete lab-service --region=us-central1 --quiet'
    },
    relatedTopics: ['docker-containers', 'kubernetes-gke', 'devops-cicd'],
    docUrl: 'https://cloud.google.com/run/docs',
    lastVerified: '2026-11'
  },

  // ==========================================
  // STAGE 9: DOCKER & ARTIFACT REGISTRY
  // ==========================================
  {
    id: 'docker-containers',
    stage: 8,
    stageName: 'Stage 08 — Docker & Container Artifact Management',
    branch: 'containers',
    title: 'Docker & Artifact Registry',
    subtitle: 'Production Multi-Stage Dockerfiles, Layer Caching & Vulnerability Scanning',
    level: 'Intermediate',
    estimatedTime: '30 min',
    prerequisites: ['gcp-fundamentals'],
    freeTierEligible: true,
    simpleExplanation: 'Artifact Registry is Google secure, universal package management service for storing and managing container images (Docker, OCI) and language packages (npm, Maven, Python). It succeeds the deprecated Container Registry (gcr.io).',
    analogy: 'Docker is packing your software into standardized shipping containers with all dependencies included. Artifact Registry is the secure, climate-controlled container depot where your verified shipping containers are cataloged before deployment.',
    whyItExists: 'Building images on developer laptops and uploading them directly to production introduces drift and security vulnerabilities. Artifact Registry acts as the single source of truth with automated vulnerability scanning.',
    howItWorks: 'Developers or CI/CD pipelines authenticate with Artifact Registry via `gcloud auth configure-docker`. When images are pushed, Google Cloud automatically analyzes packages against the Common Vulnerabilities and Exposures (CVE) database.',
    internalDetails: 'Multi-stage Docker builds separate build tooling (Node.js SDK, compilers) from the final minimal runtime image (Alpine or Distroless), reducing image sizes from 1.2 GB down to 80 MB and eliminating attack surfaces.',
    consoleSteps: [
      { step: 1, title: 'Open Artifact Registry', instruction: 'In Google Cloud Console, navigate to Navigation Menu > CI/CD > Artifact Registry.' },
      { step: 2, title: 'Create Repository', instruction: 'Click "Create Repository". Format: Docker. Mode: Standard. Region: `us-central1`. Name: `forge-docker-repo`.' },
      { step: 3, title: 'Enable Vulnerability Scanning', instruction: 'Under repository settings, verify Automatic Vulnerability Scanning is enabled to flag high-severity CVEs.' }
    ],
    cliCommands: [
      {
        command: 'gcloud artifacts repositories create app-repo --repository-format=docker --location=us-central1 --description="Application container images"',
        explanation: 'Creates a modern OCI-compliant Artifact Registry repository in us-central1.',
        flags: [
          { flag: '--repository-format=docker', purpose: 'Stores Docker/OCI container images' },
          { flag: '--location=us-central1', purpose: 'Regional repository location' }
        ],
        output: 'Created repository [app-repo].'
      },
      {
        command: 'gcloud auth configure-docker us-central1-docker.pkg.dev',
        explanation: 'Configures local Docker daemon helper to authenticate seamlessly with Google Artifact Registry.',
        flags: [],
        output: 'Docker configuration file updated.'
      }
    ],
    terraformSnippet: `resource "google_artifact_registry_repository" "docker_repo" {
  location      = "us-central1"
  repository_id = "company-containers"
  description   = "Production container images"
  format        = "DOCKER"
}`,
    commonMistakes: [
      { mistake: 'Continuing to use legacy Container Registry (`gcr.io`).', fix: 'Container Registry is deprecated. All new production workloads must use Artifact Registry (`pkg.dev`) which supports fine-grained IAM and multiple package formats.' },
      { mistake: 'Including development secrets or `.env` files in Docker image layers.', fix: 'Always create a `.dockerignore` file excluding `node_modules`, `.git`, and `.env` files. Inject secrets at runtime via Secret Manager.' }
    ],
    securityImplications: 'Artifact Registry integrates with Binary Authorization, ensuring that GKE or Cloud Run only runs container images that have been digitally signed by an approved CI/CD attestation authority.',
    quickRevision: [
      'Artifact Registry replaces deprecated Container Registry (`gcr.io`).',
      'Format URI: `LOCATION-docker.pkg.dev/PROJECT_ID/REPOSITORY_NAME/IMAGE:TAG`.',
      'Multi-stage Dockerfiles slash image footprint and security vulnerabilities.',
      'Automatic vulnerability scanning identifies known CVEs before production deployment.',
      'Never bake secrets into container images; load dynamically from Secret Manager.'
    ],
    quiz: [
      {
        question: 'What is the current, modern Google Cloud service recommended for storing Docker and OCI container images?',
        options: [
          'Google Container Registry (gcr.io)',
          'Artifact Registry (pkg.dev)',
          'Cloud Storage Nearline Bucket',
          'Compute Engine Disk Images'
        ],
        answerIndex: 1,
        explanation: 'Artifact Registry is Google Cloud modern universal package and container repository, superseding the deprecated Container Registry.'
      }
    ],
    labTask: {
      title: 'Create Artifact Registry Repo & Build Minimal Docker Image',
      objective: 'Create a Docker repository in Artifact Registry and configure Docker authentication.',
      tasks: [
        'Run `gcloud artifacts repositories create lab-repo --repository-format=docker --location=us-central1`',
        'Run `gcloud auth configure-docker us-central1-docker.pkg.dev`',
        'List active repositories: `gcloud artifacts repositories list`'
      ],
      cleanupCommand: 'gcloud artifacts repositories delete lab-repo --location=us-central1 --quiet'
    },
    relatedTopics: ['cloud-run', 'kubernetes-gke', 'devops-cicd'],
    docUrl: 'https://cloud.google.com/artifact-registry/docs',
    lastVerified: '2026-11'
  },

  // ==========================================
  // STAGE 10: KUBERNETES & GKE
  // ==========================================
  {
    id: 'kubernetes-gke',
    stage: 9,
    stageName: 'Stage 09 — Kubernetes & Google Kubernetes Engine',
    branch: 'containers',
    title: 'Google Kubernetes Engine (GKE)',
    subtitle: 'Autopilot vs Standard, Control Plane, Pods, Deployments & Workload Identity',
    level: 'Advanced',
    estimatedTime: '45 min',
    prerequisites: ['docker-containers', 'vpc-networking'],
    freeTierEligible: true,
    costWarning: 'GKE Standard clusters incur node VM charges. GKE provides one free zonal cluster management fee per billing account ($74.40/month credit), but worker node VMs continue accruing standard Compute Engine charges.',
    simpleExplanation: 'Google Kubernetes Engine (GKE) is the industry gold standard managed Kubernetes platform. Built by the creators of Kubernetes, GKE automates cluster provisioning, control plane upgrades, node repairs, and auto-scaling.',
    analogy: 'If Docker is a single musical instrument, Kubernetes is the symphonic conductor who coordinates dozens of musicians, adjusting volume, tempo, and instantly replacing a violinist if a string snaps.',
    whyItExists: 'Complex multi-tier microservice applications require advanced service discovery, mesh networking, stateful storage volumes, cron workloads, and precise placement constraints that single-container platforms cannot provide.',
    howItWorks: 'GKE provides two operational modes: GKE Autopilot (Google manages the entire infrastructure, control plane, node pools, and OS hardening; you pay only for Pod vCPU/memory requested) and GKE Standard (you manage worker node pools, machine types, and scaling policies).',
    internalDetails: 'GKE natively integrates with Google Cloud networking via VPC-native clusters (alias IPs for pods), Cloud Load Balancing via GKE Gateway API, and security via Workload Identity (mapping Kubernetes Service Accounts directly to Google Cloud IAM Service Accounts).',
    consoleSteps: [
      { step: 1, title: 'Open Kubernetes Engine', instruction: 'Navigate to Navigation Menu > Kubernetes Engine > Clusters.' },
      { step: 2, title: 'Create Cluster', instruction: 'Click "Create". Select GKE Autopilot (Google recommended for 95% of production workloads).' },
      { step: 3, title: 'Configure Networking', instruction: 'Select your custom VPC and subnet. Ensure "Private Cluster" is enabled so worker nodes have no public IP addresses.' },
      { step: 4, title: 'Connect with kubectl', instruction: 'Click "Connect" next to the cluster and copy the generated `gcloud container clusters get-credentials` command.' }
    ],
    cliCommands: [
      {
        command: 'gcloud container clusters create-auto prod-cluster --region=us-central1 --network=prod-vpc --subnetwork=prod-subnet-us',
        explanation: 'Provisions a fully managed, production-hardened GKE Autopilot cluster.',
        flags: [
          { flag: 'create-auto', purpose: 'Enables GKE Autopilot managed operations' },
          { flag: '--region=us-central1', purpose: 'Provisions multi-zonal high-availability control plane' }
        ],
        output: 'Creating cluster prod-cluster in us-central1... Cluster created.\nkubeconfig entry generated.'
      },
      {
        command: 'kubectl get nodes -o wide',
        explanation: 'Queries the Kubernetes cluster to inspect all active worker nodes, internal IPs, and OS versions.',
        flags: [],
        output: 'NAME                                      STATUS   ROLES    AGE   VERSION\ngke-prod-cluster-nap-12ab-node-9182       Ready    <none>   5m    v1.30.2-gke.1500'
      }
    ],
    terraformSnippet: `resource "google_container_cluster" "autopilot_cluster" {
  name     = "forge-autopilot-cluster"
  location = "us-central1"

  enable_autopilot = true
  network          = var.vpc_name
  subnetwork       = var.subnet_name

  ip_allocation_policy {} # Required for VPC-native alias IPs
}`,
    commonMistakes: [
      { mistake: 'Using GKE Standard and manually sizing node pools for simple container workloads.', fix: 'Adopt GKE Autopilot: it enforces security best practices out-of-the-box, auto-scales pods efficiently, and eliminates node management overhead.' },
      { mistake: 'Storing Google Cloud service account keys inside Kubernetes Secrets.', fix: 'Use GKE Workload Identity. It binds Kubernetes Service Accounts directly to Google IAM Service Accounts, issuing ephemeral short-lived tokens automatically.' }
    ],
    securityImplications: 'Workload Identity is the security standard for GKE. Pods authenticate to Cloud SQL, Pub/Sub, and Secret Manager without mounting static credential files onto container filesystems.',
    quickRevision: [
      'GKE is Google enterprise managed Kubernetes service.',
      'GKE Autopilot manages control plane AND worker nodes; pay only for Pod resource requests.',
      'GKE Standard gives full control over node OS, daemon sets, and custom machine types.',
      'VPC-native clusters give every Pod an internal IP directly routable within the VPC.',
      'Workload Identity securely binds Kubernetes Pods to Google Cloud IAM roles.'
    ],
    quiz: [
      {
        question: 'Which GKE operation mode automatically handles worker node provisioning, OS security patching, and bin-packing while billing you exclusively for Pod CPU/memory requests?',
        options: [
          'GKE Standard Zonal',
          'GKE Autopilot',
          'Compute Engine Managed Instance Group',
          'Cloud Run Anthos'
        ],
        answerIndex: 1,
        explanation: 'GKE Autopilot is Google fully managed operational mode that automates cluster infrastructure management and charges only for pod resource allocations.'
      }
    ],
    labTask: {
      title: 'Inspect GKE Autopilot Architecture & Deploy Sample Nginx Pod',
      objective: 'Connect to a GKE cluster context and deploy a declarative Kubernetes workload.',
      tasks: [
        'Inspect cluster credentials with `gcloud container clusters list`',
        'Create a deployment: `kubectl create deployment web-demo --image=nginx:alpine`',
        'Inspect running pods: `kubectl get pods -l app=web-demo`',
        'Scale the deployment: `kubectl scale deployment web-demo --replicas=3`'
      ],
      cleanupCommand: 'kubectl delete deployment web-demo'
    },
    relatedTopics: ['cloud-run', 'docker-containers', 'devops-cicd'],
    docUrl: 'https://cloud.google.com/kubernetes-engine/docs',
    lastVerified: '2026-11'
  },

  // ==========================================
  // STAGE 11: DEVOPS & INFRASTRUCTURE AS CODE
  // ==========================================
  {
    id: 'devops-cicd',
    stage: 10,
    stageName: 'Stage 10 — DevOps, CI/CD & Terraform',
    branch: 'devops',
    title: 'CI/CD with GitHub Actions & Terraform',
    subtitle: 'Workload Identity Federation, Cloud Build, Remote State & Automated Delivery',
    level: 'Advanced',
    estimatedTime: '40 min',
    prerequisites: ['iam-foundations', 'cloud-run'],
    freeTierEligible: true,
    simpleExplanation: 'Modern DevOps automates building, testing, securing, and deploying software. With Infrastructure as Code (Terraform), your entire cloud infrastructure is defined in declarative code files versioned in Git.',
    analogy: 'Instead of having a human manually click 40 buttons across the Google Cloud Console (which differs every time and causes human error), Terraform is an automated architect blueprint that constructs the exact identical building every single run.',
    whyItExists: 'Manual console changes create "configuration drift", unrepeatable environments, and accidental downtime. Automated CI/CD pipelines verify tests and apply security scans before any code reaches production.',
    howItWorks: 'GitHub Actions authenticates to Google Cloud via Workload Identity Federation (no stored secrets). Terraform stores the current reality of your infrastructure in a remote State File stored securely in a versioned Cloud Storage bucket with object locking.',
    internalDetails: 'A complete pipeline: Git commit -> GitHub Action triggers -> Workload Identity Federation exchanges GitHub OIDC token for temporary GCP token -> Docker image builds and pushes to Artifact Registry -> Terraform plans and applies -> Cloud Run receives new revision.',
    consoleSteps: [
      { step: 1, title: 'Open Cloud Build', instruction: 'Navigate to Navigation Menu > CI/CD > Cloud Build.' },
      { step: 2, title: 'Create Build Trigger', instruction: 'Connect your GitHub repository. Select trigger event "Push to branch: main".' },
      { step: 3, title: 'Configure Build Configuration', instruction: 'Select `cloudbuild.yaml` in repository root to define build, test, and deploy steps.' }
    ],
    cliCommands: [
      {
        command: 'gcloud iam workload-identity-pools create "github-pool" --location="global" --description="GitHub Actions Pool"',
        explanation: 'Creates a Workload Identity Pool for secretless authentication from GitHub Actions CI/CD.',
        flags: [],
        output: 'Created workload identity pool [github-pool].'
      },
      {
        command: 'terraform init && terraform plan -out=tfplan',
        explanation: 'Initializes Terraform remote backend in Cloud Storage and generates an execution plan showing exact resource additions, updates, and destructions.',
        flags: [],
        output: 'Terraform will perform the following actions:\n  # google_cloud_run_v2_service.api will be created\nPlan: 1 to add, 0 to change, 0 to destroy.'
      }
    ],
    terraformSnippet: `# Terraform remote backend in Cloud Storage
terraform {
  backend "gcs" {
    bucket  = "forge-tf-state-prod"
    prefix  = "terraform/state/production"
  }
}

module "cloud_run_service" {
  source       = "./modules/cloud_run"
  service_name = "order-api"
  region       = "us-central1"
  image_url    = var.image_digest
}`,
    commonMistakes: [
      { mistake: 'Storing a Google Cloud JSON service account key in GitHub repository Secrets.', fix: 'Never store static keys in CI/CD. Use Google Cloud Workload Identity Federation to exchange GitHub short-lived tokens for temporary Google IAM credentials.' },
      { mistake: 'Committing `terraform.tfstate` into Git repositories.', fix: 'Terraform state contains sensitive infrastructure IDs and cleartext secrets. Always store state in a private Cloud Storage bucket with versioning and encryption enabled.' }
    ],
    securityImplications: 'Workload Identity Federation eliminates long-lived credentials entirely. If a CI runner is compromised after a build, the attacker obtains zero persistent Google Cloud credentials.',
    quickRevision: [
      'Infrastructure as Code (IaC) ensures repeatable, auditable cloud environments.',
      'Terraform state must be stored in a versioned, encrypted Google Cloud Storage bucket.',
      'Workload Identity Federation provides secretless CI/CD authentication for GitHub Actions.',
      'Never run manual ad-hoc console commands in production; enforce pipeline automation.',
      'Implement canary releases and automated rollback triggers for safe zero-downtime shipping.'
    ],
    quiz: [
      {
        question: 'Why is Workload Identity Federation strongly preferred over JSON Service Account Keys for authenticating GitHub Actions with Google Cloud?',
        options: [
          'It is faster because it bypasses Google IAM entirely',
          'It eliminates static long-lived credentials, issuing temporary short-lived tokens based on verifiable OIDC tokens',
          'It allows deployments to bypass Google Cloud billing',
          'It works without requiring an active Google Cloud Project'
        ],
        answerIndex: 1,
        explanation: 'Workload Identity Federation exchanges GitHub Actions cryptographic OIDC tokens for short-lived Google IAM credentials on-the-fly, completely eliminating the catastrophic risk of leaked static JSON keys.'
      }
    ],
    labTask: {
      title: 'Configure GCS Remote Terraform Backend Bucket',
      objective: 'Create a dedicated Cloud Storage bucket configured for Terraform state locking.',
      tasks: [
        'Create bucket: `gcloud storage buckets create gs://tfstate-$RANDOM --location=us-central1 --uniform-bucket-level-access`',
        'Enable versioning: `gcloud storage buckets update gs://<BUCKET_NAME> --versioning`',
        'Verify bucket properties: `gcloud storage buckets describe gs://<BUCKET_NAME>`'
      ],
      cleanupCommand: 'gcloud storage rm -r gs://<BUCKET_NAME>'
    },
    relatedTopics: ['iam-foundations', 'cloud-run', 'production-projects'],
    docUrl: 'https://cloud.google.com/docs/terraform',
    lastVerified: '2026-11'
  },

  // ==========================================
  // STAGE 12: OBSERVABILITY & RELIABILITY
  // ==========================================
  {
    id: 'cloud-observability',
    stage: 11,
    stageName: 'Stage 11 — Observability, Logging & SRE',
    branch: 'observability',
    title: 'Cloud Monitoring, Logging & SRE',
    subtitle: 'Golden Signals, Log-Based Metrics, Distributed Tracing & Incident Response',
    level: 'Advanced',
    estimatedTime: '30 min',
    prerequisites: ['cloud-run'],
    freeTierEligible: true,
    simpleExplanation: 'Google Cloud Observability (formerly Stackdriver) gives you real-time visibility into application health, performance, and errors. It comprises Cloud Logging, Cloud Monitoring, Cloud Trace, and Error Reporting.',
    analogy: 'Running production systems without observability is like flying a supersonic jet at night with all cockpit instrument gauges turned off. Cloud Observability gives you radar, altimeters, and immediate engine warning lights.',
    whyItExists: 'When customers experience HTTP 500 errors or high latency, developers cannot SSH into serverless containers to inspect logs. Centralized observability enables instant diagnosis across distributed microservices.',
    howItWorks: 'Applications output structured JSON logs to `stdout`/`stderr`. Google Cloud automatically ingests logs into Cloud Logging. Metrics evaluate against alerting policies. Cloud Trace captures request latency spans across microservice boundaries.',
    internalDetails: 'Google Site Reliability Engineering (SRE) focuses on the 4 Golden Signals: Latency (time to service request), Traffic (demand/QPS), Errors (rate of failed requests), and Saturation (how full resources are).',
    consoleSteps: [
      { step: 1, title: 'Open Cloud Logging', instruction: 'Navigate to Navigation Menu > Operations > Logging > Logs Explorer.' },
      { step: 2, title: 'Filter Errors', instruction: 'In Query builder, filter for `severity >= ERROR` and inspect stack traces in the JSON payload.' },
      { step: 3, title: 'Create Alerting Policy', instruction: 'Navigate to Operations > Monitoring > Alerting. Click "Create Policy", choose metric `run.googleapis.com/request_latencies`, and set threshold to 2000ms.' }
    ],
    cliCommands: [
      {
        command: 'gcloud logging read "resource.type=cloud_run_revision AND severity>=ERROR" --limit=10 --format="table(timestamp, severity, textPayload)"',
        explanation: 'Queries the latest 10 application errors from Cloud Run services directly in the terminal.',
        flags: [
          { flag: '--limit=10', purpose: 'Returns only the 10 most recent matching log entries' },
          { flag: '--format=...', purpose: 'Displays clean timestamp and error message' }
        ],
        output: 'TIMESTAMP                 SEVERITY  TEXT_PAYLOAD\n2026-11-16T10:14:02.192Z  ERROR     Unhandled exception: DB connection timeout'
      }
    ],
    terraformSnippet: `resource "google_monitoring_alert_policy" "high_error_rate" {
  display_name = "Cloud Run 5xx Error Rate > 5%"
  combiner     = "OR"

  conditions {
    display_name = "5xx error ratio"
    condition_threshold {
      filter     = "resource.type = \\"cloud_run_revision\\" AND metric.type = \\"run.googleapis.com/request_count\\" AND metric.labels.response_code_class = \\"5xx\\""
      duration   = "300s"
      comparison = "COMPARISON_GT"
      threshold_value = 10
    }
  }

  notification_channels = [var.pagerduty_channel_id]
}`,
    commonMistakes: [
      { mistake: 'Writing multi-line unformatted raw text strings to logs instead of structured JSON.', fix: 'Output single-line structured JSON with `message`, `severity`, `trace`, and `component` keys so Cloud Logging indexes fields for rapid query filtering.' },
      { mistake: 'Setting alerting thresholds too sensitive, causing alert fatigue for on-call engineers.', fix: 'Alert on customer-impacting Service Level Objectives (SLOs) like sustained error budgets rather than transient single-second CPU spikes.' }
    ],
    securityImplications: 'Ensure that application logs do not inadvertently leak Personally Identifiable Information (PII), credit cards, or authentication bearer tokens. Configure Cloud DLP (Sensitive Data Protection) or log exclusions to redact sensitive payloads.',
    quickRevision: [
      'Cloud Logging ingests structured JSON logs from Compute Engine, Cloud Run, and GKE.',
      'SRE 4 Golden Signals: Latency, Traffic, Errors, and Saturation.',
      'Cloud Trace visualizes distributed latency bottlenecks across microservices.',
      'Error Reporting groups related application crashes and sends real-time notifications.',
      'Audit Logs (Admin Activity & Data Access) track WHO performed WHAT action in your project.'
    ],
    quiz: [
      {
        question: 'According to Google SRE principles, what are the four "Golden Signals" of service monitoring?',
        options: [
          'CPU, Memory, Disk, and Network',
          'Latency, Traffic, Errors, and Saturation',
          'Users, Revenue, Pageviews, and Bounce Rate',
          'Uptime, MTBF, Deployments, and Rollbacks'
        ],
        answerIndex: 1,
        explanation: 'Google SRE identifies Latency, Traffic, Errors, and Saturation as the four core golden signals essential for monitoring user-facing systems.'
      }
    ],
    labTask: {
      title: 'Query Cloud Logging with Filter Expressions',
      objective: 'Execute structured log searches in Logs Explorer and test severity filtering.',
      tasks: [
        'Open Cloud Shell and run: `gcloud logging write test-log "Test info message" --severity=INFO`',
        'Write an error log: `gcloud logging write test-log "Test error message" --severity=ERROR`',
        'Query the error log: `gcloud logging read "logName:test-log AND severity=ERROR" --limit=5`'
      ],
      cleanupCommand: '# Log entries expire automatically according to project retention policy (default 30 days).'
    },
    relatedTopics: ['cloud-run', 'kubernetes-gke', 'devops-cicd'],
    docUrl: 'https://cloud.google.com/stackdriver/docs',
    lastVerified: '2026-11'
  },

  // ==========================================
  // STAGE 13: ARTIFICIAL INTELLIGENCE & VERTEX AI
  // ==========================================
  {
    id: 'vertex-ai-genai',
    stage: 12,
    stageName: 'Stage 12 — Vertex AI & Generative AI Architecture',
    branch: 'ai-advanced',
    title: 'Vertex AI, Gemini & Enterprise RAG',
    subtitle: 'Gemini Models, Embeddings, Vector Search & Retrieval-Augmented Generation',
    level: 'Architect',
    estimatedTime: '45 min',
    prerequisites: ['cloud-run', 'cloud-storage'],
    freeTierEligible: false,
    costWarning: 'Vertex AI foundation model calls and Vector Search index endpoints incur per-token or hourly hosting costs. Always use Gemini Flash for high-speed cost-effective inference.',
    simpleExplanation: 'Vertex AI is Google Cloud enterprise machine learning and generative AI platform. It gives developers secure API access to state-of-the-art multimodal foundation models (Gemini 1.5 Pro, Gemini 1.5 Flash, Imagen 3) without managing GPU clusters.',
    analogy: 'Instead of building and training a massive neural network from scratch in a billion-dollar supercomputer laboratory, Vertex AI is an enterprise API where you can consult world-class intelligence on demand.',
    whyItExists: 'Consumer AI tools lack enterprise security, data privacy, and SLA guarantees. Vertex AI ensures that customer prompts and proprietary enterprise data are NEVER used to train Google foundational models.',
    howItWorks: 'In a Retrieval-Augmented Generation (RAG) architecture: Enterprise documents stored in Cloud Storage are chunked -> Converted into vector embeddings via Vertex AI Embeddings API -> Indexed in Vertex AI Vector Search -> At query time, similar document chunks are retrieved and provided as grounded context to Gemini to answer with zero hallucination.',
    internalDetails: 'Gemini models feature massive context windows (up to 2 million tokens), allowing entire codebases, legal libraries, or hour-long video files to be processed in a single prompt without external vector retrieval.',
    consoleSteps: [
      { step: 1, title: 'Open Vertex AI Studio', instruction: 'In Google Cloud Console, navigate to Navigation Menu > Vertex AI > Vertex AI Studio.' },
      { step: 2, title: 'Enable Vertex AI API', instruction: 'Enable `aiplatform.googleapis.com` for your project.' },
      { step: 3, title: 'Test in Multimodal Playground', instruction: 'Select Gemini 1.5 Flash. Test prompt with system instructions, temperature controls, and safety filters.' }
    ],
    cliCommands: [
      {
        command: 'gcloud services enable aiplatform.googleapis.com',
        explanation: 'Enables the core Vertex AI API suite for the active project.',
        flags: [],
        output: 'Operation finished successfully.'
      },
      {
        command: 'curl -X POST -H "Authorization: Bearer $(gcloud auth print-access-token)" -H "Content-Type: application/json" "https://us-central1-aiplatform.googleapis.com/v1/projects/$(gcloud config get-value project)/locations/us-central1/publishers/google/models/gemini-1.5-flash:generateContent" -d \'{"contents": [{"role": "user", "parts": [{"text": "Explain VPC Peering in 1 sentence."}]}]}\'',
        explanation: 'Invokes the Gemini 1.5 Flash foundation model directly via authenticated REST API.',
        flags: [],
        output: '{\n  "candidates": [\n    {\n      "content": {\n        "parts": [{"text": "VPC Peering connects two Virtual Private Clouds privately using Google internal network without internet transit."}]\n      }\n    }\n  ]\n}'
      }
    ],
    terraformSnippet: `resource "google_vertex_ai_index" "vector_index" {
  region       = "us-central1"
  display_name = "enterprise-knowledge-base"
  description  = "RAG Document Embeddings"

  metadata {
    contents_delta_uri = "gs://forge-embeddings-bucket/initial/"
    config {
      dimensions                  = 768
      approximate_neighbors_count = 150
      distance_measure_type       = "DOT_PRODUCT_DISTANCE"
      algorithm_config {
        tree_ah_config {
          leaf_node_embedding_count    = 500
          leaf_nodes_to_search_percent = 7
        }
      }
    }
  }
}`,
    commonMistakes: [
      { mistake: 'Using consumer Gemini/ChatGPT endpoints that retain enterprise prompts for training.', fix: 'Always use Google Cloud Vertex AI: Google Cloud customer agreements explicitly guarantee that customer data and prompts are encrypted and never used for model training.' },
      { mistake: 'Using heavyweight Gemini Pro for simple classification or summarization tasks.', fix: 'Adopt Gemini 1.5 Flash: it delivers 4x lower latency and 10x lower token pricing while handling standard enterprise reasoning tasks with high accuracy.' }
    ],
    securityImplications: 'Enterprise RAG pipelines should integrate Customer-Managed Encryption Keys (CMEK) via Cloud KMS and apply fine-grained IAM roles (`roles/aiplatform.user`) to prevent unauthorized API invocations.',
    quickRevision: [
      'Vertex AI provides enterprise-grade Generative AI with Google Cloud SLA and security guarantees.',
      'Customer prompts and company data are NEVER used to train Google models.',
      'Gemini 1.5 Flash delivers sub-second latency and ultra-low cost for high-throughput production.',
      'RAG (Retrieval-Augmented Generation) grounds Gemini responses with verified company data.',
      'Vertex AI Vector Search provides millisecond vector indexing at billion-vector scale.'
    ],
    quiz: [
      {
        question: 'In an enterprise Google Cloud environment, what guarantee does Google Cloud provide regarding customer data submitted to Vertex AI Gemini models?',
        options: [
          'Data is automatically published into Google open-source datasets',
          'Customer prompts, inputs, and outputs are private, encrypted, and never used to train Google foundation models',
          'Data is stored permanently in public buckets for audit reviews',
          'Data must be anonymized before calling the API or the call will be rejected'
        ],
        answerIndex: 1,
        explanation: 'Google Cloud enterprise terms strictly guarantee that customer data submitted through Vertex AI remains completely confidential and is never used to train Google foundational models.'
      }
    ],
    labTask: {
      title: 'Invoke Gemini 1.5 Flash API via gcloud Token',
      objective: 'Enable Vertex AI API and execute a model inference request from Cloud Shell.',
      tasks: [
        'Run `gcloud services enable aiplatform.googleapis.com`',
        'Verify your authentication token with `gcloud auth print-access-token`',
        'Send an HTTP POST request to the Vertex AI Gemini generateContent endpoint and parse response.'
      ],
      cleanupCommand: '# API calls are billed per-token; no running infrastructure to clean up.'
    },
    relatedTopics: ['cloud-run', 'cloud-storage', 'production-projects'],
    docUrl: 'https://cloud.google.com/vertex-ai/docs',
    lastVerified: '2026-11'
  }
];

const batchOneTopicSources: Record<string, string[]> = {
  'cloud-foundations': ['https://cloud.google.com/docs/overview', 'https://cloud.google.com/docs/security/overview'],
  'gcp-fundamentals': ['https://cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy', 'https://cloud.google.com/resource-manager/docs/creating-managing-projects'],
  'billing-cost': ['https://cloud.google.com/billing/docs/how-to/budgets', 'https://cloud.google.com/free/docs/free-cloud-features'],
  'iam-foundations': ['https://cloud.google.com/iam/docs/overview', 'https://cloud.google.com/iam/docs/permissions-reference'],
  'vpc-networking': ['https://cloud.google.com/vpc/docs/overview', 'https://cloud.google.com/firewall/docs/firewalls'],
  'cloud-run-serverless': ['https://cloud.google.com/run/docs/overview', 'https://cloud.google.com/run/docs/managing-revisions']
};

TOPIC_NODES.forEach(topic => {
  if (batchOneTopicSources[topic.id]) topic.sourceReferences = batchOneTopicSources[topic.id];
});

const batchOneAccuracyNotes: Record<string, Partial<TopicNode>> = {
  'cloud-foundations': {
    quickRevision: ['Regions contain zones; zone counts vary by region and can change.', 'Choose multiple zones only when the workload needs fault-domain separation.', 'Cloud pricing depends on service, region, usage, and network path.', 'Shared responsibility changes with the service abstraction level.', 'Free-tier eligibility depends on account, service, region, and quota.']
  },
  'gcp-fundamentals': {
    howItWorks: 'Organization, folder, project, and resource policies can contribute to an effective policy. Inheritance is evaluated with resource-level bindings, deny policies, and permissions boundaries; a child resource is not automatically unable to add a narrower control.',
    securityImplications: 'Review the effective policy at the target resource. Parent allow bindings can grant access below, while deny policies and supported resource-level controls can restrict access. Test policy changes with least privilege and avoid assuming hierarchy alone removes access.'
  },
  'billing-cost': {
    costWarning: 'Budgets and alerts provide monitoring and notifications. They do not cap expenditure, stop resources, or guarantee Free Tier eligibility. Billing export data can arrive later than resource activity, depending on export configuration and destination.',
    securityImplications: 'Grant billing-account and project billing roles separately. Limit who can change budgets, billing links, exports, and notification recipients.'
  },
  'iam-foundations': {
    howItWorks: 'IAM evaluates the effective policy from applicable resource levels together with deny policies and principal access boundaries where supported. Parent grants can flow down; resource-level grants can add access; a child cannot generally remove an inherited allow by deleting its own binding.',
    securityImplications: 'Use deny policies and supported resource-level controls deliberately. Confirm effective access with policy analysis or an authenticated test, and distinguish developer permissions from service-account workload permissions.'
  },
  'vpc-networking': {
    howItWorks: 'A VPC is global, while subnets are regional. Routes and firewall rules are evaluated with priority and direction semantics; Cloud NAT provides outbound translation for eligible resources and does not provide unsolicited inbound access. Private Google Access and Private Service Connect solve different private-service paths.',
    securityImplications: 'Use narrow firewall sources and target tags or service accounts. Treat IAP source ranges as a specific ingress requirement, not as a general trusted network.'
  },
  'cloud-run-serverless': {
    howItWorks: 'Cloud Run scales revisions based on incoming work and configured limits. Concurrency is a per-instance setting, not a throughput guarantee; startup time, CPU allocation, request duration, min instances, max instances, and downstream limits affect observed behavior. Cloud Run services and Cloud Run functions are different deployment products.',
    costWarning: 'Cloud Run has conditional free quotas. Charges can apply for compute, requests, networking, build, registry, logging, and related services. Traffic splitting changes routing, not billing protection.'
  }
};

TOPIC_NODES.forEach(topic => {
  const notes = batchOneAccuracyNotes[topic.id];
  if (notes) Object.assign(topic, notes);
});

export const ROADMAP_STAGES: RoadmapStage[] = [
  {
    stage: 0,
    name: 'Stage 00 — Cloud Computing Foundations',
    description: 'Learn fundamental cloud concepts, virtualization, and the shared responsibility model.',
    level: 'Beginner',
    topics: TOPIC_NODES.filter(t => t.stage === 0)
  },
  {
    stage: 1,
    name: 'Stage 01 — Google Cloud Fundamentals & Billing',
    description: 'Master resource hierarchies, organizations, projects, and cost guardrails.',
    level: 'Beginner',
    topics: TOPIC_NODES.filter(t => t.stage === 1)
  },
  {
    stage: 2,
    name: 'Stage 02 — IAM & Security Foundations',
    description: 'Enforce least privilege access with predefined roles, service accounts, and policy inheritance.',
    level: 'Beginner',
    topics: TOPIC_NODES.filter(t => t.stage === 2)
  },
  {
    stage: 3,
    name: 'Stage 03 — Google Cloud Networking',
    description: 'Design global VPCs, regional subnets, firewall rules, and zero-trust IAP access.',
    level: 'Intermediate',
    topics: TOPIC_NODES.filter(t => t.stage === 3)
  },
  {
    stage: 4,
    name: 'Stage 04 — Compute Engine & Virtual Machines',
    description: 'Deploy resilient VM instances, machine families, persistent disks, and autoscaling MIGs.',
    level: 'Intermediate',
    topics: TOPIC_NODES.filter(t => t.stage === 4)
  },
  {
    stage: 5,
    name: 'Stage 05 — Cloud Storage & File Management',
    description: 'Scale unstructured object data with buckets, storage classes, and signed URLs.',
    level: 'Beginner',
    topics: TOPIC_NODES.filter(t => t.stage === 5)
  },
  {
    stage: 6,
    name: 'Stage 06 — Google Cloud Databases',
    description: 'Choose and deploy Cloud SQL, AlloyDB, Cloud Spanner, and Firestore for high availability.',
    level: 'Intermediate',
    topics: TOPIC_NODES.filter(t => t.stage === 6)
  },
  {
    stage: 7,
    name: 'Stage 07 — Cloud Run & Serverless Architecture',
    description: 'Deploy autoscaling serverless container microservices with traffic splitting and zero maintenance.',
    level: 'Intermediate',
    topics: TOPIC_NODES.filter(t => t.stage === 7)
  },
  {
    stage: 8,
    name: 'Stage 08 — Docker & Container Management',
    description: 'Package microservices with multi-stage Dockerfiles and secure Artifact Registry storage.',
    level: 'Intermediate',
    topics: TOPIC_NODES.filter(t => t.stage === 8)
  },
  {
    stage: 9,
    name: 'Stage 09 — Kubernetes & Google Kubernetes Engine',
    description: 'Orchestrate enterprise container workloads with GKE Autopilot and Workload Identity.',
    level: 'Advanced',
    topics: TOPIC_NODES.filter(t => t.stage === 9)
  },
  {
    stage: 10,
    name: 'Stage 10 — DevOps, CI/CD & Terraform',
    description: 'Automate declarative infrastructure and secretless deployments with Workload Identity Federation.',
    level: 'Advanced',
    topics: TOPIC_NODES.filter(t => t.stage === 10)
  },
  {
    stage: 11,
    name: 'Stage 11 — Observability, Logging & SRE',
    description: 'Monitor golden signals, diagnose production errors with Cloud Logging, and configure alerts.',
    level: 'Advanced',
    topics: TOPIC_NODES.filter(t => t.stage === 11)
  },
  {
    stage: 12,
    name: 'Stage 12 — Vertex AI & Generative AI Architecture',
description: 'Build enterprise RAG pipelines with currently supported Gemini models, embeddings, and Vector Search; verify model availability by region before deployment.',
    level: 'Architect',
    topics: TOPIC_NODES.filter(t => t.stage === 12)
  }
];

