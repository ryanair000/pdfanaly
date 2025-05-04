import React from 'react';
import { FileTextIcon } from 'lucide-react';
import Layout from './components/Layout';
import PdfUploader from './components/PdfUploader';
import { PdfAnalyzerProvider } from './context/PdfAnalyzerContext';

function App() {
  return (
    <PdfAnalyzerProvider>
      <Layout>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <FileTextIcon size={48} className="text-indigo-700" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">StudyGuide AI</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform your IT lecture notes into comprehensive study guides with summaries, 
              key concepts, and review questions.
            </p>
          </header>
          
          <PdfUploader />
        </div>
      </Layout>
    </PdfAnalyzerProvider>
  );
}

export default App;