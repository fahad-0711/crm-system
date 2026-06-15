import React, { useEffect, useRef } from 'react';
import { useCRM } from '../context/CRMContext';
import { Target, Flame, DollarSign, CheckSquare } from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import FunnelOverview from '../components/Dashboard/FunnelOverview';
import SourceBreakdown from '../components/Dashboard/SourceBreakdown';
import RecentLeadsTable from '../components/Dashboard/RecentLeadsTable';
import TodayActivities from '../components/Dashboard/TodayActivities';
import AgentLeaderboard from '../components/Dashboard/AgentLeaderboard';
import FunnelChart from '../components/Dashboard/FunnelChart';
import QuickActions from '../components/Dashboard/QuickActions';

export default function DashboardPage() {
  const { pipelineStats, valueFormatted, leads } = useCRM();
  const canvasRef = useRef(null);

  // Sparkline data generators
  const sparklineLeads = [
    { val: 200 }, { val: 210 }, { val: 205 }, { val: 230 }, { val: 250 }, { val: 245 }, { val: 284 }
  ];
  const sparklineHot = [
    { val: 30 }, { val: 35 }, { val: 32 }, { val: 40 }, { val: 45 }, { val: 42 }, { val: 47 }
  ];
  const sparklineVal = [
    { val: 12 }, { val: 14 }, { val: 13 }, { val: 16 }, { val: 15 }, { val: 17 }, { val: 18.4 }
  ];
  const sparklineClosed = [
    { val: 4 }, { val: 6 }, { val: 5 }, { val: 7 }, { val: 8 }, { val: 7 }, { val: 9 }
  ];

  // Particle background simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let particles = [];
    const particleCount = 20;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? '#00f5ff' : '#bf00ff',
        speedX: Math.random() * 0.4 - 0.2,
        speedY: Math.random() * -0.6 - 0.1, // Drifting upwards
        opacity: Math.random() * 0.2 + 0.15
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow

        // Update positions
        p.x += p.speedX;
        p.y += p.speedY;

        // Reset particle if it drifts off top
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        // bounce on walls
        if (p.x < 0 || p.x > canvas.width) {
          p.speedX = -p.speedX;
        }
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="space-y-6 relative pb-12">
      {/* Background Canvas Particles */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
      />

      {/* Row 1: KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <StatCard
          title="Total Leads"
          targetValue={pipelineStats.totalLeads}
          trendText="12% this month"
          trendDirection="up"
          icon={Target}
          color="cyan"
          sparklineData={sparklineLeads}
          animateDelayClass="delay-1"
        />
        <StatCard
          title="Hot Leads"
          targetValue={pipelineStats.hotLeads}
          trendText="8% this week"
          trendDirection="up"
          icon={Flame}
          color="magenta"
          sparklineData={sparklineHot}
          animateDelayClass="delay-2"
        />
        <StatCard
          title="Pipeline Value"
          targetValue={18.4}
          isFloat={true}
          prefix="₹"
          suffix="Cr"
          trendText="23% total"
          trendDirection="up"
          icon={DollarSign}
          color="purple"
          sparklineData={sparklineVal}
          animateDelayClass="delay-3"
        />
        <StatCard
          title="Deals Closed"
          targetValue={pipelineStats.closedDeals}
          trendText="3 from last month"
          trendDirection="up"
          icon={CheckSquare}
          color="green"
          sparklineData={sparklineClosed}
          animateDelayClass="delay-4"
        />
      </div>

      {/* Row 2: Funnel + Source Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative z-10">
        <div className="lg:col-span-3">
          <FunnelOverview animateDelayClass="delay-5" />
        </div>
        <div className="lg:col-span-2">
          <SourceBreakdown animateDelayClass="delay-6" />
        </div>
      </div>

      {/* Row 3: Recent Leads + Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 relative z-10">
        <div className="lg:col-span-6">
          <RecentLeadsTable animateDelayClass="delay-7" />
        </div>
        <div className="lg:col-span-4">
          <TodayActivities animateDelayClass="delay-8" />
        </div>
      </div>

      {/* Row 4: Leaderboard + Conversion + Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        <AgentLeaderboard animateDelayClass="delay-9" />
        <FunnelChart animateDelayClass="delay-10" />
        <QuickActions animateDelayClass="delay-10" />
      </div>
    </div>
  );
}
