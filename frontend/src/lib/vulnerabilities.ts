export type Vulnerability = {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  severity: "high" | "medium" | "low";
  timeEstimate: string;
  category: string;
  learningObjective: string;
};

export const vulnerabilities: Vulnerability[] = [
  {
    id: 1,
    title: "LLM01 – Prompt Injection",
    shortTitle: "Prompt Injection",
    description: "Malicious users manipulate model prompts to override system or developer instructions, gaining access to hidden data or executing unintended actions. This vulnerability can cause data exposure or model misbehavior if not mitigated properly.",
    severity: "high",
    timeEstimate: "20 min",
    category: "Input Manipulation",
    learningObjective: "Learn to identify and prevent prompt injection attacks through input validation and context separation.",
  },
  {
    id: 2,
    title: "LLM02 – Insecure Output Handling",
    shortTitle: "Insecure Output Handling",
    description: "Unsanitized model outputs may lead to code injection, data leakage, or cross-application compromise. Always validate and sanitize model responses before displaying or executing them.",
    severity: "high",
    timeEstimate: "20 min",
    category: "Output Security",
    learningObjective: "Master output sanitization techniques and implement secure handling of LLM-generated content.",
  },
  {
    id: 3,
    title: "LLM03 – Training Data Poisoning",
    shortTitle: "Training Data Poisoning",
    description: "Attackers inject malicious or biased data into training datasets, altering model behavior or embedding persistent threats. Regular dataset reviews and integrity checks are key defenses.",
    severity: "high",
    timeEstimate: "25 min",
    category: "Training Attack",
    learningObjective: "Understand data poisoning vectors and establish robust data validation and auditing processes.",
  },
  {
    id: 4,
    title: "LLM04 – Model Denial of Service",
    shortTitle: "Model Denial of Service",
    description: "Attackers overload the model with complex or lengthy inputs to drain compute resources and slow down services. Implement token limits, rate limiting, and timeout controls.",
    severity: "low",
    timeEstimate: "15 min",
    category: "Availability Attack",
    learningObjective: "Implement resource management controls to protect against DoS attacks on LLM systems.",
  },
  {
    id: 5,
    title: "LLM05 – Supply Chain Vulnerabilities",
    shortTitle: "Supply Chain Vulnerabilities",
    description: "Using unverified third-party datasets or models introduces hidden risks like backdoors or bias. Secure all dependencies with verification, signatures, and version control.",
    severity: "medium",
    timeEstimate: "20 min",
    category: "Supply Chain",
    learningObjective: "Establish secure supply chain practices for models, datasets, and dependencies.",
  },
  {
    id: 6,
    title: "LLM06 – Sensitive Information Disclosure",
    shortTitle: "Sensitive Information Disclosure",
    description: "LLMs may inadvertently expose confidential data from prompts or training sets. Apply prompt sanitization, data redaction, and strict access policies to prevent leaks.",
    severity: "high",
    timeEstimate: "20 min",
    category: "Privacy Attack",
    learningObjective: "Protect sensitive data through redaction, access controls, and privacy-preserving techniques.",
  },
  {
    id: 7,
    title: "LLM07 – Insecure Plugin Design",
    shortTitle: "Insecure Plugin Design",
    description: "Weak plugin permissions or authentication can expose internal APIs and sensitive actions. Use least-privilege design and continuous plugin security audits.",
    severity: "high",
    timeEstimate: "25 min",
    category: "Plugin Security",
    learningObjective: "Design secure LLM plugins with proper authentication, authorization, and monitoring.",
  },
  {
    id: 8,
    title: "LLM08 – Excessive Agency",
    shortTitle: "Excessive Agency",
    description: "Giving LLMs too much control over actions (code execution, automation, transactions) can cause unintended or unsafe results. Require human oversight for critical tasks.",
    severity: "low",
    timeEstimate: "15 min",
    category: "Autonomy Control",
    learningObjective: "Implement governance controls and human-in-the-loop processes for high-risk LLM actions.",
  },
  {
    id: 9,
    title: "LLM09 – Overreliance on LLM Outputs",
    shortTitle: "Overreliance",
    description: "Relying solely on model outputs without verification can lead to incorrect, biased, or unsafe conclusions. Encourage human validation and feedback loops.",
    severity: "medium",
    timeEstimate: "15 min",
    category: "Trust & Validation",
    learningObjective: "Establish verification protocols and avoid blind trust in LLM-generated content.",
  },
  {
    id: 10,
    title: "LLM10 – Model Theft and Exfiltration",
    shortTitle: "Model Theft",
    description: "Attackers may extract or replicate proprietary model parameters through scraping or leaks. Use encrypted APIs, model watermarking, and strict access control.",
    severity: "high",
    timeEstimate: "20 min",
    category: "Intellectual Property",
    learningObjective: "Apply model protection techniques including watermarking, encryption, and access monitoring.",
  },
];

export function getVulnerabilityById(id: number): Vulnerability | undefined {
  return vulnerabilities.find((v) => v.id === id);
}
