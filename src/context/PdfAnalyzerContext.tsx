import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source path
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

// Types
type TechnicalLevel = 'beginner' | 'intermediate' | 'advanced';

interface AnalyzerSettings {
  technicalLevel: TechnicalLevel;
  highlightExamInfo: boolean;
  preserveDiagrams: boolean;
  includeFormulas: boolean;
  includeCode: boolean;
  questionsPerSection: number;
  [key: string]: any;
}

interface Section {
  title: string;
  summary: string;
  keyTerms: { term: string; definition: string }[];
  questions: { question: string; answer: string; explanation: string }[];
}

interface AnalysisResult {
  title: string;
  sections: Section[];
  overallSummary: string;
}

interface PdfAnalyzerContextType {
  pdfs: File[];
  addPdfs: (files: File[]) => void;
  removePdf: (index: number) => void;
  selectedPdf: number | null;
  setSelectedPdf: (index: number | null) => void;
  settings: AnalyzerSettings;
  updateSettings: (newSettings: Partial<AnalyzerSettings>) => void;
  analyzePdfs: () => void;
  analyzing: boolean;
  analyzedResults: AnalysisResult | null;
  loading: boolean;
}

const defaultSettings: AnalyzerSettings = {
  technicalLevel: 'intermediate',
  highlightExamInfo: true,
  preserveDiagrams: true,
  includeFormulas: true,
  includeCode: true,
  questionsPerSection: 10,
};

// Create context
const PdfAnalyzerContext = createContext<PdfAnalyzerContextType | undefined>(undefined);

// Provider component
export const PdfAnalyzerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pdfs, setPdfs] = useState<File[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<number | null>(null);
  const [settings, setSettings] = useState<AnalyzerSettings>(defaultSettings);
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analyzedResults, setAnalyzedResults] = useState<AnalysisResult | null>(null);

  const addPdfs = (files: File[]) => {
    setPdfs(prev => [...prev, ...files]);
    
    // Select the first file if no file is selected
    if (selectedPdf === null && files.length > 0) {
      setSelectedPdf(0);
    }
  };

  const removePdf = (index: number) => {
    setPdfs(prev => prev.filter((_, i) => i !== index));
    
    // Adjust selected PDF if necessary
    if (selectedPdf === index) {
      if (pdfs.length > 1) {
        setSelectedPdf(index === pdfs.length - 1 ? index - 1 : index);
      } else {
        setSelectedPdf(null);
      }
    } else if (selectedPdf !== null && selectedPdf > index) {
      setSelectedPdf(selectedPdf - 1);
    }
  };

  const updateSettings = (newSettings: Partial<AnalyzerSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const extractTextFromPdf = async (file: File): Promise<string[]> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pageTexts: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      pageTexts.push(pageText);
    }

    return pageTexts;
  };

  const analyzePdfs = async () => {
    try {
      setAnalyzing(true);
      setLoading(true);

      // Process each PDF
      const allPageTexts: string[][] = await Promise.all(
        pdfs.map(pdf => extractTextFromPdf(pdf))
      );

      // Simple content analysis (this should be enhanced with more sophisticated analysis)
      const sections: Section[] = allPageTexts.map((pageTexts, index) => {
        const content = pageTexts.join(' ');
        return {
          title: `Section ${index + 1}`,
          summary: content.substring(0, 500) + '...',
          keyTerms: [
            { 
              term: 'Example Term',
              definition: 'Example definition extracted from the content.'
            }
          ],
          questions: [
            {
              question: 'Sample question based on the content?',
              answer: 'Sample answer extracted from the content.',
              explanation: 'Brief explanation of the concept.'
            }
          ]
        };
      });

      const results: AnalysisResult = {
        title: pdfs[0].name,
        sections,
        overallSummary: 'Analysis complete. Content has been processed and organized into sections.'
      };

      setAnalyzedResults(results);
    } catch (error) {
      console.error('Error analyzing PDFs:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const value = {
    pdfs,
    addPdfs,
    removePdf,
    selectedPdf,
    setSelectedPdf,
    settings,
    updateSettings,
    analyzePdfs,
    analyzing,
    analyzedResults,
    loading,
  };

  return (
    <PdfAnalyzerContext.Provider value={value}>
      {children}
    </PdfAnalyzerContext.Provider>
  );
};

// Custom hook for using the context
export const usePdfAnalyzer = () => {
  const context = useContext(PdfAnalyzerContext);
  if (context === undefined) {
    throw new Error('usePdfAnalyzer must be used within a PdfAnalyzerProvider');
  }
  return context;
};