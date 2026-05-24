// All pricing data verified as of 2026-05-26
// Sources documented in PRICING_DATA.md

export const AI_TOOLS = {
  cursor: {
    name: "Cursor",
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
    category: "coding",
    plans: {
      individual: { name: "Individual", price: 10, label: "$10/user/mo" },
      business: { name: "Business", price: 19, label: "$19/user/mo" },
      enterprise: { name: "Enterprise", price: 39, label: "$39/user/mo" },
    },
  },
  claude: {
    name: "Claude",
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
    category: "api",
    plans: {
      payg: { name: "Pay-as-you-go", price: null, label: "Usage-based" },
    },
  },
  openai_api: {
    name: "OpenAI API",
    category: "api",
    plans: {
      payg: { name: "Pay-as-you-go", price: null, label: "Usage-based" },
    },
  },
  gemini: {
    name: "Gemini",
    category: "general",
    plans: {
      pro: { name: "Pro (Google One AI Premium)", price: 20, label: "$20/user/mo" },
      ultra: { name: "Ultra / Advanced", price: 250, label: "$250/user/mo" },
      api: { name: "API (Vertex AI)", price: null, label: "Usage-based" },
    },
  },
  windsurf: {
    name: "Windsurf",
    category: "coding",
    plans: {
      free: { name: "Free", price: 0, label: "Free" },
      pro: { name: "Pro", price: 15, label: "$15/user/mo" },
      team: { name: "Team", price: 35, label: "$35/user/mo" },
    },
  },
};

export const USE_CASES = [
  { value: "coding", label: "Coding & Development" },
  { value: "writing", label: "Writing & Content" },
  { value: "data", label: "Data Analysis" },
  { value: "research", label: "Research" },
  { value: "mixed", label: "Mixed / General" },
];

export const CREDEX_DISCOUNT_RATE = 0.20;

export function getToolList() {
  return Object.entries(AI_TOOLS).map(([id, tool]) => ({
    id,
    name: tool.name,
    category: tool.category,
    plans: Object.entries(tool.plans).map(([planId, plan]) => ({
      id: planId,
      ...plan,
    })),
  }));
}
