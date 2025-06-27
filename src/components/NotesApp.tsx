
import React, { useState, useEffect } from 'react';
import { Plus, Search, Moon, Sun, LogOut, Settings, Brain } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import NoteEditor from './NoteEditor';
import MindMap from './MindMap';
import TodoList from './TodoList';
import AIAssistant from './AIAssistant';
import SettingsModal from './SettingsModal';

interface NotesAppProps {
  onLogout: () => void;
}

interface Note {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'mindmap' | 'todo';
  createdAt: Date;
  updatedAt: Date;
}

const NotesApp: React.FC<NotesAppProps> = ({ onLogout }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  useEffect(() => {
    const savedNotes = document.cookie
      .split('; ')
      .find(row => row.startsWith('notes='))
      ?.split('=')[1];
    
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(decodeURIComponent(savedNotes)).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
        setNotes(parsedNotes);
      } catch (e) {
        console.error('Error parsing notes:', e);
      }
    }
  }, []);

  const saveNotes = (updatedNotes: Note[]) => {
    document.cookie = `notes=${encodeURIComponent(JSON.stringify(updatedNotes))}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    setNotes(updatedNotes);
  };

  const createNote = (type: 'note' | 'mindmap' | 'todo') => {
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content: type === 'todo' ? '[]' : '',
      type,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updatedNotes = [newNote, ...notes];
    saveNotes(updatedNotes);
    setActiveNote(newNote);
  };

  const updateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map(note => 
      note.id === updatedNote.id ? { ...updatedNote, updatedAt: new Date() } : note
    );
    saveNotes(updatedNotes);
    setActiveNote(updatedNote);
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    saveNotes(updatedNotes);
    if (activeNote?.id === noteId) {
      setActiveNote(null);
    }
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 z-10">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Notepad AI
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Welcome, {user?.username}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAI(true)}
            className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
            title="AI Assistant"
          >
            <Brain className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <button
            onClick={handleLogout}
            className="p-2 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <Sidebar
            notes={filteredNotes}
            activeNote={activeNote}
            onSelectNote={setActiveNote}
            onCreateNote={createNote}
            onDeleteNote={deleteNote}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-gray-800">
          {activeNote ? (
            <>
              {activeNote.type === 'note' && (
                <NoteEditor note={activeNote} onUpdate={updateNote} />
              )}
              {activeNote.type === 'mindmap' && (
                <MindMap note={activeNote} onUpdate={updateNote} />
              )}
              {activeNote.type === 'todo' && (
                <TodoList note={activeNote} onUpdate={updateNote} />
              )}
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Plus className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Create your first note
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Choose from notes, mind maps, or todo lists
                </p>
                <div className="flex space-x-3 justify-center">
                  <button
                    onClick={() => createNote('note')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    New Note
                  </button>
                  <button
                    onClick={() => createNote('mindmap')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Mind Map
                  </button>
                  <button
                    onClick={() => createNote('todo')}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Todo List
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
      
      {showAI && (
        <AIAssistant
          onClose={() => setShowAI(false)}
          activeNote={activeNote}
          onUpdateNote={updateNote}
        />
      )}
    </div>
  );
};

export default NotesApp;
