import React, { useState } from 'react';
import { 
  sheetsDefinitions, 
  googleSheetsFormulas, 
  pastelColorSpecs, 
  conditionalFormattingRules, 
  appsScriptCode, 
  appsScriptHtmlForm 
} from '../../data/sheetsBlueprint';
import { sampleProjects, sampleTasks, sampleIssues } from '../../data/sampleData';
import { downloadFile, exportProjectsToTSV, exportTasksToTSV, exportIssuesToTSV } from '../../utils/exportUtils';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  Table, 
  Calculator, 
  Palette, 
  Terminal, 
  Database, 
  BookOpen,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const BlueprintView: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const steps = [
    { num: 1, title: 'ขั้นตอนที่ 1: โครงสร้าง 5 ชีต', icon: Table },
    { num: 2, title: 'ขั้นตอนที่ 2: สูตร Google Sheets', icon: Calculator },
    { num: 3, title: 'ขั้นตอนที่ 3: สีพาสเทล & กฎเงื่อนไข', icon: Palette },
    { num: 4, title: 'ขั้นตอนที่ 4: Google Apps Script', icon: Terminal },
    { num: 5, title: 'ขั้นตอนที่ 5: ข้อมูลตัวอย่าง 3 โครงการ', icon: Database },
    { num: 6, title: 'ขั้นตอนที่ 6: คู่มือการใช้งานภาษาไทย', icon: BookOpen }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-purple-200 border border-white/10 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>พิมพ์เขียวระบบและชุดโค้ด Google Sheets & Apps Script ฉบับสมบูรณ์</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            คู่มือการติดตั้งและชุดสูตร Repair tracking
          </h2>
          <p className="text-xs sm:text-sm text-purple-200 font-normal leading-relaxed">
            รวบรวมโครงสร้างคอลัมน์ สูตร Google Sheets ที่คำนวณถูกต้องแม่นยำ กฎ Conditional Formatting สีพาสเทล โค้ด Apps Script พร้อมใช้ และคู่มือขั้นตอนการนำไปสร้างไฟล์จริงบน Google Sheets
          </p>
        </div>
      </div>

      {/* Step Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = activeStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-xs shadow-purple-500/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-purple-600'}`} />
                <span className="truncate">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Contents */}

      {/* STEP 1: SHEET STRUCTURE */}
      {activeStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="text-base font-bold text-slate-800 mb-1">
              ขั้นตอนที่ 1: ออกแบบโครงสร้างชีตทั้งหมด (5 ชีตหลัก)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              สร้างชีตตามชื่อด้านล่างนี้ใน Google Sheets เพื่อให้สูตรและการอ้างอิงของระบบทำงานได้อย่างถูกต้อง
            </p>

            <div className="space-y-6">
              {sheetsDefinitions.map((sheet, idx) => (
                <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md text-slate-700 bg-white border border-slate-200 font-mono">
                          {sheet.sheetName}
                        </span>
                        <h4 className="text-sm font-bold text-slate-800">{sheet.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{sheet.purpose}</p>
                    </div>
                  </div>

                  <div className="p-4 overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600 border-collapse">
                      <thead>
                        <tr className="bg-slate-100/60 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                          <th className="py-2.5 px-3">ชื่อคอลัมน์ (หัวตาราง)</th>
                          <th className="py-2.5 px-3">ประเภทข้อมูล</th>
                          <th className="py-2.5 px-4 min-w-[200px]">คำอธิบายและหน้าที่</th>
                          <th className="py-2.5 px-3">ตัวอย่างข้อมูล</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-normal">
                        {sheet.columns.map((col, cIdx) => (
                          <tr key={cIdx} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 font-semibold text-slate-800">
                              {col.name}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono text-slate-600">
                                {col.type}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-slate-600">
                              {col.description}
                              {col.formula && (
                                <div className="mt-1 font-mono text-[10px] bg-slate-50 text-indigo-700 p-1 rounded border border-slate-200">
                                  สูตร: {col.formula}
                                </div>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-500">
                              {col.example}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: GOOGLE SHEETS FORMULAS */}
      {activeStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  ขั้นตอนที่ 2: สูตร Google Sheets ที่จำเป็นทั้งหมด (พร้อมตำแหน่งเซลล์)
                </h3>
                <p className="text-xs text-slate-500">
                  คัดลอกสูตรเหล่านี้ไปวางในเซลล์ที่ระบุของแต่ละชีต สามารถกดปุ่ม &quot;คัดลอก&quot; เพื่อความสะดวก
                </p>
              </div>
            </div>

            <div className="space-y-6 mt-4">
              {googleSheetsFormulas.map((cat, idx) => (
                <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <div className="bg-purple-50/70 px-4 py-3 border-b border-purple-100 flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-purple-900">{cat.category}</h4>
                    <span className="text-[11px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-semibold">
                      {cat.items.length} สูตร
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 p-2">
                    {cat.items.map((item, itemIdx) => {
                      const copyId = `formula-${idx}-${itemIdx}`;
                      const isCopied = copiedKey === copyId;

                      return (
                        <div key={itemIdx} className="p-3 hover:bg-slate-50/60 rounded-xl transition-colors">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="bg-slate-800 text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                                เซลล์ {item.cell}
                              </span>
                              <span className="font-bold text-xs text-slate-800">{item.name}</span>
                            </div>
                            <button
                              onClick={() => handleCopy(item.formula, copyId)}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center space-x-1 transition-colors"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{isCopied ? 'คัดลอกแล้ว' : 'คัดลอกสูตร'}</span>
                            </button>
                          </div>

                          <div className="bg-slate-900 text-sky-300 font-mono text-xs p-2.5 rounded-lg overflow-x-auto shadow-inner">
                            <code>{item.formula}</code>
                          </div>

                          <div className="text-[11px] text-slate-500 mt-1.5 flex items-center space-x-1">
                            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{item.description}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: PASTEL PALETTE & CONDITIONAL FORMATTING */}
      {activeStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                ขั้นตอนที่ 3: โทนสีพาสเทลและกฎการจัดรูปแบบตามเงื่อนไข (Conditional Formatting)
              </h3>
              <p className="text-xs text-slate-500">
                ใช้ชุดสีพาสเทลเพื่อความสะอาดตา เป็นมืออาชีพ สบายตา และมีกฎจัดสีอัตโนมัติตามสถานะ
              </p>
            </div>

            {/* Pastel Swatches */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                🎨 รหัสสีพาสเทลมาตรฐานที่ใช้ในระบบ (Pastel Color Palette)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pastelColorSpecs.map((color, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between space-y-2">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 rounded-xl shadow-xs border border-slate-200/60"
                        style={{ backgroundColor: color.hex.split(' / ')[0] }}
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-800">{color.name}</div>
                        <div className="font-mono text-[11px] text-slate-400 font-semibold">{color.hex}</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500">{color.usage}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conditional Formatting Rules Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                ⚙️ กฎ Conditional Formatting ใน Google Sheets (ตั้งค่าผ่าน เมนู รูปแบบ &gt; การจัดรูปแบบตามเงื่อนไข)
              </h4>
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-600 border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                      <th className="py-2.5 px-3">ชื่อชีต</th>
                      <th className="py-2.5 px-3">ช่วงที่ใช้ (Range)</th>
                      <th className="py-2.5 px-4">เงื่อนไข (Rule)</th>
                      <th className="py-2.5 px-3">สีตัวอย่างที่ได้</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-normal">
                    {conditionalFormattingRules.map((rule, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{rule.sheet}</td>
                        <td className="py-2.5 px-3 font-mono text-purple-700 font-bold">{rule.range}</td>
                        <td className="py-2.5 px-4 text-slate-700">{rule.condition}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-bold inline-block"
                            style={{ backgroundColor: rule.bg, color: rule.textColor }}
                          >
                            ตัวอย่างข้อความ
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: GOOGLE APPS SCRIPT */}
      {activeStep === 4 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  ขั้นตอนที่ 4: โค้ด Google Apps Script (Code.gs &amp; Form.html)
                </h3>
                <p className="text-xs text-slate-500">
                  เพิ่ม Custom Menu บนเมนูบาร์ของ Google Sheets พร้อมฟังก์ชันสร้างรหัสอัตโนมัติ Dialog ป้อนข้อมูล และระบบแจ้งเตือน
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(appsScriptCode, 'script-code')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 flex items-center space-x-1.5 transition-colors"
                >
                  {copiedKey === 'script-code' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'script-code' ? 'คัดลอกแล้ว' : 'คัดลอก Code.gs'}</span>
                </button>

                <button
                  onClick={() => downloadFile(appsScriptCode, 'Code.gs', 'application/javascript')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center space-x-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลด .gs</span>
                </button>
              </div>
            </div>

            {/* Code Box for Code.gs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>ไฟล์ที่ 1: Code.gs (สคริปต์หลัก)</span>
                <span className="text-slate-400 font-mono text-[11px]">JavaScript / Apps Script API</span>
              </div>
              <div className="bg-slate-900 text-slate-100 font-mono text-xs p-4 rounded-2xl max-h-96 overflow-y-auto shadow-inner leading-relaxed">
                <pre>{appsScriptCode}</pre>
              </div>
            </div>

            {/* Code Box for Form.html */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>ไฟล์ที่ 2: Form.html (หน้าต่างฟอร์มสำหรับ Modal Dialog)</span>
                <button
                  onClick={() => handleCopy(appsScriptHtmlForm, 'form-html')}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  {copiedKey === 'form-html' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>คัดลอก Form.html</span>
                </button>
              </div>
              <div className="bg-slate-900 text-sky-200 font-mono text-xs p-4 rounded-2xl max-h-60 overflow-y-auto shadow-inner leading-relaxed">
                <pre>{appsScriptHtmlForm}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: SAMPLE DATA */}
      {activeStep === 5 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-800">
              ขั้นตอนที่ 5: ชุดข้อมูลตัวอย่าง 3 โครงการสมบูรณ์สำหรับการทดสอบระบบ
            </h3>
            <p className="text-xs text-slate-500">
              ประกอบด้วย 3 โครงการระดับองค์กรที่มีลักษณะความเสี่ยงต่างกัน พร้อมงานย่อยและปัญหาครบถ้วน สามารถกดคัดลอกไปวางใน Google Sheets ได้ทันที
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sampleProjects.map((p) => {
                const projectTasks = sampleTasks.filter(t => t.projectId === p.projectId);
                const projectIssues = sampleIssues.filter(i => i.projectId === p.projectId);

                return (
                  <div key={p.projectId} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded text-xs">
                        {p.projectId}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {p.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 leading-snug">{p.projectName}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>

                    <div className="text-[11px] text-slate-600 space-y-1 pt-2 border-t border-slate-200">
                      <div>ฝ่าย: {p.department}</div>
                      <div>ผู้รับผิดชอบโครงการ: {p.owner}</div>
                      <div>งบประมาณ: ฿{p.budget.toLocaleString()}</div>
                      <div className="font-semibold text-purple-700">
                        มี {projectTasks.length} งานย่อย | {projectIssues.length} ปัญหา
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: USER MANUAL */}
      {activeStep === 6 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                ขั้นตอนที่ 6: คู่มือการใช้งานระบบและการติดตั้งฉบับภาษาไทย (User Guide)
              </h3>
              <p className="text-xs text-slate-500">
                ขั้นตอนแบบทีละก้าว (Step-by-step) ตั้งแต่การเปิด Google Sheets จนถึงการใช้งานประจำวัน
              </p>
            </div>

            <div className="space-y-5">
              {/* Step 1 in guide */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-sm text-slate-800">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>การสร้างชีตและใส่สูตรใน Google Sheets</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 pl-8 list-disc">
                  <li>เปิด Google Sheets ใหม่ที่ <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-sky-600 underline font-semibold">sheets.new</a></li>
                  <li>สร้างชีต 5 แผ่น และเปลี่ยนชื่อตามนี้ให้ตรงเป๊ะ: <code>Dashboard</code>, <code>Project_Master</code>, <code>Task_Tracking</code>, <code>Issue_Log</code>, <code>Settings</code></li>
                  <li>คัดลอกแถวหัวตารางจาก &quot;ขั้นตอนที่ 1&quot; ไปวางที่แถวที่ 1 ของแต่ละชีต</li>
                  <li>คัดลอกสูตรจาก &quot;ขั้นตอนที่ 2&quot; ไปวางในเซลล์ที่ระบุ เช่น K2 ใน Project_Master แล้วลากสูตรลงมา (Drag down)</li>
                </ul>
              </div>

              {/* Step 2 in guide */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-sm text-slate-800">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>การติดตั้ง Google Apps Script</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 pl-8 list-disc">
                  <li>ใน Google Sheets คลิกเมนู <strong>ส่วนขยาย (Extensions) &gt; Apps Script</strong></li>
                  <li>ลบโค้ดเดิมทั้งหมดในไฟล์ <code>Code.gs</code> แล้ววางโค้ดจาก &quot;ขั้นตอนที่ 4&quot; ลงไป</li>
                  <li>กดไอคอน <strong>+</strong> ด้านซ้ายเลือก <strong>HTML</strong> ตั้งชื่อว่า <code>Form</code> แล้วนำโค้ด Form.html ไปวาง</li>
                  <li>กดปุ่ม <strong>บันทึก (Ctrl+S)</strong> แล้วกลับมาที่ชีต กดรีเฟรชหน้าเว็บ (F5) 1 ครั้ง</li>
                  <li>จะเห็นเมนูใหม่ปรากฏขึ้นบนเมนูบาร์: <strong>🔧 Repair Tracking</strong></li>
                </ul>
              </div>

              {/* Step 3 in guide */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-sm text-slate-800">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                    3
                  </span>
                  <span>การอนุญาตสิทธิ์การใช้งาน (Authorization) ในครั้งแรก</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 pl-8 list-disc">
                  <li>เมื่อกดเมนูของ Apps Script ครั้งแรก Google จะแสดงหน้าต่าง &quot;จำเป็นต้องได้รับอนุญาต&quot;</li>
                  <li>คลิก <strong>ดำเนินการต่อ (Continue)</strong></li>
                  <li>เลือกบัญชี Google ของท่าน</li>
                  <li>คลิก <strong>ขั้นสูง (Advanced)</strong> ด้านล่าง &gt; คลิก <strong>ไปที่ (ไม่ปลอดภัย) / Go to (unsafe)</strong></li>
                  <li>คลิก <strong>อนุญาต (Allow)</strong> สคริปต์จะสามารถทำงานได้อย่างสมบูรณ์ 100% โดยไม่ต้องเสียค่าบริการใดๆ</li>
                </ul>
              </div>

              {/* Step 4 in guide */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-sm text-slate-800">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                    4
                  </span>
                  <span>คู่มือการใช้งานประจำวัน</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 pl-8 list-disc">
                  <li><strong>เพิ่มโครงการ:</strong> คลิกเมนู <code>🔧 Repair Tracking &gt; ➕ เพิ่มโครงการใหม่</code> รหัส PRJ-xxx จะถูกสร้างให้อัตโนมัติ</li>
                  <li><strong>เพิ่มงานย่อย:</strong> เลือกรหัสโครงการหลัก กำหนดน้ำหนักงาน (Weight %) และ Deadline วันคงเหลือและงานล่าช้าจะคำนวณอัตโนมัติ</li>
                  <li><strong>บันทึกปัญหา:</strong> บันทึกอาการและระบุระดับความรุนแรง (วิกฤต/สูง) เพื่อให้เตือนบน Dashboard ทันที</li>
                  <li><strong>ตรวจเช็กความเสี่ยง:</strong> คลิกเมนู <code>🚨 ตรวจสอบงานล่าช้า &amp; แจ้งเตือน</code> ระบบจะนับและสรุปงานที่เลยกำหนดให้ทันที</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
