import { CommandLineItem } from '../types';

export const COMMAND_LIBRARY: CommandLineItem[] = [
  // AUTHENTICATION & PROJECTS
  {
    id: 'auth-login',
    category: 'Authentication',
    command: 'gcloud auth login',
    description: 'Initiates Google account OAuth2 authentication flow in your web browser.',
    syntax: 'gcloud auth login [--no-launch-browser] [--update-adc]',
    example: 'gcloud auth login --update-adc',
    expectedOutput: 'Your browser has been opened to visit: https://accounts.google.com/o/oauth2/auth...\nYou are now authenticated as: [developer@company.com]',
    prerequisites: 'Google account with cloud console access',
    permissions: 'None required on GCP project'
  },
  {
    id: 'auth-adc',
    category: 'Authentication',
    command: 'gcloud auth application-default login',
    description: 'Generates local Application Default Credentials (ADC) used by client libraries (Node.js, Python, Go) on your machine.',
    syntax: 'gcloud auth application-default login',
    example: 'gcloud auth application-default login',
    expectedOutput: 'Credentials saved to file: [~/.config/gcloud/application_default_credentials.json]',
    prerequisites: 'Active gcloud CLI',
    permissions: 'Local machine only'
  },
  {
    id: 'projects-set',
    category: 'Projects',
    command: 'gcloud config set project <PROJECT_ID>',
    description: 'Sets the default active Google Cloud Project ID for subsequent gcloud commands in the current CLI profile.',
    syntax: 'gcloud config set project <PROJECT_ID>',
    example: 'gcloud config set project forge-production-01',
    expectedOutput: 'Updated property [core/project].',
    prerequisites: 'Project must exist',
    permissions: 'resourcemanager.projects.get'
  },
  {
    id: 'services-enable',
    category: 'Projects',
    command: 'gcloud services enable <API_NAME>',
    description: 'Enables a specific Google Cloud API service for the current project.',
    syntax: 'gcloud services enable SERVICE_NAME [SERVICE_NAME ...]',
    example: 'gcloud services enable run.googleapis.com sqladmin.googleapis.com compute.googleapis.com',
    expectedOutput: 'Operation "operations/acat.p2-482910-..." finished successfully.',
    prerequisites: 'Billing must be enabled on project',
    permissions: 'serviceusage.services.enable'
  },

  // IAM & SECURITY
  {
    id: 'iam-sa-create',
    category: 'IAM',
    command: 'gcloud iam service-accounts create <SA_NAME>',
    description: 'Creates a new machine service account within the active project.',
    syntax: 'gcloud iam service-accounts create NAME [--display-name=DISPLAY_NAME] [--description=DESCRIPTION]',
    example: 'gcloud iam service-accounts create api-runner --display-name="Cloud Run API Runner"',
    expectedOutput: 'Created service account [api-runner].',
    prerequisites: 'Active project',
    permissions: 'iam.serviceAccounts.create'
  },
  {
    id: 'iam-policy-binding',
    category: 'IAM',
    command: 'gcloud projects add-iam-policy-binding <PROJECT_ID> --member=<MEMBER> --role=<ROLE>',
    description: 'Grants an IAM role to a user, group, or service account at project scope.',
    syntax: 'gcloud projects add-iam-policy-binding PROJECT_ID --member=PRINCIPAL --role=ROLE',
    example: 'gcloud projects add-iam-policy-binding my-proj --member="serviceAccount:api-runner@my-proj.iam.gserviceaccount.com" --role="roles/cloudsql.client"',
    expectedOutput: 'Updated IAM policy for project [my-proj].',
    prerequisites: 'Target principal must exist',
    permissions: 'resourcemanager.projects.setIamPolicy'
  },

  // NETWORKING & VPC
  {
    id: 'vpc-create',
    category: 'Networking',
    command: 'gcloud compute networks create <NAME> --subnet-mode=custom',
    description: 'Provisions a custom-mode Virtual Private Cloud network without default auto-subnets.',
    syntax: 'gcloud compute networks create NETWORK_NAME --subnet-mode=custom [--bgp-routing-mode=global]',
    example: 'gcloud compute networks create prod-vpc --subnet-mode=custom --bgp-routing-mode=global',
    expectedOutput: 'Created [https://www.googleapis.com/compute/v1/projects/.../networks/prod-vpc].',
    prerequisites: 'Compute API enabled',
    permissions: 'compute.networks.create'
  },
  {
    id: 'subnet-create',
    category: 'Networking',
    command: 'gcloud compute networks subnets create <NAME> --network=<VPC> --region=<REGION> --range=<CIDR>',
    description: 'Creates a regional subnet with custom RFC 1918 private IPv4 CIDR range.',
    syntax: 'gcloud compute networks subnets create SUBNET --network=VPC --region=REGION --range=CIDR [--enable-private-ip-google-access]',
    example: 'gcloud compute networks subnets create us-app-sub --network=prod-vpc --region=us-central1 --range=10.10.0.0/24 --enable-private-ip-google-access',
    expectedOutput: 'Created [https://www.googleapis.com/compute/v1/projects/.../subnets/us-app-sub].',
    prerequisites: 'VPC must exist',
    permissions: 'compute.subnetworks.create'
  },
  {
    id: 'firewall-create',
    category: 'Networking',
    command: 'gcloud compute firewall-rules create <NAME> --network=<VPC> --allow=<RULES>',
    description: 'Creates a stateful firewall rule to filter ingress or egress network traffic.',
    syntax: 'gcloud compute firewall-rules create NAME --network=VPC --allow=PROTOCOL[:PORT] [--source-ranges=RANGES] [--target-tags=TAGS]',
    example: 'gcloud compute firewall-rules create allow-http --network=prod-vpc --allow=tcp:80,tcp:443 --source-ranges=0.0.0.0/0 --target-tags=web-server',
    expectedOutput: 'Created [https://www.googleapis.com/compute/v1/projects/.../firewall-rules/allow-http].',
    prerequisites: 'VPC network exists',
    permissions: 'compute.firewalls.create'
  },

  // COMPUTE ENGINE
  {
    id: 'compute-create',
    category: 'Compute Engine',
    command: 'gcloud compute instances create <NAME> --machine-type=<TYPE> --zone=<ZONE>',
    description: 'Provisions a new Compute Engine virtual machine instance.',
    syntax: 'gcloud compute instances create INSTANCE_NAME --zone=ZONE --machine-type=TYPE [--image-family=IMAGE_FAMILY] [--network=NETWORK]',
    example: 'gcloud compute instances create app-vm-01 --zone=us-central1-a --machine-type=e2-micro --image-family=debian-12 --image-project=debian-cloud',
    expectedOutput: 'NAME         ZONE           MACHINE_TYPE  PREEMPTIBLE  INTERNAL_IP  EXTERNAL_IP    STATUS\napp-vm-01   us-central1-a  e2-micro                   10.128.0.2   34.120.45.19   RUNNING',
    prerequisites: 'Compute API enabled, active subnet',
    permissions: 'compute.instances.create'
  },
  {
    id: 'compute-ssh',
    category: 'Compute Engine',
    command: 'gcloud compute ssh <NAME> --zone=<ZONE> [--tunnel-through-iap]',
    description: 'Initiates a secure SSH session into a VM instance, optionally tunneled through Cloud Identity-Aware Proxy.',
    syntax: 'gcloud compute ssh INSTANCE_NAME --zone=ZONE [--tunnel-through-iap]',
    example: 'gcloud compute ssh app-vm-01 --zone=us-central1-a --tunnel-through-iap',
    expectedOutput: 'Linux app-vm-01 6.1.0-18-cloud-amd64 ...\nuser@app-vm-01:~$',
    prerequisites: 'OS Login or metadata SSH keys configured',
    permissions: 'compute.instances.setMetadata or iap.tunnelInstances.accessViaIAP'
  },
  {
    id: 'compute-delete',
    category: 'Compute Engine',
    command: 'gcloud compute instances delete <NAME> --zone=<ZONE> --quiet',
    description: 'Permanently deletes a Compute Engine virtual machine instance and attached boot disk.',
    syntax: 'gcloud compute instances delete INSTANCE_NAME --zone=ZONE [--quiet]',
    example: 'gcloud compute instances delete app-vm-01 --zone=us-central1-a --quiet',
    expectedOutput: 'Deleted [https://www.googleapis.com/compute/v1/projects/.../instances/app-vm-01].',
    isDestructive: true,
    warning: 'Destructive operation: terminates VM and permanently purges local boot disk data.',
    prerequisites: 'VM exists',
    permissions: 'compute.instances.delete'
  },

  // CLOUD STORAGE
  {
    id: 'storage-create',
    category: 'Cloud Storage',
    command: 'gcloud storage buckets create gs://<BUCKET_NAME> --location=<LOCATION>',
    description: 'Creates a new Cloud Storage bucket with specified geographic location and access controls.',
    syntax: 'gcloud storage buckets create gs://BUCKET_NAME --location=LOCATION [--uniform-bucket-level-access]',
    example: 'gcloud storage buckets create gs://company-prod-media-2026 --location=us-central1 --uniform-bucket-level-access',
    expectedOutput: 'Creating gs://company-prod-media-2026/...\nCreated gs://company-prod-media-2026/',
    prerequisites: 'Storage API enabled, globally unique bucket name',
    permissions: 'storage.buckets.create'
  },
  {
    id: 'storage-cp',
    category: 'Cloud Storage',
    command: 'gcloud storage cp <SRC> <DEST>',
    description: 'Copies local files to a Cloud Storage bucket or between buckets with high-throughput parallel streams.',
    syntax: 'gcloud storage cp SOURCE gs://BUCKET/PATH [--recursive]',
    example: 'gcloud storage cp -r ./dist/* gs://company-frontend-bucket/assets/',
    expectedOutput: 'Copying file://... to gs://...\nAverage throughput: 65.4MiB/s',
    prerequisites: 'Source files exist, write permission on destination bucket',
    permissions: 'storage.objects.create'
  },

  // CLOUD RUN
  {
    id: 'run-deploy',
    category: 'Cloud Run',
    command: 'gcloud run deploy <SERVICE_NAME> --image=<IMAGE_URI> --region=<REGION>',
    description: 'Deploys or updates an autoscaling container service on Cloud Run.',
    syntax: 'gcloud run deploy SERVICE --image=IMAGE --region=REGION [--allow-unauthenticated] [--port=PORT] [--set-env-vars=VARS]',
    example: 'gcloud run deploy api-service --image=us-docker.pkg.dev/my-proj/repo/api:v1.0.0 --region=us-central1 --allow-unauthenticated --port=8080 --memory=512Mi',
    expectedOutput: 'Deploying container to Cloud Run service [api-service] in us-central1...\nService URL: https://api-service-abc12-uc.a.run.app',
    prerequisites: 'Container image pushed to Artifact Registry',
    permissions: 'run.services.create, iam.serviceAccounts.actAs'
  },
  {
    id: 'run-traffic',
    category: 'Cloud Run',
    command: 'gcloud run services update-traffic <SERVICE_NAME> --to-revisions=<REVISION_SPLIT>',
    description: 'Adjusts traffic percentages across active immutable revisions for canary testing or rollback.',
    syntax: 'gcloud run services update-traffic SERVICE --region=REGION --to-revisions=REVISION=PERCENT,...',
    example: 'gcloud run services update-traffic api-service --region=us-central1 --to-revisions=api-service-00002=20,api-service-00001=80',
    expectedOutput: 'Updated traffic for service [api-service].',
    prerequisites: 'Multiple active service revisions',
    permissions: 'run.services.update'
  },

  // ARTIFACT REGISTRY
  {
    id: 'artifacts-create',
    category: 'Artifact Registry',
    command: 'gcloud artifacts repositories create <NAME> --repository-format=docker --location=<REGION>',
    description: 'Creates a modern OCI container and package repository in Artifact Registry.',
    syntax: 'gcloud artifacts repositories create REPO --repository-format=docker --location=LOCATION',
    example: 'gcloud artifacts repositories create app-containers --repository-format=docker --location=us-central1 --description="App images"',
    expectedOutput: 'Created repository [app-containers].',
    prerequisites: 'Artifact Registry API enabled',
    permissions: 'artifactregistry.repositories.create'
  },

  // GKE & KUBECTL
  {
    id: 'gke-get-credentials',
    category: 'GKE',
    command: 'gcloud container clusters get-credentials <CLUSTER> --region=<REGION>',
    description: 'Fetches cluster endpoint and CA certificate, configuring local `~/.kube/config` for kubectl access.',
    syntax: 'gcloud container clusters get-credentials CLUSTER_NAME --region=REGION',
    example: 'gcloud container clusters get-credentials prod-autopilot --region=us-central1',
    expectedOutput: 'Fetching cluster endpoint and auth data.\nkubeconfig entry generated for prod-autopilot.',
    prerequisites: 'GKE cluster active, kubectl installed',
    permissions: 'container.clusters.get'
  },

  // LOGGING & MONITORING
  {
    id: 'logging-read',
    category: 'Observability',
    command: 'gcloud logging read <FILTER_EXPRESSION> --limit=<NUM>',
    description: 'Queries ingested structured logs from Cloud Logging matching specified criteria.',
    syntax: 'gcloud logging read "FILTER" [--limit=N] [--format=FORMAT]',
    example: 'gcloud logging read "resource.type=cloud_run_revision AND severity>=WARNING" --limit=20 --format="json"',
    expectedOutput: '[\n  {\n    "insertId": "12345",\n    "severity": "WARNING",\n    "textPayload": "High memory consumption"\n  }\n]',
    prerequisites: 'Logging API enabled',
    permissions: 'logging.logEntries.list'
  }
];

