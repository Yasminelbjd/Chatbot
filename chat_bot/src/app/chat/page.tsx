
'use client';
import { useEffect, useState } from 'react';
import ChatSection from "@/components/chat/ChatSection";
import FilesSection from "@/components/files/FilesSection";
import type { Session, Message, SendMessageRequest } from "@/types/chat";
import { fetchSessions, createSession, sendMessage, uploadFile, UploadResponse } from '@/lib/api';
import { toast } from 'react-hot-toast';

const ChatPage = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleSessionSelect (sessionId : string) {
        console.log("sessionId",sessionId)
        setActiveSessionId(sessionId)
    }

    const onSend = async (message: string) => {
        if (!activeSessionId) return;
        // Créer un nouveau message utilisateur
        const newUserMessage = {
            id: Date.now().toString(),
            content: message,
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        // Mettre à jour la session active avec le nouveau message
        setSessions(prevSessions => 
            prevSessions.map(session => 
                session.id === activeSessionId
                    ? {
                        ...session,
                        messages: [
                            ...(session as any).messages || [],
                            newUserMessage
                        ]
                    }
                    : session
            )
        );

        const sendMessageRequest : SendMessageRequest = {
            session_id: activeSessionId,
            message: message
        }

        const response = await sendMessage(sendMessageRequest)

        const newBotMessage = {
            id: Date.now().toString(),
            content: response.reply,
            sender: 'bot',
            timestamp: new Date().toISOString()
        };

        // Mettre à jour la session active avec le nouveau message
        setSessions(prevSessions => 
            prevSessions.map(session => 
                session.id === activeSessionId
                    ? {
                        ...session,
                        messages: [
                            ...(session as any).messages || [],
                            newBotMessage
                        ]
                    }
                    : session
            )
        );

        console.log(response.reply)


    };

    const onFileUpload = (file: File) => {
        // Implémentation de la fonction d'upload de fichier
        console.log('Fichier à uploader:', file);
        // TODO: Implémenter l'upload du fichier
    };

    const onNewSession = async () => {
        try {
            const newSession = await createSession("");
            setSessions(prev => [...prev, newSession]);
            setActiveSessionId(newSession.id);
        } catch (err) {
            setError('Erreur lors de la création d\'une nouvelle session');
            console.error(err);
        }
    };

    // Charger les sessions au montage du composant
    useEffect(() => {
        const loadSessions = async () => {
            try {
                setIsLoading(true);
                const sessionsData = await fetchSessions();
                
                setSessions(sessionsData);
                // Sélectionner la première session si disponible
                if (sessionsData.length > 0 && !activeSessionId) {
                    setActiveSessionId(sessionsData[0].id);
                }
            } catch (err) {
                setError('Erreur lors du chargement des sessions');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadSessions();
    }, []);

    const handleSendMessage = async (message: string) => {
        // Implémentez la logique d'envoi de message ici
        console.log('Message à envoyer:', message);
    };

    const handleFileUpload = async (file: File) => {
        // Implémentez la logique d'upload de fichier ici
        console.log('Fichier à uploader:', file.name);
    };

    const handleNewSession = async () => {
        try {
            setIsLoading(true);
            const title = `Session ${sessions.length + 1}`;
            const newSession = await createSession(title);
            
            setSessions(prevSessions => [newSession, ...prevSessions]);
            setActiveSessionId(newSession.id);
        } catch (err) {
            setError('Erreur lors de la création de la session');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };


    if (isLoading) {
        return <div>Chargement des sessions...</div>;
    }

    if (error) {
        return <div>Erreur: {error}</div>;
    }
    return (
        <div className="flex h-screen font-sans">
            <ChatSection 
                activeSession={sessions.find(session => session.id === activeSessionId)} 
                onSendMessage={onSend} 
                onFileUpload={handleFileUpload} 
                onNewSession={onNewSession} 
                isLoading={isLoading} 
            />
            <FilesSection 
                sessions={sessions} 
                activeSessionId={activeSessionId} 
                uploadedFiles={[]} 
                onNewSession={onNewSession} 
                onSessionSelect={handleSessionSelect} 
                onFileUpload={onFileUpload} 
                onDeleteFile={() => {}}
            />
        </div>
    );
};

export default ChatPage;
