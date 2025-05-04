import React from 'react';
import { usePdfAnalyzer } from '../context/PdfAnalyzerContext';
import { SlidersIcon, BookOpenIcon, BookIcon, GraduationCapIcon } from 'lucide-react';

const AnalysisSettings: React.FC = () => {
  const { 
    settings, 
    updateSettings 
  } = usePdfAnalyzer();

  const handleTechnicalLevelChange = (level: 'beginner' | 'intermediate' | 'advanced') => {
    updateSettings({ technicalLevel: level });
  };

  const handleToggleSetting = (setting: string) => {
    updateSettings({ [setting]: !settings[setting] });
  };

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex items-center mb-4">
        <SlidersIcon className="h-5 w-5 text-indigo-500 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Analysis Settings</h3>
      </div>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Technical Level</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTechnicalLevelChange('beginner')}
              className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                settings.technicalLevel === 'beginner'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
              }`}
            >
              <BookOpenIcon className="h-4 w-4 mr-1" />
              Beginner
            </button>
            <button
              onClick={() => handleTechnicalLevelChange('intermediate')}
              className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                settings.technicalLevel === 'intermediate'
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
              }`}
            >
              <BookIcon className="h-4 w-4 mr-1" />
              Intermediate
            </button>
            <button
              onClick={() => handleTechnicalLevelChange('advanced')}
              className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                settings.technicalLevel === 'advanced'
                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
              }`}
            >
              <GraduationCapIcon className="h-4 w-4 mr-1" />
              Advanced
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="highlight-exam-info"
                name="highlight-exam-info"
                type="checkbox"
                checked={settings.highlightExamInfo}
                onChange={() => handleToggleSetting('highlightExamInfo')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="highlight-exam-info" className="font-medium text-gray-700">
                Highlight Exam Relevant Info
              </label>
              <p className="text-gray-500">
                Emphasize content likely to appear on exams
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="preserve-diagrams"
                name="preserve-diagrams"
                type="checkbox"
                checked={settings.preserveDiagrams}
                onChange={() => handleToggleSetting('preserveDiagrams')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="preserve-diagrams" className="font-medium text-gray-700">
                Include Diagrams & Visuals
              </label>
              <p className="text-gray-500">
                Preserve and include key visual elements from the PDF
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="include-formulas"
                name="include-formulas"
                type="checkbox"
                checked={settings.includeFormulas}
                onChange={() => handleToggleSetting('includeFormulas')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="include-formulas" className="font-medium text-gray-700">
                Include Mathematical Formulas
              </label>
              <p className="text-gray-500">
                Preserve mathematical equations and formulas
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="include-code"
                name="include-code"
                type="checkbox"
                checked={settings.includeCode}
                onChange={() => handleToggleSetting('includeCode')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="include-code" className="font-medium text-gray-700">
                Format Code Examples
              </label>
              <p className="text-gray-500">
                Format and highlight code snippets properly
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Questions & Answers</h4>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Questions per section:</label>
            <select
              value={settings.questionsPerSection}
              onChange={(e) => updateSettings({ questionsPerSection: parseInt(e.target.value) })}
              className="mt-1 block w-24 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisSettings;