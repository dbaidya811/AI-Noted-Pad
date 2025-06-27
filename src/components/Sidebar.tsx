
import React from 'react';
import { Search, Plus, FileText, Brain, CheckSquare, Trash2 } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'mindmap' | 'todo';
  createdAt: Date;
  updatedAt: Date;
}

interface SidebarProps {
  notes: Note[];
  activeNote: Note | null;
  onSelectNote: (note: Note) => void;
  onCreateNote: (type: 'note' | 'mindmap' | 'todo') => void;
  onDeleteNote: (noteId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  notes,
  activeNote,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  searchQuery,
  onSearchChange
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <FileText className="h-4 w-4" />;
      case 'mindmap':
        return <Brain className="h-4 w-4" />;
      case 'todo':
        return <CheckSquare className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'note':
        return 'text-blue-500';
      case 'mindmap':
        return 'text-green-500';
      case 'todo':
        return 'text-purple-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Create buttons */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onCreateNote('note')}
            className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex flex-col items-center space-y-1"
          >
            <FileText className="h-4 w-4" />
            <span className="text-xs">Note</span>
          </button>
          <button
            onClick={() => onCreateNote('mindmap')}
            className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors flex flex-col items-center space-y-1"
          >
            <Brain className="h-4 w-4" />
            <span className="text-xs">Mind Map</span>
          </button>
          <button
            onClick={() => onCreateNote('todo')}
            className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors flex flex-col items-center space-y-1"
          >
            <CheckSquare className="h-4 w-4" />
            <span className="text-xs">Todo</span>
          </button>
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {searchQuery ? 'No notes found' : 'No notes yet'}
          </div>
        ) : (
          <div className="p-2">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note)}
                className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 mb-2 ${
                  activeNote?.id === note.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={getTypeColor(note.type)}>
                        {getTypeIcon(note.type)}
                      </span>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {note.title}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {note.type === 'todo' 
                        ? `${JSON.parse(note.content || '[]').length} items`
                        : note.content || 'No content'
                      }
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {note.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(note.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
