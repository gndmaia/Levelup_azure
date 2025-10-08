'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, List, Copy } from 'lucide-react';

interface ParsedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  reference: string;
  category: string;
  tempId?: string;
}

interface ExistingQuestion {
  id: string;
  stem: string;
  options: { id: string; text: string; }[];
  correctOptions: string[];
  explanation?: string;
  difficulty: string;
  objectiveId: string;
}

interface DuplicateGroup {
  questions: ExistingQuestion[];
  similarity: number;
}

type TabType = 'import' | 'view-all' | 'duplicates';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('import');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [allQuestions, setAllQuestions] = useState<ExistingQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
  const [loadingDuplicates, setLoadingDuplicates] = useState(false);
  const [questionsToDelete, setQuestionsToDelete] = useState<Set<string>>(new Set());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith('.htm')) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select an HTML (.htm) file');
      setFile(null);
    }
  };

  const handleUploadAndParse = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    setParsedQuestions([]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/parse-questions', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setParsedQuestions(data.questions);
        setSelectedQuestions(new Set(data.questions.map((q: ParsedQuestion) => q.tempId)));
      } else {
        setError(data.error || 'Failed to parse questions');
      }
    } catch (err) {
      setError('Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestionSelection = (tempId: string) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(tempId)) {
      newSelected.delete(tempId);
    } else {
      newSelected.add(tempId);
    }
    setSelectedQuestions(newSelected);
  };

  const handleSaveQuestions = async () => {
    const questionsToSave = parsedQuestions.filter(q => selectedQuestions.has(q.tempId!));

    if (questionsToSave.length === 0) {
      setError('Please select at least one question');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/save-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: questionsToSave }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Successfully added ${data.count} questions to the database!`);
        setParsedQuestions([]);
        setSelectedQuestions(new Set());
        setFile(null);
      } else {
        setError(data.error || 'Failed to save questions');
      }
    } catch (err) {
      setError('Error saving questions');
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = (tempId: string, field: string, value: any) => {
    setParsedQuestions(prev =>
      prev.map(q =>
        q.tempId === tempId ? { ...q, [field]: value } : q
      )
    );
  };

  const fetchAllQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const response = await fetch('/api/admin/all-questions');
      const data = await response.json();
      if (data.success) {
        setAllQuestions(data.questions);
      } else {
        setError('Failed to load questions');
      }
    } catch (err) {
      setError('Error loading questions');
    } finally {
      setLoadingQuestions(false);
    }
  };

  const findDuplicates = async () => {
    setLoadingDuplicates(true);
    try {
      const response = await fetch('/api/admin/find-duplicates');
      const data = await response.json();
      if (data.success) {
        setDuplicateGroups(data.duplicates);
      } else {
        setError('Failed to find duplicates');
      }
    } catch (err) {
      setError('Error finding duplicates');
    } finally {
      setLoadingDuplicates(false);
    }
  };

  const handleDeleteDuplicates = async () => {
    if (questionsToDelete.size === 0) {
      setError('No questions selected for deletion');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${questionsToDelete.size} duplicate question(s)?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/delete-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionIds: Array.from(questionsToDelete) }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(`Successfully deleted ${data.count} question(s)`);
        setQuestionsToDelete(new Set());
        findDuplicates(); // Refresh the list
      } else {
        setError(data.error || 'Failed to delete questions');
      }
    } catch (err) {
      setError('Error deleting questions');
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestionForDeletion = (questionId: string) => {
    setQuestionsToDelete(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (activeTab === 'view-all' && allQuestions.length === 0) {
      fetchAllQuestions();
    }
    if (activeTab === 'duplicates' && duplicateGroups.length === 0) {
      findDuplicates();
    }
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Admin - Question Manager</h1>
          <p className="text-neutral-600">
            Manage questions for the AI-900 exam database
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-neutral-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('import')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'import'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              <Upload className="inline-block w-5 h-5 mr-2" />
              Import Questions
            </button>
            <button
              onClick={() => setActiveTab('view-all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'view-all'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              <List className="inline-block w-5 h-5 mr-2" />
              View All Questions ({allQuestions.length})
            </button>
            <button
              onClick={() => setActiveTab('duplicates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'duplicates'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              <Copy className="inline-block w-5 h-5 mr-2" />
              Find Duplicates ({duplicateGroups.length})
            </button>
          </nav>
        </div>

        {/* Import Tab Content */}
        {activeTab === 'import' && (
          <>
            {/* File Upload Section */}
            <div className="mb-8 border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
          <label className="cursor-pointer">
            <span className="text-primary-500 hover:text-primary-600 font-semibold">
              Choose HTML file
            </span>
            <input
              type="file"
              className="hidden"
              accept=".htm,.html"
              onChange={handleFileChange}
            />
          </label>
          {file && (
            <div className="mt-4 flex items-center justify-center text-sm text-neutral-600">
              <FileText className="h-5 w-5 mr-2" />
              {file.name}
            </div>
          )}
          <button
            onClick={handleUploadAndParse}
            disabled={!file || loading}
            className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Parsing...' : 'Upload & Parse Questions'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Parsed Questions */}
        {parsedQuestions.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-neutral-900">
                Review Questions ({selectedQuestions.size} selected)
              </h2>
              <button
                onClick={handleSaveQuestions}
                disabled={loading || selectedQuestions.size === 0}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : `Save ${selectedQuestions.size} Questions`}
              </button>
            </div>

            <div className="space-y-6">
              {parsedQuestions.map((question, index) => (
                <div
                  key={question.tempId}
                  className={`border rounded-lg p-6 transition-all ${
                    selectedQuestions.has(question.tempId!)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200'
                  }`}
                >
                  <div className="flex items-start mb-4">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.has(question.tempId!)}
                      onChange={() => toggleQuestionSelection(question.tempId!)}
                      className="mt-1 h-5 w-5 text-primary-500 rounded border-neutral-300"
                    />
                    <div className="ml-4 flex-1">
                      <label className="text-sm font-semibold text-neutral-600 mb-2 block">
                        Question {index + 1}
                      </label>
                      
                      {/* Display images or image instructions */}
                      {(question.question.includes('[📊 Image/Diagram:') || question.question.includes('[Image:')) && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-blue-900 mb-2">
                                This question includes visual content
                              </p>
                              {(() => {
                                // Check for properly formatted image paths
                                const diagramMatch = question.question.match(/\[📊 Image\/Diagram: ([^\]]+)\]/);
                                if (diagramMatch) {
                                  const imagePaths = diagramMatch[1].split(', ');
                                  return (
                                    <div className="space-y-2">
                                      {imagePaths.map((imgPath, imgIdx) => (
                                        <img
                                          key={imgIdx}
                                          src={imgPath}
                                          alt={`Question ${index + 1} diagram ${imgIdx + 1}`}
                                          className="max-w-full h-auto border border-neutral-300 rounded"
                                        />
                                      ))}
                                    </div>
                                  );
                                }
                                
                                // Check for placeholder image markers
                                const imageMatch = question.question.match(/\[Image: ([^\]]+)\]/);
                                if (imageMatch) {
                                  const imageFilenames = imageMatch[1].split(', ');
                                  return (
                                    <div className="space-y-2">
                                      <p className="text-sm text-blue-800 mb-2">
                                        📋 <strong>Action needed:</strong> This question references these image files:
                                      </p>
                                      <ul className="list-disc list-inside text-sm text-blue-900 ml-4">
                                        {imageFilenames.map((filename, idx) => (
                                          <li key={idx} className="font-mono">{filename}</li>
                                        ))}
                                      </ul>
                                      <p className="text-xs text-blue-700 mt-2">
                                        To display images: <br/>
                                        1. Copy image files to <code className="bg-blue-100 px-1 rounded">public/question-images/</code> <br/>
                                        2. Edit question text to replace <code className="bg-blue-100 px-1 rounded">[Image: filename]</code> with <code className="bg-blue-100 px-1 rounded">[📊 Image/Diagram: /question-images/filename]</code>
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <textarea
                        value={question.question}
                        onChange={(e) => handleEditQuestion(question.tempId!, 'question', e.target.value)}
                        className="w-full p-3 border border-neutral-300 rounded-lg text-neutral-900 mb-4"
                        rows={3}
                      />

                      {/* Options */}
                      <div className="space-y-2 mb-4">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center">
                            <span className={`px-3 py-2 rounded-lg font-semibold mr-3 ${
                              optIndex === question.correctAnswer
                                ? 'bg-green-500 text-white'
                                : 'bg-neutral-200 text-neutral-600'
                            }`}>
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...question.options];
                                newOptions[optIndex] = e.target.value;
                                handleEditQuestion(question.tempId!, 'options', newOptions);
                              }}
                              className="flex-1 p-2 border border-neutral-300 rounded-lg"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Category */}
                      <div className="mb-4">
                        <label className="text-sm font-semibold text-neutral-600 mb-2 block">
                          Category
                        </label>
                        <select
                          value={question.category}
                          onChange={(e) => handleEditQuestion(question.tempId!, 'category', e.target.value)}
                          className="w-full p-2 border border-neutral-300 rounded-lg"
                        >
                          <option value="AI-Workloads">AI-Workloads</option>
                          <option value="Computer-Vision">Computer-Vision</option>
                          <option value="NLP">NLP</option>
                          <option value="Conversational-AI">Conversational-AI</option>
                          <option value="Speech">Speech</option>
                          <option value="Document-Intelligence">Document-Intelligence</option>
                          <option value="Responsible-AI">Responsible-AI</option>
                          <option value="ML-Fundamentals">ML-Fundamentals</option>
                          <option value="Azure-ML">Azure-ML</option>
                          <option value="Custom-Vision">Custom-Vision</option>
                          <option value="Anomaly-Detection">Anomaly-Detection</option>
                        </select>
                      </div>

                      {/* Explanation */}
                      <div className="mb-4">
                        <label className="text-sm font-semibold text-neutral-600 mb-2 block">
                          Explanation
                        </label>
                        <textarea
                          value={question.explanation}
                          onChange={(e) => handleEditQuestion(question.tempId!, 'explanation', e.target.value)}
                          className="w-full p-3 border border-neutral-300 rounded-lg text-neutral-900"
                          rows={3}
                        />
                      </div>

                      {/* Reference */}
                      {question.reference && (
                        <div className="text-sm text-neutral-600">
                          <span className="font-semibold">Reference: </span>
                          <a
                            href={question.reference}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-500 hover:underline"
                          >
                            {question.reference}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          </>
        )}

        {/* View All Questions Tab */}
        {activeTab === 'view-all' && (
          <div className="space-y-4">
            {loadingQuestions ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                <p className="mt-4 text-neutral-600">Loading questions...</p>
              </div>
            ) : allQuestions.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                No questions found in the database.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-neutral-900">
                    All Questions ({allQuestions.length})
                  </h2>
                  <button
                    onClick={fetchAllQuestions}
                    className="px-4 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
                  >
                    Refresh
                  </button>
                </div>

                {allQuestions.map((question, index) => (
                  <div key={question.id} className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
                    <div className="space-y-4">
                      {/* Question Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-semibold text-neutral-500">
                              Question {index + 1}
                            </span>
                            <span className="px-2 py-1 text-xs font-semibold bg-neutral-200 text-neutral-700 rounded">
                              {question.id}
                            </span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded ${
                              question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                              question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {question.difficulty.toUpperCase()}
                            </span>
                            <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded">
                              {question.objectiveId}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Question Text */}
                      <div className="prose max-w-none">
                        <p className="text-neutral-900 font-medium whitespace-pre-wrap">{question.stem}</p>
                      </div>

                      {/* Options */}
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-neutral-600">Options:</p>
                        {question.options.map((option) => (
                          <div
                            key={option.id}
                            className={`p-3 rounded-lg border-2 ${
                              question.correctOptions.includes(option.id)
                                ? 'border-green-500 bg-green-50'
                                : 'border-neutral-200 bg-white'
                            }`}
                          >
                            <div className="flex items-start">
                              <span className="font-semibold text-neutral-700 mr-2">{option.id}.</span>
                              <span className="flex-1 text-neutral-900">{option.text}</span>
                              {question.correctOptions.includes(option.id) && (
                                <CheckCircle className="h-5 w-5 text-green-600 ml-2 flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Correct Answer */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-green-900 mb-1">
                          ✓ Correct Answer: {question.correctOptions.join(', ')}
                        </p>
                      </div>

                      {/* Explanation */}
                      {question.explanation && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm font-semibold text-blue-900 mb-2">Explanation:</p>
                          <p className="text-sm text-blue-800 whitespace-pre-wrap">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Duplicates Tab */}
        {activeTab === 'duplicates' && (
          <div className="space-y-6">
            {loadingDuplicates ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                <p className="mt-4 text-neutral-600">Analyzing questions for duplicates...</p>
              </div>
            ) : duplicateGroups.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-neutral-900 mb-2">No duplicates found!</p>
                <p className="text-neutral-600">All questions appear to be unique.</p>
                <button
                  onClick={findDuplicates}
                  className="mt-4 px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                  Re-scan for Duplicates
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900">
                      Duplicate Questions Found ({duplicateGroups.length} groups)
                    </h2>
                    <p className="text-sm text-neutral-600 mt-1">
                      Select questions to delete. Keep at least one question from each group.
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={findDuplicates}
                      className="px-4 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
                    >
                      Refresh
                    </button>
                    {questionsToDelete.size > 0 && (
                      <button
                        onClick={handleDeleteDuplicates}
                        disabled={loading}
                        className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        Delete Selected ({questionsToDelete.size})
                      </button>
                    )}
                  </div>
                </div>

                {duplicateGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-yellow-900">
                        Duplicate Group {groupIndex + 1}
                        <span className="ml-2 text-sm font-normal text-yellow-700">
                          ({group.questions.length} similar questions - {Math.round(group.similarity * 100)}% match)
                        </span>
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {group.questions.map((question, qIndex) => (
                        <div
                          key={question.id}
                          className={`bg-white border-2 rounded-lg p-4 ${
                            questionsToDelete.has(question.id)
                              ? 'border-red-500 bg-red-50'
                              : 'border-neutral-200'
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <input
                              type="checkbox"
                              checked={questionsToDelete.has(question.id)}
                              onChange={() => toggleQuestionForDeletion(question.id)}
                              className="mt-1 h-5 w-5 text-red-600 focus:ring-red-500 border-neutral-300 rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="px-2 py-1 text-xs font-semibold bg-neutral-200 text-neutral-700 rounded">
                                  {question.id}
                                </span>
                                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                  question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                  question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {question.difficulty.toUpperCase()}
                                </span>
                                {questionsToDelete.has(question.id) && (
                                  <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded">
                                    MARKED FOR DELETION
                                  </span>
                                )}
                              </div>
                              <p className="text-neutral-900 font-medium mb-3 whitespace-pre-wrap">
                                {question.stem}
                              </p>
                              <div className="text-sm text-neutral-600">
                                <strong>Options:</strong> {question.options.map(o => o.text).join(' | ')}
                              </div>
                              <div className="text-sm text-green-700 mt-1">
                                <strong>Correct:</strong> {question.correctOptions.join(', ')}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
