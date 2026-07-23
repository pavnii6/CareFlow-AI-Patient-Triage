'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { cn, riskHeatColor, formatDate } from '@/lib/utils';
import { RISKS } from '@/data/pmo';
import { AlertTriangle, Shield, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import type { Risk } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  open:      'badge-high',
  mitigated: 'badge-low',
  accepted:  'badge-medium',
  closed:    'bg-slate-100 text-slate-600 border-slate-200',
  escalated: 'badge-critical',
};

const HEAT_MATRIX = Array.from({ length: 5 }, (_, probIdx) =>
  Array.from({ length: 5 }, (_, impIdx) => {
    const prob = 5 - probIdx;
    const impact = impIdx + 1;
    const score = prob * impact;
    const risks = RISKS.filter(r => r.probability === prob && r.impact === impact);
    return { prob, impact, score, risks };
  })
);

export default function RiskRegisterPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [hoveredRisk, setHoveredRisk] = useState<Risk | null>(null);

  const filtered = RISKS.filter(r => filter === 'all' || r.status === filter || r.category.toLowerCase() === filter.toLowerCase());

  const stats = [
    { label: 'Total Risks', value: RISKS.length, color: 'text-foreground' },
    { label: 'Open', value: RISKS.filter(r => r.status === 'open').length, color: 'text-red-600' },
    { label: 'Escalated', value: RISKS.filter(r => r.status === 'escalated').length, color: 'text-orange-600' },
    { label: 'Mitigated', value: RISKS.filter(r => r.status === 'mitigated').length, color: 'text-green-600' },
    { label: 'Critical (≥15)', value: RISKS.filter(r => r.score >= 15).length, color: 'text-red-600' },
    { label: 'High (10-14)', value: RISKS.filter(r => r.score >= 10 && r.score < 15).length, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Risk Register</h1>
        <p className="text-muted-foreground text-sm mt-1">Project risk identification, assessment, heat map, and mitigation tracking</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {stats.map(s => (
          <Card key={s.label} className="p-4 text-center">
            <div className={cn('text-2xl font-bold', s.color)}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heat map */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Heat Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {/* Column headers (Impact) */}
              <div className="flex items-center gap-1.5 ml-8">
                <div className="text-[10px] text-muted-foreground mr-1 flex-shrink-0">Impact →</div>
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex-1 text-center text-[10px] font-semibold text-muted-foreground">{i}</div>
                ))}
              </div>
              {HEAT_MATRIX.map((row, ri) => (
                <div key={ri} className="flex items-center gap-1.5">
                  <div className="text-[10px] font-semibold text-muted-foreground w-6 text-center flex-shrink-0">
                    {row[0].prob}
                  </div>
                  {row.map((cell, ci) => (
                    <div
                      key={ci}
                      className="flex-1 aspect-square rounded-lg flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:opacity-75 transition-all hover:scale-105 relative"
                      style={{ backgroundColor: riskHeatColor(cell.score) }}
                      onMouseEnter={() => cell.risks[0] && setHoveredRisk(cell.risks[0])}
                      onMouseLeave={() => setHoveredRisk(null)}
                      title={`P${cell.prob}×I${cell.impact} = ${cell.score}\n${cell.risks.map(r => r.title).join(', ')}`}
                    >
                      {cell.risks.length > 0 ? cell.risks.length : ''}
                    </div>
                  ))}
                </div>
              ))}
              {/* Row header */}
              <div className="flex justify-end mt-1">
                <span className="text-[10px] text-muted-foreground">← Probability</span>
              </div>

              {/* Color legend */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                {[
                  { color: '#EF4444', label: 'Critical ≥15' },
                  { color: '#F97316', label: 'High 10-14' },
                  { color: '#F59E0B', label: 'Medium 5-9' },
                  { color: '#10B981', label: 'Low < 5' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: l.color }} />
                    <span className="text-[10px] text-muted-foreground">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hovered risk preview */}
            {hoveredRisk && (
              <div className="mt-3 p-3 rounded-xl bg-muted/50 border border-border">
                <div className="font-semibold text-sm text-foreground">{hoveredRisk.title}</div>
                <div className="text-xs text-muted-foreground mt-1">Owner: {hoveredRisk.owner}</div>
                <div className="text-xs text-muted-foreground">Score: {hoveredRisk.score} · {hoveredRisk.status}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Risk list */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between w-full flex-wrap gap-3">
              <CardTitle>Risk Register</CardTitle>
              <div className="flex gap-2 flex-wrap">
                {['all', 'open', 'mitigated', 'escalated'].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={cn('px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize',
                      filter === f ? 'kpi-blue text-white' : 'bg-muted text-muted-foreground hover:bg-accent'
                    )}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filtered.sort((a, b) => b.score - a.score).map(risk => (
                <div key={risk.id}>
                  <button
                    className="w-full p-4 text-left hover:bg-muted/30 transition-colors flex items-start gap-4"
                    onClick={() => setExpanded(expanded === risk.id ? null : risk.id)}
                  >
                    {/* Risk indicator */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: riskHeatColor(risk.score) }}
                    >
                      {risk.score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-foreground">{risk.title}</span>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full border', STATUS_COLORS[risk.status])}>
                          {risk.status}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {risk.category} · P{risk.probability}×I{risk.impact} · Owner: {risk.owner}
                      </div>
                    </div>
                    {expanded === risk.id ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                  </button>
                  {expanded === risk.id && (
                    <div className="px-4 pb-4 bg-muted/10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Description</div>
                          <p className="text-sm text-foreground leading-relaxed">{risk.description}</p>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Mitigation Strategy</div>
                            <p className="text-sm text-foreground">{risk.mitigation}</p>
                          </div>
                          {risk.contingency && (
                            <div>
                              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Contingency Plan</div>
                              <p className="text-sm text-foreground">{risk.contingency}</p>
                            </div>
                          )}
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>Identified: {formatDate(risk.dateIdentified)}</span>
                            <span>Review: {formatDate(risk.reviewDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
