import { motion } from "framer-motion";
import { FileText, Users, CheckCircle, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { MetricCard } from "@/components/MetricCard";

const areaData = [
  { name: "Ene", envios: 120, abiertos: 80 },
  { name: "Feb", envios: 180, abiertos: 130 },
  { name: "Mar", envios: 240, abiertos: 190 },
  { name: "Abr", envios: 310, abiertos: 250 },
  { name: "May", envios: 280, abiertos: 220 },
  { name: "Jun", envios: 390, abiertos: 310 },
  { name: "Jul", envios: 450, abiertos: 370 },
  { name: "Ago", envios: 520, abiertos: 430 },
];

const barData = [
  { name: "Contacto", value: 340 },
  { name: "Demo", value: 220 },
  { name: "Newsletter", value: 180 },
  { name: "Soporte", value: 90 },
  { name: "Registro", value: 260 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="font-medium text-foreground">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function Index() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Resumen de formularios y métricas CRM</p>
      </motion.div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={FileText} title="Formularios" value="12" change="+3 este mes" changeType="positive" delay={0.05} />
        <MetricCard icon={Users} title="Submissions" value="2,847" change="+18.2%" changeType="positive" delay={0.1} />
        <MetricCard icon={CheckCircle} title="Tasa Éxito" value="94.3%" change="+2.1pp" changeType="positive" delay={0.15} />
        <MetricCard icon={TrendingUp} title="Conversión" value="12.8%" change="-0.4pp" changeType="negative" delay={0.2} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="glass-card p-5 lg:col-span-2"
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">Envíos por Mes</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="gLime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(82,78%,55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(82,78%,55%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(195,90%,60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(195,90%,60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,22%)" />
              <XAxis dataKey="name" tick={{ fill: "hsl(215,16%,65%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215,16%,65%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="envios" stroke="hsl(82,78%,55%)" fill="url(#gLime)" strokeWidth={2} />
              <Area type="monotone" dataKey="abiertos" stroke="hsl(195,90%,60%)" fill="url(#gCyan)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="glass-card p-5"
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">Por Tipo</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,22%)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "hsl(215,16%,65%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "hsl(215,16%,65%)", fontSize: 11 }} axisLine={false} tickLine={false} width={75} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="hsl(250,40%,55%)" radius={[0, 6, 6, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
