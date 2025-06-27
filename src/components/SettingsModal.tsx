
import React, { useState } from 'react';
import { X, Key, User, Palette, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { user, apiKey, setApiKey } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSaveApiKey = () => {
    setApiKey(tempApiKey);
    alert('API key saved successfully!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Account</h3>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Username</p>
              <p className="text-gray-900 dark:text-white font-medium">{user?.username}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Email</p>
              <p className="text-gray-900 dark:text-white font-medium">{user?.email}</p>
            </div>
          </div>

          {/* Theme */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Appearance</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDark ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* API Key */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Key className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">OpenAI API Key</h3>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="Enter your OpenAI API key..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveApiKey}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save API Key
                </button>
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Get API Key
                </a>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                    <p className="font-medium mb-1">How to get your API key:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Go to OpenAI's website</li>
                      <li>Sign up or log in to your account</li>
                      <li>Navigate to API Keys section</li>
                      <li>Create a new API key</li>
                      <li>Copy and paste it here</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
