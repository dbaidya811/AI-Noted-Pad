
import React, { useState, useEffect } from 'react';
import { Plus, Minus, Edit3 } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'mindmap' | 'todo';
  createdAt: Date;
  updatedAt: Date;
}

interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  children: string[];
  parent?: string;
}

interface MindMapProps {
  note: Note;
  onUpdate: (note: Note) => void;
}

const MindMap: React.FC<MindMapProps> = ({ note, onUpdate }) => {
  const [title, setTitle] = useState(note.title);
  const [nodes, setNodes] = useState<MindMapNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    setTitle(note.title);
    try {
      const parsedNodes = note.content ? JSON.parse(note.content) : [];
      if (parsedNodes.length === 0) {
        // Create initial central node
        const centralNode: MindMapNode = {
          id: 'root',
          text: 'Central Idea',
          x: 400,
          y: 300,
          children: []
        };
        setNodes([centralNode]);
      } else {
        setNodes(parsedNodes);
      }
    } catch (e) {
      console.error('Error parsing mind map data:', e);
    }
  }, [note]);

  const updateNodes = (newNodes: MindMapNode[]) => {
    setNodes(newNodes);
    onUpdate({ ...note, content: JSON.stringify(newNodes) });
  };

  const addNode = (parentId: string) => {
    const parent = nodes.find(n => n.id === parentId);
    if (!parent) return;

    const angle = (parent.children.length * 60) * (Math.PI / 180);
    const distance = 150;
    const newNode: MindMapNode = {
      id: Math.random().toString(36).substr(2, 9),
      text: 'New Idea',
      x: parent.x + Math.cos(angle) * distance,
      y: parent.y + Math.sin(angle) * distance,
      children: [],
      parent: parentId
    };

    const updatedNodes = [...nodes, newNode];
    const updatedParent = { ...parent, children: [...parent.children, newNode.id] };
    const finalNodes = updatedNodes.map(n => n.id === parentId ? updatedParent : n);
    
    updateNodes(finalNodes);
  };

  const deleteNode = (nodeId: string) => {
    if (nodeId === 'root') return; // Don't delete root node
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    // Remove from parent's children
    const updatedNodes = nodes.filter(n => n.id !== nodeId);
    if (node.parent) {
      const parent = updatedNodes.find(n => n.id === node.parent);
      if (parent) {
        parent.children = parent.children.filter(id => id !== nodeId);
      }
    }

    updateNodes(updatedNodes);
  };

  const startEditing = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setEditingNode(nodeId);
      setEditText(node.text);
    }
  };

  const saveEdit = () => {
    if (editingNode) {
      const updatedNodes = nodes.map(n => 
        n.id === editingNode ? { ...n, text: editText } : n
      );
      updateNodes(updatedNodes);
      setEditingNode(null);
      setEditText('');
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    onUpdate({ ...note, title: newTitle });
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
          placeholder="Mind map title..."
        />
      </div>

      {/* Mind Map Canvas */}
      <div className="flex-1 relative overflow-hidden bg-gray-50 dark:bg-gray-900">
        <svg className="w-full h-full absolute inset-0">
          {/* Draw connections */}
          {nodes.map(node => 
            node.children.map(childId => {
              const child = nodes.find(n => n.id === childId);
              if (!child) return null;
              return (
                <line
                  key={`${node.id}-${childId}`}
                  x1={node.x}
                  y1={node.y}
                  x2={child.x}
                  y2={child.y}
                  stroke="#6b7280"
                  strokeWidth="2"
                  className="dark:stroke-gray-400"
                />
              );
            })
          )}
        </svg>

        {/* Render nodes */}
        {nodes.map(node => (
          <div
            key={node.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 group ${
              node.id === 'root' ? 'z-10' : 'z-0'
            }`}
            style={{ left: node.x, top: node.y }}
            onClick={() => setSelectedNode(node.id)}
          >
            <div className={`
              px-4 py-2 rounded-lg shadow-lg border-2 cursor-pointer transition-all duration-200
              ${node.id === 'root' 
                ? 'bg-blue-500 text-white border-blue-600' 
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'
              }
              ${selectedNode === node.id ? 'ring-2 ring-blue-400' : ''}
              hover:shadow-xl hover:scale-105
            `}>
              {editingNode === node.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={saveEdit}
                  onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                  className="bg-transparent border-none focus:outline-none min-w-20 text-center"
                  autoFocus
                />
              ) : (
                <span className="text-sm font-medium">{node.text}</span>
              )}
              
              {/* Node controls */}
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addNode(node.id);
                  }}
                  className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(node.id);
                  }}
                  className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Edit3 className="h-3 w-3" />
                </button>
                {node.id !== 'root' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNode(node.id);
                    }}
                    className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How to use:</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Click a node to select it</li>
            <li>• Hover to see controls (add, edit, delete)</li>
            <li>• Add branches from any node</li>
            <li>• Edit text by clicking the edit button</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MindMap;
