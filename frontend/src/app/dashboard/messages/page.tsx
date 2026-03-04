'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserStorage, setUserStorage } from '@/lib/user-storage';
import { Send, Search, Plus, X, Smile, Image as ImageIcon, Video } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  read: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'emoji';
}

interface Conversation {
  id: string;
  userId: string;
  otherUserId: string;
  otherUserName: string;
  messages: Message[];
  unreadCount: number;
}

interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const mediaMenuRef = useRef<HTMLDivElement>(null);

  // Charger les conversations de l'utilisateur
  useEffect(() => {
    if (!user?.id) return;

    const savedConversations = getUserStorage<Conversation[]>('conversations', user.id);
    let conversationsToSet = savedConversations && Array.isArray(savedConversations) ? savedConversations : [];

    // Vérifier s'il y a une conversation active en attente
    const activeConversationData = localStorage.getItem('activeConversation');
    if (activeConversationData) {
      try {
        const { providerId, providerName } = JSON.parse(activeConversationData);
        
        // Vérifier si la conversation existe déjà
        const existingConv = conversationsToSet.find(c => c.otherUserId === providerId.toString());
        
        if (!existingConv) {
          // Créer une nouvelle conversation
          const newConversation: Conversation = {
            id: `conv_${Date.now()}`,
            userId: user.id,
            otherUserId: providerId.toString(),
            otherUserName: providerName,
            messages: [],
            unreadCount: 0,
          };
          conversationsToSet = [...conversationsToSet, newConversation];
          setUserStorage('conversations', conversationsToSet, user.id);
        }
        
        // Sélectionner la conversation
        const conversationToSelect = conversationsToSet.find(c => c.otherUserId === providerId.toString());
        if (conversationToSelect) {
          setSelectedConversation(conversationToSelect);
        }
        
        // Nettoyer le localStorage
        localStorage.removeItem('activeConversation');
      } catch (error) {
        console.error('Erreur lors de la création de la conversation:', error);
      }
    }

    setConversations(conversationsToSet);

    // Charger la liste de tous les utilisateurs
    const allUsersData = JSON.parse(localStorage.getItem('kyndex_users') || '[]') as User[];
    const other = allUsersData.filter(u => u.id?.toString() !== user.id);
    setAllUsers(other);
  }, [user?.id]);

  // Auto-scroll vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  // Fermer le menu média en cliquant dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mediaMenuRef.current && !mediaMenuRef.current.contains(e.target as Node)) {
        setShowMediaMenu(false);
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sauvegarder les conversations
  const saveConversations = (updated: Conversation[]) => {
    if (!user?.id) return;
    setConversations(updated);
    setUserStorage('conversations', updated, user.id);

    // Émettre un événement pour notifier le layout des changements
    window.dispatchEvent(new CustomEvent('unreadCountsUpdated'));
  };

  // Liste complète des emojis populaires
  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😌', '😔', '😑', '😐', '😶', '🥱', '🤐', '🤨', '🤔', '🤫', '🤓', '🥳', '😌', '😔', '😓', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤮', '🤧', '🤬', '🤡', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👍', '👎', '☝️', '👆', '👇', '☟', '✋', '🖐', '🫵', '👉', '👈', '👉', '👊', '✊', '👏', '🙌', '👐', '🫳', '🫴', '🤲', '🤝', '🤜', '🤛', '🦾', '🦿', '👂', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '👶', '👧', '🧒', '👦', '👨', '👩', '👴', '👵', '👱', '👨‍🦰', '👩‍🦰', '👨‍🦱', '👩‍🦱', '👨‍🦲', '👩‍🦲', '👨‍🦳', '👩‍🦳', '🏌️', '⛹️', '🏋️', '🚴', '🏃', '💃', '🕺', '🧘', '🏄', '🏊', '🤽', '🏇', '⛷️', '🎿', '🏂', '🪂', '🛷', '🛹', '🛼', '🛴', '🚣', '🏞️', '🌍', '🌎', '🌏', '🌐', '🗺️', '🗿', '🗽', '🗼', '⛩️', '🏰', '🏯', '🏟️', '💒', '🎪', '🚀', '🛸', '🛰️', '🛳️', '⛴️', '🛥️', '🛶', '⚓', '⛵', '🚤', '🚢', '🚧', '⛽', '🚨', '🚥', '🚦', '🛑', '🚏', '🗾', '🎡', '🎢', '🎠', '⛲', '⛺', '🏕️', '⛰️', '🏔️', '🌋', '⛰️', '🏞️', '🛣️', '🛤️', '🗾', '🎯', '🎪', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🎻', '🎲', '♟️', '🎮', '🎰', '🧩', '♠️', '♥️', '♦️', '♣️', '🌟', '⭐', '✨', '⚡', '☄️', '💥', '🔥', '🌪️', '🌈', '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '💧', '💦', '☔', '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥑', '🍆', '🍅', '🌶️', '🌽', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🌰', '🍞', '🥐', '🥖', '🥨', '🥯', '🥞', '🧇', '🥚', '🍳', '🧈', '🥞', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🍰', '🎂', '🧁', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🥛', '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧋', '🧃', '🧉', '🧊', '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎳', '🏓', '🏸', '🏒', '🏑', '🥍', '🥅', '⛳', '⛸️', '🎣', '🎽', '🎿', '🛷', '🛼', '🛹', '🛴', '⛹️', '🏋️', '🚴', '🚲', '🏊', '🏄', '🏇', '🧗', '🚣', '🚣', '🏌️', '⛷️', '🏂', '🪂', '🧗', '🏋️', '🏌️', '⛹️', '🤺', '🤼', '🤸', '⛹️', '🤺', '🤼', '🧖', '🧗', '🚴', '🚵', '🏃', '💃', '🕺', '🕴️', '🤽', '🏌️', '⛹️', '🏄', '🚣', '🏊', '⛷️', '🏂', '🪂'];


  // Ajouter un emoji
  const handleAddEmoji = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Gérer les photos
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedConversation && user?.id) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const mediaUrl = reader.result as string;
        sendMediaMessage('image', mediaUrl);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowMediaMenu(false);
  };

  // Gérer les vidéos
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedConversation && user?.id) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const mediaUrl = reader.result as string;
        sendMediaMessage('video', mediaUrl);
      };
      reader.readAsDataURL(file);
    }
    if (videoInputRef.current) videoInputRef.current.value = '';
    setShowMediaMenu(false);
  };

  // Envoyer un message avec média
  const sendMediaMessage = (mediaType: 'image' | 'video', mediaUrl: string) => {
    if (!selectedConversation || !user?.id) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      senderName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Vous',
      content: `${mediaType === 'image' ? '📸 Photo' : '🎥 Vidéo'}`,
      timestamp: Date.now(),
      read: false,
      mediaUrl,
      mediaType,
    };

    // Mettre à jour la conversation
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMessage],
    };

    const updatedConversations = conversations.map(conv =>
      conv.id === selectedConversation.id ? updatedConversation : conv
    );

    saveConversations(updatedConversations);
    setSelectedConversation(updatedConversation);

    // Sauvegarder aussi pour l'autre utilisateur
    const otherUserConversations = getUserStorage<Conversation[]>('conversations', updatedConversation.otherUserId) || [];
    const otherConvIndex = otherUserConversations.findIndex(c => c.otherUserId === user.id);
    
    if (otherConvIndex >= 0) {
      otherUserConversations[otherConvIndex] = {
        ...otherUserConversations[otherConvIndex],
        messages: [...otherUserConversations[otherConvIndex].messages, newMessage],
        unreadCount: (otherUserConversations[otherConvIndex].unreadCount || 0) + 1,
      };
    } else {
      const newConvForOther: Conversation = {
        id: `conv_${selectedConversation.otherUserId}_${user.id}`,
        userId: selectedConversation.otherUserId,
        otherUserId: user.id,
        otherUserName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        messages: [newMessage],
        unreadCount: 1,
      };
      otherUserConversations.push(newConvForOther);
    }

    setUserStorage('conversations', otherUserConversations, updatedConversation.otherUserId);
  };

  // Envoyer un message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation || !user?.id) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      senderName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Vous',
      content: messageInput,
      timestamp: Date.now(),
      read: false,
    };

    // Mettre à jour la conversation
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMessage],
    };

    const updatedConversations = conversations.map(conv =>
      conv.id === selectedConversation.id ? updatedConversation : conv
    );

    saveConversations(updatedConversations);
    setSelectedConversation(updatedConversation);
    setMessageInput('');

    // Sauvegarder aussi pour l'autre utilisateur
    const otherUserConversations = getUserStorage<Conversation[]>('conversations', updatedConversation.otherUserId) || [];
    const otherConvIndex = otherUserConversations.findIndex(c => c.otherUserId === user.id);
    
    if (otherConvIndex >= 0) {
      otherUserConversations[otherConvIndex] = {
        ...otherUserConversations[otherConvIndex],
        messages: [...otherUserConversations[otherConvIndex].messages, newMessage],
        unreadCount: (otherUserConversations[otherConvIndex].unreadCount || 0) + 1,
      };
    } else {
      const newConvForOther: Conversation = {
        id: `conv_${selectedConversation.otherUserId}_${user.id}`,
        userId: selectedConversation.otherUserId,
        otherUserId: user.id,
        otherUserName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        messages: [newMessage],
        unreadCount: 1,
      };
      otherUserConversations.push(newConvForOther);
    }

    setUserStorage('conversations', otherUserConversations, updatedConversation.otherUserId);
  };

  // Démarrer une nouvelle conversation
  const handleStartConversation = (otherUser: User) => {
    if (!user?.id) return;

    const existing = conversations.find(c => c.otherUserId === otherUser.id?.toString());
    if (existing) {
      setSelectedConversation(existing);
      setShowNewChat(false);
      return;
    }

    const newConv: Conversation = {
      id: `conv_${user.id}_${otherUser.id}`,
      userId: user.id,
      otherUserId: otherUser.id?.toString() || '',
      otherUserName: `${otherUser.firstname} ${otherUser.lastname}`,
      messages: [],
      unreadCount: 0,
    };

    const updated = [...conversations, newConv];
    saveConversations(updated);
    setSelectedConversation(newConv);
    setShowNewChat(false);
  };

  // Marquer une conversation comme lue
  const handleSelectConversation = (conversation: Conversation) => {
    // Réinitialiser le compteur de messages non lus
    const updatedConversations = conversations.map(conv =>
      conv.id === conversation.id 
        ? { ...conv, unreadCount: 0 }
        : conv
    );

    // Sauvegarder les changements
    saveConversations(updatedConversations);

    // Sélectionner la conversation avec le compteur réinitialisé
    const updatedConversation = {
      ...conversation,
      unreadCount: 0,
    };
    setSelectedConversation(updatedConversation);
  };

  // Filtrer les utilisateurs
  const filteredUsers = allUsers.filter(u =>
    `${u.firstname} ${u.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtrer les conversations
  const filteredConversations = conversations.filter(c =>
    c.otherUserName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Veuillez vous connecter</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-gray-400 text-sm mb-1">Messagerie</p>
        <h1 className="text-4xl font-bold text-white">Messages</h1>
        <p className="text-gray-400 mt-2">Communiquez avec vos clients et prestataires</p>
      </div>

      {/* Main Chat Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Left: Conversations List */}
        <div className="lg:col-span-1 bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900 border border-cyan-500/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-cyan-500/10 space-y-4 bg-gradient-to-r from-cyan-500/5 to-transparent">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Conversations</h2>
              <button
                onClick={() => setShowNewChat(!showNewChat)}
                className="p-2 hover:bg-cyan-500/20 rounded-xl transition duration-300 border border-cyan-500/20 hover:border-cyan-500/40"
              >
                {showNewChat ? <X size={20} className="text-red-400" /> : <Plus size={20} className="text-cyan-400" />}
              </button>
            </div>

            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/50" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-cyan-500/20 rounded-xl text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:bg-gray-800 transition duration-300"
              />
            </div>
          </div>

          {/* New Chat Selection */}
          {showNewChat && (
            <div className="border-b border-cyan-500/10 max-h-64 overflow-y-auto bg-gray-800/30">
              <div className="p-4 space-y-2">
                <p className="text-xs text-cyan-400/70 px-2 font-semibold">Sélectionner un utilisateur</p>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(u => (
                    <button
                      key={u.id}
                      onClick={() => handleStartConversation(u)}
                      className="w-full text-left px-4 py-3 hover:bg-cyan-500/10 rounded-xl transition duration-200 border border-transparent hover:border-cyan-500/30 group"
                    >
                      <p className="font-semibold text-white text-sm group-hover:text-cyan-300">{u.firstname} {u.lastname}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 text-center py-4">Aucun utilisateur trouvé</p>
                )}
              </div>
            </div>
          )}

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full text-left px-4 py-4 rounded-xl transition duration-300 border ${
                    selectedConversation?.id === conv.id
                      ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/20 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                      : 'hover:bg-gray-800/50 border-transparent hover:border-cyan-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{conv.otherUserName}</p>
                      <p className="text-xs text-gray-400 truncate mt-1">
                        {conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].content : 'Pas de messages'}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="flex-shrink-0 ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6">
                <p className="text-sm">Aucune conversation</p>
                <p className="text-xs mt-2">Cliquez sur + pour en démarrer une</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Chat Window */}
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900 border border-cyan-500/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-cyan-500/10 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 backdrop-blur">
                <h3 className="text-xl font-bold text-white">{selectedConversation.otherUserName}</h3>
                <p className="text-xs text-cyan-400 mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                  En ligne
                </p>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-black/20 to-transparent">
                {selectedConversation.messages.length > 0 ? (
                  selectedConversation.messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                      <div
                        className={`max-w-xs rounded-3xl backdrop-blur ${
                          msg.senderId === user.id
                            ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-br-none shadow-lg shadow-cyan-500/30'
                            : 'bg-gray-800/70 border border-gray-700/50 text-gray-100 rounded-bl-none shadow-lg shadow-black/30'
                        } px-5 py-3 transition duration-200`}
                      >
                        {msg.mediaUrl && msg.mediaType === 'image' && (
                          <img 
                            src={msg.mediaUrl} 
                            alt="Photo" 
                            onClick={() => setLightboxMedia({ url: msg.mediaUrl!, type: 'image' })}
                            className="w-full max-w-xs rounded-2xl mb-2 cursor-pointer hover:opacity-80 transition shadow-md" 
                          />
                        )}
                        {msg.mediaUrl && msg.mediaType === 'video' && (
                          <div 
                            onClick={() => setLightboxMedia({ url: msg.mediaUrl!, type: 'video' })}
                            className="w-full max-w-xs rounded-2xl mb-2 cursor-pointer hover:opacity-80 transition overflow-hidden shadow-md"
                          >
                            <video src={msg.mediaUrl} className="w-full" />
                          </div>
                        )}
                        <p className="text-sm break-words">{msg.content}</p>
                        <p className={`text-xs mt-2 opacity-70`}>
                          {new Date(msg.timestamp).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <p className="text-lg font-semibold">Aucun message</p>
                      <p className="text-sm mt-2">Lancez la conversation! 💬</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-cyan-500/10 bg-gradient-to-r from-gray-900 to-gray-850">
                <div className="flex gap-3 items-center">
                  {/* Menu Media */}
                  <div className="relative" ref={mediaMenuRef}>
                    <button
                      onClick={() => {
                        setShowMediaMenu(!showMediaMenu);
                        setShowEmojiPicker(false);
                      }}
                      className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/40 hover:to-blue-500/40 border border-cyan-500/30 text-cyan-400 rounded-xl transition duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-cyan-500/20"
                    >
                      <Plus size={20} />
                    </button>

                    {/* Menu déroulant */}
                    {showMediaMenu && (
                      <div className="absolute bottom-full left-0 mb-3 bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/20 rounded-xl shadow-xl z-50 w-48 overflow-hidden backdrop-blur">
                        {/* Emoji Picker */}
                        <button
                          onClick={() => {
                            setShowEmojiPicker(!showEmojiPicker);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-cyan-500/10 transition border-b border-cyan-500/10 text-left group"
                        >
                          <Smile size={18} className="text-yellow-400 group-hover:scale-110 transition" />
                          <span className="text-sm text-white group-hover:text-cyan-300">Ajouter emoji</span>
                        </button>

                        {/* Photo Upload */}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-cyan-500/10 transition border-b border-cyan-500/10 text-left group"
                        >
                          <ImageIcon size={18} className="text-green-400 group-hover:scale-110 transition" />
                          <span className="text-sm text-white group-hover:text-cyan-300">Ajouter photo</span>
                        </button>

                        {/* Video Upload */}
                        <button
                          onClick={() => videoInputRef.current?.click()}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-cyan-500/10 transition text-left group"
                        >
                          <Video size={18} className="text-blue-400 group-hover:scale-110 transition" />
                          <span className="text-sm text-white group-hover:text-cyan-300">Ajouter vidéo</span>
                        </button>
                      </div>
                    )}

                    {/* Emoji Picker Grid */}
                    {showEmojiPicker && (
                      <div className="absolute bottom-full left-0 mb-2 bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/20 rounded-xl shadow-xl z-50 backdrop-blur">
                        <div className="p-3 overflow-y-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(8, minmax(44px, 1fr))', gap: '0.25rem', maxHeight: '300px', scrollbarWidth: 'thin' }}>
                          {emojis.map((emoji, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleAddEmoji(emoji)}
                              className="text-3xl hover:scale-125 transition p-2 hover:bg-cyan-500/20 rounded-lg flex items-center justify-center"
                              title={emoji}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input Message */}
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Écrivez votre message..."
                    className="flex-1 bg-gray-800/50 border border-cyan-500/20 rounded-xl px-5 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:bg-gray-800 transition duration-300 focus:ring-2 focus:ring-cyan-500/20"
                  />

                  {/* Send Button */}
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-cyan-500/30"
                  >
                    <Send size={20} />
                  </button>

                  {/* File Inputs (Hidden) */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    className="hidden"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <p className="text-lg font-semibold">Sélectionnez une conversation</p>
                <p className="text-sm mt-2">ou créez-en une nouvelle</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox pour images et vidéos */}
      {lightboxMedia && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center backdrop-blur"
          onClick={() => setLightboxMedia(null)}
        >
          <div 
            className="relative max-w-4xl max-h-screen flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxMedia(null)}
              className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg transition z-10"
            >
              <X size={24} />
            </button>

            {/* Content */}
            {lightboxMedia.type === 'image' && (
              <img
                src={lightboxMedia.url}
                alt="Full view"
                className="max-w-full max-h-screen object-contain rounded-lg"
              />
            )}
            {lightboxMedia.type === 'video' && (
              <video
                src={lightboxMedia.url}
                autoPlay
                controls
                className="max-w-full max-h-screen object-contain rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
