import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, User, MessageAttachment } from '../../types';
import {
  getConversationMessages,
  sendChatMessage,
  markConversationAsRead,
} from '../../services/storageService';
import {
  validateDocumentFile,
  readFileAsDataUrl,
} from '../../utils/fileUpload';
import {
  X,
  Send,
  Building,
  MapPin,
  Package,
  CheckCheck,
  AlertCircle,
  Flag,
  Paperclip,
  FileText,
  Download,
  Image as ImageIcon,
} from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation | null;
  currentUser: User | null;
  onRefreshConversations?: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  conversation,
  currentUser,
  onRefreshConversations,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [pendingAttachment, setPendingAttachment] = useState<MessageAttachment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reported, setReported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMessages = () => {
    if (!conversation || !currentUser) return;
    const result = getConversationMessages(conversation.id, currentUser.id);
    if (result.success && result.messages) {
      setMessages(result.messages);
      markConversationAsRead(conversation.id, currentUser.id);
      if (onRefreshConversations) onRefreshConversations();
    } else {
      setError(result.error || 'Impossible de charger la conversation.');
    }
  };

  useEffect(() => {
    if (isOpen && conversation && currentUser) {
      loadMessages();
    }
  }, [isOpen, conversation, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen || !conversation || !currentUser) return null;

  const isBuyer = currentUser.id === conversation.buyerId;
  const partnerName = isBuyer ? conversation.supplierName : conversation.buyerName;
  const partnerCompany = isBuyer ? conversation.supplierCompany : conversation.buyerCompany;
  const partnerRole = isBuyer ? 'Fournisseur' : 'Acheteur';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateDocumentFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Fichier non valide.');
      return;
    }

    try {
      const processed = await readFileAsDataUrl(file);
      setPendingAttachment({
        name: processed.name,
        url: processed.url,
        size: processed.size,
        type: processed.type,
      });
    } catch (err: any) {
      setError(err.message || 'Erreur lors du traitement du fichier.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!inputText.trim() && !pendingAttachment) return;

    const result = sendChatMessage(
      conversation.id,
      currentUser.id,
      inputText,
      pendingAttachment || undefined
    );

    if (result.success && result.message) {
      setMessages((prev) => [...prev, result.message!]);
      setInputText('');
      setPendingAttachment(null);
      if (onRefreshConversations) onRefreshConversations();
    } else {
      setError(result.error || 'Erreur lors de l’envoi.');
    }
  };

  const handleReport = () => {
    setReported(true);
    setTimeout(() => setReported(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[85vh] sm:h-[700px]">
        {/* Chat Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold flex items-center justify-center text-sm uppercase">
              {partnerCompany ? partnerCompany.charAt(0) : partnerName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">{partnerCompany}</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {partnerRole}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Contact : {partnerName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleReport}
              title="Signaler la conversation"
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer text-xs"
            >
              <Flag className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Banner */}
        {reported && (
          <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Signalement enregistré par le service de modération WORLDORA.</span>
          </div>
        )}

        {/* Product Context Banner */}
        {conversation.productId && (
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {conversation.productImage ? (
                <img
                  src={conversation.productImage}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-slate-400" />
                </div>
              )}
              <div className="truncate">
                <p className="font-semibold text-slate-900 truncate">
                  {conversation.productName || 'Produit concerné'}
                </p>
                {conversation.productPrice !== undefined && (
                  <p className="text-slate-600 font-medium tabular-nums text-[11px]">
                    Prix unitaire de référence : {conversation.productPrice.toLocaleString('fr-FR')}{' '}
                    {conversation.productCurrency}
                  </p>
                )}
              </div>
            </div>
            <span className="text-[10px] font-semibold text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded-md shrink-0">
              Négociation directe
            </span>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                <Send className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-700">Aucun message pour l'instant</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Présentez vos besoins au fournisseur : volume souhaité, destination de livraison et délais envisagés. Vous pouvez aussi joindre un document technique ou un bon de commande.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              const dateStr = new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] font-medium text-slate-400 mb-1 px-1">
                    {isMine ? 'Vous' : msg.senderName} · {dateStr}
                  </div>
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isMine
                        ? 'bg-slate-900 text-white rounded-br-xs'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    {msg.content && <p className="whitespace-pre-wrap break-words">{msg.content}</p>}

                    {/* Attachment preview / download */}
                    {msg.attachment && (
                      <div className="mt-2 pt-2 border-t border-slate-200/40">
                        {msg.attachment.type === 'image' ? (
                          <div className="rounded-lg overflow-hidden border border-white/20 max-w-xs">
                            <img
                              src={msg.attachment.url}
                              alt={msg.attachment.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-auto max-h-48 object-cover cursor-pointer"
                              onClick={() => window.open(msg.attachment!.url, '_blank')}
                            />
                            <div className="p-1.5 bg-black/40 text-[10px] flex items-center justify-between">
                              <span className="truncate">{msg.attachment.name}</span>
                              <span className="shrink-0 ml-1">{msg.attachment.size}</span>
                            </div>
                          </div>
                        ) : (
                          <a
                            href={msg.attachment.url}
                            download={msg.attachment.name}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                              isMine
                                ? 'bg-white/10 hover:bg-white/20 text-white'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                            }`}
                          >
                            <FileText className="w-4 h-4 shrink-0 text-amber-400" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold truncate">{msg.attachment.name}</p>
                              <p className="text-[10px] opacity-75">{msg.attachment.size}</p>
                            </div>
                            <Download className="w-3.5 h-3.5 shrink-0 opacity-80" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Pending attachment preview */}
        {pendingAttachment && (
          <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="w-4 h-4 text-slate-600 shrink-0" />
              <span className="font-semibold text-slate-800 truncate">{pendingAttachment.name}</span>
              <span className="text-slate-500 text-[11px] shrink-0">({pendingAttachment.size})</span>
            </div>
            <button
              type="button"
              onClick={() => setPendingAttachment(null)}
              className="p-1 text-slate-500 hover:text-rose-600 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Joindre un fichier (PDF, image, bon de commande, spécifications)"
            className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Écrivez votre message ou joignez un fichier..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          />

          <button
            type="submit"
            disabled={!inputText.trim() && !pendingAttachment}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
