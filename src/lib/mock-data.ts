export type RiskLevel = "critical" | "high" | "moderate" | "low";
export type RequestStatus = "approved" | "flagged" | "rejected" | "verification" | "pending";

export interface School {
  id: string;
  name: string;
  district: string;
  type: "Primary" | "Upper Primary" | "High School" | "Ashram";
  enrollment: number;
  classrooms: { available: number; required: number };
  toilets: { boys: number; girls: number; functional: number };
  electrification: boolean;
  drinkingWater: "functional" | "non-functional" | "absent";
  lastRepair: string;
  riskLevel: RiskLevel;
  lat: number;
  lng: number;
  tribal: boolean;
  aiScore: number;
  enrollmentTrend: number[];
}

export interface InfraRequest {
  id: string;
  schoolId: string;
  schoolName: string;
  type: string;
  cost: number;
  status: RequestStatus;
  confidence: number;
  reason: string;
  policyTags: string[];
  submittedAt: string;
}

export interface Anomaly {
  id: string;
  schoolName: string;
  district: string;
  type: "Duplicate" | "Inflated Cost" | "Already Sanctioned" | "Enrollment Mismatch";
  fraudScore: number;
  amount: number;
  detectedAt: string;
}

const districts = ["Amaravati", "Visakhapatnam", "Tirupati", "Araku Valley", "Nellore", "Vijayawada", "Guntur", "Kakinada", "Anantapur", "Kurnool", "Kadapa", "Chittoor"];
const featured: Partial<School>[] = [
  { name: "ZP High School, Amaravati", district: "Amaravati", lat: 16.51, lng: 80.51, tribal: false },
  { name: "Government Girls High School, Visakhapatnam", district: "Visakhapatnam", lat: 17.68, lng: 83.21, tribal: false },
  { name: "MPUP School, Tirupati Rural", district: "Tirupati", lat: 13.62, lng: 79.41, tribal: false },
  { name: "Tribal Welfare Ashram School, Araku Valley", district: "Araku Valley", lat: 18.33, lng: 82.87, tribal: true },
  { name: "Government High School, Nellore", district: "Nellore", lat: 14.44, lng: 79.98, tribal: false },
];

const types: School["type"][] = ["Primary", "Upper Primary", "High School", "Ashram"];
const risks: RiskLevel[] = ["critical", "high", "moderate", "low"];

function rng(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export const schools: School[] = (() => {
  const r = rng(42);
  const list: School[] = [];
  featured.forEach((f, i) => {
    list.push({
      id: `SCH-${1000 + i}`,
      name: f.name!,
      district: f.district!,
      type: types[Math.floor(r() * types.length)],
      enrollment: Math.floor(180 + r() * 720),
      classrooms: { available: Math.floor(6 + r() * 14), required: Math.floor(10 + r() * 18) },
      toilets: { boys: Math.floor(2 + r() * 4), girls: Math.floor(2 + r() * 4), functional: Math.floor(1 + r() * 5) },
      electrification: r() > 0.2,
      drinkingWater: r() > 0.3 ? "functional" : r() > 0.5 ? "non-functional" : "absent",
      lastRepair: `${2019 + Math.floor(r() * 6)}-${String(Math.floor(1 + r() * 12)).padStart(2, "0")}`,
      riskLevel: risks[Math.floor(r() * risks.length)],
      lat: f.lat!,
      lng: f.lng!,
      tribal: f.tribal!,
      aiScore: Math.floor(60 + r() * 38),
      enrollmentTrend: Array.from({ length: 6 }, () => Math.floor(180 + r() * 720)),
    });
  });
  for (let i = 5; i < 64; i++) {
    const d = districts[Math.floor(r() * districts.length)];
    list.push({
      id: `SCH-${1000 + i}`,
      name: `${["ZP", "MPUP", "Government", "Mandal", "Tribal"][Math.floor(r() * 5)]} ${["High School", "Primary School", "Upper Primary"][Math.floor(r() * 3)]}, ${d}`,
      district: d,
      type: types[Math.floor(r() * types.length)],
      enrollment: Math.floor(120 + r() * 800),
      classrooms: { available: Math.floor(4 + r() * 16), required: Math.floor(8 + r() * 20) },
      toilets: { boys: Math.floor(1 + r() * 5), girls: Math.floor(1 + r() * 5), functional: Math.floor(0 + r() * 6) },
      electrification: r() > 0.15,
      drinkingWater: r() > 0.35 ? "functional" : r() > 0.55 ? "non-functional" : "absent",
      lastRepair: `${2018 + Math.floor(r() * 7)}-${String(Math.floor(1 + r() * 12)).padStart(2, "0")}`,
      riskLevel: risks[Math.floor(r() * risks.length)],
      lat: 13 + r() * 6,
      lng: 78 + r() * 6,
      tribal: r() > 0.8,
      aiScore: Math.floor(40 + r() * 58),
      enrollmentTrend: Array.from({ length: 6 }, () => Math.floor(120 + r() * 800)),
    });
  }
  return list;
})();

export const requests: InfraRequest[] = (() => {
  const r = rng(7);
  const reqTypes = ["New Classrooms", "Toilet Block", "RO Water Plant", "Boundary Wall", "Roof Repair", "Electrification", "Smart Classroom"];
  const statuses: RequestStatus[] = ["approved", "flagged", "rejected", "verification", "pending"];
  const reasons = [
    "Enrollment data validated; demand consistent with growth.",
    "Duplicate request detected within 90 days.",
    "Cost exceeds district benchmark by 38%.",
    "Already sanctioned under Samagra Shiksha 2024.",
    "Enrollment mismatch vs UDISE+ records.",
    "Compliant with RTE infrastructure norms.",
  ];
  return schools.slice(0, 28).map((s, i) => ({
    id: `REQ-${5000 + i}`,
    schoolId: s.id,
    schoolName: s.name,
    type: reqTypes[Math.floor(r() * reqTypes.length)],
    cost: Math.floor(150000 + r() * 2500000),
    status: statuses[Math.floor(r() * statuses.length)],
    confidence: Math.floor(55 + r() * 44),
    reason: reasons[Math.floor(r() * reasons.length)],
    policyTags: ["RTE 2009", "Samagra Shiksha", "PM SHRI"].filter(() => r() > 0.5),
    submittedAt: `2026-${String(Math.floor(1 + r() * 5)).padStart(2, "0")}-${String(Math.floor(1 + r() * 28)).padStart(2, "0")}`,
  }));
})();

export const anomalies: Anomaly[] = (() => {
  const r = rng(99);
  const types = ["Duplicate", "Inflated Cost", "Already Sanctioned", "Enrollment Mismatch"] as const;
  return schools.slice(10, 28).map((s, i) => ({
    id: `ANM-${800 + i}`,
    schoolName: s.name,
    district: s.district,
    type: types[Math.floor(r() * types.length)],
    fraudScore: Math.floor(60 + r() * 39),
    amount: Math.floor(200000 + r() * 1800000),
    detectedAt: `2026-0${Math.floor(1 + r() * 5)}-${String(Math.floor(1 + r() * 28)).padStart(2, "0")}`,
  }));
})();

export const kpis = {
  totalSchools: 45382,
  pendingApprovals: 1247,
  ghostDemands: 184,
  budgetUtilization: 68,
  highRiskSchools: 312,
  aiAccuracy: 94.2,
};

export const districtData = districts.map((d, i) => ({
  district: d,
  schools: 800 + i * 230,
  gaps: 40 + ((i * 13) % 80),
  risk: 20 + ((i * 17) % 70),
}));

export const enrollmentTrend = [
  { year: "2019", enrollment: 6.2, classrooms: 4.8 },
  { year: "2020", enrollment: 6.0, classrooms: 4.9 },
  { year: "2021", enrollment: 6.4, classrooms: 5.0 },
  { year: "2022", enrollment: 6.8, classrooms: 5.1 },
  { year: "2023", enrollment: 7.1, classrooms: 5.3 },
  { year: "2024", enrollment: 7.4, classrooms: 5.4 },
  { year: "2025", enrollment: 7.7, classrooms: 5.5 },
  { year: "2026", enrollment: 8.0, classrooms: 5.6 },
];

export const forecastData = [
  { metric: "Classroom Demand", current: 5.6, projected: 7.2, confidence: 92, risk: "high" },
  { metric: "Sanitation Units", current: 38400, projected: 51200, confidence: 88, risk: "high" },
  { metric: "Repair Backlog", current: 12800, projected: 9100, confidence: 81, risk: "moderate" },
  { metric: "Enrollment Growth", current: 7.7, projected: 8.6, confidence: 95, risk: "moderate" },
];

export const workflowStages = [
  { stage: "Request Submitted", date: "2026-04-12", status: "complete" },
  { stage: "AI Validation", date: "2026-04-13", status: "complete" },
  { stage: "Field Verification", date: "2026-04-22", status: "complete" },
  { stage: "Approval", date: "2026-05-02", status: "complete" },
  { stage: "Budget Sanction", date: "2026-05-10", status: "current" },
  { stage: "Construction", date: "—", status: "pending" },
  { stage: "Completion", date: "—", status: "pending" },
];
