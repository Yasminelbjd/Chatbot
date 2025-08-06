'use client';

import { useState } from 'react';
import { Plus, MessageCircle } from 'lucide-react';
import { Session } from '@/types/chat';

interface CustomFile extends File {
  id: string;
}

interface FilesSectionProps {
  sessions: Session[];
  activeSessionId: string | null;
  uploadedFiles: CustomFile[];
  onNewSession: () => void;
  onSessionSelect: (sessionId: string) => void;
  onFileUpload: (file: File) => void;
  onDeleteFile: (fileId: string) => void;
}

const FilesSection : React.FC<FilesSectionProps> = ({ 
  sessions = [], 
  activeSessionId = null, 
  uploadedFiles = [],
  onNewSession = () => {},
  onSessionSelect = () => {},
  onFileUpload = () => {},
  onDeleteFile = () => {}
}) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [isHovered, setIsHovered] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="w-80 bg-gray-50 p-4 border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Onglets */}
      <div className="flex mb-4 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 p-2 border-none rounded transition-all duration-200 ${
            activeTab === 'chat' 
              ? 'bg-blue-50 font-bold text-blue-600' 
              : 'bg-transparent font-normal text-gray-700 hover:bg-gray-100'
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab('files')}
          className={`flex-1 p-2 border-none rounded transition-all duration-200 ${
            activeTab === 'files' 
              ? 'bg-blue-50 font-bold text-blue-600' 
              : 'bg-transparent font-normal text-gray-700 hover:bg-gray-100'
          }`}
        >
          Fichiers
        </button>
      </div>

      <h2 className="text-xl mb-4 font-semibold text-gray-800">ChatBot FR</h2>
      
      <button
        onClick={onNewSession}
        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-md cursor-pointer mb-4 text-sm font-medium transition-colors duration-200"
      >
        <Plus size={16} />
        Nouvelle Session
      </button>

      {/* Contenu de l'onglet actif */}
      <div className="overflow-y-auto flex-1 p-2">
        {activeTab === 'chat' ? (
          // Onglet Chat
          sessions.length > 0 ? (
            sessions.map(session => (
              <div
                key={session.id}
                onClick={() => onSessionSelect(session.id)}
                className={`p-3 rounded-md mb-2 cursor-pointer transition-colors duration-200 ${
                  activeSessionId === session.id ? 'bg-blue-50' : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageCircle size={16} className="text-gray-600" />
                  <div>
                    <div className="font-medium text-sm text-gray-800">{session.title}</div>
                    <div className="text-xs text-gray-600">
                      {new Date(session.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600 text-sm">
              Aucune session de chat
            </div>
          )
        ) : (
          // Onglet Fichiers
          <div>
            <div className="p-3 bg-blue-50 rounded-md mb-4 flex flex-col gap-2">
              <div className="font-bold text-sm text-gray-800">Téléverser un fichier</div>
              <label 
                htmlFor="file-upload-sidebar"
                className={`flex items-center justify-center gap-2 px-3 py-2 text-white rounded cursor-pointer text-sm transition-colors duration-200 ${
                  isHovered ? 'bg-blue-700' : 'bg-blue-600'
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sélectionner un fichier
                <input
                  id="file-upload-sidebar"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            <div className="mb-4">
              <div className="font-medium mb-2 text-sm text-gray-800">
                Fichiers téléversés ({uploadedFiles.length})
              </div>
              {uploadedFiles.length === 0 ? (
                <div className="p-4 text-center text-gray-600 text-sm bg-gray-50 rounded-md border border-dashed border-gray-300">
                  Aucun fichier téléversé
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {uploadedFiles.map(file => (
                    <div key={file.name} className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200 text-xs">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 2V8H20" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                          {file.name}
                        </div>
                      </div>
                      <div className="text-gray-600 whitespace-nowrap ml-2">
                        {formatFileSize(file.size)}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteFile(file.id);
                        }}
                        className="ml-2 bg-transparent border-none text-red-500 hover:text-red-700 cursor-pointer p-1 flex items-center justify-center transition-colors duration-200"
                        title="Supprimer le fichier"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesSection;