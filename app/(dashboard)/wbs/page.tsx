'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';
import { WBS_DATA } from '@/data/pmo';
import { ChevronRight, ChevronDown, ListTree, Circle } from 'lucide-react';
import type { WBSNode } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  done:        'bg-green-100 text-green-700 border-green-200',
  in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
  todo:        'bg-slate-100 text-slate-600 border-slate-200',
  blocked:     'bg-red-100 text-red-700 border-red-200',
  cancelled:   'bg-gray-100 text-gray-500 border-gray-200',
};

function WBSRow({ node, depth = 0, defaultOpen = false }: { node: WBSNode; depth?: number; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <>
      <tr className="hover:bg-muted/30 transition-colors">
        <td>
          <div className="flex items-center" style={{ paddingLeft: `${depth * 24}px` }}>
            {hasChildren ? (
              <button onClick={() => setOpen(!open)} className="mr-2 text-muted-foreground hover:text-foreground">
                {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <span className="mr-2 w-4 flex-shrink-0">
                <Circle className="w-2 h-2 text-muted-foreground ml-1" />
              </span>
            )}
            <span className={cn(
              'font-medium text-sm',
              depth === 0 ? 'text-foreground font-bold' :
              depth === 1 ? 'text-foreground font-semibold' : 'text-foreground'
            )}>
              {node.title}
            </span>
          </div>
        </td>
        <td>
          <span className="font-mono text-xs text-muted-foreground">{node.id}</span>
        </td>
        <td>
          <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium', STATUS_COLORS[node.status])}>
            {node.status.replace('_', ' ')}
          </span>
        </td>
        <td>
          <div className="flex items-center gap-2 min-w-[120px]">
            <Progress value={node.progress} size="sm" className="flex-1"
              color={node.status === 'done' ? 'bg-green-500' : node.status === 'blocked' ? 'bg-red-500' : 'bg-blue-500'}
            />
            <span className="text-xs text-muted-foreground w-8">{node.progress}%</span>
          </div>
        </td>
        <td><span className="text-xs text-muted-foreground">{node.owner ?? '—'}</span></td>
        <td><span className="text-xs text-muted-foreground">{node.duration ?? '—'}</span></td>
      </tr>
      {open && hasChildren && node.children!.map(child => (
        <WBSRow key={child.id} node={child} depth={depth + 1} />
      ))}
    </>
  );
}

export default function WBSPage() {
  const root = WBS_DATA[0];
  const totalNodes = root.children?.reduce((acc, c) => acc + 1 + (c.children?.length ?? 0), 0) ?? 0;
  const doneNodes = root.children?.reduce((acc, c) => {
    const done = c.children?.filter(ch => ch.status === 'done').length ?? 0;
    return acc + done + (c.status === 'done' ? 1 : 0);
  }, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Work Breakdown Structure</h1>
        <p className="text-muted-foreground text-sm mt-1">Hierarchical decomposition of project deliverables with progress tracking</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Work Packages', value: totalNodes },
          { label: 'Completed', value: doneNodes },
          { label: 'In Progress', value: Math.round(totalNodes * 0.3) },
          { label: 'Overall Progress', value: `${root.progress}%` },
        ].map(s => (
          <Card key={s.label} className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Progress by phase */}
      <Card>
        <CardHeader><CardTitle>Phase Progress Overview</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {root.children?.map(phase => (
              <div key={phase.id} className="p-4 rounded-xl bg-muted/40 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-foreground">{phase.title}</span>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full border', STATUS_COLORS[phase.status])}>
                    {phase.status.replace('_', ' ')}
                  </span>
                </div>
                <Progress value={phase.progress} size="md" showLabel
                  color={phase.status === 'done' ? 'bg-green-500' : 'bg-blue-500'}
                />
                <div className="text-xs text-muted-foreground mt-2">Owner: {phase.owner}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* WBS Tree */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ListTree className="w-5 h-5 text-primary" />
            <CardTitle>WBS Hierarchy</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="cf-table min-w-[700px]">
            <thead>
              <tr>
                <th>Work Package</th>
                <th>ID</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Owner</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <WBSRow node={root} depth={0} defaultOpen />
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
