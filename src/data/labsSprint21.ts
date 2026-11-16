import { HandsOnLab } from '../types';
import { HANDS_ON_LABS as BASE_LABS } from './labsCorrected';

/*
*/
const readablePubSubConsumer = 'python3 scripts/pubsub_dlq_fail_consumer.py';

export const HANDS_ON_LABS: HandsOnLab[] = BASE_LABS.map(lab => {
  if (lab.id === 'lab-01-iam-least-privilege') {
    return {
      ...lab,
      consoleSteps: [
        'Grant the service account only its workload role.',
        'Grant the developer roles/iam.serviceAccountTokenCreator on the service account.',
        'Verify these are separate bindings: workload permissions belong to the service account; Token Creator belongs to the developer caller.'
      ],
    verificationChecklist: [
      'Developer identity can create and configure the service account.',
      'Service account has only its workload role.',
      'Developer has Token Creator on the service account.',
      'Token checks identify the impersonated principal only; they do not prove a separate workload API call.',
      'No service-account key was created.'
    ],
    verificationSteps: [
        'Create an access token and an identity token with --impersonate-service-account and --include-email.',
        'Decode the identity-token payload locally and confirm the email claim is the service account. This avoids assuming a user-written log entry has protoPayload.authenticationInfo.',
        'Confirm no service-account key exists.'
      ],
      cliSteps: [...lab.cliSteps, 'export IDENTITY_TOKEN=$(gcloud auth print-identity-token --impersonate-service-account="$SA" --audiences="https://example.invalid" --include-email); python3 -c "import base64,json,os; p=os.environ[\"IDENTITY_TOKEN\"].split(\".\")[1]; claims=json.loads(base64.urlsafe_b64decode(p + \"=\" * (-len(p) % 4))); assert claims.get(\"email\") == os.environ[\"SA\"], claims"']
    };
  }
  if (lab.id === 'lab-02-custom-vpc-iap') {
    return {
      ...lab,
      consoleGuide: [
        { navigation: 'VPC network > VPC networks > Create VPC network', action: 'Choose Custom mode and create the VPC.', setting: 'Subnet creation mode', exampleValue: 'Custom', why: 'Custom mode makes subnet regions and ranges explicit.', expectedResult: 'The VPC exists without an automatically generated subnet.' },
        { navigation: 'VPC network > VPC networks > forge-lab-vpc > Subnets', action: 'Create the regional subnet and enable Private Google Access.', setting: 'Region / IP range / Private Google Access', exampleValue: 'us-central1 / 10.20.0.0/24 / On', why: 'Private Google Access lets private resources reach supported Google APIs without external IPs.', expectedResult: 'The subnet is regional and shows Private Google Access enabled.' },
        { navigation: 'VPC network > Firewall', action: 'Create an ingress rule for IAP SSH.', setting: 'Source IPv4 ranges / target tags / TCP port', exampleValue: '35.235.240.0/20 / iap-ssh / 22', why: 'IAP TCP forwarding reaches the VM through the documented IAP source range and target tag.', expectedResult: 'The rule applies only to tagged VMs and TCP 22.', warning: 'Do not use 0.0.0.0/0 for this lab.' },
        { navigation: 'Compute Engine > VM instances > Create instance', action: 'Create the VM with OS Login metadata and no external IP.', setting: 'Network interface / External IPv4 / enable-oslogin', exampleValue: 'forge-lab-subnet / None / TRUE', why: 'The VM stays private; IAP provides the administrative tunnel and OS Login provides SSH identity control.', expectedResult: 'The VM has an internal IP and no external IP.' }
      ],
      consoleSteps: [...lab.consoleSteps, 'Administrator setup: grant the administrator network and instance administration roles. Learner setup: grant only IAP tunnel access and the applicable OS Login role.'],
      cliSteps: [
        ...lab.cliSteps.slice(0, 1),
        'export ADMIN_EMAIL="admin@example.com"; export LEARNER_EMAIL="learner@example.com"',
        'gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="user:${ADMIN_EMAIL}" --role="roles/compute.networkAdmin"',
        'gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="user:${ADMIN_EMAIL}" --role="roles/compute.instanceAdmin.v1"',
        'gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="user:${LEARNER_EMAIL}" --role="roles/iap.tunnelResourceAccessor"',
        'gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="user:${LEARNER_EMAIL}" --role="roles/compute.osLogin"',
        ...lab.cliSteps.slice(1)
      ]
    };
  }
  if (lab.id === 'lab-04-pubsub-dlq') {
    return { ...lab, cliSteps: lab.cliSteps.map(step => step.includes('google.cloud import pubsub_v1') ? readablePubSubConsumer : step) };
  }
  return lab;
});
