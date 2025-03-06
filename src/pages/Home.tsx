import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Upload, Type, ImageIcon, Loader2 } from 'lucide-react';
import { analyzeImage } from '../lib/gemini';
import SupportBlock from '../components/SupportBlock';

// Default font image path
const DEFAULT_IMAGE = "/default-font.jpg";

// Default analysis for the font
const DEFAULT_ANALYSIS = `1. Primary Font Identification:
- Font Name: Garamond (Classic style)
- Classification: Serif
- Style: Old-style serif
- Weight: Regular
- Era/Period: Renaissance (16th century origins)
- Sample Characters: "fetched the day before", "Tales at Bedtime", "Tom the Scout-Cub"

2. Font Details & Characteristics:
- Designer: Claude Garamond (original) with many variants over centuries
- Distinctive Features: Elegant proportions, moderate contrast between thick and thin strokes
- x-height: Moderate
- Serifs: Bracketed serifs with gentle curves
- Character Terminals: Rounded, soft terminals
- Stress Angle: Diagonal/oblique stress
- Character Recognition: Classic double-story 'a', graceful 'e' with angled crossbar

3. Secondary Fonts Detected:
- Chapter Titles: Possibly Garamond Bold or Semibold
- Page Numbers: Same typeface, smaller point size
- Book Title: Garamond small caps or variant

4. Typographic Analysis:
- Leading (Line Spacing): Generous, approximately 1.4-1.5× the font size
- Paragraph Formatting: Justified alignment
- Margins: Generous margins characteristic of classic book design
- Character Spacing: Natural spacing with minimal kerning adjustments
- Word Spacing: Well-balanced for readability
- Page Layout: Traditional book layout with page numbers at top outside corners

5. Similar Fonts & Alternatives:
- Adobe Garamond Pro
- Sabon (designed by Jan Tschichold)
- EB Garamond (open source)
- Granjon
- Minion Pro
- Bembo
- Palatino

6. Font Licensing & Sources:
- Commercial Options: Adobe Fonts (Adobe Garamond), Monotype (Garamond variants)
- Free Alternatives: EB Garamond (Google Fonts), Cormorant Garamond
- Usage Restrictions: Most Garamond variants allow both personal and commercial use

7. Historical Context:
- Garamond typefaces are named after Claude Garamond (c. 1510-1561)
- Originally designed for Latin texts and evolved for various European languages
- Widely used in book printing for centuries
- Considered one of the most readable serif fonts for extended text
- Known for its elegance and refined appearance

8. Usage Recommendations:
- Ideal For: Books, academic texts, literary publications
- Print Applications: Magazine articles, journals, formal invitations
- Digital Use: Any text requiring elegance and readability
- Pairing Suggestions: Sans-serif fonts like Gill Sans or Futura for headers/subtitles
- Point Size Recommendation: 10-12pt for body text, 14-18pt for subheadings`;

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load default image and analysis without API call
    const loadDefaultContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(DEFAULT_IMAGE);
        if (!response.ok) {
          throw new Error('Failed to load default image');
        }
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setImage(base64data);
          setAnalysis(DEFAULT_ANALYSIS);
          setLoading(false);
        };
        reader.onerror = () => {
          setError('Failed to load default image');
          setLoading(false);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error('Error loading default image:', err);
        setError('Failed to load default image');
        setLoading(false);
      }
    };

    loadDefaultContent();
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('Image size should be less than 20MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImage(base64String);
      setError(null);
      handleAnalyze(base64String);
    };
    reader.onerror = () => {
      setError('Failed to read the image file. Please try again.');
    };
    reader.readAsDataURL(file);

    // Reset the file input so the same file can be selected again
    e.target.value = '';
  }, []);

  const handleAnalyze = async (imageData: string) => {
    setLoading(true);
    setError(null);
    const fontPrompt = "Analyze this image and identify the fonts used in it. Provide the following information:\n1. Primary Font Identification (font name, classification, style, weight, era/period, sample characters)\n2. Font Details & Characteristics (designer, distinctive features, x-height, serifs, terminals, stress angle, character recognition)\n3. Secondary Fonts Detected (if any other fonts are present in headings, captions, etc.)\n4. Typographic Analysis (leading, paragraph formatting, margins, character spacing, word spacing, layout)\n5. Similar Fonts & Alternatives (list of similar typefaces and good alternatives)\n6. Font Licensing & Sources (where to find the font, licensing information)\n7. Historical Context (background information about the font)\n8. Usage Recommendations (ideal uses, print applications, digital use, pairing suggestions, size recommendations)\n\nIf you cannot identify the exact font with certainty, provide your best educated guess and list several possible matches.";
    try {
      const result = await analyzeImage(imageData, fontPrompt);
      setAnalysis(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze image. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatAnalysis = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Remove any markdown-style formatting
      const cleanLine = line.replace(/[*_#`]/g, '').trim();
      if (!cleanLine) return null;

      // Format section headers (lines starting with numbers)
      if (/^\d+\./.test(cleanLine)) {
        return (
          <div key={index} className="mt-8 first:mt-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {cleanLine.replace(/^\d+\.\s*/, '')}
            </h3>
          </div>
        );
      }
      
      // Format list items with specific properties
      if (cleanLine.startsWith('-') && cleanLine.includes(':')) {
        const [label, ...valueParts] = cleanLine.substring(1).split(':');
        const value = valueParts.join(':').trim();
        return (
          <div key={index} className="flex gap-2 mb-3 ml-4">
            <span className="font-semibold text-gray-800 min-w-[120px]">{label.trim()}:</span>
            <span className="text-gray-700">{value}</span>
          </div>
        );
      }
      
      // Format regular list items
      if (cleanLine.startsWith('-')) {
        return (
          <div key={index} className="flex gap-2 mb-3 ml-4">
            <span className="text-gray-400">•</span>
            <span className="text-gray-700">{cleanLine.substring(1).trim()}</span>
          </div>
        );
      }

      // Regular text
      return (
        <p key={index} className="mb-3 text-gray-700">
          {cleanLine}
        </p>
      );
    }).filter(Boolean);
  };

  return (
    <div className="bg-gray-50 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">AI Font Identifier</h1>
          <p className="text-base sm:text-lg text-gray-600">Upload an image containing text and instantly identify the fonts used</p>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-12">
          <div className="flex flex-col items-center justify-center mb-6">
            <label 
              htmlFor="image-upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer w-full sm:w-auto"
            >
              <Upload className="h-5 w-5" />
              Upload Image with Text
              <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleImageUpload}
              />
            </label>
            <p className="mt-2 text-sm text-gray-500">PNG, JPG, JPEG or WEBP (MAX. 20MB)</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {loading && !image && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          )}

          {image && (
            <div className="mb-6">
              <div className="relative rounded-lg mb-4 overflow-hidden bg-gray-100">
                <img
                  src={image}
                  alt="Text sample preview"
                  className="w-full h-auto max-h-[500px] object-contain mx-auto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnalyze(image)}
                  disabled={loading}
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Type className="-ml-1 mr-2 h-5 w-5" />
                      Identify Font
                    </>
                  )}
                </button>
                <button
                  onClick={triggerFileInput}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Another Image
                </button>
              </div>
            </div>
          )}

          {analysis && (
            <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Font Analysis Results</h2>
              <div className="text-gray-700">
                {formatAnalysis(analysis)}
              </div>
            </div>
          )}
        </div>

        <SupportBlock />

        <div className="prose max-w-none my-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">AI Font Identifier: Recognize Any Typography Instantly</h2>
          
          <p>Welcome to our free font identifier tool, powered by advanced artificial intelligence technology.
             This tool helps you identify typefaces from any image containing text, providing essential information about the font's
             characteristics, history, and where you can find it.</p>

          <h3>How Our Font Identifier Works</h3>
          <p>Our tool uses AI to analyze images containing text and identify the fonts used.
             Simply upload a clear photo of any printed or digital text, and our AI will help you identify the typeface,
             suggest similar alternatives, and provide valuable information about its design and usage - perfect for designers, 
             marketers, and typography enthusiasts.</p>

          <h3>Key Features of Our Font Identifier</h3>
          <ul>
            <li>Advanced AI font recognition technology</li>
            <li>Detailed typeface classification and characteristics</li>
            <li>Historical context and designer information</li>
            <li>Similar font recommendations</li>
            <li>Licensing information and download sources</li>
            <li>Usage recommendations and pairing suggestions</li>
            <li>100% free to use</li>
          </ul>

          <h3>Perfect For:</h3>
          <ul>
            <li>Graphic designers seeking to match fonts</li>
            <li>Marketers analyzing competitors' branding</li>
            <li>Publishers maintaining typographic consistency</li>
            <li>Web developers replicating design mockups</li>
            <li>Students learning about typography</li>
            <li>Anyone curious about the fonts they encounter daily</li>
          </ul>

          <p>Try our free font identifier today and unlock the mystery of any typeface you encounter!
             No registration required - just upload an image and discover the world of typography.</p>
        </div>

        <SupportBlock />
      </div>
    </div>
  );
}