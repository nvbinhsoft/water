import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeHighlight from 'rehype-highlight';
import type { Plugin } from 'unified';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { useTheme } from './ThemeProvider';

interface RichMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onUploadImage?: (file: File) => Promise<string>;
}

const codeLanguages = ['ts', 'tsx', 'js', 'jsx', 'java', 'python', 'go', 'bash', 'yaml', 'json', 'sql'];

export const RichMarkdownEditor = ({ value, onChange, onUploadImage }: RichMarkdownEditorProps) => {
  const [selectedLang, setSelectedLang] = useState('ts');
  const [isUploading, setIsUploading] = useState(false);
  const { theme } = useTheme();

  const insertCodeBlock = (lang: string) => {
    const snippet = `\n\`\`\`${lang}\n// ${lang} code\n\`\`\`\n`;
    onChange(`${value}${snippet}`);
  };

  const handleImageUpload = async (file?: File) => {
    if (!file || !onUploadImage) return;
    setIsUploading(true);
    try {
      const url = await onUploadImage(file);
      onChange(`${value}\n\n![image](${url})\n`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="h-9 rounded-md border-slate-200 bg-white text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {codeLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => insertCodeBlock(selectedLang)}
            className="h-9 rounded-md bg-white px-3 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700"
          >
            Insert Code
          </button>
        </div>
        {onUploadImage && (
          <label className="flex h-9 cursor-pointer items-center gap-2 rounded-md bg-white px-3 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-slate-500">
              <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-2.69l-2.22-2.219a.75.75 0 00-1.06 0l-1.91 1.909.47.47a.75.75 0 11-1.06 1.06L6.53 8.091a.75.75 0 00-1.06 0l-2.97 2.97zM12 7a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
            </svg>
            {isUploading ? 'Uploading...' : 'Upload Image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files?.[0])}
              disabled={isUploading}
            />
          </label>
        )}
      </div>

      <div
        data-color-mode={theme}
        className="overflow-hidden rounded-lg border border-slate-200 shadow-sm dark:border-slate-800"
      >
        <MDEditor
          value={value}
          onChange={(next) => onChange(next ?? '')}
          height={600}
          previewOptions={{ rehypePlugins: [[rehypeHighlight as unknown as Plugin, { detect: true, ignoreMissing: true }]] }}
          textareaProps={{ placeholder: 'Write your post in Markdown...' }}
          className="!border-none"
        />
      </div>
    </div>
  );
};
