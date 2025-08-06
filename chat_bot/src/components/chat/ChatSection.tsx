
'use client';
import React, { useState } from 'react';
import { Session } from '@/types/chat';
import { Plus } from 'lucide-react';


interface ChatSectionProps {
    activeSession : Session | undefined,
    onSendMessage : (message : string) => void,
    onFileUpload : (file : File) => void,
    onNewSession : () => void,
    isLoading : boolean
}

const ChatSection : React.FC<ChatSectionProps> = ({ 
  activeSession,
  onSendMessage,
  onFileUpload,
  onNewSession,
  isLoading = false 
}) => {
  const [currentMessage, setCurrentMessage] = useState('');

  const handleSendMessage = (e : any) => {
    e.preventDefault();
    if (currentMessage.trim() && !isLoading) {
      onSendMessage(currentMessage);
      setCurrentMessage('');
    }
  };

  const handleFileUpload = (e : any) => {
    const file = e.target.files[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {activeSession ? (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 bg-gray-50 flex flex-col gap-4">
            {activeSession.messages?.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-600 text-base text-center p-5">
                Aucun message. Commencez la conversation !
              </div>
            ) : (
              activeSession.messages?.map(message => (
                <div 
                  key={message.id}
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
                    message.sender === 'user' 
                      ? 'self-end bg-blue-600 text-white' 
                      : 'self-start bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                  <div className={`text-[11px] opacity-80 mt-1 text-right ${
                    message.sender === 'user' 
                      ? 'text-white/80' 
                      : 'text-black/50'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <form 
            onSubmit={handleSendMessage}
            className="p-4 bg-white border-t border-gray-200 flex gap-3 items-center"
          >
            <label 
              htmlFor="file-upload"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors duration-200"
              title="Téléverser un fichier"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 8L12 3L7 8" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3V15" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-3xl text-[15px] outline-none focus:border-blue-500 transition-colors duration-200"
            />
            
            <button
              type="submit"
              disabled={!currentMessage.trim() || isLoading}
              className={`w-12 h-12 rounded-full border-none flex items-center justify-center transition-colors duration-200 relative overflow-hidden ${
                currentMessage.trim() && !isLoading 
                  ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
                  : 'bg-gray-400 cursor-not-allowed'
              } text-white`}
              title="Envoyer le message"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </form>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-600 text-center p-8">
          <h3 className="text-xl mb-4 text-gray-800">
            Bienvenue sur ChatBot FR
          </h3>
          <p className="mb-6 max-w-lg">
            Créez une nouvelle session pour commencer à discuter avec l'assistant.
          </p>
          <button
            onClick={onNewSession}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-md cursor-pointer text-[15px] font-medium transition-colors duration-200"
          >
            <Plus size={16} />
            Créer une session
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatSection;