
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Student, 
  AssessmentMetadata, 
  GradeLevel, 
  SummaryStat,
  AssessmentType,
  AssessmentScore
} from './types';
import { 
  GRADE_THRESHOLDS as DEFAULT_THRESHOLDS, 
  INITIAL_SCORES, 
  TAB_CONFIG
} from './constants';
import Header from './components/Header';
import AssessmentTable from './components/AssessmentTable';
import SummaryDashboard from './components/SummaryDashboard';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AssessmentType>(AssessmentType.SQ_CRITICAL);
  const [bulkInput, setBulkInput] = useState<string>('');
  const [showAddPanel, setShowAddPanel] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  const [maxScores, setMaxScores] = useState<Record<AssessmentType, number>>({
    [AssessmentType.SQ_CRITICAL]: 4,
    [AssessmentType.EQ_AWARENESS]: 4,
    [AssessmentType.LEARNING_ANXIETY]: 4
  });

  const [randRange, setRandRange] = useState({ min: 1, max: 4 });
  
  const [metadata, setMetadata] = useState<AssessmentMetadata>({
    activityNumber: '4.1',
    activityName: '',
    teacherName: ''
  });

  const [students, setStudents] = useState<Student[]>([]);
  
  const [thresholds, setThresholds] = useState<Record<AssessmentType, typeof DEFAULT_THRESHOLDS>>({
    [AssessmentType.SQ_CRITICAL]: JSON.parse(JSON.stringify(DEFAULT_THRESHOLDS)),
    [AssessmentType.EQ_AWARENESS]: JSON.parse(JSON.stringify(DEFAULT_THRESHOLDS)),
    [AssessmentType.LEARNING_ANXIETY]: JSON.parse(JSON.stringify(DEFAULT_THRESHOLDS))
  });

  // Load logic - Runs once on mount
  useEffect(() => {
    const savedStudents = localStorage.getItem('assessment_students');
    const savedMetadata = localStorage.getItem('assessment_metadata');
    const savedThresholds = localStorage.getItem('assessment_thresholds_v2');
    
    if (savedStudents) {
      try {
        const parsed = JSON.parse(savedStudents);
        if (Array.isArray(parsed)) setStudents(parsed);
      } catch (e) {}
    }
    
    if (savedMetadata) {
      try {
        setMetadata(JSON.parse(savedMetadata));
      } catch (e) {}
    }

    if (savedThresholds) {
      try {
        setThresholds(JSON.parse(savedThresholds));
      } catch (e) {}
    } else {
      const oldThresholds = localStorage.getItem('assessment_thresholds');
      if (oldThresholds) {
        try {
          const parsed = JSON.parse(oldThresholds);
          if (Array.isArray(parsed)) {
            setThresholds({
              [AssessmentType.SQ_CRITICAL]: JSON.parse(JSON.stringify(parsed)),
              [AssessmentType.EQ_AWARENESS]: JSON.parse(JSON.stringify(parsed)),
              [AssessmentType.LEARNING_ANXIETY]: JSON.parse(JSON.stringify(parsed))
            });
          }
        } catch (e) {}
      }
    }
    
    setIsInitialized(true);
  }, []);

  // Save logic - Only runs after successful initialization
  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem('assessment_students', JSON.stringify(students));
    localStorage.setItem('assessment_metadata', JSON.stringify(metadata));
    localStorage.setItem('assessment_thresholds_v2', JSON.stringify(thresholds));
  }, [students, metadata, thresholds, isInitialized]);

  const handleBulkAdd = () => {
    if (!bulkInput.trim()) return;

    const names = bulkInput.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const newStudents: Student[] = names.map((name, index) => ({
      id: students.length + index + 1,
      name: name,
      scores: {
        [AssessmentType.SQ_CRITICAL]: { ...INITIAL_SCORES },
        [AssessmentType.EQ_AWARENESS]: { ...INITIAL_SCORES },
        [AssessmentType.LEARNING_ANXIETY]: { ...INITIAL_SCORES }
      }
    }));

    setStudents([...students, ...newStudents]);
    setBulkInput('');
    setShowAddPanel(false);
  };

  /**
   * ฟังก์ชันเคลียร์ข้อมูลแบบ Nuclear Reset
   * แก้ไขปัญหา Auto-save บันทึกข้อมูลกลับเร็วเกินไป โดยการ Disable ระบบเขียนข้อมูลชั่วคราว
   */
  const handleFullReset = () => {
    if (window.confirm('ยืนยันการเคลียร์ข้อมูล "ทั้งหมด" ในตาราง?\n(รายชื่อและคะแนนจะถูกลบทิ้งถาวรเพื่อเริ่มข้อมูลชุดใหม่)')) {
      // 1. หยุดการทำงานของ localStorage ทันทีเพื่อป้องกัน Auto-save ในเสี้ยววินาทีสุดท้าย
      try {
        (window.localStorage as any).setItem = () => {};
        (window.localStorage as any).removeItem = () => {};
      } catch (e) {}

      // 2. ใช้คำสั่งล้างข้อมูลจริงผ่าน Prototype ของระบบ
      Storage.prototype.clear.call(window.localStorage);
      
      // 3. บังคับโหลดหน้าจอใหม่ทันที
      window.location.replace(window.location.pathname);
    }
  };

  const handleScoreChange = (studentId: number, criteriaKey: string, value: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          scores: { ...s.scores, [activeTab]: { ...s.scores[activeTab], [criteriaKey]: value } }
        };
      }
      return s;
    }));
  };

  const handleNameChange = (studentId: number, name: string) => {
    setStudents(prev => prev.map(s => (s.id === studentId ? { ...s, name } : s)));
  };

  const handleMaxScoreChange = (newMax: number) => {
    setMaxScores(prev => ({ ...prev, [activeTab]: newMax }));
    if (randRange.max > newMax) {
      setRandRange(r => ({ ...r, max: newMax }));
    }
  };

  const randomizeScores = () => {
    if (students.length === 0) return;
    setStudents(prev => prev.map(s => {
      const newScores: AssessmentScore = { ...s.scores[activeTab] };
      Object.keys(newScores).forEach(key => {
        const k = key as keyof AssessmentScore;
        const randomVal = Math.floor(Math.random() * (randRange.max - randRange.min + 1)) + randRange.min;
        newScores[k] = randomVal;
      });
      return {
        ...s,
        scores: { ...s.scores, [activeTab]: newScores }
      };
    }));
  };

  const currentTabConfig = TAB_CONFIG[activeTab];
  const currentMaxTotal = maxScores[activeTab] * 7;
  const currentThresholds = thresholds[activeTab];

  const dynamicThresholds = useMemo(() => {
    return currentThresholds.map(g => ({
      ...g,
      max: g.level === currentThresholds[0].level ? currentMaxTotal : g.max
    }));
  }, [currentMaxTotal, currentThresholds]);

  const summaryStats = useMemo<SummaryStat[]>(() => {
    const counts: Record<string, number> = {};
    currentThresholds.forEach(t => { counts[t.level] = 0; });

    students.forEach(s => {
      const currentScores = s.scores[activeTab];
      const total = (Object.values(currentScores) as number[]).reduce((a, b) => a + b, 0);
      const grade = dynamicThresholds.find(g => total >= g.min && total <= g.max);
      if (grade) {
        counts[grade.level]++;
      } else if (total < dynamicThresholds[dynamicThresholds.length - 1].min) {
        counts[currentThresholds[currentThresholds.length - 1].level]++;
      }
    });

    return dynamicThresholds.map(g => ({
      level: g.level as GradeLevel,
      description: g.description,
      minScore: g.min,
      maxScore: g.max,
      count: counts[g.level] || 0,
      percentage: students.length > 0 ? ((counts[g.level] || 0) / students.length) * 100 : 0,
    }));
  }, [students, activeTab, dynamicThresholds, currentThresholds]);

  const togglePreview = () => {
    setIsPreview(!isPreview);
    window.scrollTo(0, 0);
  };

  const updateThresholdLevel = (index: number, newLevel: string) => {
    const newTabThresholds = [...currentThresholds];
    newTabThresholds[index] = { ...newTabThresholds[index], level: newLevel as GradeLevel };
    setThresholds(prev => ({ ...prev, [activeTab]: newTabThresholds }));
  };

  const updateThresholdDesc = (index: number, newDesc: string) => {
    const newTabThresholds = [...currentThresholds];
    newTabThresholds[index] = { ...newTabThresholds[index], description: newDesc };
    setThresholds(prev => ({ ...prev, [activeTab]: newTabThresholds }));
  };

  const updateThresholdMin = (index: number, newMin: number) => {
    const newTabThresholds = [...currentThresholds];
    newTabThresholds[index] = { ...newTabThresholds[index], min: newMin };
    if (index < currentThresholds.length - 1) {
      newTabThresholds[index + 1] = { ...newTabThresholds[index + 1], max: newMin - 1 };
    }
    setThresholds(prev => ({ ...prev, [activeTab]: newTabThresholds }));
  };

  if (isPreview) {
    return (
      <div className="preview-mode min-h-screen">
        <div className="no-print fixed top-6 right-10 z-50 flex flex-col gap-3">
          <button onClick={togglePreview} className="px-6 py-2 bg-white text-slate-800 rounded-lg font-bold shadow-xl hover:bg-slate-100 border border-slate-300 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
            กลับไปแก้ไขข้อมูล
          </button>
          <button onClick={() => window.print()} className="px-6 py-4 bg-red-600 text-white rounded-lg font-bold shadow-2xl hover:bg-red-700 transition-all flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            พิมพ์รายงานเป็น PDF
          </button>
        </div>

        <div className="a4-page">
          <Header metadata={metadata} onMetadataChange={setMetadata} activeTab={activeTab} onTabChange={setActiveTab} isPrintMode={true} />
          <div className="mt-4">
            <AssessmentTable activeTab={activeTab} students={students} maxScorePerCriteria={maxScores[activeTab]} onMaxScoreChange={handleMaxScoreChange} onScoreChange={handleScoreChange} onNameChange={handleNameChange} isPrintMode={true} />
          </div>
        </div>

        <div className="a4-page">
          <SummaryDashboard activeTab={activeTab} stats={summaryStats} totalStudents={students.length} isPrintMode={true} />
          <div className="mt-24 pb-12 flex justify-between items-start gap-16 text-center">
            <div className="w-1/2 flex flex-col items-center gap-4">
              <p>ลงชื่อ......................................................................</p>
              <p>( {metadata.teacherName || '......................................................'} )</p>
              <p className="font-bold">ผู้รายงาน / ครูผู้สอน</p>
            </div>
            <div className="w-1/2 flex flex-col items-center gap-4">
              <p>ลงชื่อ......................................................................</p>
              <p>(......................................................................)</p>
              <p className="font-bold">ผู้อำนวยการโรงเรียนหนองบัวแดงวิทยา</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <Header metadata={metadata} onMetadataChange={setMetadata} activeTab={activeTab} onTabChange={setActiveTab} isPrintMode={false} />

        <main className="space-y-8">
          {/* Management Panel */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                จัดการรายชื่อและเกณฑ์ ({students.length} คน)
              </h2>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setShowAddPanel(!showAddPanel)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-sm transition-all ${showAddPanel ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  {showAddPanel ? 'ปิดแผงจัดการชื่อ' : 'เพิ่มรายชื่อนักเรียน'}
                </button>
                
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-sm transition-all ${showSettings ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700'}`}
                >
                  {showSettings ? 'ปิดการตั้งค่า' : `แก้ไขเกณฑ์ของ ${currentTabConfig.label}`}
                </button>
              </div>
            </div>

            {/* Threshold Settings Panel */}
            {showSettings && (
              <div className="mb-6 p-5 bg-indigo-50 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-top-2">
                <h3 className="text-sm font-bold text-indigo-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
                  ตั้งค่าเกณฑ์คุณภาพสำหรับ: {currentTabConfig.label}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {currentThresholds.map((t, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg border border-indigo-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-center shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">ชื่อระดับคุณภาพ</span>
                        <input type="text" value={t.level} onChange={(e) => updateThresholdLevel(idx, e.target.value)} className="p-2 text-sm font-bold border rounded outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div className="flex flex-col md:col-span-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">คำอธิบายประกอบ</span>
                        <input type="text" value={t.description} onChange={(e) => updateThresholdDesc(idx, e.target.value)} className="p-2 text-sm border rounded outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">คะแนนขั้นต่ำ (Min)</span>
                        <div className="flex items-center gap-2">
                           <input type="number" value={t.min} onChange={(e) => updateThresholdMin(idx, parseInt(e.target.value) || 0)} className="w-full p-2 text-sm border rounded text-center font-bold" />
                           <span className="text-xs text-slate-400">ถึง {idx === 0 ? currentMaxTotal : t.max}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showAddPanel && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <label className="block text-sm font-medium text-slate-600 mb-2">วางรายชื่อนักเรียนที่นี่ (บรรทัดละ 1 ชื่อ)</label>
                  <textarea value={bulkInput} onChange={(e) => setBulkInput(e.target.value)} placeholder="นาย เทวาพิทักษ์ สายทอง&#10;นาย นริศภรินทร์ หมวดเมืองกลาง..." rows={6} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-sans text-sm shadow-inner" />
                  <div className="mt-3 flex justify-end">
                    <button onClick={handleBulkAdd} disabled={!bulkInput.trim()} className="px-8 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 disabled:opacity-40 transition-all active:scale-95">เพิ่มนักเรียนเข้าระบบ</button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Randomizer Tool */}
          {students.length > 0 && (
            <section className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
              <span className="text-sm font-bold text-slate-500 uppercase">สุ่มคะแนน:</span>
              <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                <input type="number" value={randRange.min} min={0} max={maxScores[activeTab]} onChange={(e) => setRandRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))} className="w-12 p-1 text-center bg-white border border-slate-300 rounded text-xs font-bold outline-none" />
                <span className="text-slate-400">ถึง</span>
                <input type="number" value={randRange.max} min={randRange.min} max={maxScores[activeTab]} onChange={(e) => setRandRange(prev => ({ ...prev, max: parseInt(e.target.value) || 0 }))} className="w-12 p-1 text-center bg-white border border-slate-300 rounded text-xs font-bold outline-none" />
                <button onClick={randomizeScores} className="ml-2 px-4 py-1.5 bg-amber-500 text-white text-xs font-bold rounded hover:bg-amber-600 shadow-sm active:scale-95">สุ่มตอนนี้</button>
              </div>
            </section>
          )}

          {/* ส่วนหัวของตาราง พร้อมปุ่มเคลียร์ข้อมูล */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8 mb-2 p-4 bg-white rounded-t-xl border-x border-t border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              ตารางบันทึกคะแนนรายบุคคล
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={handleFullReset}
                className="px-6 py-2 text-sm font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 shadow-lg active:scale-95 flex items-center gap-2 transition-all border-b-4 border-rose-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                เคลียร์ข้อมูลและเริ่มต้นใหม่
              </button>
            </div>
          </div>

          <AssessmentTable activeTab={activeTab} students={students} maxScorePerCriteria={maxScores[activeTab]} onMaxScoreChange={handleMaxScoreChange} onScoreChange={handleScoreChange} onNameChange={handleNameChange} isPrintMode={false} />

          {students.length > 0 && (
            <SummaryDashboard activeTab={activeTab} stats={summaryStats} totalStudents={students.length} isPrintMode={false} />
          )}
        </main>

        <footer className="pt-12 pb-16 text-center text-slate-400 text-sm border-t border-slate-200 mt-12">
          <p>© {new Date().getFullYear()} โรงเรียนหนองบัวแดงวิทยา จังหวัดชัยภูมิ</p>
          <div className="mt-6">
            <button onClick={togglePreview} disabled={students.length === 0} className="px-10 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-all shadow-xl hover:shadow-2xl flex items-center gap-3 mx-auto disabled:opacity-30 group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-125 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              ออกรายงาน / พิมพ์เป็น PDF
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
