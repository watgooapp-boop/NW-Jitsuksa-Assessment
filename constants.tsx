
import { GradeLevel, AssessmentScore, AssessmentType } from './types';

export const LOGO_URL = 'https://img5.pic.in.th/file/secure-sv1/nw_logo-removebg.png';

export const SQ_CRITERIA = [
  { key: 'c1', label: 'แยกแยะถูกผิดตามหลักคุณธรรม : ตัดสินใจโดยใช้จริยธรรม ไม่เอาเปรียบผู้อื่น' },
  { key: 'c2', label: 'ตั้งคำถามกับค่านิยม/ความเชื่ออย่างใคร่ครวญ : ไม่ยอมรับสิ่งต่างๆ โดยปราศจากการวิจารณญาณ' },
  { key: 'c3', label: 'วิเคราะห์ผลของการตัดสินใจ : คำนึงถึงผลลัพธ์ก่อนลงมือทำ' },
  { key: 'c4', label: 'เปิดใจรับฟังความเห็นต่าง : ยินดีปรับเปลี่ยนความคิดหากมีเหตุผลที่ถูกต้อง' },
  { key: 'c5', label: 'เชื่อมโยงการคิดกับคุณค่าภายใน : ใช้เมตตาธรรม ในการตัดสินใจ' },
  { key: 'c6', label: 'สะท้อนความคิดอย่างซื่อสัตย์ โดยไม่มีอคติ' },
  { key: 'c7', label: 'ไม่หลงตามกระแสสังคมหรืออารมณ์กลุ่ม ยินดีในความคิดที่เป็นธรรม' },
];

export const EQ_CRITERIA = [
  { key: 'c1', label: 'สามารถระบุอารมณ์ของตนเองได้ชัดเจน' },
  { key: 'c2', label: 'เข้าใจสาเหตุของอารมณ์ตนเอง' },
  { key: 'c3', label: 'รู้ว่าอารมณ์มีผลต่อความคิดและพฤติกรรมของตน' },
  { key: 'c4', label: 'กล้ายอมรับข้อดี จุดอ่อนของตนเอง' },
  { key: 'c5', label: 'สามารถสะท้อนและทบทวนตนเองได้อย่างตรงไปตรงมา' },
  { key: 'c6', label: 'แยกแยะความรู้สึกชั่วคราวกับตัวตนระยะยาวได้' },
  { key: 'c7', label: 'กล้าแสดงออกความคิดเห็นของตนเอง อย่างเคารพตนเองและผู้อื่น' },
];

export const ANXIETY_CRITERIA = [
  { key: 'c1', label: 'ตระหนักรู้ว่าตนเองมีความวิตกกังวลในการเรียน' },
  { key: 'c2', label: 'ระบุสาเหตุของความวิตกกังวลได้' },
  { key: 'c3', label: 'ใช้เทคนิคผ่อนคลายหรือจัดการอารมณ์ได้' },
  { key: 'c4', label: 'ไม่หลีกเลี่ยงงานหรือสถานการณ์ที่กังวล' },
  { key: 'c5', label: 'วางแผนอ่านหนังสือหรือเตรียมตัวล่วงหน้า' },
  { key: 'c6', label: 'มีทัศนคติเชิงบวกต่อการเรียน' },
  { key: 'c7', label: 'ขอความช่วยเหลือเมื่อรู้สึกเครียด' },
];

export const TAB_CONFIG = {
  [AssessmentType.SQ_CRITICAL]: {
    label: 'SQ: การคิดวิจารณญาณ',
    subtitle: '(การพัฒนาปัญญาภายใน : ความฉลาดด้านจิตวิญญาณ (SQ): การคิดวิจารณญาณ)',
    criteria: SQ_CRITERIA,
    accent: 'indigo'
  },
  [AssessmentType.EQ_AWARENESS]: {
    label: 'EQ: การตระหนักรู้ตนเอง',
    subtitle: '(การพัฒนาปัญญาภายใน : ความฉลาดทางด้านอารมณ์ (EQ) : การตระหนักรู้ตนเอง)',
    criteria: EQ_CRITERIA,
    accent: 'rose'
  },
  [AssessmentType.LEARNING_ANXIETY]: {
    label: 'พฤติกรรม: ความวิตกกังวลในการเรียน',
    subtitle: '(พฤติกรรมการเรียน : ความวิตกกังวลในการเรียน)',
    criteria: ANXIETY_CRITERIA,
    accent: 'amber'
  }
};

export const MAX_SCORE_PER_CRITERIA = 4;
export const TOTAL_MAX_SCORE = 28;

export const GRADE_THRESHOLDS = [
  { level: GradeLevel.EXCELLENT, min: 25, max: 28, description: 'แสดงออกอย่างชัดเจนและต่อเนื่อง' },
  { level: GradeLevel.GOOD, min: 20, max: 24, description: 'แสดงออกอย่างสม่ำเสมอ' },
  { level: GradeLevel.FAIR, min: 15, max: 19, description: 'แสดงออกเป็นบางครั้ง' },
  { level: GradeLevel.IMPROVEMENT, min: 0, max: 14, description: 'แสดงออกน้อยหรือไม่แสดงเลย' },
];

export const INITIAL_SCORES: AssessmentScore = {
  c1: 0, c2: 0, c3: 0, c4: 0, c5: 0, c6: 0, c7: 0
};
