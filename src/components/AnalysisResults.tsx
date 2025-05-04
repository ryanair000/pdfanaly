import React, { useState } from 'react';
import { BookIcon, BookOpenIcon, FileTextIcon, Download, Share2Icon, CheckCircleIcon, HelpCircleIcon } from 'lucide-react';
import { usePdfAnalyzer } from '../context/PdfAnalyzerContext';

const AnalysisResults: React.FC = () => {
  const { analyzedResults, loading } = usePdfAnalyzer();
  const [activeTab, setActiveTab] = useState('summary');
  const [activeSection, setActiveSection] = useState(0);
  
  if (!analyzedResults) return null;
  if (loading) {
    return (
      <div className="border rounded-lg p-12 bg-white shadow-sm text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-indigo-100 p-4 mb-4">
            <FileTextIcon className="h-8 w-8 text-indigo-400" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="mt-8 w-full max-w-sm">
            <div className="h-2 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-2 bg-gray-200 rounded w-5/6 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="border-b">
        <div className="sm:hidden p-4">
          <label htmlFor="tabs" className="sr-only">Select a tab</label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="summary">Summary</option>
            <option value="key-concepts">Key Concepts</option>
            <option value="questions">Review Questions</option>
          </select>
        </div>
        
        <div className="hidden sm:block">
          <nav className="flex -mb-px" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('summary')}
              className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'summary'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BookOpenIcon className="w-5 h-5 inline-block mr-2" />
              Summary
            </button>
            
            <button
              onClick={() => setActiveTab('key-concepts')}
              className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'key-concepts'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BookIcon className="w-5 h-5 inline-block mr-2" />
              Key Concepts
            </button>
            
            <button
              onClick={() => setActiveTab('questions')}
              className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'questions'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <HelpCircleIcon className="w-5 h-5 inline-block mr-2" />
              Review Questions
            </button>
          </nav>
        </div>
      </div>
      
      <div className="flex border-b">
        <div className="w-64 border-r min-h-[600px] overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Sections</h3>
          </div>
          <ul>
            {analyzedResults.sections.map((section, index) => (
              <li key={index}>
                <button
                  onClick={() => setActiveSection(index)}
                  className={`w-full text-left p-4 border-b text-sm ${
                    activeSection === index
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto max-h-[600px]">
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {analyzedResults.sections[activeSection].title}
            </h2>
            <div className="flex space-x-2">
              <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <Share2Icon className="h-4 w-4 mr-1" />
                Share
              </button>
              <button className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
            </div>
          </div>
          
          {activeTab === 'summary' && (
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">
                {analyzedResults.sections[activeSection].summary}
              </p>
              
              {/* Example code block */}
              {activeSection === 0 && (
                <div className="bg-gray-100 rounded-md p-4 my-4 overflow-x-auto">
                  <pre className="text-sm text-gray-800">
                    <code>
{`function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  
  return [...result, ...left.slice(i), ...right.slice(j)];
}`}
                    </code>
                  </pre>
                </div>
              )}
              
              {/* Mock diagram - would be actual image from PDF */}
              {activeSection === 1 && (
                <div className="my-6 border rounded-md overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/5926393/pexels-photo-5926393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="Network Diagram" 
                    className="w-full h-auto"
                  />
                  <div className="p-2 text-sm text-gray-600 bg-gray-50 text-center">
                    Figure 3.2: OSI Network Model
                  </div>
                </div>
              )}
              
              {/* Exam relevant highlight */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Exam Note:</strong> Time complexity analysis is a frequent exam question. Remember that Merge Sort has a time complexity of O(n log n) in all cases.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'key-concepts' && (
            <div className="space-y-6">
              {(activeSection === 0 ? [
                { term: "Sorting Algorithm", definition: "A method or process used to arrange elements of a collection in a specific order (ascending or descending)." },
                { term: "Merge Sort", definition: "A divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves." },
                { term: "Time Complexity", definition: "A measure of the amount of time an algorithm takes to complete as a function of the input size." },
                { term: "Divide and Conquer", definition: "An algorithmic paradigm where a problem is broken down into simpler sub-problems, solved independently, and then combined." },
                { term: "O(n log n)", definition: "The time complexity classification of merge sort, indicating that its performance scales with the input size n multiplied by log(n)." },
              ] : [
                { term: "OSI Model", definition: "A conceptual framework used to understand network interactions in seven layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application." },
                { term: "TCP/IP", definition: "A suite of communication protocols used to interconnect network devices on the internet and similar networks." },
                { term: "Router", definition: "A networking device that forwards data packets between computer networks, directing traffic flow on the internet." },
                { term: "IP Address", definition: "A numerical label assigned to each device connected to a computer network that uses the Internet Protocol for communication." },
                { term: "Subnet Mask", definition: "A 32-bit number that masks an IP address and divides it into network address and host address." },
              ]).map((concept, index) => (
                <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                  <h3 className="text-md font-medium text-gray-900 mb-1">{concept.term}</h3>
                  <p className="text-gray-600">{concept.definition}</p>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'questions' && (
            <div className="space-y-8">
              {(activeSection === 0 ? [
                { 
                  question: "What is the time complexity of Merge Sort in the worst case?",
                  answer: "O(n log n)",
                  explanation: "Merge Sort always divides the array into halves, resulting in a time complexity of O(n log n) even in the worst case."
                },
                { 
                  question: "Explain how the divide-and-conquer approach is used in the Merge Sort algorithm.",
                  answer: "Merge Sort uses divide-and-conquer by recursively dividing the array into halves until individual elements remain, then merging these elements in sorted order.",
                  explanation: "This approach breaks down the problem into smaller, more manageable subproblems."
                },
                { 
                  question: "What is the space complexity of Merge Sort?",
                  answer: "O(n)",
                  explanation: "Merge Sort requires additional space proportional to the size of the input array for the merging process."
                },
              ] : [
                { 
                  question: "Name the seven layers of the OSI model in order.",
                  answer: "Physical, Data Link, Network, Transport, Session, Presentation, Application",
                  explanation: "These layers represent the hierarchical organization of network functions."
                },
                { 
                  question: "What is the primary function of the Transport layer in the OSI model?",
                  answer: "To provide reliable data transfer services to the upper layers",
                  explanation: "This includes segmentation, flow control, and error control."
                },
                { 
                  question: "Which protocol operates at the Network layer of the OSI model?",
                  answer: "IP (Internet Protocol)",
                  explanation: "IP handles the routing of packets across multiple networks."
                },
              ]).map((qa, index) => (
                <div key={index} className="bg-white rounded-lg border p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-3">
                    Q{index + 1}: {qa.question}
                  </h3>
                  
                  <div className="pl-4 border-l-4 border-green-400 py-1">
                    <p className="font-medium text-gray-700">Answer: {qa.answer}</p>
                    <p className="text-sm text-gray-600 mt-1">{qa.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;