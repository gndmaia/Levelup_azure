import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

// Helper function to download and save image
async function downloadImage(imageUrl: string, imageBuffer?: Buffer): Promise<string | null> {
  try {
    // Create images directory if it doesn't exist
    const imagesDir = path.join(process.cwd(), 'public', 'question-images');
    await fs.mkdir(imagesDir, { recursive: true });

    let buffer: Buffer;
    let ext = '.png';

    // If image buffer is provided (from uploaded file), use it directly
    if (imageBuffer) {
      buffer = imageBuffer;
      // Try to determine extension from the image data
      ext = path.extname(imageUrl) || '.png';
    } else {
      // Otherwise, try to download from URL (for absolute URLs)
      try {
        const response = await fetch(imageUrl);
        if (!response.ok) return null;
        buffer = Buffer.from(await response.arrayBuffer());
        ext = path.extname(new URL(imageUrl).pathname) || '.png';
      } catch (e) {
        // If it's not a valid URL, skip it
        console.log('Skipping invalid URL:', imageUrl);
        return null;
      }
    }
    
    // Generate unique filename based on URL hash
    const hash = crypto.createHash('md5').update(imageUrl).digest('hex');
    const filename = `${hash}${ext}`;
    const filepath = path.join(imagesDir, filename);

    // Save the image
    await fs.writeFile(filepath, buffer);

    // Return the public URL
    return `/question-images/${filename}`;
  } catch (error) {
    console.error('Error downloading image:', imageUrl, error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' });
    }

    const htmlContent = await file.text();
    const $ = cheerio.load(htmlContent);

    // Get all uploaded image files (if any)
    const imageFiles = new Map<string, Buffer>();
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image-') && value instanceof File) {
        const imageName = key.substring(6); // Remove 'image-' prefix
        const buffer = Buffer.from(await value.arrayBuffer());
        imageFiles.set(imageName, buffer);
      }
    }

    const questions: any[] = [];

    // Find all question list items
    $('.wpProQuiz_listItem').each((index, element) => {
      const $item = $(element);
      
      // Extract question text (including images and all content)
      const $questionContainer = $item.find('.wpProQuiz_question_text');
      let questionText = '';
      let questionImages: string[] = [];
      let imageUrls: string[] = [];
      
      // Get all text content (all paragraphs, not just first)
      const textParts: string[] = [];
      $questionContainer.find('p').each((_, p) => {
        const text = $(p).text().trim();
        if (text) textParts.push(text);
      });
      questionText = textParts.join('\n\n');
      
      // If no paragraphs, get direct text
      if (!questionText) {
        questionText = $questionContainer.text().trim();
      }
      
      // Extract images if present
      $questionContainer.find('img').each((_, img) => {
        const src = $(img).attr('src');
        const alt = $(img).attr('alt') || 'diagram';
        if (src) {
          console.log(`Found image in question ${index + 1}:`, src);
          // Extract just the filename from the path
          const filename = src.split('/').pop() || src;
          imageUrls.push(filename);
        }
      });
      
      // Store images for later processing
      if (imageUrls.length > 0) {
        questionImages = imageUrls;
        // Add a note to the question text that it contains an image
        questionText += `\n\n[Image: ${imageUrls.join(', ')}]`;
      }
      
      if (!questionText) return;

      // Extract options
      const options: string[] = [];
      let correctAnswerIndex = -1;

      $item.find('.wpProQuiz_questionListItem').each((optIndex, optElement) => {
        const $opt = $(optElement);
        const optionText = $opt.find('label').text().trim();
        
        if (optionText) {
          options.push(optionText);
        }

        // Check if this is the correct answer
        if ($opt.hasClass('wpProQuiz_answerCorrect')) {
          correctAnswerIndex = optIndex;
        }
      });

      // Extract explanation and reference
      let explanation = '';
      let reference = '';

      const $response = $item.find('.wpProQuiz_correct p').first();
      if ($response.length) {
        explanation = $response.text().trim();
        
        // Extract reference URL
        const $refLink = $item.find('.wpProQuiz_correct a').first();
        if ($refLink.length) {
          reference = $refLink.attr('href') || '';
        }
      }

      // If no explanation in correct section, try unattempted section
      if (!explanation) {
        const $unattempted = $item.find('.wpProQuiz_unattempted p').first();
        if ($unattempted.length) {
          explanation = $unattempted.text().trim();
          
          const $refLink = $item.find('.wpProQuiz_unattempted a').first();
          if ($refLink.length) {
            reference = $refLink.attr('href') || '';
          }
        }
      }

      // Auto-categorize based on keywords
      let category = 'ML-Fundamentals'; // default
      const lowerQuestion = questionText.toLowerCase();
      const lowerExplanation = explanation.toLowerCase();
      const combinedText = lowerQuestion + ' ' + lowerExplanation;

      if (combinedText.includes('computer vision') || combinedText.includes('image') || combinedText.includes('object detection') || combinedText.includes('custom vision')) {
        category = 'Computer-Vision';
      } else if (combinedText.includes('nlp') || combinedText.includes('natural language') || combinedText.includes('text analytics') || combinedText.includes('language understanding')) {
        category = 'NLP';
      } else if (combinedText.includes('bot') || combinedText.includes('conversational') || combinedText.includes('qna maker') || combinedText.includes('luis')) {
        category = 'Conversational-AI';
      } else if (combinedText.includes('speech') || combinedText.includes('audio')) {
        category = 'Speech';
      } else if (combinedText.includes('document intelligence') || combinedText.includes('form recognizer') || combinedText.includes('ocr')) {
        category = 'Document-Intelligence';
      } else if (combinedText.includes('responsible') || combinedText.includes('fairness') || combinedText.includes('transparency') || combinedText.includes('bias')) {
        category = 'Responsible-AI';
      } else if (combinedText.includes('azure machine learning') || combinedText.includes('azure ml') || combinedText.includes('workspace')) {
        category = 'Azure-ML';
      } else if (combinedText.includes('anomaly detection')) {
        category = 'Anomaly-Detection';
      } else if (combinedText.includes('ai workload') || combinedText.includes('artificial intelligence')) {
        category = 'AI-Workloads';
      }

      questions.push({
        tempId: `temp_${Date.now()}_${index}`,
        question: questionText,
        options,
        correctAnswer: correctAnswerIndex,
        explanation,
        reference,
        category,
        images: questionImages, // Store original image URLs temporarily
      });
    });

    if (questions.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No questions found in the HTML file. Make sure it\'s a valid SkillCertPro exam file.',
      });
    }

    // Note: Images are now marked in the question text with [Image: filename]
    // The admin can manually upload images to public/question-images/ folder
    // and edit the question to reference them properly with [📊 Image/Diagram: /question-images/filename]
    
    // Clean up temporary images arrays
    for (const question of questions) {
      delete (question as any).images;
    }

    return NextResponse.json({
      success: true,
      questions,
      count: questions.length,
    });
  } catch (error: any) {
    console.error('Error parsing questions:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to parse questions',
    });
  }
}
