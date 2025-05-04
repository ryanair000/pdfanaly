import React, { useState } from 'react';
import { UploadCloudIcon, FileTextIcon, XIcon, CheckIcon } from 'lucide-react';
import { usePdfAnalyzer } from '../context/PdfAnalyzerContext';
import PdfViewer from './PdfViewer';
import AnalysisSettings from './AnalysisSettings';
import AnalysisResults from './AnalysisResults';

const PdfUploader: React.FC = () => {
  const { addPdfs, pdfs, selectedPdf, setSelectedPdf, analyzing, analyzePdfs } = usePdfAnalyzer();
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    if (pdfFiles.length > 0) {
      addPdfs(pdfFiles);
    }
  };

  const removePdf = (index: number) => {
    // This would be implemented in the context
  };

  return (
    <div className="flex flex-col space-y-8">
      {pdfs.length === 0 ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-12 text-center ${
            dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex justify-center">
            <UploadCloudIcon 
              size={48} 
              className={`${dragActive ? 'text-indigo-500' : 'text-gray-400'}`} 
            />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Upload your lecture notes
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Drag and drop your PDF files here, or click to browse
          </p>
          <div className="mt-6">
            <label htmlFor="file-upload" className="cursor-pointer bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Select PDF Files
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept="application/pdf"
                multiple
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Documents</h3>
            <ul className="divide-y divide-gray-200">
              {pdfs.map((pdf, index) => (
                <li key={index} className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <FileTextIcon className="h-5 w-5 text-indigo-500 mr-3" />
                    <span className="text-sm font-medium text-gray-900">{pdf.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setSelectedPdf(index)}
                      className={`px-3 py-1 rounded-md text-xs font-medium ${
                        selectedPdf === index ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {selectedPdf === index ? 'Viewing' : 'View'}
                    </button>
                    <button 
                      onClick={() => removePdf(index)} 
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <label htmlFor="add-more-files" className="cursor-pointer inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <UploadCloudIcon className="h-4 w-4 mr-1" />
                Add More Files
                <input
                  id="add-more-files"
                  name="add-more-files"
                  type="file"
                  className="sr-only"
                  accept="application/pdf"
                  multiple
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {selectedPdf !== null && (
            <PdfViewer pdf={pdfs[selectedPdf]} />
          )}
          
          <AnalysisSettings />
          
          <div className="flex justify-center">
            <button
              onClick={analyzePdfs}
              disabled={analyzing || pdfs.length === 0}
              className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                analyzing || pdfs.length === 0 
                  ? 'bg-indigo-300 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {analyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Create Study Guide
                </>
              )}
            </button>
          </div>
          
          <AnalysisResults />
        </div>
      )}
    </div>
  );
};

export default PdfUploader;