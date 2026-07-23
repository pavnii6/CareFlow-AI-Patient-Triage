'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { TriageBadge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';
import { PATIENTS } from '@/data/patients';
import type { TriageLevel, TriageFeatureContribution, TriagePrediction } from '@/types';
import {
  Brain, Activity, Thermometer, Heart, Wind, TrendingUp,
  CheckCircle, AlertTriangle, Info, Zap, ChevronRight, BarChart2
} from 'lucide-react';

// ─── Simulated AI prediction engine ──────────────────────────
function simulateTriage(vitals: {
  heartRate: number; bloodPressure: string; temperature: number;
  oxygenSaturation: number; respiratoryRate: number;
}, symptoms: string[], age: number): TriagePrediction {
  const [sys] = vitals.bloodPressure.split('/').map(Number);

  let score = 0;
  const contributions: TriageFeatureContribution[] = [];

  // Heart rate
  const hrScore = vitals.heartRate > 120 ? 20 : vitals.heartRate > 100 ? 12 : vitals.heartRate < 50 ? 18 : 0;
  score += hrScore;
  if (hrScore > 0) contributions.push({ feature: 'Heart Rate', value: `${vitals.heartRate} bpm`, contribution: hrScore / 25, direction: 'risk_up' });

  // Systolic BP
  const bpScore = sys > 180 ? 22 : sys > 160 ? 14 : sys < 90 ? 20 : 0;
  score += bpScore;
  if (bpScore > 0) contributions.push({ feature: 'Systolic BP', value: `${sys} mmHg`, contribution: bpScore / 25, direction: 'risk_up' });

  // Temperature
  const tempScore = vitals.temperature > 39 ? 12 : vitals.temperature > 38.5 ? 8 : vitals.temperature < 36 ? 10 : 0;
  score += tempScore;
  if (tempScore > 0) contributions.push({ feature: 'Temperature', value: `${vitals.temperature}°C`, contribution: tempScore / 15, direction: 'risk_up' });

  // SpO2
  const spo2Score = vitals.oxygenSaturation < 90 ? 25 : vitals.oxygenSaturation < 95 ? 15 : 0;
  score += spo2Score;
  if (spo2Score > 0) contributions.push({ feature: 'SpO₂', value: `${vitals.oxygenSaturation}%`, contribution: spo2Score / 28, direction: 'risk_up' });
  else contributions.push({ feature: 'SpO₂', value: `${vitals.oxygenSaturation}%`, contribution: 0.8, direction: 'risk_down' });

  // Age
  const ageScore = age > 70 ? 8 : age > 60 ? 5 : age < 5 ? 6 : 0;
  score += ageScore;
  if (ageScore > 0) contributions.push({ feature: 'Age', value: `${age} years`, contribution: ageScore / 10, direction: 'risk_up' });

  // Symptoms
  const critSymptoms = ['Chest Pain', 'Shortness of Breath', 'Confusion', 'Arm Weakness', 'Slurred Speech'];
  const matchedCrit = symptoms.filter(s => critSymptoms.includes(s));
  score += matchedCrit.length * 8;
  if (matchedCrit.length > 0) contributions.push({ feature: 'Critical Symptoms', value: matchedCrit.join(', '), contribution: Math.min(1, matchedCrit.length * 0.3), direction: 'risk_up' });

  score = Math.min(100, score);
  const level: TriageLevel = score >= 85 ? 'critical' : score >= 65 ? 'high' : score >= 40 ? 'medium' : 'low';
  const deptMap: Record<string, string> = {
    'Chest Pain': 'Cardiology', 'Shortness of Breath': 'Pulmonology',
    'Confusion': 'Neurology', 'Arm Weakness': 'Neurology', 'Abdominal Pain': 'Gastroenterology',
    'Joint Pain': 'Rheumatology', 'Fever': 'Infectious Disease'
  };
  const dept = Object.entries(deptMap).find(([sym]) => symptoms.includes(sym))?.[1] ?? 'General Medicine';

  const diagMap: Record<string, string[]> = {
    'critical': ['ECG', 'CT_Scan', 'Blood_Test', 'Specialist_Consultation'],
    'high': ['Blood_Test', 'X_Ray', 'Specialist_Consultation'],
    'medium': ['Blood_Test', 'Ultrasound'],
    'low': ['Blood_Test'],
  };

  return {
    patientId: 'NEW',
    triageLevel: level, riskScore: score,
    confidencePercent: 88 + Math.floor(Math.random() * 10),
    recommendedDepartment: dept,
    recommendedDiagnostics: diagMap[level],
    predictedWaitTime: level === 'critical' ? 2 : level === 'high' ? 15 : level === 'medium' ? 35 : 60,
    featureContributions: contributions.sort((a, b) => b.contribution - a.contribution),
    modelVersion: 'CareFlow-Triage-v3.2',
    generatedAt: new Date().toISOString(),
  };
}

const SYMPTOM_OPTIONS = [
  'Chest Pain', 'Shortness of Breath', 'Dizziness', 'Nausea', 'Vomiting',
  'Severe Headache', 'Confusion', 'Arm Weakness', 'Slurred Speech', 'Blurred Vision',
  'Abdominal Pain', 'Fever', 'High Fever', 'Rash', 'Joint Pain', 'Back Pain',
  'Palpitations', 'Fatigue', 'Leg Swelling', 'Cough', 'Breathlessness',
];

export default function TriagePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', age: 45, gender: 'Male',
    heartRate: 78, bloodPressure: '120/80', temperature: 37.0,
    oxygenSaturation: 98, respiratoryRate: 16,
    symptoms: [] as string[],
  });
  const [prediction, setPrediction] = useState<TriagePrediction | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleSymptom(s: string) {
    setForm(f => ({
      ...f,
      symptoms: f.symptoms.includes(s) ? f.symptoms.filter(x => x !== s) : [...f.symptoms, s]
    }));
  }

  async function runTriage() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800)); // simulate ML inference
    const result = simulateTriage(
      { heartRate: form.heartRate, bloodPressure: form.bloodPressure, temperature: form.temperature, oxygenSaturation: form.oxygenSaturation, respiratoryRate: form.respiratoryRate },
      form.symptoms,
      form.age
    );
    setPrediction(result);
    setLoading(false);
    setStep(3);
  }

  const triageQueue = PATIENTS.filter(p => p.status === 'waiting' || p.status === 'in_triage')
    .sort((a, b) => b.triageScore - a.triageScore);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Triage Engine</h1>
          <p className="text-muted-foreground text-sm mt-1">CareFlow-Triage-v3.2 · ML-powered risk assessment with explainability</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Online · 97.2% Accuracy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Triage form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-4">
            {[
              { n: 1, label: 'Patient Info' },
              { n: 2, label: 'Symptoms & Vitals' },
              { n: 3, label: 'AI Prediction' },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                  step >= s.n ? 'kpi-blue text-white' : 'bg-muted text-muted-foreground'
                )}>
                  {step > s.n ? <CheckCircle className="w-4 h-4" /> : s.n}
                </div>
                <span className={cn('text-sm font-medium', step === s.n ? 'text-foreground' : 'text-muted-foreground')}>
                  {s.label}
                </span>
                {i < 2 && <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />}
              </div>
            ))}
          </div>

          {/* Step 1: Patient info */}
          {step === 1 && (
            <Card>
              <CardHeader><CardTitle>Patient Demographics</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Full Name</label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Patient full name" className="w-full px-3 py-2.5 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Age</label>
                    <input type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: Number(e.target.value) }))}
                      min={0} max={120} className="w-full px-3 py-2.5 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Gender</label>
                  <div className="flex gap-3">
                    {['Male', 'Female', 'Other'].map(g => (
                      <button key={g} type="button"
                        onClick={() => setForm(f => ({ ...f, gender: g }))}
                        className={cn(
                          'px-4 py-2 rounded-lg text-sm font-medium border transition-all',
                          form.gender === g ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border text-muted-foreground hover:border-primary/50'
                        )}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="w-full py-3 kpi-blue rounded-xl text-white font-medium text-sm hover:opacity-90 transition-opacity">
                  Next: Enter Vitals & Symptoms →
                </button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Vitals + symptoms */}
          {step === 2 && (
            <Card>
              <CardHeader><CardTitle>Vitals & Symptoms</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Heart Rate', key: 'heartRate', unit: 'bpm', icon: Heart, min: 20, max: 250 },
                    { label: 'Blood Pressure', key: 'bloodPressure', unit: 'mmHg', icon: Activity, type: 'text' },
                    { label: 'Temperature', key: 'temperature', unit: '°C', icon: Thermometer, min: 30, max: 45, step: 0.1 },
                    { label: 'SpO₂', key: 'oxygenSaturation', unit: '%', icon: Wind, min: 50, max: 100 },
                    { label: 'Resp. Rate', key: 'respiratoryRate', unit: '/min', icon: Activity, min: 5, max: 60 },
                  ].map(v => (
                    <div key={v.key}>
                      <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <v.icon className="w-3.5 h-3.5" />
                          {v.label}
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type={(v as any).type ?? 'number'}
                          value={(form as any)[v.key]}
                          onChange={e => setForm(f => ({ ...f, [v.key]: (v as any).type === 'text' ? e.target.value : Number(e.target.value) }))}
                          min={(v as any).min} max={(v as any).max} step={(v as any).step ?? 1}
                          className="w-full pl-3 pr-12 py-2.5 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{v.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Presenting Symptoms <span className="text-xs font-normal text-muted-foreground">(select all that apply)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SYMPTOM_OPTIONS.map(s => (
                      <button key={s} type="button"
                        onClick={() => toggleSymptom(s)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                          form.symptoms.includes(s)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-muted border-border text-muted-foreground hover:border-blue-300 hover:text-blue-600'
                        )}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
                    ← Back
                  </button>
                  <button
                    onClick={runTriage}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 kpi-blue rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Running AI Analysis...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4" />
                        Run AI Triage Analysis
                      </>
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Prediction result */}
          {step === 3 && prediction && (
            <div className="space-y-4">
              {/* Main result */}
              <div className={cn(
                'rounded-2xl p-6 text-white relative overflow-hidden',
                prediction.triageLevel === 'critical' ? 'bg-gradient-to-br from-red-600 to-red-800' :
                prediction.triageLevel === 'high' ? 'bg-gradient-to-br from-orange-500 to-orange-700' :
                prediction.triageLevel === 'medium' ? 'bg-gradient-to-br from-amber-500 to-amber-700' :
                'bg-gradient-to-br from-green-600 to-green-800'
              )}>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white -translate-y-1/2 translate-x-1/2" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-white/70 text-sm font-medium mb-1">AI Triage Assessment</div>
                      <div className="text-4xl font-bold tracking-tight uppercase">
                        {prediction.triageLevel}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/70 text-xs">Risk Score</div>
                      <div className="text-4xl font-bold">{prediction.riskScore}</div>
                      <div className="text-white/70 text-xs">/100</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-white/60 text-xs">Confidence</div>
                      <div className="text-xl font-bold">{prediction.confidencePercent}%</div>
                    </div>
                    <div>
                      <div className="text-white/60 text-xs">Est. Wait</div>
                      <div className="text-xl font-bold">{prediction.predictedWaitTime} min</div>
                    </div>
                    <div>
                      <div className="text-white/60 text-xs">Department</div>
                      <div className="text-sm font-bold leading-tight">{prediction.recommendedDepartment}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explainability */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-primary" />
                    <CardTitle>Feature Contribution Analysis</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {prediction.featureContributions.map(f => (
                    <div key={f.feature} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{f.feature}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-xs">{f.value}</span>
                          <span className={cn(
                            'text-xs font-semibold',
                            f.direction === 'risk_up' ? 'text-red-600' :
                            f.direction === 'risk_down' ? 'text-green-600' : 'text-muted-foreground'
                          )}>
                            {f.direction === 'risk_up' ? '↑ Risk' : f.direction === 'risk_down' ? '↓ Risk' : '—'}
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-700',
                            f.direction === 'risk_up' ? 'bg-red-500' :
                            f.direction === 'risk_down' ? 'bg-green-500' : 'bg-slate-400'
                          )}
                          style={{ width: `${Math.abs(f.contribution) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 text-xs text-muted-foreground flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    Model: {prediction.modelVersion} · Generated: {new Date(prediction.generatedAt).toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>

              {/* Recommended diagnostics */}
              <Card>
                <CardHeader><CardTitle>Recommended Diagnostics</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {prediction.recommendedDiagnostics.map(d => (
                      <span key={d} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-sm font-medium border border-purple-200 dark:border-purple-800">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {d.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <button
                onClick={() => { setStep(1); setPrediction(null); setForm(f => ({ ...f, symptoms: [] })); }}
                className="w-full py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                + Triage New Patient
              </button>
            </div>
          )}
        </div>

        {/* Right: Triage queue */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle>Emergency Queue</CardTitle>
                <span className="text-xs text-muted-foreground">{triageQueue.length} waiting</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 p-3">
              {triageQueue.map((p, i) => (
                <div key={p.id} className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border transition-all',
                  p.triageLevel === 'critical' ? 'border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10 critical-pulse' :
                  p.triageLevel === 'high' ? 'border-orange-200 bg-orange-50 dark:border-orange-900/30 dark:bg-orange-900/10' :
                  'border-border bg-card'
                )}>
                  <div className="text-lg font-bold text-muted-foreground w-6 flex-shrink-0">{i+1}</div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm text-foreground truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.estimatedWaitTime} min · {p.department}</div>
                  </div>
                  <TriageBadge level={p.triageLevel} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Triage stats */}
          <Card>
            <CardHeader><CardTitle>Today&apos;s Stats</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Total Triaged', value: 247, color: 'bg-blue-500' },
                { label: 'Avg Assessment Time', value: '2.8 min', color: 'bg-teal-500' },
                { label: 'AI Override Rate', value: '3.2%', color: 'bg-amber-500' },
                { label: 'Model Confidence', value: '94.1%', color: 'bg-green-500' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-2 h-2 rounded-full', s.color)} />
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{s.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
