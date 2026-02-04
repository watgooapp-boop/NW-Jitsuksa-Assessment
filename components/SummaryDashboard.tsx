
import React from 'react';
import { SummaryStat, AssessmentType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TAB_CONFIG } from '../constants';

interface SummaryDashboardProps {
  activeTab: AssessmentType;
  stats: SummaryStat[];
  totalStudents: number;
  isPrintMode?: boolean;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']; // Green, Blue, Yellow, Red

const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ activeTab, stats, totalStudents, isPrintMode = false }) => {
  const currentTab = TAB_CONFIG[activeTab];
  
  const chartData = stats.map((s, idx) => ({
    name: s.level,
    value: s.count,
    color: COLORS[idx] || '#cbd5e1'
  }));

  return (
    <div className={`space-y-8 ${isPrintMode ? 'space-y-12' : ''}`}>
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${isPrintMode ? 'grid-cols-2 gap-10' : ''}`}>
        
        {/* Statistics Table */}
        <div className={`bg-white p-6 rounded-xl ${isPrintMode ? 'rounded-none border border-black p-4' : 'shadow-sm border border-slate-200'}`}>
          <h3 className={`text-xl font-bold text-slate-800 mb-6 flex items-center ${isPrintMode ? 'text-black mb-4' : ''}`}>
            {!isPrintMode && <span className={`w-2 h-8 bg-${currentTab.accent}-600 rounded-full mr-3`}></span>}
            บทสรุปผลการประเมิน
          </h3>
          <div className="overflow-x-auto">
            <table className={`w-full ${isPrintMode ? 'text-[11px]' : 'text-sm'}`}>
              <thead className={`bg-slate-50 border-y ${isPrintMode ? 'border-black' : 'border-slate-200'}`}>
                <tr>
                  <th className="p-3 text-left">ระดับคุณภาพ</th>
                  <th className="p-3 text-center">เกณฑ์คะแนน</th>
                  <th className="p-3 text-center">จำนวน (คน)</th>
                  <th className="p-3 text-center">ร้อยละ</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isPrintMode ? 'divide-black' : 'divide-slate-100'}`}>
                {stats.map((s, idx) => (
                  <tr key={s.level} className={`${isPrintMode ? '' : 'hover:bg-slate-50 transition-colors'}`}>
                    <td className="p-3 font-semibold text-slate-700">
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[idx], border: isPrintMode ? '0.5pt solid black' : 'none' }}></span>
                        {s.level}
                      </div>
                      <span className={`text-[10px] font-normal text-slate-400 block ml-5 ${isPrintMode ? 'text-black' : ''}`}>{s.description}</span>
                    </td>
                    <td className="p-3 text-center text-slate-600">
                      {s.minScore} - {s.maxScore}
                    </td>
                    <td className="p-3 text-center font-bold text-slate-800">{s.count}</td>
                    <td className="p-3 text-center font-bold text-slate-800">{s.percentage.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className={`${isPrintMode ? 'bg-slate-100 text-black border-t-2 border-black' : 'bg-slate-800 text-white'} font-bold`}>
                <tr>
                  <td colSpan={2} className="p-3 text-right">รวมทั้งสิ้น</td>
                  <td className="p-3 text-center">{totalStudents}</td>
                  <td className="p-3 text-center">100.0%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Visualization */}
        <div className={`bg-white p-6 rounded-xl ${isPrintMode ? 'rounded-none border border-black p-4' : 'shadow-sm border border-slate-200'} flex flex-col items-center justify-center min-h-[400px]`}>
          <h3 className="text-xl font-bold text-slate-800 mb-6 w-full text-left">สถิติแสดงผลการประเมิน</h3>
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="45%"
                  innerRadius={isPrintMode ? 50 : 60}
                  outerRadius={isPrintMode ? 90 : 100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#000" strokeWidth={0.5} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} คน`, 'จำนวนนักเรียน']} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: isPrintMode ? '10px' : '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Level Card */}
      <div className={`p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 ${
        isPrintMode 
          ? 'bg-white border-2 border-black rounded-none shadow-none text-black p-6' 
          : `bg-${currentTab.accent}-900 text-white shadow-xl`
      }`}>
        <div className="space-y-2 text-center md:text-left">
          <h4 className={`font-medium uppercase tracking-widest text-sm ${isPrintMode ? 'text-slate-600' : `text-${currentTab.accent}-200`}`}>ผลสรุปภาพรวม</h4>
          <p className="text-3xl font-bold">{currentTab.label}</p>
          <p className={`opacity-80 ${isPrintMode ? 'text-black' : `text-${currentTab.accent}-100`}`}>{currentTab.subtitle}</p>
        </div>
        <div className="flex gap-4">
          {stats.slice(0, 2).map((s, idx) => (
            <div key={s.level} className={`p-4 rounded-xl border min-w-[130px] text-center ${
              isPrintMode 
                ? 'bg-slate-50 border-black text-black' 
                : 'bg-white/10 backdrop-blur-md border-white/20'
            }`}>
              <span className="text-4xl font-black block">{s.count}</span>
              <span className={`text-xs font-bold uppercase ${isPrintMode ? 'text-slate-600' : `text-${currentTab.accent}-200`}`}>{s.level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryDashboard;
