export type EvidenceEntry = {
  id: string;
  date: string;
  category: string;
  title: string;
  summary: string;
  directQuote: string;
  witnesses: string[];
  factorTags: string[];
  strengthScore: number;
  confidenceScore: number;
  pinned?: boolean;
};

export type Pattern = {
  id: string;
  label: string;
  description: string;
  severity: number;
  confidence: number;
  exampleQuote: string;
  supportingCount: number;
  trend: "increasing" | "stable" | "decreasing";
};

export type CustodyFactor = {
  id: string;
  name: string;
  description: string;
  status: "covered" | "weak" | "missing" | "contradicted";
  evidenceCount: number;
  confidence: number;
  category: string;
};

export type ExhibitItem = {
  id: string;
  label: string;
  title: string;
  sourceType: string;
  date: string;
  strengthScore: number;
  included: boolean;
};

export const mockEvidenceEntries: EvidenceEntry[] = [
  {
    id: "e1",
    date: "2026-05-12",
    category: "Scheduling",
    title: "Late pickup without notice — 2 hours",
    summary: "David Thompson arrived 2 hours late for the scheduled 5:00 PM pickup and did not respond to text messages or phone calls during that period. Sofia waited at school with her teacher.",
    directQuote: "I'll be there when I get there. Stop texting me.",
    witnesses: ["Ms. Karen Wells (teacher)"],
    factorTags: ["Moral Fitness", "Parenting Routine", "Willingness to Honor Schedule"],
    strengthScore: 8,
    confidenceScore: 0.92,
    pinned: true
  },
  {
    id: "e2",
    date: "2026-05-10",
    category: "Communication",
    title: "Hostile language — summer camp dispute",
    summary: "During a text exchange about Sofia's summer camp registration, David used hostile language and refused to respond to questions about cost-sharing.",
    directQuote: "You always ruin everything for them. This is why we're here.",
    witnesses: [],
    factorTags: ["Co-Parenting Communication", "Moral Fitness"],
    strengthScore: 7,
    confidenceScore: 0.88
  },
  {
    id: "e3",
    date: "2026-05-04",
    category: "Medical / Safety",
    title: "Refused to share medical records — Sofia's asthma",
    summary: "Maria requested Sofia's updated asthma action plan from the last pediatric visit. David refused to forward the records and did not inform Maria of a medication change.",
    directQuote: "I'll handle Sofia's medical stuff. You don't need to be involved in everything.",
    witnesses: ["Dr. Patricia Huang (pediatrician)"],
    factorTags: ["Medical Needs", "Co-Parenting", "Safety"],
    strengthScore: 9,
    confidenceScore: 0.95,
    pinned: true
  },
  {
    id: "e4",
    date: "2026-04-27",
    category: "Co-Parenting",
    title: "Unilateral school enrollment change",
    summary: "David enrolled Lucas in a new after-school program without consulting Maria. The program conflicts with Maria's scheduled parenting time on Tuesdays and Thursdays.",
    directQuote: "I already signed him up. You'll have to work around it.",
    witnesses: ["Lisa Torres (school administrator)"],
    factorTags: ["Unilateral Decision-Making", "Activities / Education", "Co-Parenting"],
    strengthScore: 8,
    confidenceScore: 0.90
  },
  {
    id: "e5",
    date: "2026-04-15",
    category: "Financial",
    title: "Refused to contribute to school supplies",
    summary: "Maria requested reimbursement for $312 in school supplies purchased for both children. David denied the request and accused Maria of fabricating costs.",
    directQuote: "That's your problem. I already spend enough on my time.",
    witnesses: [],
    factorTags: ["Financial Responsibility", "Children's Needs"],
    strengthScore: 6,
    confidenceScore: 0.80
  },
  {
    id: "e6",
    date: "2026-04-02",
    category: "Communication",
    title: "33-hour non-response to urgent message",
    summary: "Maria sent an urgent message at 9:14 PM reporting Sofia had a 103°F fever and requesting coordination about a doctor appointment. David did not respond until 6:20 PM the following day.",
    directQuote: "I was busy. She's fine.",
    witnesses: [],
    factorTags: ["Non-Responsiveness", "Medical Needs", "Co-Parenting"],
    strengthScore: 9,
    confidenceScore: 0.97
  },
  {
    id: "e7",
    date: "2026-03-20",
    category: "Activities / Education",
    title: "Missed three consecutive school events",
    summary: "David missed Sofia's science fair (March 2), Lucas's kindergarten spring show (March 14), and parent-teacher conferences (March 20). No advance notice was given for any absence.",
    directQuote: "Work comes first. They'll understand when they're older.",
    witnesses: ["Principal Sandra Knox"],
    factorTags: ["Parental Involvement", "Activities / Education", "Stability"],
    strengthScore: 7,
    confidenceScore: 0.85
  },
  {
    id: "e8",
    date: "2026-03-10",
    category: "Scheduling",
    title: "Cancelled weekend visitation — last minute",
    summary: "David cancelled the March 8-10 visitation weekend at 11:45 PM on Friday via text. No rescheduling offer was made. Maria had arranged childcare coordination around the absence.",
    directQuote: "Something came up. I'll make it up to them.",
    witnesses: [],
    factorTags: ["Scheduling Violations", "Frequent and Continuing Contact"],
    strengthScore: 8,
    confidenceScore: 0.91
  },
  {
    id: "e9",
    date: "2026-02-28",
    category: "Legal / Discovery",
    title: "Non-compliance with disclosure request",
    summary: "Court-ordered financial disclosure documents due February 15 were not submitted. Maria's attorney sent a written reminder on February 22 with no response.",
    directQuote: "",
    witnesses: ["Atty. Robert Garza"],
    factorTags: ["Court Compliance", "Financial"],
    strengthScore: 9,
    confidenceScore: 0.98
  }
];

export const mockCustodyFactors: CustodyFactor[] = [
  { id: "f1", name: "Parental fitness and character", description: "Each parent's overall fitness, including moral character and judgment", status: "covered", evidenceCount: 5, confidence: 0.88, category: "Parental Fitness" },
  { id: "f2", name: "Continuity of existing parent-child relationship", description: "Maintaining established bonds with each parent", status: "covered", evidenceCount: 4, confidence: 0.82, category: "Stability" },
  { id: "f3", name: "Capacity to honor time-sharing arrangements", description: "Each parent's demonstrated willingness to comply with the parenting plan", status: "covered", evidenceCount: 6, confidence: 0.91, category: "Co-Parenting" },
  { id: "f4", name: "Preference of child", description: "The child's reasonable preference if of sufficient maturity", status: "weak", evidenceCount: 1, confidence: 0.45, category: "Child Preferences" },
  { id: "f5", name: "Geographic viability of the plan", description: "The geographic distance and feasibility of the proposed parenting plan", status: "covered", evidenceCount: 2, confidence: 0.78, category: "Logistics" },
  { id: "f6", name: "Anticipated division of parental responsibilities", description: "How each parent will handle childcare, education, and activity decisions", status: "weak", evidenceCount: 2, confidence: 0.55, category: "Co-Parenting" },
  { id: "f7", name: "Parental competence to meet child's developmental needs", description: "Each parent's ability to address the age-appropriate needs of the child", status: "covered", evidenceCount: 3, confidence: 0.75, category: "Parental Fitness" },
  { id: "f8", name: "Ability to promote a positive relationship with the other parent", description: "Each parent's willingness to facilitate the child's relationship with the other parent", status: "weak", evidenceCount: 2, confidence: 0.60, category: "Co-Parenting" },
  { id: "f9", name: "History of domestic violence or abuse", description: "Any history of domestic violence, child abuse, or neglect", status: "covered", evidenceCount: 1, confidence: 0.85, category: "Safety" },
  { id: "f10", name: "Stability of living environment", description: "The permanence and stability of each parent's home", status: "covered", evidenceCount: 3, confidence: 0.80, category: "Stability" },
  { id: "f11", name: "Physical, mental, and emotional health of parents", description: "Any relevant health issues affecting parenting capacity", status: "missing", evidenceCount: 0, confidence: 0, category: "Parental Fitness" },
  { id: "f12", name: "Child's adjustment to home, school, and community", description: "How well the child has adjusted to current settings and routines", status: "covered", evidenceCount: 4, confidence: 0.83, category: "Stability" },
  { id: "f13", name: "School and community record", description: "The child's academic and community involvement history", status: "covered", evidenceCount: 2, confidence: 0.78, category: "Education" },
  { id: "f14", name: "Financial ability to meet child's needs", description: "Each parent's demonstrated financial capacity to support the children", status: "weak", evidenceCount: 1, confidence: 0.50, category: "Financial" },
  { id: "f15", name: "Sibling relationships", description: "The importance of maintaining sibling bonds", status: "covered", evidenceCount: 2, confidence: 0.77, category: "Relationships" },
  { id: "f16", name: "Evidence of substance abuse", description: "Any documented substance use that affects parenting", status: "missing", evidenceCount: 0, confidence: 0, category: "Safety" },
  { id: "f17", name: "Prior court orders and compliance", description: "Each parent's history of complying with existing court orders", status: "covered", evidenceCount: 3, confidence: 0.92, category: "Legal" },
  { id: "f18", name: "Extended family relationships", description: "The value of each parent's extended family network", status: "missing", evidenceCount: 0, confidence: 0, category: "Relationships" },
];

export const mockPatterns: Pattern[] = [
  {
    id: "p1",
    label: "Non-Responsiveness",
    description: "Pattern of failing to reply to time-sensitive medical, educational, or scheduling messages within a reasonable period. Documented 31 instances across 6 months.",
    severity: 6,
    confidence: 0.88,
    exampleQuote: "I didn't see the message. (sent 33 hours after urgent fever notification)",
    supportingCount: 31,
    trend: "increasing"
  },
  {
    id: "p2",
    label: "Interference with Parenting Time",
    description: "Deliberately scheduling children's activities, appointments, or events during the other parent's scheduled parenting time without consent.",
    severity: 8,
    confidence: 0.91,
    exampleQuote: "I already signed him up. You'll have to work around it.",
    supportingCount: 22,
    trend: "increasing"
  },
  {
    id: "p3",
    label: "Gaslighting",
    description: "Denying documented events, downplaying safety concerns, and attributing normal parental concern to irrationality or hostility.",
    severity: 7,
    confidence: 0.80,
    exampleQuote: "That never happened. You always exaggerate everything.",
    supportingCount: 14,
    trend: "stable"
  },
  {
    id: "p4",
    label: "DARVO",
    description: "Deny, Attack, Reverse Victim and Offender — responding to accountability by denying misconduct, attacking the other parent, and claiming victimhood.",
    severity: 5,
    confidence: 0.72,
    exampleQuote: "You're the one who causes all the problems around here.",
    supportingCount: 8,
    trend: "stable"
  },
  {
    id: "p5",
    label: "Unilateral Decision-Making",
    description: "Making major decisions about the children's education, healthcare, and activities without consulting or notifying the other parent.",
    severity: 7,
    confidence: 0.87,
    exampleQuote: "I made the decision. Deal with it.",
    supportingCount: 11,
    trend: "increasing"
  }
];

export const mockExhibits: ExhibitItem[] = [
  { id: "ex1", label: "A", title: "Text message thread — late pickup May 12", sourceType: "Screenshot", date: "2026-05-12", strengthScore: 8, included: true },
  { id: "ex2", label: "B", title: "Medical non-disclosure — pediatrician record", sourceType: "Document", date: "2026-05-04", strengthScore: 9, included: true },
  { id: "ex3", label: "C", title: "Hostile communication — summer camp texts", sourceType: "Screenshot", date: "2026-05-10", strengthScore: 7, included: true },
  { id: "ex4", label: "D", title: "School enrollment — unauthorized change letter", sourceType: "Document", date: "2026-04-27", strengthScore: 8, included: true },
  { id: "ex5", label: "E", title: "Non-compliance notice — financial disclosure", sourceType: "Court Document", date: "2026-02-28", strengthScore: 9, included: true },
  { id: "ex6", label: "F", title: "School event absence record", sourceType: "School Record", date: "2026-03-20", strengthScore: 7, included: false },
];

export const mockNarrativeDraft = `
**I. Background and History of the Parenting Relationship**

The parties have two minor children, Sofia Martinez (age 8) and Lucas Martinez (age 5), who have resided primarily with the Petitioner, Maria Martinez, since the parties' separation in January 2025. During the period from January 2025 through the present, the Respondent, David Thompson, has maintained a scheduled parenting time arrangement pursuant to the temporary order entered on February 14, 2025.

**II. Pattern of Scheduling Non-Compliance**

Beginning in February 2026, the Respondent has demonstrated a consistent pattern of late arrivals, last-minute cancellations, and failures to communicate regarding scheduled parenting time. Documented instances include: (1) a two-hour late pickup on May 12, 2026, during which the Respondent failed to respond to seven text messages and two phone calls, leaving Sofia waiting at school with her teacher, Ms. Karen Wells; (2) cancellation of the March 8-10 weekend at 11:45 PM on Friday with no rescheduling offer; and (3) three consecutive missed school events in March 2026.

**III. Co-Parenting Communication Failures and Unilateral Decisions**

Analysis of communication records reveals a pattern of non-responsiveness to time-sensitive matters. When the Petitioner reported Sofia's 103°F fever and requested coordination for a physician appointment, the Respondent did not respond for 33 hours. The Respondent also made several unilateral decisions affecting the children without the Petitioner's knowledge or consent, including: changing Sofia's asthma medication without disclosure, enrolling Lucas in an after-school program that conflicts with the Petitioner's parenting time, and failing to produce court-ordered financial disclosure documents by the February 15, 2026 deadline.
`;

export const mockFloridaCase = {
  id: "case-1",
  caseNickname: "Martinez v. Thompson",
  state: "FL",
  county: "Hillsborough County",
  courtName: "13th Judicial Circuit",
  caseType: "Custody / Parenting Time",
  hearingDate: "2026-08-14",
  isRepresented: false,
  attorneyName: "",
  people: {
    user: "Maria Martinez",
    otherParty: "David Thompson",
    others: [] as string[]
  },
  children: [
    { id: "c1", name: "Sofia", age: 8, school: "Westchase Elementary", birthDate: "2017-09-03", notes: "Has asthma; attends therapy" },
    { id: "c2", name: "Lucas", age: 5, school: "Westchase K-8", birthDate: "2020-04-11", notes: "Enrolled in soccer program" }
  ],
  evidenceStats: {
    totalEntries: 18,
    coveredFactors: 12,
    weakFactors: 4,
    missingFactors: 3,
    documents: 2
  },
  communicationStats: {
    avgResponseDelayHours: 11.2,
    medianResponseDelayHours: 7.4,
    avgResponseDelayPct: 47,
    ignoredRequests: 12,
    refusedTrades: 8,
    scheduleChangeAttempts: 14,
    hostileLanguageCount: 23,
    cooperationScore: 32
  },
  recentEvidence: mockEvidenceEntries.slice(0, 3),
  patterns: mockPatterns
};

export const mockCaliforniaCase = {
  id: "case-2",
  caseNickname: "Chen v. Rivera",
  state: "CA",
  county: "Los Angeles County",
  courtName: "Superior Court",
  caseType: "Divorce with Children",
  hearingDate: "2026-09-22",
  isRepresented: true,
  attorneyName: "Sarah Okonkwo, Esq.",
  people: {
    user: "Emily Chen",
    otherParty: "Michael Rivera",
    others: [] as string[]
  },
  children: [
    { id: "c1", name: "Emma", age: 10, school: "Westwood Elementary", birthDate: "2015-06-14", notes: "" },
    { id: "c2", name: "James", age: 7, school: "Westwood Elementary", birthDate: "2018-11-02", notes: "" }
  ],
  evidenceStats: {
    totalEntries: 8,
    coveredFactors: 8,
    weakFactors: 2,
    missingFactors: 1,
    documents: 4
  },
  communicationStats: {
    avgResponseDelayHours: 24.5,
    medianResponseDelayHours: 18.2,
    avgResponseDelayPct: 60,
    ignoredRequests: 5,
    refusedTrades: 2,
    scheduleChangeAttempts: 6,
    hostileLanguageCount: 12,
    cooperationScore: 48
  },
  recentEvidence: [
    {
      id: "ca-e1",
      date: "2026-06-01",
      category: "Scheduling",
      title: "Missed scheduled weekend visitation",
      summary: "Respondent failed to pick up Emma and James for the scheduled June 1-2 weekend without prior notice. Children were expecting the visit.",
      directQuote: "Forgot about it. Can we do next weekend?",
      witnesses: [] as string[],
      factorTags: ["Frequent and Continuing Contact", "Reliability"],
      strengthScore: 9,
      confidenceScore: 0.95
    }
  ],
  patterns: [
    {
      id: "ca-p1",
      label: "Interference with Parenting Time",
      description: "Repeatedly scheduling children's activities during the other parent's parenting time without notice or consent.",
      severity: 8,
      confidence: 0.90,
      exampleQuote: "I already signed them up for soccer, you'll have to take them.",
      supportingCount: 22,
      trend: "stable" as const
    }
  ]
};

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
  "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas",
  "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming", "District of Columbia"
];

export const CASE_TYPES = [
  { id: "custody", label: "Custody / Parenting Time", description: "Establish or clarify custody and visitation schedules" },
  { id: "modification", label: "Custody Modification", description: "Modify an existing custody or parenting plan" },
  { id: "divorce", label: "Divorce with Children", description: "Divorce proceedings involving minor children" },
  { id: "paternity", label: "Paternity / Parentage", description: "Establish legal parentage of a child" },
  { id: "protection", label: "Protection Order", description: "Seek or respond to a protective order" },
  { id: "relocation", label: "Relocation", description: "Request or oppose a move with the children" },
  { id: "other", label: "Other Family Law", description: "Guardianship, adoption, or other family matters" }
];
