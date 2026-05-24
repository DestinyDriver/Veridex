// All pricing data verified as of 2026-05-26

export const AI_TOOLS = {
  cursor: {
    name: "Cursor",
    vendor: "Anysphere",
    mono: "Cu",
    tint: "#d8d8d8",
    category: "coding",
    plans: {
      hobby: { name: "Hobby", price: 0, label: "Free" },
      pro: { name: "Pro", price: 20, label: "$20/user/mo" },
      business: { name: "Business", price: 40, label: "$40/user/mo" },
      enterprise: { name: "Enterprise", price: 40, label: "$40/user/mo (custom)" },
    },
  },
  github_copilot: {
    name: "GitHub Copilot",
    vendor: "GitHub",
    mono: "GC",
    tint: "#bfbfbf",
    category: "coding",
    plans: {
      individual: { name: "Individual", price: 10, label: "$10/user/mo" },
      business: { name: "Business", price: 19, label: "$19/user/mo" },
      enterprise: { name: "Enterprise", price: 39, label: "$39/user/mo" },
    },
  },
  claude: {
    name: "Claude",
    vendor: "Anthropic",
    mono: "Cl",
    tint: "#c97b4e",
    category: "general",
    plans: {
      free: { name: "Free", price: 0, label: "Free" },
      pro: { name: "Pro", price: 20, label: "$20/user/mo" },
      max: { name: "Max", price: 100, label: "$100/user/mo" },
      team: { name: "Team", price: 30, label: "$30/user/mo" },
      enterprise: { name: "Enterprise", price: 30, label: "$30/user/mo (custom)" },
      api: { name: "API Direct", price: null, label: "Usage-based" },
    },
  },
  chatgpt: {
    name: "ChatGPT",
    vendor: "OpenAI",
    mono: "OA",
    tint: "#10a37f",
    category: "general",
    plans: {
      plus: { name: "Plus", price: 20, label: "$20/user/mo" },
      team: { name: "Team", price: 30, label: "$30/user/mo" },
      enterprise: { name: "Enterprise", price: 0, label: "Custom pricing" },
      api: { name: "API Direct", price: null, label: "Usage-based" },
    },
  },
  anthropic_api: {
    name: "Anthropic API",
    vendor: "Anthropic",
    mono: "An",
    tint: "#c97b4e",
    category: "api",
    plans: {
      payg: { name: "Pay-as-you-go", price: null, label: "Usage-based" },
    },
  },
  openai_api: {
    name: "OpenAI API",
    vendor: "OpenAI",
    mono: "OA",
    tint: "#10a37f",
    category: "api",
    plans: {
      payg: { name: "Pay-as-you-go", price: null, label: "Usage-based" },
    },
  },
  gemini: {
    name: "Gemini",
    vendor: "Google",
    mono: "G",
    tint: "#5a8ef6",
    category: "general",
    plans: {
      pro: { name: "Pro (Google One AI Premium)", price: 20, label: "$20/user/mo" },
      ultra: { name: "Ultra / Advanced", price: 250, label: "$250/user/mo" },
      api: { name: "API (Vertex AI)", price: null, label: "Usage-based" },
    },
  },
  windsurf: {
    name: "Windsurf",
    vendor: "Codeium",
    mono: "Ws",
    tint: "#4ac9f0",
    category: "coding",
    plans: {
      free: { name: "Free", price: 0, label: "Free" },
      pro: { name: "Pro", price: 15, label: "$15/user/mo" },
      team: { name: "Team", price: 35, label: "$35/user/mo" },
    },
  },
  perplexity: {
    name: "Perplexity",
    vendor: "Perplexity",
    mono: "P",
    tint: "#22b8b8",
    category: "general",
    plans: {
      free: { name: "Free", price: 0, label: "Free" },
      pro: { name: "Pro", price: 20, label: "$20/user/mo" },
      enterprise: { name: "Enterprise", price: 40, label: "$40/user/mo" },
    },
  },
  notion: {
    name: "Notion AI",
    vendor: "Notion",
    mono: "N",
    tint: "#e6e0d0",
    category: "general",
    plans: {
      addon: { name: "AI add-on", price: 8, label: "$8/user/mo" },
      business: { name: "Business + AI", price: 24, label: "$24/user/mo" },
    },
  },
  midjourney: {
    name: "Midjourney",
    vendor: "Midjourney",
    mono: "Mj",
    tint: "#8a7bd6",
    category: "creative",
    plans: {
      basic: { name: "Basic", price: 10, label: "$10/user/mo" },
      standard: { name: "Standard", price: 30, label: "$30/user/mo" },
      pro: { name: "Pro", price: 60, label: "$60/user/mo" },
    },
  },
  replit: {
    name: "Replit",
    vendor: "Replit",
    mono: "Rp",
    tint: "#f57c4a",
    category: "coding",
    plans: {
      core: { name: "Core", price: 20, label: "$20/user/mo" },
      teams: { name: "Teams", price: 40, label: "$40/user/mo" },
    },
  },
};

export const USE_CASES = [
  { value: "mixed", label: "Mixed / General" },
  { value: "coding", label: "Engineering & code" },
  { value: "research", label: "Research & data" },
  { value: "writing", label: "Marketing & writing" },
  { value: "creative", label: "Design & creative" },
  { value: "support", label: "Customer support" },
  { value: "ops", label: "Operations & ops" },
];

export const ORG_SIZES = [
  "1–10",
  "11–50",
  "51–200",
  "201–500",
  "501–1,000",
  "1,000+",
];

export const CREDEX_DISCOUNT_RATE = 0.20;

export function getToolList() {
  return Object.entries(AI_TOOLS).map(([id, tool]) => ({
    id,
    name: tool.name,
    vendor: tool.vendor,
    mono: tool.mono,
    tint: tool.tint,
    category: tool.category,
    plans: Object.entries(tool.plans).map(([planId, plan]) => ({
      id: planId,
      ...plan,
    })),
  }));
}
