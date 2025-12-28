
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ViewState, DashboardTab, Message, ChatSession } from './types';
import { Onboarding } from './components/Onboarding';
import { MOCK_USERS, INITIAL_PUBLIC_MESSAGES } from './constants';
import { Button, Card, Input, FadeIn } from './components/UiComponents';
import { generateIcebreaker } from './services/geminiService';
import { 
  Heart, 
  MessageCircle, 
  Users, 
  ArrowLeft, 
  RefreshCw, 
  Send, 
  UserPlus,
  MoreVertical,
  Bell,
  User,
  Search,
  Sparkles,
  MapPin,
  Check,
  X,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentTab, setCurrentTab] = useState<DashboardTab>('public');
  
  // Check for existing session on load
  useEffect(() => {
    const savedUser = localStorage.getItem('malda_mingle_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setView('dashboard');
      } catch (e) {
        console.error("Failed to restore session", e);
      }
    }
  }, []);

  // Friend System State
  const [friends, setFriends] = useState<string[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<string[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  // Simulate incoming requests for demo
  useEffect(() => {
    if (currentUser) {
      const potentialRequesters = MOCK_USERS.filter(u => 
        u.id !== currentUser.id && 
        !friends.includes(u.id) && 
        !incomingRequests.includes(u.id)
      );
      
      if (potentialRequesters.length > 0 && incomingRequests.length === 0) {
        const timer = setTimeout(() => {
          setIncomingRequests(prev => [...prev, potentialRequesters[0].id]);
        }, 8000);
        return () => clearTimeout(timer);
      }
    }
  }, [currentUser]);

  const handleProfileComplete = (profile: UserProfile) => {
    setCurrentUser(profile);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('malda_mingle_user');
    setCurrentUser(null);
    setView('landing');
    setCurrentTab('public');
    setFriends([]);
    setIncomingRequests([]);
    setSentRequests([]);
  };

  const handleSendRequest = (targetId: string) => {
    setSentRequests(prev => [...prev, targetId]);
  };

  const handleAcceptRequest = (requesterId: string) => {
    setFriends(prev => [...prev, requesterId]);
    setIncomingRequests(prev => prev.filter(id => id !== requesterId));
  };

  const handleDeclineRequest = (requesterId: string) => {
    setIncomingRequests(prev => prev.filter(id => id !== requesterId));
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-brand flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-soft"></div>
           <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl animate-pulse-soft" style={{animationDelay: '1s'}}></div>
        </div>

        <FadeIn className="relative z-10 flex flex-col items-center w-full max-w-md">
          <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl shadow-black/10 mb-8 animate-float border border-white/30">
            <Heart size={56} className="text-white fill-white drop-shadow-lg" />
          </div>
          
          <h1 className="text-6xl font-display font-black text-white mb-4 tracking-tight drop-shadow-sm">
            Malda<br/><span className="text-yellow-200">Mingle</span>
          </h1>
          
          <p className="text-xl text-white/90 max-w-xs mb-12 font-medium leading-relaxed">
            Directly connect with people in Malda. No login required to start.
          </p>
          
          <div className="w-full px-4">
            <button 
              onClick={() => setView('onboarding')}
              className="w-full bg-white text-rose-600 px-6 py-5 rounded-2xl font-bold text-2xl shadow-2xl shadow-rose-900/30 hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-3"
            >
              Enter Malda Mingle
              <ArrowRight className="transition-transform group-hover:translate-x-1" size={28}/>
            </button>
          </div>
          
          <p className="mt-12 text-white/60 text-xs font-bold tracking-widest uppercase">
            Quick Entry • Private • Local
          </p>
        </FadeIn>
      </div>
    );
  }

  if (view === 'onboarding') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Onboarding onComplete={handleProfileComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="w-full max-w-md h-[100dvh] sm:h-[90vh] sm:rounded-3xl bg-white shadow-2xl overflow-hidden relative flex flex-col">
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-md p-4 pt-5 border-b border-slate-100 z-20 flex justify-between items-center sticky top-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center text-white">
               <Heart size={16} className="fill-white" />
            </div>
            <div className="text-xl font-display font-bold text-slate-900 tracking-tight">Malda<span className="text-brand-primary">Mingle</span></div>
          </div>
          <button 
            onClick={() => setCurrentTab('messages')}
            className="p-2 hover:bg-slate-100 rounded-full relative transition-colors"
          >
             <Bell size={22} className="text-slate-600" />
             {incomingRequests.length > 0 && (
               <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-brand-primary rounded-full border-2 border-white animate-bounce"></span>
             )}
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative bg-slate-50">
           <RealDashboard 
             currentUser={currentUser!} 
             activeTab={currentTab}
             friends={friends}
             incomingRequests={incomingRequests}
             sentRequests={sentRequests}
             onSendRequest={handleSendRequest}
             onAcceptRequest={handleAcceptRequest}
             onDeclineRequest={handleDeclineRequest}
             onLogout={handleLogout}
           />
        </main>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-slate-100 flex justify-around items-center p-2 pb-6 sm:pb-2 z-20 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
          <NavButton 
            active={currentTab === 'public'} 
            onClick={() => setCurrentTab('public')} 
            icon={<Users size={24} />} 
            label="Public" 
          />
          <NavButton 
            active={currentTab === 'random'} 
            onClick={() => setCurrentTab('random')} 
            icon={<Sparkles size={24} />} 
            label="Random" 
          />
          <NavButton 
            active={currentTab === 'messages'} 
            onClick={() => setCurrentTab('messages')} 
            icon={<MessageCircle size={24} />} 
            label="Chats"
            badge={incomingRequests.length}
          />
          <NavButton 
            active={currentTab === 'profile'} 
            onClick={() => setCurrentTab('profile')} 
            icon={<User size={24} />} 
            label="Profile" 
          />
        </nav>
      </div>
    </div>
  );
}

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; badge?: number }> = ({ active, onClick, icon, label, badge }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 px-4 rounded-2xl transition-all duration-300 relative ${
      active ? 'text-brand-primary scale-110 bg-rose-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
    }`}
  >
    <div className="relative">
      {icon}
      {badge ? (
        <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-white">
          {badge}
        </span>
      ) : null}
    </div>
    <span className="text-[10px] font-semibold tracking-wide">{label}</span>
  </button>
);

interface RealDashboardProps {
  currentUser: UserProfile; 
  activeTab: DashboardTab;
  friends: string[];
  incomingRequests: string[];
  sentRequests: string[];
  onSendRequest: (id: string) => void;
  onAcceptRequest: (id: string) => void;
  onDeclineRequest: (id: string) => void;
  onLogout: () => void;
}

const RealDashboard: React.FC<RealDashboardProps> = ({ 
  currentUser, 
  activeTab,
  friends,
  incomingRequests,
  sentRequests,
  onSendRequest,
  onAcceptRequest,
  onDeclineRequest,
  onLogout
}) => {
  const [publicMessages, setPublicMessages] = useState<Message[]>(INITIAL_PUBLIC_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [activeChat, setActiveChat] = useState<ChatSession | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [messageViewMode, setMessageViewMode] = useState<'chats' | 'discover' | 'requests'>('discover'); 
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [publicMessages, activeChat?.messages]);

  const handleSendPublic = () => {
    if (!inputText.trim()) return;
    setPublicMessages(prev => [...prev, {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: inputText,
      timestamp: Date.now()
    }]);
    setInputText('');
  };

  const handleSendPrivate = () => {
    if (!inputText.trim() || !activeChat) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: inputText,
      timestamp: Date.now()
    };

    setActiveChat(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage]
    } : null);
    
    setInputText('');

    setTimeout(() => {
      setActiveChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, {
          id: (Date.now() + 1).toString(),
          senderId: prev.participant.id,
          senderName: prev.participant.name,
          text: "That sounds interesting! Tell me more about yourself.",
          timestamp: Date.now()
        }]
      } : null);
    }, 1500);
  };

  const startRandomChat = async () => {
    setIsSearching(true);
    setTimeout(async () => {
      const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
      const icebreaker = await generateIcebreaker();
      setActiveChat({
        id: crypto.randomUUID(),
        participant: randomUser,
        messages: [{
          id: 'sys', senderId: 'system', senderName: 'Malda Bot',
          text: `Matched with ${randomUser.name} from ${randomUser.policeStation}. Icebreaker: ${icebreaker}`,
          isSystem: true, timestamp: Date.now()
        }]
      });
      setIsSearching(false);
    }, 2000);
  };

  const startDirectChat = (user: UserProfile) => {
    setActiveChat({
      id: `chat-${user.id}`,
      participant: user,
      messages: [] 
    });
  };

  const ChatBubble: React.FC<{ msg: Message; isMe: boolean }> = ({ msg, isMe }) => (
    <FadeIn className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-4`}>
       {!isMe && <span className="text-[10px] font-bold text-slate-400 ml-2 mb-1 uppercase tracking-wider">{msg.senderName}</span>}
       <div className={`max-w-[80%] px-4 py-3 text-sm shadow-sm ${
         msg.isSystem ? 'bg-slate-100 text-slate-500 text-center w-full !max-w-full italic rounded-xl border border-slate-200 my-2' :
         isMe ? 'bg-gradient-brand text-white rounded-2xl rounded-tr-sm' : 'bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-tl-sm'
       }`}>
         {msg.text}
       </div>
    </FadeIn>
  );

  if (activeChat) {
    return (
      <div className="h-full flex flex-col bg-slate-50 absolute inset-0 z-30 animate-slide-up">
        {/* Chat Header */}
        <div className="bg-white/90 backdrop-blur p-3 border-b border-slate-100 flex items-center gap-3 shadow-sm sticky top-0 z-10">
          <button onClick={() => setActiveChat(null)} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
              <ArrowLeft size={22} className="text-slate-600"/>
          </button>
          <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img src={activeChat.participant.photos[0]} className="w-full h-full object-cover" alt="User" />
              </div>
              <div>
                  <h3 className="font-display font-bold text-slate-900 text-sm leading-tight">{activeChat.participant.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{activeChat.participant.policeStation}</p>
              </div>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600"><MoreVertical size={20}/></button>
        </div>
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-2">
          {activeChat.messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm animate-fade-in">
                  <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-3">
                    <span className="text-2xl">👋</span>
                  </div>
                  <p>Say Hello to <span className="font-bold text-slate-700">{activeChat.participant.name}</span>!</p>
              </div>
          )}
          {activeChat.messages.map(m => <ChatBubble key={m.id} msg={m} isMe={m.senderId === currentUser.id}/>)}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center pb-6 sm:pb-3">
          <Input 
              value={inputText} 
              onChange={e => setInputText(e.target.value)} 
              placeholder="Type a message..." 
              className="!rounded-full !bg-slate-100 !border-transparent focus:!bg-white focus:!ring-brand-secondary !py-2.5"
              onKeyDown={(e) => e.key === 'Enter' && handleSendPrivate()}
          />
          <button 
              onClick={handleSendPrivate}
              disabled={!inputText.trim()}
              className="bg-gradient-brand text-white p-3 rounded-full hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
              <Send size={20} className="ml-0.5"/>
          </button>
        </div>
      </div>
    );
  }

  if (activeTab === 'public') {
    return (
      <div className="h-full flex flex-col bg-slate-50 animate-fade-in">
        <div className="bg-white px-5 py-3 border-b border-slate-100 flex justify-between items-center">
           <div>
              <h2 className="font-display font-bold text-slate-900">Public Lounge</h2>
              <p className="text-xs text-slate-500 font-medium">All Malda • Live</p>
           </div>
           <div className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 shadow-sm border border-rose-100">
             <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span> Live
           </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {publicMessages.map(m => <ChatBubble key={m.id} msg={m} isMe={m.senderId === currentUser.id}/>)}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-3 bg-white border-t border-slate-100 flex gap-2 pb-6 sm:pb-3 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
          <Input 
            value={inputText} 
            onChange={e => setInputText(e.target.value)} 
            placeholder="Message public group..." 
            className="!rounded-full !bg-slate-100 !border-transparent"
          />
          <Button onClick={handleSendPublic} className="!rounded-full !px-3 !py-0 aspect-square"><Send size={18}/></Button>
        </div>
      </div>
    );
  }

  if (activeTab === 'random') {
    return (
      <div className="h-full flex items-center justify-center p-6 relative overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-rose-300 rounded-full blur-[100px] animate-pulse-soft"></div>
            <div className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-amber-300 rounded-full blur-[100px] animate-pulse-soft" style={{animationDelay: '1s'}}></div>
        </div>

        <FadeIn className="text-center w-full max-w-xs relative z-10">
           <div className="mx-auto w-32 h-32 bg-white rounded-full flex items-center justify-center text-brand-primary mb-8 shadow-2xl shadow-rose-500/20 border-4 border-white relative">
             {isSearching ? (
               <>
                <div className="absolute inset-0 rounded-full border-4 border-brand-primary border-t-transparent animate-spin"></div>
                <RefreshCw className="text-brand-secondary" size={40}/>
               </>
             ) : (
               <Sparkles size={48} className="fill-brand-primary/20"/>
             )}
           </div>
           <h2 className="text-3xl font-display font-bold mb-3 text-slate-900">Random Match</h2>
           <p className="text-slate-500 mb-10 leading-relaxed font-medium">
             Connect with a random stranger from anywhere in Malda District.
           </p>
           <Button 
             onClick={startRandomChat} 
             disabled={isSearching} 
             className="w-full py-4 text-lg shadow-xl shadow-brand-primary/30 rounded-2xl"
           >
             {isSearching ? 'Searching Malda...' : 'Start Random Chat'}
           </Button>
        </FadeIn>
      </div>
    );
  }

  if (activeTab === 'messages') {
    const friendUsers = MOCK_USERS.filter(u => friends.includes(u.id));
    const unknownUsers = MOCK_USERS.filter(u => !friends.includes(u.id) && u.id !== currentUser.id && !incomingRequests.includes(u.id));
    const requestUsers = MOCK_USERS.filter(u => incomingRequests.includes(u.id));

    return (
      <div className="h-full flex flex-col bg-slate-50 animate-fade-in">
        <div className="bg-white px-4 py-3 shadow-sm z-10 sticky top-0">
           <div className="flex p-1 bg-slate-100 rounded-xl relative overflow-hidden">
              {(['discover', 'chats', 'requests'] as const).map((mode) => (
                 <button 
                  key={mode}
                  onClick={() => setMessageViewMode(mode)}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all z-10 relative ${
                    messageViewMode === mode 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                  }`}
                >
                  {mode}
                  {mode === 'chats' && friendUsers.length > 0 && (
                     <span className="ml-1 px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[9px] border border-slate-200">{friendUsers.length}</span>
                  )}
                  {mode === 'requests' && requestUsers.length > 0 && (
                     <span className="ml-1 px-1.5 py-0.5 bg-brand-primary text-white rounded-full text-[9px] animate-pulse">{requestUsers.length}</span>
                  )}
                </button>
              ))}
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
          {messageViewMode === 'chats' && (
             friendUsers.length > 0 ? (
               <div className="space-y-3">
                  {friendUsers.map((u, i) => (
                    <FadeIn key={u.id} delay={i * 50}>
                      <div onClick={() => startDirectChat(u)} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:bg-slate-50 active:scale-98 transition-all">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-sm">
                          <img src={u.photos[0]} alt={u.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 text-lg truncate">{u.name}</h3>
                            <p className="text-xs text-brand-primary font-medium flex items-center gap-1">
                              <MapPin size={10}/> {u.policeStation}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-brand-light text-brand-primary flex items-center justify-center">
                            <MessageCircle size={20} className="fill-current" />
                        </div>
                      </div>
                    </FadeIn>
                  ))}
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle size={32} className="opacity-50"/>
                  </div>
                  <p className="font-medium">No chats yet.</p>
                  <Button variant="ghost" className="mt-2 text-brand-primary" onClick={() => setMessageViewMode('discover')}>Find Friends</Button>
               </div>
             )
          )}

          {messageViewMode === 'requests' && (
             requestUsers.length > 0 ? (
                <div className="space-y-4">
                  {requestUsers.map((u, i) => (
                    <FadeIn key={u.id} delay={i * 50}>
                      <Card className="p-4">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                             <img src={u.photos[0]} alt={u.name} className="w-full h-full object-cover" />
                           </div>
                           <div>
                             <h3 className="font-display font-bold text-slate-900 text-lg">{u.name}, {u.age}</h3>
                             <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={12}/> {u.policeStation}</p>
                           </div>
                        </div>
                        <div className="flex gap-3">
                           <Button 
                              className="flex-1 !py-2 bg-slate-100 !text-slate-600 hover:!bg-slate-200 shadow-none"
                              onClick={() => onDeclineRequest(u.id)}
                           >
                             Decline
                           </Button>
                           <Button 
                              className="flex-1 !py-2"
                              onClick={() => onAcceptRequest(u.id)}
                           >
                             Accept
                           </Button>
                        </div>
                      </Card>
                    </FadeIn>
                  ))}
                </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <UserPlus size={32} className="opacity-50"/>
                  </div>
                  <p className="font-medium">No pending requests.</p>
               </div>
             )
          )}

          {messageViewMode === 'discover' && (
            <div className="space-y-6 pb-20">
              {unknownUsers.map((u, i) => {
                const isRequested = sentRequests.includes(u.id);
                return (
                  <FadeIn key={u.id} delay={i * 100} className="group">
                    <Card className="overflow-hidden border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/80 transition-all duration-500">
                      <div className="h-80 overflow-hidden relative">
                        <img src={u.photos[0]} alt={u.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90"></div>
                        <div className="absolute bottom-0 left-0 w-full p-5 text-white">
                            <div className="flex justify-between items-end mb-2">
                              <div className="flex items-baseline gap-2">
                                  <h3 className="text-3xl font-display font-bold leading-none">{u.name}</h3>
                                  <span className="text-xl font-medium opacity-90">{u.age}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-sm font-medium text-white/90 mb-3">
                              <MapPin size={14} className="text-brand-secondary" /> {u.policeStation}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {u.interests.slice(0, 3).map(int => (
                                <span key={int} className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-semibold border border-white/10">
                                  {int}
                                </span>
                              ))}
                            </div>
                        </div>
                      </div>
                      <div className="p-4 bg-white flex items-center gap-4">
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 flex-1 pl-1">{u.bio}</p>
                        {isRequested ? (
                          <Button disabled variant="secondary" className="!rounded-full !px-6 opacity-70" icon={<Clock size={16}/>}>
                            Sent
                          </Button>
                        ) : (
                          <Button onClick={() => onSendRequest(u.id)} className="!rounded-full !px-6 shadow-lg shadow-brand-primary/20">
                            Connect
                          </Button>
                        )}
                      </div>
                    </Card>
                  </FadeIn>
                );
              })}
              <div className="text-center p-8 text-slate-400 text-sm font-medium">
                 You've explored Malda! <br/> Check back for new faces.
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'profile') {
    return (
      <div className="h-full overflow-y-auto bg-slate-50 p-6 animate-fade-in">
        <div className="relative mb-16 mt-4">
           <div className="h-32 bg-gradient-brand rounded-3xl shadow-lg shadow-orange-500/20"></div>
           <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="w-32 h-32 rounded-3xl rotate-3 overflow-hidden border-4 border-white shadow-2xl">
                <img src={currentUser.photos[0]} alt="Me" className="w-full h-full object-cover bg-white" />
              </div>
           </div>
        </div>

        <div className="text-center mb-8">
           <h2 className="text-2xl font-display font-bold text-slate-900">{currentUser.name}, {currentUser.age}</h2>
           <p className="text-slate-500 font-medium flex items-center justify-center gap-1 mt-1">
             <MapPin size={14}/> {currentUser.policeStation}
           </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
             <span className="block text-2xl font-display font-bold text-brand-primary">{friends.length}</span>
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Friends</span>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
             <span className="block text-2xl font-display font-bold text-slate-900">0</span>
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Likes</span>
          </div>
        </div>
        
        <Card className="overflow-hidden border-0 shadow-sm">
          <div className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer flex justify-between items-center transition-colors">
             <span className="font-medium text-slate-700">Edit Profile</span>
             <ArrowRight size={18} className="text-slate-300" />
          </div>
          <div className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer flex justify-between items-center transition-colors">
             <span className="font-medium text-slate-700">Privacy & Terms</span>
             <ArrowRight size={18} className="text-slate-300" />
          </div>
           <div 
             // Fixed: Using the correct prop onLogout instead of the non-existent handleLogout
             onClick={onLogout}
             className="p-4 hover:bg-red-50 cursor-pointer flex justify-between items-center text-red-500 transition-colors"
           >
             <span className="font-bold">Leave Website</span>
             <ArrowRight size={18} className="text-red-300" />
          </div>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Malda Mingle District Network</p>
        </div>
      </div>
    );
  }

  return null;
}
