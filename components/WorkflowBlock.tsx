/**
 * WorkflowBlock — Inspired by 21st.dev N8N Workflow Block
 * Visual automation workflow with animated nodes and connections
 * No external deps — pure React + CSS animations
 */
import React, { useEffect, useState, useRef } from 'react';
import { Webhook, Database, GitBranch, Send, Zap, Bot, BarChart3, Mail } from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'output';
  title: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  color: string;
  status: 'idle' | 'active' | 'done';
}

const nodes: WorkflowNode[] = [
  { id: 'webhook', type: 'trigger', title: 'Webhook Trigger', desc: 'Lead-formulier inzending', icon: Webhook, color: '#F62961', status: 'idle' },
  { id: 'ai', type: 'action', title: 'AI Classificatie', desc: 'Lead score & segmentatie', icon: Bot, color: '#00A3E0', status: 'idle' },
  { id: 'condition', type: 'condition', title: 'Score Check', desc: 'Hoog vs. laag potentieel', icon: GitBranch, color: '#F7E644', status: 'idle' },
  { id: 'crm', type: 'action', title: 'CRM Update', desc: 'HubSpot pipeline bijwerken', icon: Database, color: '#25D366', status: 'idle' },
  { id: 'email', type: 'output', title: 'Auto E-mail', desc: 'Gepersonaliseerde opvolging', icon: Mail, color: '#25D366', status: 'idle' },
];

const WorkflowBlock: React.FC = () => {
  const [activeStep, setActiveStep] = useState(-1);
  const [completed, setCompleted] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          setTimeout(() => runFlow(), 1000);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  const runFlow = () => {
    setIsRunning(true);
    setCompleted([]);
    setActiveStep(0);

    nodes.forEach((_, i) => {
      setTimeout(() => {
        setActiveStep(i);
        setTimeout(() => {
          setCompleted(prev => [...prev, nodes[i].id]);
          if (i === nodes.length - 1) {
            setIsRunning(false);
            setActiveStep(-1);
            // Restart after pause
            setTimeout(() => {
              setCompleted([]);
              runFlow();
            }, 3000);
          }
        }, 800);
      }, i * 1000);
    });
  };

  return (
    <div ref={containerRef} className="w-full">
      <div
        className="relative rounded-[2.5rem] overflow-hidden p-8 md:p-12"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute w-96 h-96 rounded-full blur-[100px] opacity-10"
            style={{ top: '20%', left: '10%', background: '#F62961' }}
          />
          <div
            className="absolute w-96 h-96 rounded-full blur-[100px] opacity-10"
            style={{ bottom: '10%', right: '15%', background: '#25D366' }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-10 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Zap size={16} className="text-[#F7E644]" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">AUTOMATION WORKFLOW</span>
            </div>
            <h3 className="text-white font-black uppercase tracking-tighter text-2xl md:text-3xl">
              LEAD → KLANT <span className="text-[#25D366]">IN 3 STAPPEN</span>
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${isRunning ? 'animate-pulse bg-[#25D366]' : 'bg-white/20'}`}
            />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
              {isRunning ? 'RUNNING' : 'STANDBY'}
            </span>
          </div>
        </div>

        {/* Nodes */}
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-0">
          {nodes.map((node, i) => {
            const Icon = node.icon;
            const isActive = activeStep === i;
            const isDone = completed.includes(node.id);
            const isLast = i === nodes.length - 1;

            return (
              <React.Fragment key={node.id}>
                {/* Node */}
                <div
                  className={`relative flex-shrink-0 rounded-2xl p-4 md:p-5 border transition-all duration-500 w-full md:w-36 ${
                    isActive
                      ? 'border-white/30 bg-white/10 scale-105'
                      : isDone
                      ? 'border-opacity-50 bg-white/5'
                      : 'border-white/5 bg-white/[0.02]'
                  }`}
                  style={{
                    borderColor: isActive ? node.color : isDone ? `${node.color}40` : undefined,
                    boxShadow: isActive ? `0 0 20px ${node.color}30` : undefined,
                  }}
                >
                  {/* Type badge */}
                  <span
                    className="text-[8px] font-black uppercase tracking-[0.3em] block mb-3"
                    style={{ color: `${node.color}80` }}
                  >
                    {node.type}
                  </span>

                  {/* Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${
                      isActive ? 'scale-110' : ''
                    }`}
                    style={{ background: `${node.color}15`, border: `1px solid ${node.color}30` }}
                  >
                    <Icon size={16} style={{ color: node.color }} />
                  </div>

                  {/* Text */}
                  <div className="text-white font-black text-xs leading-tight mb-1">{node.title}</div>
                  <div className="text-white/30 font-medium text-[10px] leading-tight">{node.desc}</div>

                  {/* Status indicator */}
                  <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        isActive ? 'animate-pulse' : isDone ? 'opacity-100' : 'opacity-20'
                      }`}
                      style={{ backgroundColor: isDone || isActive ? node.color : '#fff' }}
                    />
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">
                      {isActive ? 'PROCESSING' : isDone ? 'DONE' : 'QUEUE'}
                    </span>
                  </div>
                </div>

                {/* Connector */}
                {!isLast && (
                  <div className="flex-shrink-0 hidden md:flex items-center justify-center w-8 relative">
                    <div className="absolute w-full h-px bg-white/10" />
                    {/* Animated pulse dot */}
                    <div
                      className={`w-2 h-2 rounded-full border-2 border-black z-10 transition-all duration-300 ${
                        isDone && !isActive ? 'scale-125' : 'scale-100'
                      }`}
                      style={{
                        backgroundColor: isDone ? nodes[i].color : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  </div>
                )}

                {/* Mobile connector */}
                {!isLast && (
                  <div className="md:hidden flex items-center justify-center h-6 relative self-stretch w-full">
                    <div className="absolute h-full w-px bg-white/10 left-1/2" />
                    <div
                      className={`w-2 h-2 rounded-full border-2 border-black z-10 transition-all duration-300`}
                      style={{ backgroundColor: isDone ? nodes[i].color : 'rgba(255,255,255,0.1)' }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/5 relative z-10 flex items-center justify-between">
          <span className="text-[9px] font-mono text-white/15 tracking-[0.3em] uppercase">
            POWERED BY n8n + OPENAI // REAL-TIME AUTOMATION
          </span>
          <div className="flex items-center gap-2">
            <BarChart3 size={12} className="text-[#25D366] opacity-50" />
            <span className="text-[9px] font-mono text-white/15 tracking-[0.2em]">
              AVG: 0.8s / FLOW
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBlock;
