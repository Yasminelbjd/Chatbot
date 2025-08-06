export type Message = {
    id: number;
    content: string;
    sender: 'user' | 'assistant';
    timestamp: string;
};
  
export type Session = {
    id: string;
    title: string;
    createdAt: string;
    messages: Message[];
};
export interface SendMessageRequest {
    session_id: string;
    message: string;
}

export interface SendMessageResponse {
    reply : string
}