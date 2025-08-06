import type { Session, Message } from "@/types/chat";
import { SendMessageRequest } from '../types/chat';
import { SendMessageResponse } from '../types/chat';

const API_BASE_URL = 'http://localhost:8000';

export interface UploadResponse {
  message: string;
  filename: string;
  file_path: string;
  content_type: string;
  size: number;
  amount_of_chunks?: number;
  chroma_status?: any;
  summary?: string;
}

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload/`, {
    method: 'POST',
    body: formData,
    // Note: Ne pas définir manuellement le Content-Type, 
    // le navigateur le fera automatiquement avec la bonne boundary
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Erreur lors de l\'upload du fichier');
  }

  return response.json();
};



export const fetchSessions = async (): Promise<Session[]> => {
  const response = await fetch(`${API_BASE_URL}/chat/sessions/`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des sessions');
  }
  const data = await response.json();
  return data.sessions;
};

export const createSession = async (title: string): Promise<Session> => {
  const response = await fetch(`${API_BASE_URL}/chat/sessions_create/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
  
  if (!response.ok) {
    throw new Error('Erreur lors de la création de la session');
  }
  
  return response.json();
};
export const sendMessage = async (sendMessageRequest: SendMessageRequest): Promise<SendMessageResponse> => {
  const response = await fetch(`${API_BASE_URL}/chat/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sendMessageRequest),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de l\'envoi du message');
  }

  return response.json();
};
