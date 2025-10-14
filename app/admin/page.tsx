'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, List, Copy } from 'lucide-react';

interface ParsedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  correctAnswers?: number[]; // All correct answers for multi-choice
  isMultipleChoice?: boolean;
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

type TabType = 'import' | 'manual-import' | 'view-all' | 'duplicates';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('import');
  const [selectedExam, setSelectedExam] = useState<'AI-900' | 'AZ-900'>('AI-900');
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
  const [manualText, setManualText] = useState<string>('');
  const [manualQuestionText, setManualQuestionText] = useState<string>('');
  const [manualOptionsText, setManualOptionsText] = useState<string>('');
  const [manualExplanation, setManualExplanation] = useState<string>('');
  const [manualReference, setManualReference] = useState<string>('');
  const [manualCorrectAnswer, setManualCorrectAnswer] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && (selectedFile.name.endsWith('.htm') || selectedFile.name.endsWith('.pdf'))) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select an HTML (.htm) or PDF (.pdf) file');
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

    // Determine which parser to use based on file extension
    const isPdf = file.name.endsWith('.pdf');
    const endpoint = isPdf ? '/api/admin/parse-pdf' : '/api/admin/parse-questions';

    try {
      const response = await fetch(endpoint, {
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
        body: JSON.stringify({ 
          questions: questionsToSave,
          examId: selectedExam 
        }),
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

  const handleManualParse = () => {
    // Check if using separate inputs or combined input
    const usingSeparateInputs = manualQuestionText.trim() || manualOptionsText.trim();
    
    if (usingSeparateInputs) {
      if (!manualQuestionText.trim() || !manualOptionsText.trim()) {
        setError('Please enter both question text and options');
        return;
      }
    } else if (!manualText.trim()) {
      setError('Please paste question text');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setParsedQuestions([]);

    try {
      let questions;
      
      if (usingSeparateInputs) {
        console.log('Using separate inputs (Method 2)');
        // Use dedicated Method 2 parser
        questions = parseSimpleQuestion(manualQuestionText, manualOptionsText, manualReference, manualExplanation, manualCorrectAnswer);
      } else {
        console.log('Using full text input');
        console.log('Text length:', manualText.length);
        questions = parseManualQuestions(manualText, manualReference);
      }
      
      console.log('Parsed questions count:', questions.length);
      
      if (questions.length === 0) {
        setError('No questions found. Please check the format.');
      } else {
        setParsedQuestions(questions);
        setSelectedQuestions(new Set(questions.map(q => q.tempId!)));
        setSuccess(`Found ${questions.length} question(s)`);
      }
    } catch (err) {
      setError('Error parsing questions: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const parseNewFormatQuestion = (text: string, customReference: string = '', customExplanation: string = ''): ParsedQuestion[] => {
    const questions: ParsedQuestion[] = [];
    
    try {
      const lines = text.split('\n').map(l => l.trim()).filter(l => l);
      
      if (lines.length === 0) return questions;
      
      // First line is the question
      const questionText = lines[0];
      
      // Find where "Correct" marker appears
      let correctIndex = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i] === 'Correct' || lines[i].toLowerCase() === 'correct') {
          correctIndex = i;
          break;
        }
      }
      
      if (correctIndex === -1) {
        console.log('No "Correct" marker found in new format');
        return questions;
      }
      
      // Options are between question and "Correct" marker (excluding the question itself)
      const options: string[] = [];
      let correctOptionIndex = -1;
      
      for (let i = 1; i < correctIndex; i++) {
        const line = lines[i].trim();
        if (line && line.length > 2) {
          console.log(`New format - adding option ${options.length + 1}:`, line.substring(0, 60));
          options.push(line);
        }
      }
      
      // The last option before "Correct" is the correct answer
      correctOptionIndex = options.length - 1;
      
      console.log(`New format - Total options: ${options.length}, Correct index: ${correctOptionIndex}`);
      
      // Explanation is everything after "Correct" marker
      let explanation = customExplanation;
      if (!customExplanation && correctIndex + 1 < lines.length) {
        explanation = lines.slice(correctIndex + 1).join(' ').trim();
      }
      
      if (options.length < 2) {
        console.log('New format - Not enough options found:', options.length);
        console.log('Lines analyzed:', lines.slice(0, correctIndex + 2));
        return questions;
      }
      
      // Determine category
      const category = determineQuestionCategory(questionText);
      
      // Generate ID
      const nextId = `${selectedExam.toLowerCase().replace('-', '')}-manual-${Date.now()}`;
      const tempId = crypto.randomUUID();
      
      questions.push({
        id: nextId,
        question: questionText,
        options: options,
        correctAnswer: correctOptionIndex,
        isMultipleChoice: false,
        explanation: explanation || 'No explanation provided',
        reference: customReference || '',
        category: category,
        tempId: tempId
      });
      
      console.log('Parsed new format question:', {
        question: questionText.substring(0, 50),
        optionCount: options.length,
        correctIndex: correctOptionIndex,
        category: category
      });
      
    } catch (err) {
      console.error('Error parsing new format:', err);
    }
    
    return questions;
  };

  const parseSimpleQuestion = (questionText: string, optionsText: string, customReference: string, customExplanation: string, correctAnswerSpec: string = ''): ParsedQuestion[] => {
    const questions: ParsedQuestion[] = [];
    
    try {
      const lines = optionsText.split('\n').map(l => l.trim()).filter(l => l);
      
      if (lines.length < 2) {
        console.log('Method 2: Not enough option lines:', lines.length);
        return questions;
      }
      
      const options: string[] = [];
      let correctIndices: number[] = [];
      
      // Each non-empty line is an option
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Skip markers and empty lines
        if (!line || line === 'Correct' || line === 'This answer is correct.' || line === 'This answer is incorrect.') {
          continue;
        }
        
        // Check if this option is marked as correct
        const isCorrect = line.includes('☑') || line.includes('✓') || 
                         (i + 1 < lines.length && lines[i + 1] === 'This answer is correct.');
        
        // Clean the option text
        let optionText = line
          .replace(/[☐☑✓]/g, '')
          .replace(/This answer is correct\.?/gi, '')
          .replace(/This answer is incorrect\.?/gi, '')
          .trim();
        
        if (optionText) {
          console.log(`Method 2 - Option ${options.length + 1}:`, optionText.substring(0, 60), isCorrect ? '(correct)' : '');
          options.push(optionText);
          if (isCorrect) {
            correctIndices.push(options.length - 1);
          }
        }
      }
      
      console.log(`Method 2 - Total options: ${options.length}, Correct indices from markers:`, correctIndices);
      
      if (options.length < 2) {
        console.log('Method 2: Not enough valid options after parsing');
        return questions;
      }
      
      // If correctAnswerSpec is provided, use it INSTEAD of markers (it takes priority)
      if (correctAnswerSpec && correctAnswerSpec.trim()) {
        correctIndices = []; // Clear any indices from markers
        
        // Parse correctAnswerSpec: can be "1", "A", "1,3", "A,C", etc.
        const specs = correctAnswerSpec.split(',').map(s => s.trim().toUpperCase());
        
        for (const spec of specs) {
          // Check if it's a number (1-based) or a letter (A, B, C, etc.)
          if (/^\d+$/.test(spec)) {
            const index = parseInt(spec) - 1; // Convert to 0-based index
            if (index >= 0 && index < options.length) {
              correctIndices.push(index);
            }
          } else if (/^[A-Z]$/.test(spec)) {
            const index = spec.charCodeAt(0) - 'A'.charCodeAt(0);
            if (index >= 0 && index < options.length) {
              correctIndices.push(index);
            }
          }
        }
        console.log(`Method 2 - Using specified correct answer(s): "${correctAnswerSpec}" -> indices:`, correctIndices);
        
        if (correctIndices.length === 0) {
          const errorMsg = `Invalid correct answer format: "${correctAnswerSpec}". Please use numbers (1, 2, 3, 4) or letters (A, B, C, D). For example, if option 3 is correct, enter "3" or "C".`;
          console.error('Method 2 - ' + errorMsg);
          throw new Error(errorMsg);
        }
      }
      
      // If no correct answer marked or specified, assume first option
      if (correctIndices.length === 0) {
        console.log('Method 2 - No correct answer specified, defaulting to first option');
        correctIndices.push(0);
      }
      
      const category = determineQuestionCategory(questionText);
      const tempId = crypto.randomUUID();
      const nextId = `${selectedExam.toLowerCase().replace('-', '')}-manual-${Date.now()}`;
      
      questions.push({
        id: nextId,
        question: questionText,
        options: options,
        correctAnswer: correctIndices[0],
        correctAnswers: correctIndices.length > 1 ? correctIndices : undefined,
        isMultipleChoice: correctIndices.length > 1,
        explanation: customExplanation || 'No explanation provided',
        reference: customReference || '',
        category: category,
        tempId: tempId
      });
      
      console.log('Method 2 - Successfully parsed question');
      
    } catch (err) {
      console.error('Method 2 parsing error:', err);
    }
    
    return questions;
  };

  const parseManualQuestions = (text: string, customReference: string = '', customExplanation: string = ''): ParsedQuestion[] => {
    const questions: ParsedQuestion[] = [];
    
    // Check if this is the new format (no "Question X of Y", has "Correct" marker on its own line)
    const hasQuestionNumbers = text.match(/Question\s+\d+\s+of\s+\d+/i);
    const hasCorrectMarker = /^Correct$/im.test(text);
    const isNewFormat = !hasQuestionNumbers && hasCorrectMarker;
    
    if (isNewFormat) {
      console.log('Detected new format (no question numbers, Correct marker)');
      return parseNewFormatQuestion(text, customReference, customExplanation);
    }
    
    // Split by "Question X of Y" pattern (old format)
    const questionBlocks = text.split(/Question\s+\d+\s+of\s+\d+/i);
    
    console.log('Question blocks found:', questionBlocks.length);
    
    // If no "Question X of Y" pattern found, treat entire text as one question
    if (questionBlocks.length === 1) {
      console.log('No "Question X of Y" pattern found, treating as single question');
      questionBlocks.push(text);
    }
    
    for (let i = 1; i < questionBlocks.length; i++) {
      const block = questionBlocks[i].trim();
      console.log(`Processing block ${i}, length:`, block.length);
      if (!block) continue;

      try {
        const lines = block.split('\n').map(l => l.trim()).filter(l => l);
        
        // Find instruction line and explanation start
        let instructionIndex = -1;
        let explanationStartIndex = -1;
        
        // Find where instructions are (Select all answers that apply, etc.)
        for (let j = 0; j < lines.length; j++) {
          const lowerLine = lines[j].toLowerCase();
          if (lowerLine.includes('select all') || 
              lowerLine.includes('each correct answer') ||
              (lowerLine.includes('choose') && lowerLine.includes('answer'))) {
            instructionIndex = j;
            break;
          }
        }
        
        // Find where explanation starts - but only if we don't have a custom explanation
        const explanationMarkers = ['training |', 'microsoft learn', 'describe cloud', 'describe azure', 'reference:', 'explanation:'];
        
        // Skip explanation detection if custom explanation is provided
        if (!customExplanation) {
          // First, try to find explicit markers
          for (let j = 0; j < lines.length; j++) {
            const lowerLine = lines[j].toLowerCase();
            if (explanationMarkers.some(marker => lowerLine.includes(marker))) {
              explanationStartIndex = j;
              break;
            }
          }
          
          // If no explicit marker, look for first long paragraph after all answer feedback
          if (explanationStartIndex === -1) {
            let lastFeedbackIndex = -1;
            
            // Find the last "This answer is correct/incorrect" line
            for (let j = 0; j < lines.length; j++) {
              if (lines[j] === 'This answer is correct.' || lines[j] === 'This answer is correct' ||
                  lines[j] === 'This answer is incorrect.' || lines[j] === 'This answer is incorrect') {
                lastFeedbackIndex = j;
              }
            }
            
            // Look for first substantial paragraph after last feedback marker
            if (lastFeedbackIndex !== -1) {
              for (let j = lastFeedbackIndex + 1; j < lines.length; j++) {
                // A line is likely explanation if it's a complete sentence (>40 chars)
                // Don't count it as explanation if it looks like a short option text
                if (lines[j].length > 40) {
                  explanationStartIndex = j;
                  break;
                }
              }
            }
          }
        }
        
        // Find where options actually start
        let firstOptionIndex = -1;
        let firstFeedbackIndex = -1;
        
        // First, find the first feedback marker
        for (let j = 0; j < lines.length; j++) {
          // Check if next line is a feedback marker
          if (j + 1 < lines.length && 
              (lines[j + 1] === 'This answer is correct.' || 
               lines[j + 1] === 'This answer is correct' ||
               lines[j + 1] === 'This answer is incorrect.' || 
               lines[j + 1] === 'This answer is incorrect')) {
            firstFeedbackIndex = j;
            break;
          }
          // Or if this line has checkboxes
          if (lines[j].includes('☐') || lines[j].includes('☑') || lines[j].includes('✓')) {
            firstFeedbackIndex = j;
            break;
          }
        }
        
        // If we found a feedback marker, look backward to find where options really start
        // Options are short lines (typically < 80 chars) that come after instruction text
        if (firstFeedbackIndex !== -1) {
          firstOptionIndex = firstFeedbackIndex;
          
          // Look backward for more option-like lines
          for (let j = firstFeedbackIndex - 1; j >= 0; j--) {
            const line = lines[j].toLowerCase();
            
            // Stop if we hit instruction text or question text indicators
            if (line.includes('select all') || line.includes('select only') || 
                line.includes('each correct') || line.includes('choose') ||
                line.endsWith('?') || line.length > 120) {
              break;
            }
            
            // If it's a short line (likely an option), include it
            if (lines[j].trim().length > 0 && lines[j].trim().length < 80) {
              firstOptionIndex = j;
            }
          }
        }
        
        // Question text includes everything before the first option (including instruction lines)
        // But we need to exclude the instruction line from being in the question
        let questionEndIndex = firstOptionIndex >= 0 ? firstOptionIndex : 
                               (instructionIndex >= 0 ? instructionIndex : lines.length);
        
        // Build question text, but skip instruction-only lines that come after actual question content
        const questionLines = [];
        for (let j = 0; j < questionEndIndex; j++) {
          questionLines.push(lines[j]);
        }
        
        const questionText = questionLines.join(' ').trim();
        
        console.log('Question end index:', questionEndIndex);
        console.log('Question text:', questionText.substring(0, 100));
        console.log('First option index:', firstOptionIndex);
        console.log('Instruction index:', instructionIndex);
        
        if (!questionText) {
          console.log('Skipping - empty question text');
          continue;
        }
        
        // Options start at firstOptionIndex (where we found the first option)
        const optionStartIndex = firstOptionIndex >= 0 ? firstOptionIndex : questionEndIndex;
        const optionEndIndex = explanationStartIndex > 0 ? explanationStartIndex : lines.length;
        
        console.log('Option indices:', optionStartIndex, 'to', optionEndIndex);
        
        // Extract options and find correct answers
        const options: string[] = [];
        const correctIndices: number[] = [];
        
        for (let j = optionStartIndex; j < optionEndIndex; j++) {
          const line = lines[j];
          
          // Skip "This answer is correct/incorrect" standalone lines
          if (line === 'This answer is correct.' || line === 'This answer is correct' ||
              line === 'This answer is incorrect.' || line === 'This answer is incorrect') {
            continue;
          }
          
          // Skip empty lines
          if (!line) {
            continue;
          }
          
          // Check if next line says "This answer is correct" or "This answer is incorrect"
          const nextLineIsCorrect = (j + 1 < lines.length && 
            (lines[j + 1] === 'This answer is correct.' || lines[j + 1] === 'This answer is correct'));
          
          const nextLineIsIncorrect = (j + 1 < lines.length && 
            (lines[j + 1] === 'This answer is incorrect.' || lines[j + 1] === 'This answer is incorrect'));
          
          // Check if this is a checked option (checkbox or followed by "This answer is correct")
          const isCorrect = line.includes('☑') || line.includes('✓') || 
                           line.includes('This answer is correct') || nextLineIsCorrect;
          
          // Extract option text (remove checkbox symbols and answer feedback text)
          let optionText = line
            .replace(/[☐☑✓]/g, '')
            .replace(/This answer is correct\.?/gi, '')
            .replace(/This answer is incorrect\.?/gi, '')
            .replace(/^[A-Z][\.)]\s*/, '')
            .trim();
          
          // Skip empty lines, very short lines (likely noise), and instruction text
          if (optionText && optionText.length > 2 &&
              !optionText.toLowerCase().includes('select all') &&
              !optionText.toLowerCase().includes('each correct')) {
            console.log(`Adding option ${options.length + 1}:`, optionText, isCorrect ? '(correct)' : '');
            options.push(optionText);
            if (isCorrect) {
              correctIndices.push(options.length - 1);
            }
            
            // If next line was "This answer is correct/incorrect", skip it
            if (nextLineIsCorrect || nextLineIsIncorrect) {
              j++;
            }
          } else if (optionText) {
            console.log('Skipping potential option:', optionText);
          }
        }
        
        // Extract explanation
        let explanation = '';
        let reference = '';
        
        if (explanationStartIndex !== -1) {
          const explanationLines = lines.slice(explanationStartIndex);
          const explanationText = explanationLines.join(' ');
          
          // Split explanation and reference (look for Microsoft Learn link or training reference)
          const refMatch = explanationText.match(/(Describe[^-]+-\s*Training\s*\|\s*Microsoft Learn|Training\s*\|\s*Microsoft Learn|https?:\/\/[^\s]+)/i);
          if (refMatch) {
            const refIndex = explanationText.indexOf(refMatch[0]);
            explanation = explanationText.substring(0, refIndex).trim();
            reference = refMatch[0].trim();
          } else {
            explanation = explanationText;
          }
          
          // Clean up explanation
          explanation = explanation
            .replace(/This answer is correct\.?/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
        }
        
        if (options.length < 2) {
          console.log('Skipping question - not enough options:', questionText.substring(0, 50));
          console.log('Options found:', options);
          console.log('Explanation start index:', explanationStartIndex);
          console.log('Option start/end:', optionStartIndex, optionEndIndex);
          continue;
        }
        
        // Determine category based on question content
        const category = determineQuestionCategory(questionText);
        
        const tempId = `manual-${Date.now()}-${i}`;
        
        questions.push({
          id: `${selectedExam.toLowerCase()}-manual-${i}`,
          question: questionText,
          options,
          correctAnswer: correctIndices.length > 0 ? correctIndices[0] : 0,
          correctAnswers: correctIndices.length > 1 ? correctIndices : undefined,
          isMultipleChoice: correctIndices.length > 1,
          explanation: customExplanation || explanation || 'No explanation provided',
          reference: customReference || reference || '',
          category,
          tempId,
        });
      } catch (err) {
        console.error('Error parsing question block:', err);
      }
    }
    
    return questions;
  };

  const determineQuestionCategory = (questionText: string): string => {
    const text = questionText.toLowerCase();
    
    if (selectedExam === 'AI-900') {
      if (text.includes('workload') || text.includes('ai service')) {
        return 'ai-workloads';
      }
      if (text.includes('machine learning') || text.includes('model')) {
        return 'ml-principles';
      }
      if (text.includes('computer vision') || text.includes('image')) {
        return 'computer-vision';
      }
      if (text.includes('nlp') || text.includes('language') || text.includes('text')) {
        return 'nlp-workloads';
      }
      if (text.includes('conversational') || text.includes('bot')) {
        return 'conversational-ai';
      }
      return 'ai-workloads';
    } else {
      // AZ-900 - Aligned with official exam domains
      if (text.includes('cloud computing') || text.includes('cloud model') || text.includes('cloud service') ||
          text.includes('iaas') || text.includes('paas') || text.includes('saas') ||
          text.includes('public cloud') || text.includes('private cloud') || text.includes('hybrid cloud') ||
          text.includes('serverless') || text.includes('capex') || text.includes('opex') ||
          text.includes('scalability') || text.includes('elasticity') || text.includes('high availability') ||
          text.includes('disaster recovery') || text.includes('shared responsibility')) {
        return 'Cloud-Concepts';
      }
      if (text.includes('region') || text.includes('availability zone') || text.includes('resource group') ||
          text.includes('virtual machine') || text.includes('vm') || text.includes('app service') ||
          text.includes('container') || text.includes('azure functions') || text.includes('aks') ||
          text.includes('storage') || text.includes('blob') || text.includes('sql') || text.includes('cosmos') ||
          text.includes('virtual network') || text.includes('vnet') || text.includes('vpn') ||
          text.includes('azure marketplace')) {
        return 'Azure-Architecture-Services';
      }
      if (text.includes('cost') || text.includes('pricing') || text.includes('tco') || text.includes('calculator') ||
          text.includes('azure policy') || text.includes('resource lock') || text.includes('blueprint') ||
          text.includes('azure portal') || text.includes('powershell') || text.includes('cli') ||
          text.includes('azure monitor') || text.includes('advisor') || text.includes('service health') ||
          text.includes('sla') || text.includes('service level')) {
        return 'Management-Governance';
      }
      if (text.includes('security') || text.includes('authentication') || text.includes('authorization') ||
          text.includes('azure active directory') || text.includes('azure ad') || text.includes('entra') ||
          text.includes('rbac') || text.includes('mfa') || text.includes('firewall') ||
          text.includes('compliance') || text.includes('gdpr') || text.includes('trust center') ||
          text.includes('encryption') || text.includes('key vault') || text.includes('defender')) {
        return 'Security-Compliance-Trust';
      }
      return 'General';
    }
  };

  const fetchAllQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const response = await fetch(`/api/admin/all-questions?exam=${selectedExam}`);
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
      const response = await fetch(`/api/admin/find-duplicates?exam=${selectedExam}`);
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
    console.log('handleDeleteDuplicates called', { questionsToDeleteSize: questionsToDelete.size, ids: Array.from(questionsToDelete) });
    
    if (questionsToDelete.size === 0) {
      setError('No questions selected for deletion');
      console.log('No questions selected');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${questionsToDelete.size} duplicate question(s)?`)) {
      console.log('User cancelled deletion');
      return;
    }

    console.log('Starting deletion...');
    setLoading(true);
    try {
      const response = await fetch('/api/admin/delete-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionIds: Array.from(questionsToDelete) }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setSuccess(`Successfully deleted ${data.count} question(s)`);
        setQuestionsToDelete(new Set());
        findDuplicates(); // Refresh the list
      } else {
        setError(data.error || 'Failed to delete questions');
      }
    } catch (err) {
      console.error('Error deleting questions:', err);
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

  // Reload data when exam selector changes
  useEffect(() => {
    if (activeTab === 'view-all') {
      fetchAllQuestions();
    } else if (activeTab === 'duplicates') {
      findDuplicates();
    }
  }, [selectedExam]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Admin - Question Manager</h1>
              <p className="text-neutral-600">
                Manage questions for Azure certification exams
              </p>
            </div>
            
            {/* Exam Selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-neutral-700">Exam:</label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value as 'AI-900' | 'AZ-900')}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="AI-900">AI-900 (Azure AI Fundamentals)</option>
                <option value="AZ-900">AZ-900 (Azure Fundamentals)</option>
              </select>
            </div>
          </div>
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
              Import File
            </button>
            <button
              onClick={() => setActiveTab('manual-import')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'manual-import'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              <FileText className="inline-block w-5 h-5 mr-2" />
              Manual Import
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
              Choose HTML or PDF file
            </span>
            <input
              type="file"
              className="hidden"
              accept=".htm,.html,.pdf"
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
                        {question.isMultipleChoice && (
                          <div className="text-sm text-blue-600 font-semibold mb-2">
                            Multiple Choice Question - {question.correctAnswers?.length || 0} correct answer(s)
                          </div>
                        )}
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center">
                            <span className={`px-3 py-2 rounded-lg font-semibold mr-3 ${
                              (question.correctAnswers?.includes(optIndex) || optIndex === question.correctAnswer)
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

        {/* Manual Import Tab */}
        {activeTab === 'manual-import' && (
          <>
            <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                📋 Two Import Methods
              </h3>
              <div className="space-y-4 text-sm text-blue-800">
                <div>
                  <strong className="text-blue-900">Method 1: Copy Full Page (Recommended for multiple questions)</strong>
                  <ol className="list-decimal list-inside space-y-1 mt-2 ml-4">
                    <li>Go to quiz page, select all (Ctrl+A), copy and paste into "Full Page Text" area</li>
                  </ol>
                </div>
                <div>
                  <strong className="text-blue-900">Method 2: Separate Question & Options (Better for single questions)</strong>
                  <ol className="list-decimal list-inside space-y-1 mt-2 ml-4">
                    <li>Paste just the question text in "Question Text" area</li>
                    <li>Paste the options and "This answer is correct/incorrect" markers in "Options & Answers" area</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Method 1: Full page text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Method 1: Full Page Text (Multiple Questions)
              </label>
              <textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Paste complete page with 'Question X of Y' headers..."
                className="w-full h-64 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-500 font-medium">OR</span>
              </div>
            </div>

            {/* Method 2: Separate inputs */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Method 2: Question Text Only
              </label>
              <textarea
                value={manualQuestionText}
                onChange={(e) => setManualQuestionText(e.target.value)}
                placeholder="Example: Select the answer that correctly completes the sentence. [Answer choice] is the logical container used to combine and organize Azure resources."
                className="w-full h-32 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Method 2: Options & Answers
              </label>
              <textarea
                value={manualOptionsText}
                onChange={(e) => setManualOptionsText(e.target.value)}
                placeholder={"Azure Container Instances\n\nAzure Functions\n\nThis answer is correct.\n\nAzure Logic Apps\n\nAzure Virtual Desktop"}
                className="w-full h-48 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Include the options and "This answer is correct/incorrect" markers, OR specify correct answer below
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Method 2: Correct Answer (Optional)
              </label>
              <input
                type="text"
                value={manualCorrectAnswer}
                onChange={(e) => setManualCorrectAnswer(e.target.value)}
                placeholder="Enter: 3 or C (if option 3 is correct)"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <p className="mt-1 text-xs text-red-600 font-medium">
                ⚠️ Use NUMBERS (1, 2, 3, 4) or LETTERS (A, B, C, D) only - NOT the option text!
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                For multiple correct answers, separate with commas: "1,3" or "A,C"
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Method 2: Explanation (Optional)
              </label>
              <textarea
                value={manualExplanation}
                onChange={(e) => setManualExplanation(e.target.value)}
                placeholder="Azure Functions allows you to run code as a service without having to manage the underlying platform or infrastructure..."
                className="w-full h-32 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Provide context or explanation for the correct answer
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Documentation Link (Optional)
              </label>
              <input
                type="text"
                value={manualReference}
                onChange={(e) => setManualReference(e.target.value)}
                placeholder="https://learn.microsoft.com/..."
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <p className="mt-1 text-xs text-neutral-500">
                If provided, this link will override any reference found in the parsed text
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleManualParse}
                disabled={(!manualText.trim() && (!manualQuestionText.trim() || !manualOptionsText.trim())) || loading}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Parsing...' : 'Parse Questions'}
              </button>
              <button
                onClick={() => {
                  setManualText('');
                  setManualQuestionText('');
                  setManualOptionsText('');
                  setManualExplanation('');
                  setManualReference('');
                  setManualCorrectAnswer('');
                  setParsedQuestions([]);
                  setError('');
                  setSuccess('');
                }}
                className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-lg font-semibold hover:bg-neutral-300 transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Show parsed questions (reuse the same display as file import) */}
            {parsedQuestions.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Parsed Questions ({parsedQuestions.length})
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Review and edit questions before saving. Uncheck any questions you don't want to import.
                </p>

                <div className="space-y-6">
                  {parsedQuestions.map((question, index) => (
                    <div
                      key={question.tempId}
                      className={`border rounded-lg p-6 ${
                        selectedQuestions.has(question.tempId!)
                          ? 'border-primary-200 bg-primary-50'
                          : 'border-neutral-200 bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <input
                          type="checkbox"
                          checked={selectedQuestions.has(question.tempId!)}
                          onChange={() => toggleQuestionSelection(question.tempId!)}
                          className="mt-1 h-5 w-5 text-primary-500 rounded focus:ring-primary-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold text-neutral-500">
                              Question {index + 1}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              question.isMultipleChoice
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {question.isMultipleChoice ? 'Multiple Choice' : 'Single Choice'}
                            </span>
                            <span className="text-xs px-2 py-1 rounded bg-neutral-100 text-neutral-700">
                              {question.category}
                            </span>
                          </div>

                          <div className="mb-4">
                            <label className="block text-xs font-medium text-neutral-600 mb-1">
                              Question Text
                            </label>
                            <textarea
                              value={question.question}
                              onChange={(e) =>
                                handleEditQuestion(question.tempId!, 'question', e.target.value)
                              }
                              className="w-full px-3 py-2 border border-neutral-300 rounded text-sm"
                              rows={3}
                            />
                          </div>

                          <div className="mb-4">
                            <label className="block text-xs font-medium text-neutral-600 mb-2">
                              Options
                            </label>
                            <div className="space-y-2">
                              {question.options.map((option, optIndex) => {
                                const isCorrect = question.isMultipleChoice
                                  ? question.correctAnswers?.includes(optIndex)
                                  : question.correctAnswer === optIndex;
                                
                                return (
                                  <div
                                    key={optIndex}
                                    className={`flex items-center gap-2 p-2 rounded ${
                                      isCorrect ? 'bg-green-50 border border-green-200' : 'bg-white border border-neutral-200'
                                    }`}
                                  >
                                    <span className="text-xs font-semibold text-neutral-500 w-6">
                                      {String.fromCharCode(65 + optIndex)}.
                                    </span>
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [...question.options];
                                        newOptions[optIndex] = e.target.value;
                                        handleEditQuestion(question.tempId!, 'options', newOptions);
                                      }}
                                      className="flex-1 px-2 py-1 border-0 bg-transparent text-sm"
                                    />
                                    {isCorrect && (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {question.explanation && (
                            <div className="mb-4">
                              <label className="block text-xs font-medium text-neutral-600 mb-1">
                                Explanation
                              </label>
                              <textarea
                                value={question.explanation}
                                onChange={(e) =>
                                  handleEditQuestion(question.tempId!, 'explanation', e.target.value)
                                }
                                className="w-full px-3 py-2 border border-neutral-300 rounded text-sm"
                                rows={2}
                              />
                            </div>
                          )}

                          {question.reference && (
                            <div className="mb-2">
                              <label className="block text-xs font-medium text-neutral-600 mb-1">
                                Reference
                              </label>
                              <input
                                type="text"
                                value={question.reference}
                                onChange={(e) =>
                                  handleEditQuestion(question.tempId!, 'reference', e.target.value)
                                }
                                className="w-full px-3 py-2 border border-neutral-300 rounded text-sm"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    onClick={handleSaveQuestions}
                    disabled={selectedQuestions.size === 0 || loading}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : `Save Selected Questions (${selectedQuestions.size})`}
                  </button>
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
