
import React, { useState, useEffect } from 'react';
import { Type, Bold, Italic, List, ListOrdered } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'mindmap' | 'todo';
  createdAt: Date;
  updatedAt: Date;
}

interface NoteEditorProps {
  note: Note;
  onUpdate: (note: Note) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onUpdate }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    onUpdate({ ...note, title: newTitle });
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onUpdate({ ...note, content: newContent });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Title */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full text-2xl font-bold bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
          placeholder="Note title..."
        />
        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Created: {note.createdAt.toLocaleDateString()}</span>
          <span>Modified: {note.updatedAt.toLocaleDateString()}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 transition-colors">
            <Bold className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 transition-colors">
            <Italic className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
          <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 transition-colors">
            <List className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 transition-colors">
            <ListOrdered className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full h-full resize-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-base leading-relaxed"
          placeholder="Start writing your note..."
        />
      </div>
    </div>
  );
};

export default NoteEditor;
