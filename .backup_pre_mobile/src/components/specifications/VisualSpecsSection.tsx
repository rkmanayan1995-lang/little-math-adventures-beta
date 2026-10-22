import React, { useState } from 'react';
import { ASSET_INVENTORY, COLOR_PALETTE } from '../../data/foundationData';
import { AssetItem } from '../../types/creativeFoundation';
import { soundManager } from '../../utils/soundEffects';
import {
  FileText,
  Palette,
  FolderTree,
  Copy,
  Check,
  Filter,
  CheckCircle2,
  Sparkles,
  Type,
  SunMedium,
  Smartphone
} from 'lucide-react';

export const VisualSpecsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const filteredAssets = selectedCategory === 'all'
    ? ASSET_INVENTORY
    : ASSET_INVENTORY.filter((a) => a.category === selectedCategory);

  const handleCopySpec = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    soundManager.playPop();
    setCopiedNotification(label);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full mb-2">
          <FileText className="w-3.5 h-3.5 text-purple-600" />
          <span>PRODUCTION SPECIFICATIONS & INVENTORY</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-fredoka tracking-tight">
          Creative Foundation Specification & Asset Inventory
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          The official design system, strict file naming conventions, modular asset catalog, and preschool ergonomic parameters for Little Math Adventures.
        </p>
      </div>

      {/* 1. Concise Asset Inventory Table */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 font-fredoka">
              Modular Asset Inventory ({ASSET_INVENTORY.length} Production Units)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Reusable assets partitioned for high-density preschool screens.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1 overflow-x-auto max-w-full">
            {[
              { id: 'all', label: 'All Assets' },
              { id: 'character', label: 'Characters' },
              { id: 'expression', label: 'Expressions' },
              { id: 'map_background', label: 'Map Art' },
              { id: 'destination', label: 'Destinations' },
              { id: 'counting_object', label: 'Counting Items' },
              { id: 'ui_element', label: 'UI Elements' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  soundManager.playPop();
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all font-fredoka whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold font-fredoka">
              <tr>
                <th className="py-3 px-4">Asset ID</th>
                <th className="py-3 px-4">Asset Name</th>
                <th className="py-3 px-4">File Name Token</th>
                <th className="py-3 px-4">Format & Canvas</th>
                <th className="py-3 px-4">Key Variants</th>
                <th className="py-3 px-4">Implementation Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-purple-700 whitespace-nowrap">
                    {asset.id}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {asset.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 bg-slate-50/50 rounded-md whitespace-nowrap">
                    {asset.fileName}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-700 text-[11px]">
                      {asset.format} · {asset.dimensions}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="flex flex-wrap gap-1">
                      {asset.variants.map((v, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-700 font-medium">
                          {v}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs leading-normal">
                    {asset.specNotes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Naming Conventions Guide */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2 bg-blue-100 rounded-xl text-blue-700">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 font-fredoka">
              Strict Asset Naming Conventions
            </h3>
            <p className="text-xs text-slate-500">
              Deterministic snake_case token syntax guaranteeing pipeline consistency across Web, Canvas, and SVG.
            </p>
          </div>
        </div>

        {/* Naming Formula */}
        <div className="p-4 bg-slate-900 text-amber-300 rounded-2xl font-mono text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="tracking-wide">
            <span className="text-pink-400">[category]</span>_
            <span className="text-blue-300">[entity]</span>_
            <span className="text-emerald-300">[expression/state]</span>_
            <span className="text-purple-300">v[version]</span>.
            <span className="text-slate-300">[ext]</span>
          </div>

          <button
            onClick={() => handleCopySpec('[category]_[entity]_[state]_v[version].[ext]', 'Naming Formula')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 transition-colors shrink-0"
          >
            {copiedNotification === 'Naming Formula' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Template</span>
          </button>
        </div>

        {/* Folder Directory Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 font-sans block mb-2">Source Asset Taxonomy:</span>
            <div className="text-slate-700 leading-relaxed">
              📁 /assets/<br />
              &nbsp;&nbsp;├── 📁 characters/<br />
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├── char_andy_full_v01.svg<br />
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├── char_sancho_full_v01.svg<br />
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└── char_osi_full_v01.svg<br />
              &nbsp;&nbsp;├── 📁 expressions/<br />
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├── char_andy_exp_[idle|happy|thinking|encouraging|celebration]_v01.svg<br />
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├── char_sancho_exp_[...]_v01.svg<br />
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└── char_osi_exp_[...]_v01.svg
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 font-sans block mb-2">World & UI Taxonomy:</span>
            <div className="text-slate-700 leading-relaxed">
              &nbsp;&nbsp;├── 📁 map/<br />
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├── bg_adventure_map_clean_v01.webp<br />
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└── token_dest_[meadow|grove|lagoon|summit|castle]_v01.svg<br />
              &nbsp;&nbsp;├── 📁 objects/<br />
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└── obj_count_[apple|star|frog|ball|flower]_v01.svg<br />
              &nbsp;&nbsp;└── 📁 ui/<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── ui_btn_[primary|secondary|icon]_[state].svg<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── ui_reward_star_[empty|bronze|silver|gold].svg<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── ui_lock_[locked|unlocked].svg
            </div>
          </div>
        </div>
      </section>

      {/* 3. Visual Specification: Color & Lighting Systems */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2 bg-pink-100 rounded-xl text-pink-700">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 font-fredoka">
              Preschool Color System (60-30-10 Distribution)
            </h3>
            <p className="text-xs text-slate-500">
              Soft calming pastels with punchy, high-contrast action accents to protect young eyes from cognitive fatigue.
            </p>
          </div>
        </div>

        {/* Swatches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLOR_PALETTE.map((color) => (
            <div
              key={color.hex}
              onClick={() => handleCopySpec(color.hex, color.name)}
              className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div
                  className="w-full h-16 rounded-xl border border-slate-200/60 shadow-inner mb-3 transition-transform group-hover:scale-102 flex items-end justify-end p-2"
                  style={{ backgroundColor: color.hex }}
                >
                  <span className="px-2 py-0.5 bg-black/40 backdrop-blur-xs text-white rounded text-[10px] font-mono">
                    {color.hex}
                  </span>
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 font-fredoka">
                  {color.name}
                </h4>
                <p className="text-[11px] text-purple-700 font-semibold mt-0.5">
                  {color.role}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <span>Contrast: {color.contrastRatio}</span>
                <span className="text-blue-600 group-hover:underline">Click to copy</span>
              </div>
            </div>
          ))}
        </div>

        {/* Typography & Lighting Foundation Rules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold font-fredoka text-sm">
              <Type className="w-4 h-4 text-purple-600" />
              <span>Typography Pairing</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Fredoka</strong> (rounded, warm, friendly) for titles, level badges, and big numbers. <strong>Plus Jakarta Sans</strong> for micro-copy, parent notes, and accessible text. Tabular numerals (`tabular-nums`) for all countdowns and counters.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold font-fredoka text-sm">
              <SunMedium className="w-4 h-4 text-amber-600" />
              <span>Soft 3D Lighting & Shading</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consistently oriented 45° soft top-left key light with warm ambient fill. Zero harsh pure-black shadows (`feDropShadow floodColor="#3F1B06" floodOpacity="0.15"`). Gives tactile clay/rubber depth.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold font-fredoka text-sm">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Preschool Ergonomics</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Touch targets must measure &ge; 56px with &ge; 16px clear gutter separation. Multi-modal confirmation: visual bounce + color change + Web Audio melodic chimes on every touch.
            </p>
          </div>
        </div>
      </section>

      {/* Copy Notification Toast */}
      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Copied {copiedNotification} to clipboard!</span>
        </div>
      )}
    </div>
  );
};
