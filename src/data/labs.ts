import { HandsOnLab } from '../types';

const LEGACY_HANDS_ON_LABS: HandsOnLab[] = [
  {
    id: 'lab-01-iam-least-privilege',
    title: 'Lab 01: Enforcing IAM Least Privilege for Backend Microservices',
    category: 'IAM & Security',
    difficulty: 'Beginner',
    estimatedTime: '25 min',
    estimatedCost: '$0.00 (Free Tier)',
    freeTier: true,
    billingRequired: false,
    requiredPermissions: ['roles/iam.serviceAccountAdmin', 'roles/resourcemanager.projectIamAdmin', 'roles/iam.serviceAccountTokenCreator'],
    billingCaveats: ['IAM policy changes do not create billable resources. A separate Datastore or application workload can create charges.'],
    setupSteps: ['Set an active project and authenticate with an identity allowed to create service accounts and modify project IAM.'],
    verificationSteps: ['Use service-account impersonation to print an access token, then confirm the workload identity and granted roles.'],
    troubleshootingSteps: ['If impersonation fails, grant roles/iam.serviceAccountTokenCreator to the calling principal on the service account.'],
    verificationStatus: 'needs-review',
    objective: 'Create a dedicated service account, assign fine-grained predefined roles, inspect IAM policy bindings, and test service account impersonation.',
    prerequisites: ['gcp-fundamentals'],
    requiredApis: ['iam.googleapis.com'],
    consoleSteps: [
      'Navigate to IAM & Admin > Service Accounts > Create Service Account.',
      'Name the service account "order-processor-sa" and click Create and Continue.',
      'Assign the role "Cloud Datastore User" (roles/datastore.user) and "Logging - Logs Writer" (roles/logging.logWriter).',
      'Click Done. Open the IAM tab and verify the new service account bindings appear in the project policy table.'
    ],
    cliSteps: [
      'gcloud iam service-accounts create order-processor-sa --display-name="Order Processor SA"',
      'gcloud projects add-iam-policy-binding $(gcloud config get-value project) --member="serviceAccount:order-processor-sa@$(gcloud config get-value project).iam.gserviceaccount.com" --role="roles/datastore.user"',
      'gcloud projects add-iam-policy-binding $(gcloud config get-value project) --member="serviceAccount:order-processor-sa@$(gcloud config get-value project).iam.gserviceaccount.com" --role="roles/logging.logWriter"',
      'gcloud projects get-iam-policy $(gcloud config get-value project) --flatten="bindings[].members" --format="table(bindings.role)" --filter="bindings.members:order-processor-sa"'
    ],
    verificationChecklist: [
      'Service account order-processor-sa exists in IAM Service Accounts list.',
      'Roles assigned include roles/datastore.user and roles/logging.logWriter.',
      'No broad basic roles (roles/editor or roles/owner) were assigned.',
      'No JSON private keys were downloaded to local disk.'
    ],
    cleanupSteps: [
      'gcloud iam service-accounts delete order-processor-sa@$(gcloud config get-value project).iam.gserviceaccount.com --quiet'
    ]
  },
  {
    id: 'lab-02-custom-vpc-iap',
    title: 'Lab 02: Deploying a Private VM with Zero-Trust IAP Tunneling',
    category: 'Networking',
    difficulty: 'Intermediate',
    estimatedTime: '35 min',
    estimatedCost: 'Billing required; VM, boot disk, and network charges are possible.',
    freeTier: false,
    billingRequired: true,
    requiredPermissions: ['roles/compute.networkAdmin', 'roles/compute.instanceAdmin.v1', 'roles/iap.tunnelResourceAccessor', 'roles/iam.serviceAccountUser'],
    possibleCharges: ['Compute Engine VM runtime', 'Persistent boot disk storage', 'Network egress'],
    billingCaveats: ['Free-tier eligibility depends on account, region, machine type, and usage. Budget alerts do not cap spend.'],
    setupSteps: ['Confirm billing account, quota, and IAP access before creating resources.'],
    verificationSteps: ['Check the VM internal and external IP fields, then connect with gcloud compute ssh --tunnel-through-iap.'],
    troubleshootingSteps: ['If SSH fails, verify the IAP source range, target tag, OS Login permissions, and roles/iap.tunnelResourceAccessor.'],
    verificationStatus: 'needs-review',
    objective: 'Construct a Custom-mode VPC, regional private subnet, configure Identity-Aware Proxy firewall rules, and SSH into a private VM without assigning an external public IP.',
    prerequisites: ['vpc-networking', 'iam-foundations'],
    requiredApis: ['compute.googleapis.com', 'iap.googleapis.com'],
    consoleSteps: [
      'Open VPC network > VPC networks > Create VPC network with Custom subnet mode.',
      'Add regional subnet "private-us-central" in region us-central1 with IP range 10.20.0.0/24 and Private Google Access enabled.',
      'Create firewall rule "allow-iap-ingress" with source range 35.235.240.0/20, TCP port 22, and target tag "iap-ssh".',
      'Deploy Compute Engine VM instance "secure-app-vm" with machine type e2-micro, attached to private-us-central subnet, with External IP set to "None".',
      'Click the SSH button to verify browser terminal connects via IAP proxy.'
    ],
    cliSteps: [
      'gcloud compute networks create lab-vpc --subnet-mode=custom',
      'gcloud compute networks subnets create lab-subnet --network=lab-vpc --region=us-central1 --range=10.20.0.0/24 --enable-private-ip-google-access',
      'gcloud compute firewall-rules create allow-iap-ssh --network=lab-vpc --allow=tcp:22 --source-ranges=35.235.240.0/20 --target-tags=iap-ssh',
      'gcloud compute instances create secure-app-vm --zone=us-central1-a --machine-type=e2-micro --network=lab-vpc --subnet=lab-subnet --no-address --tags=iap-ssh',
      'gcloud compute ssh secure-app-vm --zone=us-central1-a --tunnel-through-iap'
    ],
    verificationChecklist: [
      'Instance secure-app-vm has an internal IP (10.20.0.x) and external IP shows "None".',
      'SSH session successfully opens via IAP tunnel.',
      'Firewall rule source IP matches Google Cloud IAP IP range 35.235.240.0/20.',
      'Private Google Access is enabled on the subnet.'
    ],
    cleanupSteps: [
      'gcloud compute instances delete secure-app-vm --zone=us-central1-a --quiet',
      'gcloud compute firewall-rules delete allow-iap-ssh --quiet',
      'gcloud compute networks subnets delete lab-subnet --region=us-central1 --quiet',
      'gcloud compute networks delete lab-vpc --quiet'
    ]
  },
  {
    id: 'lab-03-cloud-run-traffic-splitting',
    title: 'Lab 03: Cloud Run Autoscaling & Canary Traffic Splitting',
    category: 'Serverless & Containers',
    difficulty: 'Intermediate',
    estimatedTime: '30 min',
    estimatedCost: 'Variable; Cloud Run, Artifact Registry, and network usage can incur charges.',
    freeTier: false,
    billingRequired: true,
    possibleCharges: ['Cloud Run requests and compute', 'Artifact Registry storage and network egress'],
    billingCaveats: ['Free-tier quotas are not guaranteed. Traffic splitting does not make the service free. Budget alerts do not prevent charges.'],
    setupSteps: ['Enable run.googleapis.com, artifactregistry.googleapis.com, and cloudbuild.googleapis.com. Record the service region and project.'],
    verificationSteps: ['Capture the revision name from gcloud run revisions list, assign explicit 90/10 traffic with --to-revisions, then inspect gcloud run services describe.'],
    troubleshootingSteps: ['Use explicit revision names. Traffic changes converge over time; verify the service status and traffic block after propagation.'],
    verificationStatus: 'needs-review',
    objective: 'Deploy a containerized API to Cloud Run, trigger an automated revision update, and split live production traffic between revisions for zero-downtime deployment.',
    prerequisites: ['cloud-run'],
    requiredApis: ['run.googleapis.com'],
    consoleSteps: [
      'Open Cloud Run and click Create Service.',
      'Select container image "us-docker.pkg.dev/cloudrun/container/hello".',
      'Set Service name to "canary-api", region "us-central1", and allow unauthenticated invocations.',
      'Deploy Revision 1, then click "Edit & Deploy New Revision" to add an environment variable `VERSION=2.0`.',
      'Click "Manage Traffic", set Revision 1 to 90% and Revision 2 to 10%, and save.'
    ],
    cliSteps: [
      'gcloud run deploy canary-api --image=us-docker.pkg.dev/cloudrun/container/hello --region=us-central1 --allow-unauthenticated --set-env-vars="VERSION=1.0"',
      'gcloud run deploy canary-api --image=us-docker.pkg.dev/cloudrun/container/hello --region=us-central1 --set-env-vars="VERSION=2.0"',
      'REV1=$(gcloud run revisions list --service=canary-api --region=us-central1 --format="value(name)" | tail -n 1)',
      'REV2=$(gcloud run revisions list --service=canary-api --region=us-central1 --format="value(name)" | head -n 1)',
      'gcloud run services update-traffic canary-api --region=us-central1 --to-revisions=$REV1=90,$REV2=10'
    ],
    verificationChecklist: [
      'Cloud Run service responds with HTTP 200 on generated service URL.',
      'Two distinct revisions exist under the Revisions tab.',
      'Traffic split displays 90% to Revision 1 and 10% to Revision 2.',
      'Sending 10 concurrent curls reveals responses distributed across both revisions.'
    ],
    cleanupSteps: [
      'gcloud run services delete canary-api --region=us-central1 --quiet'
    ]
  },
  {
    id: 'lab-04-pubsub-event-pipeline',
    title: 'Lab 04: Asynchronous Messaging with Cloud Pub/Sub & Dead-Letter Topics',
    category: 'Architecture',
    difficulty: 'Advanced',
    estimatedTime: '35 min',
    estimatedCost: '$0.00 (within Pub/Sub free tier)',
    freeTier: true,
    objective: 'Provision a high-throughput Cloud Pub/Sub topic, create a push subscription with Dead-Letter Topic (DLQ) retry policies, and verify fault-tolerant message handling.',
    prerequisites: ['cloud-run', 'iam-foundations'],
    requiredApis: ['pubsub.googleapis.com'],
    consoleSteps: [
      'Navigate to Pub/Sub > Topics and click Create Topic.',
      'Create topic "order-events-dlq" for unprocessable messages.',
      'Create main topic "order-events" and add a subscription "order-processor-sub".',
      'In subscription settings, check "Dead lettering" and select "order-events-dlq" with maximum delivery attempts set to 5.'
    ],
    cliSteps: [
      'gcloud pubsub topics create order-events-dlq',
      'gcloud pubsub subscriptions create order-events-dlq-sub --topic=order-events-dlq',
      'gcloud pubsub topics create order-events',
      'gcloud pubsub subscriptions create order-processor-sub --topic=order-events --dead-letter-topic=order-events-dlq --max-delivery-attempts=5 --ack-deadline=30',
      'gcloud pubsub topics publish order-events --message=\'{"orderId": "1001", "amount": 49.99}\''
    ],
    verificationChecklist: [
      'Topics order-events and order-events-dlq are active.',
      'Subscription has dead-letter policy configured with max 5 attempts.',
      'Published test message successfully delivered and acknowledged.'
    ],
    cleanupSteps: [
      'gcloud pubsub subscriptions delete order-processor-sub --quiet',
      'gcloud pubsub subscriptions delete order-events-dlq-sub --quiet',
      'gcloud pubsub topics delete order-events --quiet',
      'gcloud pubsub topics delete order-events-dlq --quiet'
    ]
  }
];

// Keep old import path stable while corrected lab records remain the single source of truth.
export { HANDS_ON_LABS } from './labsSprint21';
export { LEGACY_HANDS_ON_LABS };

