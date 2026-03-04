'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import AppLayout from '@/app/app-layout';
import { createApiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
import { ChevronLeft } from 'lucide-react';

interface User {
  id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    avatarUrl: string;
  };
}

interface MessageData {
  id: string;
  content: string;
  senderId: string;
  sender: User;
  createdAt: string;
}

interface ConversationData {
  id: string;
  title?: string;
  participants: Array<{ user: User }>;
  messages: MessageData[];
  lastMessage?: MessageData;
  updatedAt: string;
}

export function MessagesContent() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('conversationId');
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationData | null>(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const apiClient = useMemo(() => createApiClient(), []);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const conv = conversations.find((c) => c.id === conversationId);
      if (conv) {
        setSelectedConversation(conv);
      }
    }
  }, [conversationId, conversations]);

  useEffect(() => {
    if (conversationId && !selectedConversation) {
      loadConversationById(conversationId);
    }
  }, [conversationId]);

  const loadConversationById = async (convId: string) => {
    try {
      const response = await apiClient.get(`/messages/conversations/${convId}`);
      setSelectedConversation(response.data);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const calculateUnreadCounts = (convs: ConversationData[]) => {
    const counts: Record<string, number> = {};
    convs.forEach((conv) => {
      counts[conv.id] = conv.messages?.filter((msg) => msg.senderId !== user?.id).length || 0;
    });
    setUnreadCounts(counts);
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/messages/conversations');
      setConversations(response.data);
      calculateUnreadCounts(response.data);
      
      if (!selectedConversation && response.data.length > 0) {
        setSelectedConversation(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    const messageToSend = messageText;
    setMessageText('');

    try {
      setSending(true);
      const response = await apiClient.post(
        `/messages/conversations/${selectedConversation.id}/messages`,
        { content: messageToSend },
      );

      console.log('Send message response:', response.data);

      setSelectedConversation({
        ...selectedConversation,
        messages: [...(selectedConversation.messages || []), response.data],
      });

      setConversations((prevs) =>
        prevs.map((conv) =>
          conv.id === selectedConversation.id
            ? {
                ...conv,
                messages: [...(conv.messages || []), response.data],
                lastMessage: response.data,
              }
            : conv,
        ),
      );
    } catch (error: any) {
      console.error('Error sending message:', error.response?.data || error.message);
      setMessageText(messageToSend);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getOtherParticipant = (conv: ConversationData) => {
    return conv.participants[0]?.user;
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-40">
          <div className="px-4 py-2 sm:py-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Messages</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin mb-4">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
                <p className="text-gray-600">Chargement des conversations...</p>
              </div>
            </div>
          ) : (
            <div className="h-full">
              {/* Mobile View - Single Panel */}
              <div className={`lg:hidden h-full ${selectedConversation ? 'hidden' : 'block'}`}>
                <div className="bg-white rounded-lg border border-gray-200 overflow-y-auto h-full">
                  {conversations.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center">
                      <div>
                        <div className="text-4xl mb-2">💬</div>
                        <p className="text-gray-600">Aucune conversation</p>
                        <p className="text-gray-500 text-sm mt-2">
                          Commencez une conversation en cliquant sur "Message"
                        </p>
                      </div>
                    </div>
                  ) : (
                    conversations.map((conv) => {
                      const otherUser = getOtherParticipant(conv);
                      return (
                        <button
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv)}
                          className="w-full text-left px-4 py-4 border-b border-gray-100 hover:bg-blue-50 transition"
                        >
                          <div className="flex gap-3">
                            {otherUser?.profile?.avatarUrl ? (
                              <img
                                src={`http://localhost:3001${otherUser.profile.avatarUrl}`}
                                alt={otherUser.profile.firstName}
                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl flex-shrink-0">
                                👤
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-base truncate">
                                {otherUser?.profile?.firstName} {otherUser?.profile?.lastName}
                              </h3>
                              <p className="text-sm text-gray-600 truncate">
                                {conv.lastMessage?.content || 'Aucun message'}
                              </p>
                            </div>
                            {unreadCounts[conv.id] > 0 && (
                              <div className="flex items-center">
                                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                  {unreadCounts[conv.id]}
                                </span>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Mobile View - Chat Panel */}
              {selectedConversation && (
                <div className="lg:hidden h-full bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
                  {/* Header with Back Button */}
                  <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition -ml-2"
                      title="Retour aux conversations"
                    >
                      <ChevronLeft size={24} className="text-gray-700" />
                    </button>
                    <div className="flex items-center gap-3 flex-1 min-w-0 ml-2">
                      {(() => {
                        const otherUser = getOtherParticipant(selectedConversation);
                        return (
                          <>
                            {otherUser?.profile?.avatarUrl ? (
                              <img
                                src={`http://localhost:3001${otherUser.profile.avatarUrl}`}
                                alt={otherUser.profile.firstName}
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg flex-shrink-0">
                                👤
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <h2 className="font-semibold text-gray-900 text-base truncate">
                                {otherUser?.profile?.firstName} {otherUser?.profile?.lastName}
                              </h2>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                    {selectedConversation && selectedConversation.messages && selectedConversation.messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-center">
                        <div>
                          <div className="text-4xl mb-2">👋</div>
                          <p className="text-gray-600">Commencez une conversation!</p>
                        </div>
                      </div>
                    ) : selectedConversation && selectedConversation.messages ? (
                      selectedConversation.messages.map((msg) => {
                        const isMyMessage = msg.senderId === user?.id;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                                isMyMessage
                                  ? 'bg-blue-600 text-white rounded-br-none'
                                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
                              }`}
                            >
                              <p>{msg.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isMyMessage ? 'text-blue-100' : 'text-gray-600'
                                }`}
                              >
                                {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : null}
                  </div>

                  {/* Input */}
                  <div className="px-4 py-4 border-t border-gray-200 flex gap-2 bg-white flex-shrink-0">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => {
                          handleKeyPress(e)
                      }}
                      placeholder="Message..."
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() || sending}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition text-sm flex-shrink-0"
                    >
                      {sending ? '⏳' : '📤'}
                    </button>
                  </div>
                </div>
              )}

              {/* Desktop View - Grid Layout */}
              <div className="hidden lg:grid grid-cols-3 gap-4 h-full p-4">
                {/* Conversations List */}
                <div className="col-span-1 bg-white rounded-lg border border-gray-200 overflow-y-auto">
                  {conversations.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center">
                      <div>
                        <div className="text-4xl mb-2">💬</div>
                        <p className="text-gray-600">Aucune conversation</p>
                        <p className="text-gray-500 text-sm mt-2">
                          Commencez une conversation en cliquant sur "Message"
                        </p>
                      </div>
                    </div>
                  ) : (
                    conversations.map((conv) => {
                      const otherUser = getOtherParticipant(conv);
                      const isSelected = selectedConversation?.id === conv.id;

                      return (
                        <button
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv)}
                          className={`w-full text-left px-4 py-4 border-b border-gray-100 hover:bg-blue-50 transition relative ${
                            isSelected ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                          }`}
                        >
                          <div className="flex gap-3">
                            {otherUser?.profile?.avatarUrl ? (
                              <img
                                src={`http://localhost:3001${otherUser.profile.avatarUrl}`}
                                alt={otherUser.profile.firstName}
                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl flex-shrink-0">
                                👤
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-base truncate">
                                {otherUser?.profile?.firstName} {otherUser?.profile?.lastName}
                              </h3>
                              <p className="text-sm text-gray-600 truncate">
                                {conv.lastMessage?.content || 'Aucun message'}
                              </p>
                            </div>

                            {unreadCounts[conv.id] > 0 && (
                              <div className="flex items-center">
                                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                  {unreadCounts[conv.id]}
                                </span>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Chat Area */}
                {selectedConversation ? (
                  <div className="col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col h-full">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {(() => {
                          const otherUser = getOtherParticipant(selectedConversation);
                          return (
                            <>
                              {otherUser?.profile?.avatarUrl ? (
                                <img
                                  src={`http://localhost:3001${otherUser.profile.avatarUrl}`}
                                  alt={otherUser.profile.firstName}
                                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg flex-shrink-0">
                                  👤
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <h2 className="font-semibold text-gray-900 text-base truncate">
                                  {otherUser?.profile?.firstName} {otherUser?.profile?.lastName}
                                </h2>
                                <p className="text-sm text-gray-600 truncate">{otherUser?.email}</p>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                      {selectedConversation && selectedConversation.messages && selectedConversation.messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-center">
                          <div>
                            <div className="text-4xl mb-2">👋</div>
                            <p className="text-gray-600">Commencez une conversation!</p>
                          </div>
                        </div>
                      ) : selectedConversation && selectedConversation.messages ? (
                        selectedConversation.messages.map((msg) => {
                          const isMyMessage = msg.senderId === user?.id;
                          return (
                            <div
                              key={msg.id}
                              className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-sm px-4 py-2 rounded-lg text-sm ${
                                  isMyMessage
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                                }`}
                              >
                                <p>{msg.content}</p>
                                <p
                                  className={`text-xs mt-1 ${
                                    isMyMessage ? 'text-blue-100' : 'text-gray-600'
                                  }`}
                                >
                                  {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : null}
                    </div>

                    {/* Input */}
                    <div className="px-6 py-4 border-t border-gray-200 flex gap-2 bg-white flex-shrink-0">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => {
                            handleKeyPress(e)
                        }}
                        placeholder="Message..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim() || sending}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition text-sm flex-shrink-0"
                      >
                        {sending ? '⏳' : '📤'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="col-span-2 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl mb-4">💬</div>
                      <p className="text-gray-600 text-lg">
                        Sélectionnez une conversation
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
