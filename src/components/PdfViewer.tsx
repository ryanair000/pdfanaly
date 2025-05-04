import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';

interface PdfViewerProps {
  pdf: File;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdf }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pdfUrl, setPdfUrl] = useState<string>('');

  useEffect(() => {
    // Create a blob URL for the PDF file
    const url = URL.createObjectURL(pdf);
    setPdfUrl(url);

    // Clean up the URL when the component unmounts
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [pdf]);

  // This would be replaced with actual PDF.js implementation
  useEffect(() => {
    // Simulate loading a PDF and getting its page count
    setTotalPages(10);
  }, [pdf]);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="bg-gray-50 p-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Document Viewer</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button 
              onClick={zoomOut} 
              className="p-1 rounded-md text-gray-500 hover:bg-gray-200 focus:outline-none"
            >
              <ZoomOutIcon className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-700">{Math.round(zoom * 100)}%</span>
            <button 
              onClick={zoomIn} 
              className="p-1 rounded-md text-gray-500 hover:bg-gray-200 focus:outline-none"
            >
              <ZoomInIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={prevPage} 
              disabled={currentPage === 1}
              className={`p-1 rounded-md ${
                currentPage === 1 
                  ? 'text-gray-300' 
                  : 'text-gray-500 hover:bg-gray-200 focus:outline-none'
              }`}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={nextPage} 
              disabled={currentPage === totalPages}
              className={`p-1 rounded-md ${
                currentPage === totalPages 
                  ? 'text-gray-300' 
                  : 'text-gray-500 hover:bg-gray-200 focus:outline-none'
              }`}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-6 bg-gray-100 flex justify-center min-h-[500px]">
        <div 
          className="bg-white shadow-md transition-transform duration-200 ease-in-out"
          style={{ 
            transform: `scale(${zoom})`,
            height: '500px',
            width: '100%',
            maxWidth: '800px',
            overflow: 'auto'
          }}
        >
          {pdfUrl && (
            <iframe 
              src={`${pdfUrl}#page=${currentPage}`}
              className="w-full h-full"
              title="PDF Viewer"
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;