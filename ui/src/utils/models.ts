import { staticFilePath } from "./backend";

const MODEL_ICONS = {
  CLAUDE: staticFilePath('claude.png'),
  GEMINI: staticFilePath('gemini.png'),
  GPT: 'https://storage.googleapis.com/kaggle-avatars/thumbnails/27991204-kg.png?t=2025-07-22-21-20-41',
  LLAMA: staticFilePath('llama.png'),
}

export function estimateIcon(modelName: string): string|undefined {
  const name = modelName.toLowerCase();
  if (name.startsWith('claude')) {
    return MODEL_ICONS['CLAUDE'];
  }
  if (name.startsWith('llama')) {
    return MODEL_ICONS['LLAMA'];
  }
  if (name.startsWith('gemini')) {
    return MODEL_ICONS['GEMINI'];
  }
  if (name.startsWith('gpt') || name.startsWith('openai')) {
    return MODEL_ICONS['GPT'];
  }
  return;
}
