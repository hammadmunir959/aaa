import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatbotApi } from "@/services/chatbotApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant" | "admin";
  timestamp: Date;
  responseTimeMs?: number;
  isAdminReply?: boolean;
}

interface ChatSession {
  sessionId: string;
  messages: Message[];
  lastActivity: Date;
  isManualReplyActive: boolean;
}

const AIChatWidget = () => {
  // Session management
  const [sessionId, setSessionId] = useState<string>(() => {
    return localStorage.getItem('chatbot_session_id') ||
      `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  });

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isManualReplyActive, setIsManualReplyActive] = useState(false);
  const [lastMessageId, setLastMessageId] = useState<number>(0);
  const lastMessageIdRef = useRef<number>(0);
  const [pollBackoffCount, setPollBackoffCount] = useState<number>(0);

  // Keep ref in sync with state
  useEffect(() => {
    lastMessageIdRef.current = lastMessageId;
  }, [lastMessageId]);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isSyncingRef = useRef<boolean>(false);
  const rateLimitRef = useRef<{ isLimited: boolean; retryAfter: number }>({ isLimited: false, retryAfter: 0 });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const chatButtonRef = useRef<HTMLButtonElement>(null);

  // Load saved session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('chatbot_session');
    if (savedSession) {
      try {
        const session: ChatSession = JSON.parse(savedSession);
        setSessionId(session.sessionId);
        const loadedMessages = session.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(loadedMessages);
        setIsManualReplyActive(session.isManualReplyActive);

        // Initialize lastMessageId from loaded messages
        if (loadedMessages.length > 0) {
          // Try to extract numeric ID from message IDs (format: "admin-123" or just "123")
          const ids = loadedMessages.map(m => {
            const parts = m.id.split('-');
            return parseInt(parts[parts.length - 1]) || 0;
          });
          if (ids.length > 0) {
            const maxId = Math.max(...ids);
            lastMessageIdRef.current = maxId;
            setLastMessageId(maxId);
          }
        }

        // Check if session is still valid (within 24 hours)
        const sessionAge = Date.now() - new Date(session.lastActivity).getTime();
        if (sessionAge > 24 * 60 * 60 * 1000) { // 24 hours
          resetSession();
        }
      } catch (error) {
        console.error('Failed to load saved session:', error);
        resetSession();
      }
    } else {
      // Initialize with welcome message
      setMessages([{
        id: "welcome",
        text: "Hi! I'm your AI assistant for AAA Accident Solutions LTD. I can help answer questions about our services, fleet, claims process, and more. How can I help you today?",
        sender: "assistant",
        timestamp: new Date(),
      }]);
    }
  }, []);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (messages.length > 0) {
      const session: ChatSession = {
        sessionId,
        messages,
        lastActivity: new Date(),
        isManualReplyActive,
      };
      localStorage.setItem('chatbot_session', JSON.stringify(session));
      localStorage.setItem('chatbot_session_id', sessionId);
    }
  }, [sessionId, messages, isManualReplyActive]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Update manual reply status when chat opens
  useEffect(() => {
    if (!sessionId || !isOpen) {
      return;
    }

    // Quick check for manual reply status when chat opens
    const checkManualStatus = async () => {
      try {
        const result = await chatbotApi.getLatestMessages(sessionId, lastMessageIdRef.current);
        if (result.manual_reply_active !== isManualReplyActive) {
          setIsManualReplyActive(result.manual_reply_active);
        }
      } catch (error) {
        // Silently handle errors
      }
    };

    checkManualStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, sessionId]); // Check when chat opens or session changes


  // Poll for new messages when chat is open (always active when open)
  useEffect(() => {
    if (sessionId && isOpen) {
      // Poll function to fetch new messages
      const pollForMessages = async () => {
        // Prevent concurrent syncs
        if (isSyncingRef.current) {
          return;
        }

        // Check if we're currently rate limited
        if (rateLimitRef.current.isLimited) {
          const now = Date.now();
          if (now < rateLimitRef.current.retryAfter) {
            // Still rate limited, skip this poll
            return;
          } else {
            // Rate limit period has passed, reset
            rateLimitRef.current.isLimited = false;
          }
        }

        try {
          isSyncingRef.current = true;
          const currentLastMessageId = lastMessageIdRef.current;
          const result = await chatbotApi.getLatestMessages(sessionId, currentLastMessageId);

          // Update manual reply status
          if (result.manual_reply_active !== isManualReplyActive) {
            setIsManualReplyActive(result.manual_reply_active);
          }

          // Check if conversation is completed and stop polling if so
          if (result.status === 'completed') {
            console.log('🤖 ChatWidget: Conversation completed, stopping polling');
            if (pollingIntervalRef.current) {
              clearTimeout(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
            return;
          }

          if (result.messages && result.messages.length > 0) {
            setMessages((prev) => {
              // Create a set of existing message IDs in the format we use in state
              const existingMessageIds = new Set(prev.map(m => m.id));

              // Filter for new messages that aren't already in state
              const newMessages = result.messages.filter(msg => {
                const sender = msg.message_type === 'admin' || msg.is_admin_reply ? 'admin' :
                  msg.message_type === 'user' ? 'user' : 'assistant';
                const messageId = `${sender}-${msg.id}`;
                return !existingMessageIds.has(messageId);
              });

              if (newMessages.length > 0) {
                const formattedMessages: Message[] = newMessages.map(msg => {
                  const sender = msg.message_type === 'admin' || msg.is_admin_reply ? 'admin' :
                    msg.message_type === 'user' ? 'user' : 'assistant';
                  return {
                    id: `${sender}-${msg.id}`,
                    text: msg.content,
                    sender: sender as "user" | "assistant" | "admin",
                    timestamp: new Date(msg.timestamp),
                    isAdminReply: msg.is_admin_reply || false,
                    responseTimeMs: msg.response_time_ms || undefined,
                  };
                });

                // Check if any of the new messages are assistant/admin responses (not user messages)
                const hasResponse = newMessages.some(msg => {
                  const sender = msg.message_type === 'admin' || msg.is_admin_reply ? 'admin' :
                    msg.message_type === 'user' ? 'user' : 'assistant';
                  return sender !== 'user';
                });

                // Turn off typing indicator when we receive a response
                if (hasResponse) {
                  setIsTyping(false);
                  setIsLoading(false);
                }

                // Update last message ID - use the maximum ID from all new messages
                const maxId = Math.max(...newMessages.map(m => m.id));
                if (maxId > currentLastMessageId) {
                  lastMessageIdRef.current = maxId;
                  setLastMessageId(maxId);
                }

                // Reset backoff count when new messages are received
                setPollBackoffCount(0);

                return [...prev, ...formattedMessages];
              }

              return prev;
            });
          } else {
            // No new messages, increase backoff count
            setPollBackoffCount(prev => prev + 1);
          }
        } catch (error: any) {
          // Handle rate limiting with exponential backoff
          if (error?.status === 429 || error?.response?.status === 429) {
            // Calculate retry delay with exponential backoff (start at 2 seconds, max at 20 seconds)
            const currentDelay = rateLimitRef.current.retryAfter - Date.now();
            const newDelay = Math.min(currentDelay > 0 ? currentDelay * 2 : 2000, 20000);

            rateLimitRef.current.isLimited = true;
            rateLimitRef.current.retryAfter = Date.now() + newDelay;

            console.log(`🤖 ChatWidget: Rate limited, retrying in ${newDelay / 1000} seconds`);

            // Schedule next poll after the rate limit delay
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
            }
            pollingIntervalRef.current = setTimeout(() => {
              pollForMessages();
            }, newDelay);
            return;
          }
          console.error('Error polling for messages:', error);
        } finally {
          isSyncingRef.current = false;
        }
      };

      // Poll immediately
      pollForMessages();

      // Set up regular interval with adaptive timing
      const scheduleNextPoll = () => {
        if (pollingIntervalRef.current) {
          clearTimeout(pollingIntervalRef.current);
        }

        // Use different intervals based on rate limiting status and manual mode
        let pollInterval = 5000; // Default 5 seconds (reasonable balance)

        if (rateLimitRef.current.isLimited) {
          // If rate limited, don't schedule regular polling - it will be handled by the timeout above
          return;
        } else if (isManualReplyActive) {
          // Manual mode: poll more frequently for admin messages (2 seconds)
          pollInterval = 2000;
        } else {
          // Auto mode: progressive backoff polling for AI responses
          // If actively waiting for a response (isTyping), poll more frequently (2 seconds)
          // Otherwise, start at 5 seconds and increase with backoff
          if (isTyping) {
            pollInterval = 2000; // Poll every 2 seconds when waiting for response
          } else {
            // Start at 5 seconds, increase by 5 seconds for each consecutive poll with no new messages
            // Max out at 60 seconds to avoid being too slow
            const baseInterval = 5000; // 5 seconds (reduced from 10 for faster response detection)
            const backoffIncrement = 5000; // 5 seconds
            const maxInterval = 60000; // 60 seconds max

            pollInterval = Math.min(baseInterval + (pollBackoffCount * backoffIncrement), maxInterval);
          }
        }

        console.log(`🤖 ChatWidget: Scheduling next poll in ${pollInterval / 1000} seconds`);
        pollingIntervalRef.current = setTimeout(() => {
          pollForMessages();
          scheduleNextPoll(); // Schedule the next poll after this one completes
        }, pollInterval);
      };

      // Start the polling cycle
      scheduleNextPoll();
    } else {
      // Clear polling when chat is closed
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearTimeout(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [isOpen, sessionId, isManualReplyActive]);

  const handleResetClick = () => {
    setShowResetDialog(true);
  };

  const resetSession = () => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    setMessages([{
      id: "welcome",
      text: "Hi! I'm your AI assistant for AAA Accident Solutions LTD. I can help answer questions about our services, fleet, claims process, and more. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    }]);
    setIsManualReplyActive(false);
    setError(null);
    setIsTyping(false);
    setIsLoading(false);
    setInputValue("");
    lastMessageIdRef.current = 0;
    setLastMessageId(0);
    localStorage.removeItem('chatbot_session');
    localStorage.setItem('chatbot_session_id', newSessionId);
    setShowResetDialog(false);
  };

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isOpen) return;

      const target = event.target as Node;

      // Don't close if clicking inside the chat window
      if (chatWindowRef.current?.contains(target)) {
        return;
      }

      // Don't close if clicking on the chat button
      if (chatButtonRef.current?.contains(target)) {
        return;
      }

      // Close the chat when clicking outside
      setIsOpen(false);
    };

    if (isOpen) {
      // Add event listener with a slight delay to avoid immediate closing
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Generate AI response using agentic chatbot API
  const generateAIResponse = async (userMessage: string): Promise<{ message: string; responseTimeMs: number; isManualReplyActive: boolean; silentBlock?: boolean }> => {
    try {
      setError(null);
      const response = await chatbotApi.sendMessage(userMessage, sessionId);

      // Update manual reply status
      setIsManualReplyActive(response.manual_reply_active);

      return {
        message: response.message,
        responseTimeMs: response.response_time_ms,
        isManualReplyActive: response.manual_reply_active,
        silentBlock: response.silent_block,
      };
    } catch (error: any) {
      console.error('Chatbot API error:', error);

      // Handle rate limiting specifically
      if (error?.status === 429 || error?.response?.status === 429) {
        setError('Too many requests. Please wait a moment and try again.');
        return {
          message: "I'm receiving too many requests right now. Please wait a moment and try again.",
          responseTimeMs: 0,
          isManualReplyActive: false,
        };
      }

      setError('Failed to get response from AI assistant');

      // Fallback response
      return {
        message: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or contact our support team directly at info@aaa-as.co.uk.",
        responseTimeMs: 0,
        isManualReplyActive: false,
      };
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const messageText = inputValue.trim();
    setInputValue("");
    setIsTyping(true);
    setIsLoading(true);
    setError(null);

    try {
      // Send the message to the API
      const response = await generateAIResponse(messageText);

      // Update manual reply status
      const wasManualMode = isManualReplyActive;
      setIsManualReplyActive(response.isManualReplyActive);

      // Poll immediately to get the user message and any responses (with rate limit handling)
      if (sessionId) {
        try {
          const result = await chatbotApi.getLatestMessages(sessionId, lastMessageIdRef.current);

          if (result.messages && result.messages.length > 0) {
            setMessages((prev) => {
              const existingMessageIds = new Set(prev.map(m => m.id));
              const newMessages = result.messages.filter(msg => {
                const sender = msg.message_type === 'admin' || msg.is_admin_reply ? 'admin' :
                  msg.message_type === 'user' ? 'user' : 'assistant';
                const messageId = `${sender}-${msg.id}`;
                return !existingMessageIds.has(messageId);
              });

              if (newMessages.length > 0) {
                const formattedMessages: Message[] = newMessages.map(msg => {
                  const sender = msg.message_type === 'admin' || msg.is_admin_reply ? 'admin' :
                    msg.message_type === 'user' ? 'user' : 'assistant';
                  return {
                    id: `${sender}-${msg.id}`,
                    text: msg.content,
                    sender: sender as "user" | "assistant" | "admin",
                    timestamp: new Date(msg.timestamp),
                    isAdminReply: msg.is_admin_reply || false,
                    responseTimeMs: msg.response_time_ms || undefined,
                  };
                });

                // Check if any of the new messages are assistant/admin responses (not user messages)
                const hasResponse = newMessages.some(msg => {
                  const sender = msg.message_type === 'admin' || msg.is_admin_reply ? 'admin' :
                    msg.message_type === 'user' ? 'user' : 'assistant';
                  return sender !== 'user';
                });

                // Turn off typing indicator when we receive a response
                if (hasResponse) {
                  setIsTyping(false);
                  setIsLoading(false);
                }

                const maxId = Math.max(...newMessages.map(m => m.id));
                if (maxId > lastMessageIdRef.current) {
                  lastMessageIdRef.current = maxId;
                  setLastMessageId(maxId);
                }

                return [...prev, ...formattedMessages];
              }
              return prev;
            });
          }
        } catch (error: any) {
          // Handle rate limiting in message sending
          if (error?.status === 429 || error?.response?.status === 429) {
            console.log('Rate limited while sending message, will retry via polling');
            // Don't show error to user, polling will handle it
          } else {
            console.error('Error getting message confirmation:', error);
          }
        }
      }

      // If silent block, don't add any assistant message - just wait for admin reply
      if (response.silentBlock) {
        setIsTyping(false);
        setIsLoading(false);
        return;
      }

      // For auto mode, the main polling will handle AI responses
      // For manual mode, polling will handle admin messages
      if (response.isManualReplyActive) {
        // Manual mode - turn off typing indicator, main polling will handle admin messages
        setIsTyping(false);
        setIsLoading(false);
      } else {
        // Auto mode - keep typing indicator on, main polling will catch AI responses
        // Set a safety timeout to turn off typing after 30 seconds
        setTimeout(() => {
          setIsTyping(false);
          setIsLoading(false);
        }, 30000);
      }

    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team for assistance.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <button
        ref={chatButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-8 z-[60] w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 transition-all duration-300 flex items-center justify-center"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isManualReplyActive ? (
          <span className="text-lg font-bold">A</span>
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
        {/* Notification dot */}
        <span className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-accent"></span>
      </button>

      {/* Chat Window */}
      <div
        ref={chatWindowRef}
        className={`fixed bottom-32 right-8 z-[60] w-[calc(100%-4rem)] sm:w-full max-w-sm h-[400px] max-h-[calc(100vh-14rem)] bg-card border border-border rounded-lg shadow-2xl flex flex-col transition-all duration-300 ${isOpen
          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
          : "opacity-0 scale-95 translate-y-4 pointer-events-none"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-4 py-3 rounded-t-lg flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              {isManualReplyActive ? (
                <span className="text-sm font-bold">A</span>
              ) : (
                <Bot className="w-5 h-5 text-accent" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-sm">
                {isManualReplyActive ? 'Human Representative' : 'AI Assistant'}
              </h3>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetClick}
              className="px-2 py-1 text-xs rounded-md hover:bg-primary/20 transition-colors flex items-center gap-1 border border-primary/30"
              aria-label="Restart conversation"
              title="Start a new conversation"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Restart</span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-md hover:bg-primary/20 transition-colors flex items-center justify-center"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="px-4 py-2 bg-red-100 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
          {messages.map((message) => {
            const isAdmin = message.sender === "admin" || message.isAdminReply;
            const isAssistant = message.sender === "assistant" && !isAdmin;

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                {(isAssistant || isAdmin) && (
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    {isAdmin ? (
                      <span className="text-xs font-bold">A</span>
                    ) : (
                      <Bot className="w-4 h-4 text-accent" />
                    )}
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${message.sender === "user"
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                    }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.text}
                  </p>
                </div>
                {message.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-accent" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-accent" />
              </div>
              <div className="bg-muted text-muted-foreground rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-current rounded-full animate-bounce"></span>
                  <span
                    className="w-2 h-2 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 bg-background rounded-b-lg">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about AAA Accident Solutions LTD..."
              disabled={isTyping || isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping || isLoading}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send • {isManualReplyActive ? "Human Representative" : "Powered by AI"}
          </p>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Start New Conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to start a new conversation? This will clear your current chat history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={resetSession} className="bg-accent text-accent-foreground hover:bg-accent/90">
              Start New Conversation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AIChatWidget;


