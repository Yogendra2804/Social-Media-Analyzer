import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, FileImage, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000/api';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
  });

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'An error occurred during analysis.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Social Media Content Analyzer
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Upload your social media post draft (PDF or Image) to receive an AI-powered 
            analysis on tone, clarity, and engagement improvements.
          </p>
        </header>

        <main className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          
          {!result && !loading && (
            <div className="space-y-6">
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}
                  ${isDragReject || error ? 'border-red-400 bg-red-50' : ''}
                `}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="p-4 bg-indigo-100 text-indigo-600 rounded-full">
                    <UploadCloud size={32} />
                  </div>
                  {isDragActive ? (
                    <p className="text-lg font-medium text-indigo-600">Drop the file here ...</p>
                  ) : (
                    <div>
                      <p className="text-lg font-medium text-slate-700">
                        Drag & drop a file here, or click to select
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Supports PDF, PNG, JPG (Max 1 file)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {file && (
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center space-x-3">
                    {file.type === 'application/pdf' ? (
                      <FileText className="text-rose-500" size={24} />
                    ) : (
                      <FileImage className="text-emerald-500" size={24} />
                    )}
                    <div>
                      <p className="font-medium text-slate-800 text-sm truncate max-w-[200px] md:max-w-xs">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); clearFile(); }}
                      className="text-sm font-medium text-slate-500 hover:text-slate-700 px-3 py-1.5"
                    >
                      Remove
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAnalyze(); }}
                      className="text-sm font-medium bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                    >
                      Analyze
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <p className="text-lg font-medium text-slate-700">Analyzing content...</p>
              <p className="text-sm text-slate-500 text-center max-w-sm">
                Extracting text and running engagement analysis. This might take a few seconds.
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
              <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-500" />
                  Analysis Results
                </h2>
                <button 
                  onClick={clearFile}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-lg"
                >
                  Analyze Another
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="md:col-span-1 space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Extracted Text
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 max-h-[500px] overflow-y-auto whitespace-pre-wrap font-mono">
                    {result.extracted_text}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span>Engagement Analysis</span>
                    {result.analysis?.method === 'heuristic' && (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full normal-case font-medium">
                        Fallback Mode
                      </span>
                    )}
                  </h3>
                  <div className="prose prose-slate prose-indigo max-w-none bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <ReactMarkdown>{result.analysis?.result || 'No analysis generated.'}</ReactMarkdown>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
        
        <footer className="text-center text-sm text-slate-500">
          Built for the Technical Assessment Project
        </footer>
      </div>
    </div>
  );
}

export default App;
