import { COMMAND_LIBRARY } from './commands';
import { HANDS_ON_LABS } from './labsSprint21';
import { REAL_WORLD_PROJECTS } from './projects';
import { TOPIC_NODES } from './curriculum';

export interface ContentValidationResult {
  errors: string[];
  warnings: string[];
}

const containsSecret = (value: string) => /(AIza[0-9A-Za-z_-]{20,}|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----|password\s*[:=]\s*['\"][^'\"]+|api[_-]?key\s*[:=]\s*['\"][^'\"]+)/i.test(value);
const containsLegacyVertexSdk = (value: string) => /vertexai\.(generative_models|language_models)|vertexai\.preview/i.test(value);
const isHttpUrl = (value: string) => /^https:\/\//.test(value);
const validateSources = (owner: string, sources: string[] | undefined, errors: string[]) => {
  sources?.forEach(source => {
    if (!isHttpUrl(source)) errors.push(`${owner}: source reference must use HTTPS (${source})`);
  });
};

const stringsIn = (value: unknown): string[] => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(stringsIn);
  if (value && typeof value === 'object') return Object.values(value).flatMap(stringsIn);
  return [];
};

const duplicateIds = (ids: string[], label: string, errors: string[]) => {
  const seen = new Set<string>();
  ids.forEach(id => {
    if (seen.has(id)) errors.push(`${label}: duplicate id "${id}"`);
    seen.add(id);
  });
};

const hasCycle = (graph: Map<string, string[]>, start: string, visiting: Set<string>, visited: Set<string>): boolean => {
  if (visiting.has(start)) return true;
  if (visited.has(start)) return false;
  visiting.add(start);
  for (const dependency of graph.get(start) || []) {
    if (hasCycle(graph, dependency, visiting, visited)) return true;
  }
  visiting.delete(start);
  visited.add(start);
  return false;
};

export const validateContent = (): ContentValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const topicIds = new Set(TOPIC_NODES.map(topic => topic.id));
  const topicGraph = new Map(TOPIC_NODES.map(topic => [topic.id, topic.prerequisites]));

  duplicateIds(TOPIC_NODES.map(topic => topic.id), 'topic', errors);
  duplicateIds(HANDS_ON_LABS.map(lab => lab.id), 'lab', errors);
  duplicateIds(REAL_WORLD_PROJECTS.map(project => project.id), 'project', errors);
  duplicateIds(COMMAND_LIBRARY.map(command => command.id), 'command', errors);

  TOPIC_NODES.forEach(topic => {
    if (!topic.title.trim()) errors.push(`topic ${topic.id}: missing title`);
    if (!topic.simpleExplanation.trim()) errors.push(`topic ${topic.id}: empty core explanation`);
    topic.prerequisites.forEach(id => {
      if (!topicIds.has(id)) errors.push(`topic ${topic.id}: invalid prerequisite "${id}"`);
    });
    topic.relatedTopics.forEach(id => {
      if (!topicIds.has(id)) errors.push(`topic ${topic.id}: invalid related topic "${id}"`);
    });
    if (topic.verificationStatus === 'verified' && (!topic.sourceReferences?.length || !topic.lastVerifiedAt)) {
      errors.push(`topic ${topic.id}: verified content needs sourceReferences and lastVerifiedAt`);
    }
    if (!isHttpUrl(topic.docUrl)) errors.push(`topic ${topic.id}: documentation URL must use HTTPS`);
    validateSources(`topic ${topic.id}`, topic.sourceReferences, errors);
    if (!topic.consoleSteps.length || !topic.cliCommands.length || !topic.labTask.tasks.length) warnings.push(`topic ${topic.id}: practical implementation coverage is incomplete`);
    if (topic.verificationStatus === 'verified' && (!topic.learningObjectives?.length || !topic.troubleshooting?.length)) {
      errors.push(`topic ${topic.id}: verified content needs learningObjectives and troubleshooting`);
    }
    if (stringsIn(topic).some(containsSecret)) errors.push(`topic ${topic.id}: possible hardcoded secret`);
    if (stringsIn(topic).some(containsLegacyVertexSdk)) warnings.push(`topic ${topic.id}: legacy Vertex AI SDK reference needs migration review`);
  });

  TOPIC_NODES.forEach(topic => {
    if (hasCycle(topicGraph, topic.id, new Set(), new Set())) errors.push(`topic ${topic.id}: circular prerequisite dependency`);
  });

  HANDS_ON_LABS.forEach(lab => {
    if (!lab.title.trim()) errors.push(`lab ${lab.id}: missing title`);
    if (!lab.objective.trim()) errors.push(`lab ${lab.id}: missing objective`);
    lab.prerequisites.forEach(id => {
      if (!topicIds.has(id)) errors.push(`lab ${lab.id}: invalid prerequisite "${id}"`);
    });
    if (!lab.consoleSteps.length && !lab.cliSteps.length) errors.push(`lab ${lab.id}: missing implementation steps`);
    if (!lab.prerequisites.length) warnings.push(`lab ${lab.id}: no prerequisites listed`);
    if (!lab.cleanupSteps.length) errors.push(`lab ${lab.id}: missing cleanup steps`);
    if (lab.verificationStatus === 'verified' && !lab.sourceReferences?.length) {
      errors.push(`lab ${lab.id}: verified content needs sourceReferences`);
    }
    validateSources(`lab ${lab.id}`, lab.sourceReferences, errors);
    if (lab.billingRequired && !lab.billingCaveats?.length) errors.push(`lab ${lab.id}: billable lab needs billing caveats`);
    if (lab.billingRequired && (!lab.verificationSteps?.length || !lab.troubleshootingSteps?.length)) errors.push(`lab ${lab.id}: billable lab needs verification and troubleshooting steps`);
    if (lab.verificationSteps?.length && lab.verificationSteps.every(step => step.trim().length < 20)) warnings.push(`lab ${lab.id}: verification steps may not demonstrate the objective`);
    if (lab.verificationStatus === 'verified' && (!lab.verificationSteps?.length || lab.verificationSteps.every(step => step.trim().length < 20))) errors.push(`lab ${lab.id}: verified lab needs meaningful verification steps`);
    if (stringsIn(lab).some(containsSecret)) errors.push(`lab ${lab.id}: possible hardcoded secret`);
  });

  COMMAND_LIBRARY.forEach(command => {
    if (!command.command.trim()) errors.push(`command ${command.id}: empty command`);
    if (!command.description.trim()) errors.push(`command ${command.id}: missing description`);
    if (!command.syntax.trim()) errors.push(`command ${command.id}: empty syntax`);
    if (stringsIn(command).some(containsSecret)) errors.push(`command ${command.id}: possible hardcoded secret`);
    validateSources(`command ${command.id}`, command.sourceReferences, errors);
    if (command.example.trim() && !command.example.includes(command.command.split(' ')[0])) warnings.push(`command ${command.id}: example may not match command family`);
    if (command.verificationStatus === 'verified' && (!command.commonErrors?.length || !command.troubleshooting?.length)) {
      errors.push(`command ${command.id}: verified command needs commonErrors and troubleshooting`);
    }
  });

  REAL_WORLD_PROJECTS.forEach(project => {
    if (!project.title.trim()) errors.push(`project ${project.id}: missing title`);
    if (!project.cleanupCommand.trim()) errors.push(`project ${project.id}: missing cleanup command`);
    if (project.verificationStatus === 'verified' && !project.sourceReferences?.length) errors.push(`project ${project.id}: verified project needs sourceReferences`);
    validateSources(`project ${project.id}`, project.sourceReferences, errors);
    if (/free|\$0\.00|guaranteed/i.test(project.costEstimation)) warnings.push(`project ${project.id}: cost estimate needs explicit assumptions and caveats`);
    if (stringsIn(project).some(containsSecret)) errors.push(`project ${project.id}: possible hardcoded secret`);
  });

  return { errors, warnings };
};

export const assertValidContent = (): void => {
  const result = validateContent();
  if (result.errors.length) throw new Error(`Content validation failed:\n${result.errors.join('\n')}`);
};
