
import React from 'react';
import { AssessmentMetadata, AssessmentType } from '../types';
import { LOGO_URL, TAB_CONFIG } from '../constants';

interface HeaderProps {
  metadata: AssessmentMetadata;
  onMetadataChange: (meta: AssessmentMetadata) => void;
  activeTab: AssessmentType;
  onTabChange: (type: AssessmentType) => void;
  isPrintMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({ metadata, onMetadataChange, activeTab, onTabChange, isPrintMode = false }) => {
  const currentTab = TAB_CONFIG[activeTab];

  return (
    <header className="flex flex-col items-center space-y-4">
      <img src={LOGO_URL} alt="NW School Logo" className={`h-24 w-auto drop-shadow-md ${isPrintMode ? 'print:h-24' : ''}`} />
      <div className="text-center space-y-1">
        <h1 className={`font-bold text-slate-900 ${isPrintMode ? 'text-2xl' : 'text-2xl md:text-3xl'}`}>แบบบันทึกผลการประเมินคุณภาพผู้เรียน ด้านจิตศึกษา</h1>
        <p className={`text-slate-600 font-medium ${isPrintMode ? 'text-xl' : 'text-xl'}`}>โรงเรียนหนองบัวแดงวิทยา จังหวัดชัยภูมิ</p>
        <div className={`mt-4 py-2 px-6 bg-${currentTab.accent}-50 rounded-full text-${currentTab.accent}-700 font-semibold inline-block border border-${currentTab.accent}-100 transition-colors duration-300 ${isPrintMode ? 'bg-transparent border-none text-black mt-2 font-bold underline decoration-indigo-500 underline-offset-8' : ''}`}>
          {currentTab.subtitle}
        </div>
      </div>

      {/* Tab Switcher - Hidden in print and preview mode */}
      {!isPrintMode && (
        <nav className="w-full max-w-lg no-print pt-4">
          <div className="bg-white p-1 rounded-xl shadow-inner border border-slate-200 flex">
            {Object.entries(TAB_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() => onTabChange(key as AssessmentType)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-200 ${
                  activeTab === key 
                    ? `bg-${config.accent}-600 text-white shadow-md transform scale-[1.02]` 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Input Fields - Hidden in print and preview mode */}
      {!isPrintMode && (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200 no-print">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">กิจกรรมที่ / เรื่อง</label>
            <div className="flex gap-2">
               <input 
                type="text" 
                value={metadata.activityNumber}
                onChange={(e) => onMetadataChange({...metadata, activityNumber: e.target.value})}
                placeholder="4.1"
                className="w-20 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input 
                type="text" 
                value={metadata.activityName}
                onChange={(e) => onMetadataChange({...metadata, activityName: e.target.value})}
                placeholder="ระบุชื่อกิจกรรม..."
                className="flex-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">ครูผู้สอน</label>
            <input 
              type="text" 
              value={metadata.teacherName}
              onChange={(e) => onMetadataChange({...metadata, teacherName: e.target.value})}
              placeholder="ระบุชื่อคุณครู..."
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
      )}

      {/* Static Info Display - Shown in print and preview mode */}
      {isPrintMode && (
        <div className="w-full text-left mt-8 border-b-2 border-slate-800 pb-6 mb-4">
          <div className="space-y-3">
            <p className="text-base">
              <span className="font-bold">กิจกรรมที่:</span> {metadata.activityNumber || '........'} &nbsp;&nbsp;
              <span className="font-bold">เรื่อง:</span> {metadata.activityName || '................................................................................................'}
            </p>
            <p className="text-base">
              <span className="font-bold">ครูผู้สอน:</span> {metadata.teacherName || '..................................................................'}
            </p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
