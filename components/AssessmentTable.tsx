import React from 'react';
import { Student, AssessmentType } from '../types';
import { TAB_CONFIG } from '../constants';

interface AssessmentTableProps {
  activeTab: AssessmentType;
  students: Student[];
  maxScorePerCriteria: number;
  onMaxScoreChange: (newMax: number) => void;
  onScoreChange: (studentId: number, criteriaKey: string, value: number) => void;
  onNameChange: (studentId: number, name: string) => void;
  isPrintMode?: boolean;
}

const AssessmentTable: React.FC<AssessmentTableProps> = ({ 
  activeTab, 
  students, 
  maxScorePerCriteria,
  onMaxScoreChange,
  onScoreChange, 
  onNameChange,
  isPrintMode = false
}) => {
  const currentTab = TAB_CONFIG[activeTab];
  const criteria = currentTab.criteria;
  const totalMaxScore = maxScorePerCriteria * 7;

  if (students.length === 0 && !isPrintMode) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-16 text-center">
        <div className="max-w-xs mx-auto space-y-6">
          <div className="bg-slate-100 h-24 w-24 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800">ยังไม่มีรายชื่อนักเรียน</h3>
            <p className="text-slate-500 text-sm">เพิ่มรายชื่อนักเรียนจากแผงจัดการข้อมูลด้านบน</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl overflow-hidden ${isPrintMode ? 'rounded-none border-0' : 'shadow-sm border border-slate-200'}`}>
      <div className="overflow-x-auto">
        <table className={`w-full border-collapse ${isPrintMode ? 'text-[9px]' : 'text-xs md:text-sm'}`}>
          <thead className={isPrintMode ? 'table-header-group' : ''}>
            <tr className={`${isPrintMode ? 'bg-white' : 'bg-slate-50'} border-b ${isPrintMode ? 'border-black' : 'border-slate-200'}`}>
              <th rowSpan={2} className={`p-1 border-r text-center w-8 ${isPrintMode ? 'border-black bg-white' : 'sticky left-0 bg-slate-50 z-10 border-slate-200 p-3 w-12'}`}>ที่</th>
              <th rowSpan={2} className={`p-1 border-r text-center ${isPrintMode ? 'border-black bg-white w-48' : 'sticky left-12 bg-slate-50 z-10 border-slate-200 p-3 w-64'}`}>ชื่อ-สกุล</th>
              <th colSpan={7} className={`p-1 border-r text-center font-bold uppercase tracking-wider ${isPrintMode ? 'border-black bg-white' : `bg-slate-50 text-slate-900 border-slate-200 p-2`}`}>
                <div className="flex flex-col items-center gap-0.5">
                  <span className={isPrintMode ? 'text-[10px]' : 'text-sm'}>
                    รายการประเมิน <span className="text-red-600">{activeTab === AssessmentType.SQ_CRITICAL ? 'การคิดวิจารณญาณ' : '(๑-๗)'}</span>
                  </span>
                </div>
              </th>
              <th rowSpan={2} className={`p-1 text-center w-12 ${isPrintMode ? 'border-black bg-white' : 'bg-slate-800 text-white p-3 w-16'}`}>รวม</th>
            </tr>
            <tr className={`${isPrintMode ? 'bg-white' : 'bg-slate-100'} border-b ${isPrintMode ? 'border-black' : 'border-slate-200'}`}>
              {criteria.map((c, i) => (
                <th key={c.key} className={`p-1 border-r text-center w-16 align-top ${isPrintMode ? 'border-black' : 'border-slate-200 w-24'}`}>
                  <div className={`block overflow-hidden relative ${isPrintMode ? 'h-32' : 'h-48 md:h-56'}`}>
                    <span className={`block absolute bottom-0 left-0 w-full text-left leading-tight px-1 [writing-mode:vertical-rl] rotate-180 font-semibold ${isPrintMode ? 'text-black text-[8px]' : 'text-slate-700'}`}>
                      {c.label}
                    </span>
                  </div>
                  {!isPrintMode && (
                    <div className="mt-2 pt-1 border-t border-slate-300 text-slate-400 text-[10px]">
                      เต็ม 
                      <input 
                        type="number" 
                        min={1} 
                        value={maxScorePerCriteria}
                        onChange={(e) => onMaxScoreChange(parseInt(e.target.value) || 0)}
                        className="ml-1 w-8 text-center bg-white border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  )}
                  {isPrintMode && (
                    <div className="mt-1 pt-1 border-t border-black text-[7px] font-bold">
                      /{maxScorePerCriteria}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => {
              const currentScores = student.scores[activeTab];
              const totalScore = (Object.values(currentScores) as number[]).reduce((a, b) => a + b, 0);
              return (
                <tr key={student.id} className={`${!isPrintMode && idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} hover:bg-slate-100/50 transition-colors border-b ${isPrintMode ? 'border-black' : 'border-slate-100'}`}>
                  <td className={`p-1 border-r text-center font-medium ${isPrintMode ? 'border-black text-black' : 'text-slate-500 sticky left-0 bg-inherit z-10 border-slate-200 py-2'}`}>{student.id}</td>
                  <td className={`p-1 border-r ${isPrintMode ? 'border-black text-black' : 'sticky left-12 bg-inherit z-10 border-slate-200 py-2'}`}>
                    {!isPrintMode ? (
                      <input 
                        type="text" 
                        value={student.name}
                        onChange={(e) => onNameChange(student.id, e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-1 focus:ring-indigo-300 rounded px-1 outline-none font-medium"
                      />
                    ) : (
                      <span className="font-medium">{student.name}</span>
                    )}
                  </td>
                  {criteria.map((c) => {
                    const score = currentScores[c.key as keyof typeof currentScores];
                    const isOverMax = score > maxScorePerCriteria;
                    return (
                      <td key={c.key} className={`p-1 border-r text-center ${isPrintMode ? 'border-black' : 'border-slate-200'} ${!isPrintMode && isOverMax ? 'bg-red-50' : ''}`}>
                        {!isPrintMode ? (
                          <select 
                            value={score}
                            onChange={(e) => onScoreChange(student.id, c.key, parseInt(e.target.value))}
                            className={`w-full text-center p-1 rounded font-bold cursor-pointer appearance-none outline-none focus:ring-2 focus:ring-${currentTab.accent}-400 transition-all ${
                              score > 0 
                                ? `bg-${currentTab.accent}-100 text-${currentTab.accent}-800` 
                                : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            <option value={0}>-</option>
                            {Array.from({ length: Math.max(maxScorePerCriteria, score) }, (_, i) => i + 1).map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        ) : (
                          <span className={`font-bold ${score === 0 ? 'text-slate-100' : 'text-black'}`}>{score || ''}</span>
                        )}
                      </td>
                    );
                  })}
                  <td className={`p-1 text-center font-black ${isPrintMode ? 'border-black text-black' : ''} ${!isPrintMode ? (
                    totalScore >= (totalMaxScore * 0.9) ? 'text-emerald-600' : 
                    totalScore >= (totalMaxScore * 0.7) ? 'text-blue-600' : 
                    totalScore >= (totalMaxScore * 0.5) ? 'text-amber-600' : 'text-rose-600'
                  ) : ''}`}>
                    {totalScore || ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className={`${isPrintMode ? 'bg-white text-black border-t-2 border-black' : 'bg-slate-800 text-white'} font-bold`}>
            <tr>
              <td colSpan={2} className={`p-1 text-right ${isPrintMode ? 'border-black' : 'border-slate-600 py-3'}`}>คะแนนเต็ม</td>
              {criteria.map(c => (
                <td key={c.key} className={`p-1 text-center border-r ${isPrintMode ? 'border-black' : 'border-slate-600 py-3'}`}>{maxScorePerCriteria}</td>
              ))}
              <td className={`p-1 text-center ${isPrintMode ? 'border-black' : 'py-3'}`}>{totalMaxScore}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default AssessmentTable;
