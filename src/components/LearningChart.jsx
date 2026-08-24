import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function DonutChart({ data, size = 160 }) {
  return (
    <div style={{ width: size, height: size }} className="relative mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="pct"
            nameKey="name"
            innerRadius="62%"
            outerRadius="95%"
            paddingAngle={3}
            stroke="none"
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

const WEEK_COLORS = {
  engaged: '#35C46A',
  confused: '#FF9F5A',
  low: '#3FA9F5',
};

export function WeekStrip({ pattern }) {
  return (
    <div className="flex justify-between gap-1.5">
      {pattern.map((d) => (
        <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
          <div
            className="w-full aspect-square rounded-xl"
            style={{ background: WEEK_COLORS[d.state] || '#E5E5E5' }}
          />
          <span className="text-[10px] font-bold text-ink-soft">{d.day}</span>
        </div>
      ))}
    </div>
  );
}
