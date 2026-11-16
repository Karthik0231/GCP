import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const projects = read('src/data/projects.ts');
const labs = read('src/data/labsSprint21.ts');
const consumer = read('scripts/pubsub_dlq_fail_consumer.py');

assert.doesNotMatch(projects, /P@ssword\d+|AIza[\w-]{20,}|BEGIN .*PRIVATE KEY/);
assert.doesNotMatch(projects, /vertexai\.(generative_models|language_models)/);
assert.match(labs, /cleanupSteps/);
assert.match(labs, /needs-review/);
assert.match(consumer, /message\.nack\(\)/);
assert.match(consumer, /future\.result\(timeout=5\)/);
assert.match(consumer, /signal\.SIGTERM/);
console.log('content validation smoke tests passed');
