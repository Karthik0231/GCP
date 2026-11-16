import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const projects = read('src/data/projects.ts');
const labs = read('src/data/labsSprint21.ts');
const consumer = read('scripts/pubsub_dlq_fail_consumer.py');
const curriculum = read('src/data/curriculum.ts');
const commands = read('src/data/commands.ts');
const validation = read('src/data/contentValidation.ts');
const store = read('src/store/useLearningStore.ts');
const labsView = read('src/components/labs/LabsView.tsx');
const topicReader = read('src/components/learning/TopicReaderModal.tsx');

const count = (value, pattern) => (value.match(pattern) || []).length;

assert.doesNotMatch(projects, /P@ssword\d+|AIza[\w-]{20,}|BEGIN .*PRIVATE KEY/);
assert.doesNotMatch(projects, /vertexai\.(generative_models|language_models)/);
assert.doesNotMatch(curriculum, /vertexai\.(generative_models|language_models)|vertexai\.preview/);
assert.doesNotMatch(projects, /(?:password|api[_-]?key|secret)\s*[:=]\s*['"][^'"<$]+['"]/i);

const topicCount = count(curriculum, /^\s*id:\s*['"][^'"]+['"]/gm);
assert.ok(topicCount > 0, 'curriculum has no topic IDs');
assert.equal(count(curriculum, /^\s*title:\s*['"][^'"]+['"]/gm), topicCount, 'topic title count does not match topic ID count');
assert.match(curriculum, /sourceReferences|lastVerifiedAt|verificationStatus/);
assert.match(curriculum, /https:\/\//);
assert.match(validation, /invalid prerequisite|circular prerequisite|related topic|validateSources|containsLegacyVertexSdk/);

const commandCount = count(commands, /^\s*id:\s*['"][^'"]+['"]/gm);
assert.ok(commandCount > 0, 'command library is empty');
assert.equal(count(commands, /^\s*command:\s*['"][^'"]+['"]/gm), commandCount, 'command syntax entries do not match command IDs');
assert.equal(count(commands, /^\s*description:\s*['"][^'"]+['"]/gm), commandCount, 'command descriptions do not match command IDs');
assert.match(commands, /expectedOutput/);

assert.match(labs, /cleanupSteps/);
assert.match(labs, /verificationChecklist/);
assert.equal(count(labs, /verificationStatus:\s*['"]needs-review['"]/g), 4, 'all four labs must remain needs-review until cloud execution');
assert.ok(count(labs, /cleanupSteps:/g) >= 4, 'each lab needs cleanup instructions');
assert.doesNotMatch(labs, /^\s*(?:export\s+)?const\s+correctedPubSubConsumer/m);

assert.match(consumer, /message\.nack\(\)/);
assert.match(consumer, /future\.result\(timeout=5\)/);
assert.match(consumer, /signal\.SIGTERM/);
assert.match(consumer, /subscriber\.close\(\)/);
assert.match(store, /version:\s*2/);
assert.match(store, /labProgress/);
assert.match(store, /topicProgress/);
assert.match(store, /resetLabProgress/);
assert.match(store, /resetTopicProgress/);
assert.doesNotMatch(labsView, /checkedVerifications|toggleVerification\b/);
assert.match(labsView, /completedVerificationItems/);
assert.match(topicReader, /setTopicProgress/);
assert.match(topicReader, /type="checkbox"/);
console.log('content validation smoke tests passed');
