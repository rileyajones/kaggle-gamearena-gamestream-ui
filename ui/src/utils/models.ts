import { staticFilePath } from "./backend";

enum Models {
  CLAUDE = 'CLAUDE',
  DEEPSEEK = 'DEEPSEEK',
  GEMINI = 'GEMINI',
  GROK = 'GROK',
  KIMI = 'KIMI',
  LLAMA = 'LLAMA',
  OPENAI = 'OPENAI',
  QWEN = 'QWEN',
}

const MODEL_ICONS: Record<Models, string> = {
  CLAUDE: staticFilePath('Claude.svg'),
  DEEPSEEK: staticFilePath('Deepseek.svg'),
  GEMINI: staticFilePath('Gemini.svg'),
  GROK: staticFilePath('Grok.svg'),
  KIMI: staticFilePath('Kimi.svg'),
  LLAMA: staticFilePath('llama.png'),
  OPENAI: staticFilePath('OpenAI.svg'),
  QWEN: staticFilePath('Qwen.svg'),
}

const EDGE_ICONS: Record<Models, string> = {
  CLAUDE: staticFilePath('Claude-Edge.svg'),
  DEEPSEEK: staticFilePath('Deepseek-Edge.svg'),
  GEMINI: staticFilePath('Gemini-Edge.svg'),
  GROK: staticFilePath('Grok-Edge.svg'),
  KIMI: staticFilePath('Kimi-Edge.svg'),
  LLAMA: staticFilePath('llama.png'),
  OPENAI: staticFilePath('OpenAI-Edge.svg'),
  QWEN: staticFilePath('Qwen-Edge.svg'),
}

export function estimateIcon(modelName: string, edge = false): string|undefined {
  const name = modelName.toLowerCase();
  const map = edge ? EDGE_ICONS : MODEL_ICONS;
  if (name.startsWith('claude')) {
    return map[Models.CLAUDE];
  }
  if (name.startsWith('deepseek')) {
    return map[Models.DEEPSEEK];
  }
  if (name.startsWith('gemini')) {
    return map[Models.GEMINI];
  }
  if (name.startsWith('grok')) {
    return map[Models.GROK];
  }
  if (name.startsWith('kimi')) {
    return map[Models.KIMI];
  }
  if (name.startsWith('llama')) {
    return map[Models.LLAMA];
  }
  if (name.startsWith('gpt') || name.startsWith('openai') || name.startsWith('o3')) {
    return map[Models.OPENAI];
  }
  if (name.startsWith('qwen')) {
    return map[Models.QWEN];
  }
  return;
}

export function formatModelName(modelName: string) {
  return modelName.replaceAll(/openai\s?/ig, '');
}
