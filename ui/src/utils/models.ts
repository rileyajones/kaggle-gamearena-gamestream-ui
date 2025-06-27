import { staticFilePath } from "./backend";

const MODEL_ICONS = {
  CLAUDE: staticFilePath('claude.png'),
  GEMINI: '',
  GPT: '',
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
  if (name.startsWith('gpt')) {
    return MODEL_ICONS['GPT'];
  }
  return;
}
