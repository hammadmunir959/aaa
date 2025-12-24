import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Filter, Eye, RefreshCw, AlertCircle, Send, User, Settings2, Bot, MessageSquare, FileText, Settings, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardNavBar from "@/components/DashboardNavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { chatbotApi, type Conversation } from "@/services/chatbotApi";
import { useToast } from "@/hooks/use-toast";


const ChatbotSessions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Sessions state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showConversationModal, setShowConversationModal] = useState(false);
  const [manualReplyMessage, setManualReplyMessage] = useState("");
  const [isManualReplyLoading, setIsManualReplyLoading] = useState(false);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pollingIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const loadConversations = async (url?: string | null) => {
    try {
      setIsLoading(true);
      setError(null);

      let response: any;
      if (url) {
        // If direct URL provided (pagination), use fetch directly or parse params
        // But chatbotApi.getConversations expects params.
        // Easiest is to extract offset from URL, or just use the URL with a custom fetch if API doesn't support generic URL.
        // Let's assume URL works with custom fetch or we parse generic params.
        // Actually, easiest is to just use authFetch if we have the full URL.
        // But chatbotApi wrapper is best. Let's parse params from URL.
        const urlObj = new URL(url);
        const params = Object.fromEntries(urlObj.searchParams.entries());
        response = await chatbotApi.getConversations(params);

        // Update current page number based on offset
        const offset = parseInt(params.offset || '0');
        setCurrentPage(Math.floor(offset / 10) + 1);
      } else {
        // Initial load or filter change
        const params: any = {};
        if (statusFilter !== "all") params.status = statusFilter;
        response = await chatbotApi.getConversations(params);
        setCurrentPage(1);
      }

      let conversationsArray: Conversation[] = [];
      // Handle DRF pagination response - expecting { count: 123, results: [...] } or just [...]
      if (response && response.results && Array.isArray(response.results)) {
        conversationsArray = response.results;
        setNextPage(response.next);
        setPrevPage(response.previous);
        setTotalCount(response.count);
      } else if (Array.isArray(response)) {
        conversationsArray = response;
        setNextPage(null);
        setPrevPage(null);
        setTotalCount(response.length);
      } else if (response && response.data && Array.isArray(response.data)) {
        conversationsArray = response.data;
      }

      // Ensure all conversations have a messages array and it's actually an array
      conversationsArray = conversationsArray.map(conv => ({
        ...conv,
        messages: Array.isArray(conv.messages) ? conv.messages : []
      }));
      console.log("Processed conversations:", conversationsArray.length);
      setConversations(conversationsArray);
    } catch (error: any) {
      console.error("Failed to load conversations:", error);
      setError(error?.message || "Failed to load conversations");
      setConversations([]);
      toast({
        title: "Failed to load conversations",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("ChatbotSessions mounted, loading conversations...");
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);



  const filteredConversations = conversations
    .map(conv => ({
      ...conv,
      messages: Array.isArray(conv.messages) ? conv.messages : []
    }))
    .filter(conv => {
      const matchesSearch = !searchQuery ||
        conv.session_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (conv.user_name && conv.user_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (conv.user_email && conv.user_email.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearch;
    });

  const handleViewConversation = async (conversation: Conversation) => {
    // Initialize with empty messages to prevent undefined errors
    const initialConv = {
      ...conversation,
      messages: conversation.messages || []
    };
    setSelectedConversation(initialConv);
    setShowConversationModal(true);

    // Load full conversation details including messages
    try {
      const fullConv = await chatbotApi.getConversation(conversation.id);
      // Ensure messages array exists
      const convWithMessages = {
        ...fullConv,
        messages: Array.isArray(fullConv.messages) ? fullConv.messages : []
      };
      setSelectedConversation(convWithMessages);
    } catch (error) {
      // Keep the initial conversation with empty messages if fetch fails
      console.error('Failed to load conversation details:', error);
    }
  };

  // Poll for new messages when viewing a conversation
  useEffect(() => {
    if (showConversationModal && selectedConversation && selectedConversation.status === 'active') {
      // Poll every 2 seconds for new messages
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const updatedConv = await chatbotApi.getConversation(selectedConversation.id);
          // Ensure messages array exists and is actually an array
          const convWithMessages = {
            ...updatedConv,
            messages: Array.isArray(updatedConv.messages) ? updatedConv.messages : []
          };
          setSelectedConversation(convWithMessages);
          // Also update the conversation in the list, ensuring all conversations have messages
          setConversations(prev =>
            prev.map(conv => {
              if (conv.id === updatedConv.id) {
                return convWithMessages;
              }
              // Ensure all conversations have messages array
              return {
                ...conv,
                messages: Array.isArray(conv.messages) ? conv.messages : []
              };
            })
          );
        } catch (error) {
          // Silently fail - don't spam console
          console.error('Error polling for conversation updates:', error);
        }
      }, 2000);
    } else {
      // Clear polling when modal is closed or conversation is not active
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [showConversationModal, selectedConversation]);

  const handleToggleManualReply = async () => {
    if (!selectedConversation) return;

    try {
      const response = await chatbotApi.toggleManualReply(selectedConversation.id);
      // Immediately reload conversation to get updated state and messages
      const updatedConv = await chatbotApi.getConversation(selectedConversation.id);
      // Ensure messages array exists and is actually an array
      const convWithMessages = {
        ...updatedConv,
        messages: Array.isArray(updatedConv.messages) ? updatedConv.messages : []
      };
      setSelectedConversation(convWithMessages);
      // Reload conversations to get updated state
      loadConversations();
      toast({
        title: response.manual_reply_active ? "Switched to Manual Mode" : "Switched to Auto Mode",
        description: response.message,
      });
    } catch (error: any) {
      toast({
        title: "Failed to toggle mode",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendManualReply = async () => {
    if (!selectedConversation || !manualReplyMessage.trim()) return;

    try {
      setIsManualReplyLoading(true);
      const response = await chatbotApi.sendManualReply(selectedConversation.id, manualReplyMessage);
      toast({
        title: "Reply Sent",
        description: "Your reply has been sent successfully.",
      });
      setManualReplyMessage("");
      // Immediately reload conversation to get updated messages
      const updatedConv = await chatbotApi.getConversation(selectedConversation.id);
      // Ensure messages array exists and is actually an array
      const convWithMessages = {
        ...updatedConv,
        messages: Array.isArray(updatedConv.messages) ? updatedConv.messages : []
      };
      setSelectedConversation(convWithMessages);
      loadConversations();

      // Also trigger an immediate poll after a short delay to ensure message is visible
      setTimeout(async () => {
        try {
          const latestConv = await chatbotApi.getConversation(selectedConversation.id);
          // Ensure messages array exists and is actually an array
          const latestConvWithMessages = {
            ...latestConv,
            messages: Array.isArray(latestConv.messages) ? latestConv.messages : []
          };
          setSelectedConversation(latestConvWithMessages);
        } catch (error) {
          // Ignore errors
        }
      }, 500);
    } catch (error: any) {
      toast({
        title: "Failed to send reply",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });

    } finally {
      setIsManualReplyLoading(false);
    }
  };

  const handleDeleteConversation = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this session? This action cannot be undone.")) {
      return;
    }

    try {
      await chatbotApi.deleteConversation(id);
      toast({
        title: "Session Deleted",
        description: "The conversation session has been permanently deleted.",
      });
      loadConversations(); // Refresh list to get next page items

    } catch (error: any) {
      toast({
        title: "Failed to delete session",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleModalClose = () => {
    // If in manual mode, switch back to auto when closing
    if (selectedConversation?.manual_reply_active && selectedConversation?.status === 'active') {
      chatbotApi.toggleManualReply(selectedConversation.id).catch(() => {
        // Silently fail if toggle fails on close
      });
    }
    setShowConversationModal(false);
    setManualReplyMessage("");
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'manual': return 'destructive';
      default: return 'outline';
    }
  };

  const formatCollectedData = (data: any) => {
    if (!data || Object.keys(data).length === 0) return "No data collected";

    const entries = Object.entries(data)
      .filter(([_, value]) => value !== null && value !== "")
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");

    return entries || "No data collected";
  };

  if (error && conversations.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <DashboardHeader />
        <DashboardNavBar />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4">
            <div className="w-full p-8 text-center bg-background">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => loadConversations()} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <DashboardHeader />

      {/* NavBar */}
      <DashboardNavBar />

      {/* Main Content */}
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                  <Bot className="w-8 h-8 text-accent" />
                  AI Chatbot - Sessions
                </h1>
                <p className="text-muted-foreground">Manage chatbot conversation sessions</p>
              </div>

            </div>
          </div>

          <div className="space-y-6">
            <div className="w-full space-y-6 bg-background text-foreground min-h-[400px]">
              <div className="bg-white dark:bg-card shadow rounded-xl text-foreground">
                <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
                  <div className="flex-1 w-full sm:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="🔍 Search: Session ID, Name, Email"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-48">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter: Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="manual">Manual Reply</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => loadConversations()} variant="outline" disabled={isLoading}>
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-background">
                  <div className="rounded-md border bg-background">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Session ID</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Started</TableHead>
                          <TableHead>IP Address</TableHead>
                          <TableHead>Collected Data</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading && conversations.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground bg-background">
                              <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2" />
                              Loading conversations...
                            </TableCell>
                          </TableRow>
                        ) : filteredConversations.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground bg-background">
                              {searchQuery || statusFilter !== "all"
                                ? "No conversations match your filters"
                                : "No chatbot conversations yet. Start chatting with the AI widget to see conversations here."}
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredConversations.map((conv) => (
                            <TableRow key={conv.id}>
                              <TableCell className="font-mono text-sm">
                                {conv.session_id ? `${conv.session_id.substring(0, 8)}...` : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-medium">
                                    {conv.user_name || "Anonymous"}
                                  </div>
                                  {conv.user_email && (
                                    <div className="text-sm text-muted-foreground">
                                      {conv.user_email}
                                    </div>
                                  )}
                                  {conv.user_phone && (
                                    <div className="text-sm text-muted-foreground">
                                      {conv.user_phone}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={getStatusBadgeVariant(conv.status)}>
                                  {conv.status === 'manual'
                                    ? 'Manual Reply'
                                    : conv.status === 'active'
                                      ? 'Active'
                                      : conv.status === 'completed'
                                        ? 'Completed'
                                        : conv.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {conv.started_at
                                  ? `${new Date(conv.started_at).toLocaleDateString()} ${new Date(conv.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                  : 'N/A'}
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {conv.ip_address || "N/A"}
                              </TableCell>
                              <TableCell className="max-w-xs">
                                <div className="text-sm truncate" title={formatCollectedData(conv.collected_data)}>
                                  {formatCollectedData(conv.collected_data)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewConversation(conv)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleDeleteConversation(conv.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}

                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {conversations.length} of {totalCount} sessions
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => prevPage && loadConversations(prevPage)}
                        disabled={!prevPage || isLoading}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <div className="text-sm font-medium">
                        Page {currentPage}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => nextPage && loadConversations(nextPage)}
                        disabled={!nextPage || isLoading}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Conversation View Modal - Beautiful Redesign */}
      < Dialog open={showConversationModal} onOpenChange={handleModalClose} >
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
          {selectedConversation && (
            <>
              {/* Header */}
              <div className="px-6 py-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-xl font-semibold">Conversation</DialogTitle>
                    <DialogDescription className="mt-1">
                      Session: <span className="font-mono text-xs">{selectedConversation.session_id.substring(0, 12)}...</span> •
                      <Badge variant={getStatusBadgeVariant(selectedConversation.status)} className="ml-2">
                        {selectedConversation.status === 'manual'
                          ? 'Manual Reply'
                          : selectedConversation.status === 'active'
                            ? 'Active'
                            : 'Completed'}
                      </Badge>
                    </DialogDescription>
                  </div>
                  {selectedConversation.status === 'active' && (
                    <Button
                      variant={selectedConversation.manual_reply_active ? "default" : "outline"}
                      size="sm"
                      onClick={handleToggleManualReply}
                      className="flex items-center gap-2"
                    >
                      <Settings2 className="w-4 h-4" />
                      {selectedConversation.manual_reply_active ? "Manual Mode" : "Auto Mode"}
                    </Button>
                  )}
                </div>
              </div>

              {/* User Info Bar */}
              <div className="px-6 py-3 border-b bg-muted/30">
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>{" "}
                    <span className="font-medium">{selectedConversation.user_name || "Anonymous"}</span>
                  </div>
                  {selectedConversation.user_email && (
                    <div>
                      <span className="text-muted-foreground">Email:</span>{" "}
                      <span className="font-medium">{selectedConversation.user_email}</span>
                    </div>
                  )}
                  {selectedConversation.user_phone && (
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      <span className="font-medium">{selectedConversation.user_phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gradient-to-b from-background to-muted/20">
                {!selectedConversation?.messages || selectedConversation.messages?.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No messages yet
                  </div>
                ) : (
                  (selectedConversation.messages || []).map((msg) => {
                    const isUser = msg.message_type === 'user';
                    const isAdmin = msg.message_type === 'admin' || msg.is_admin_reply;
                    const isAssistant = msg.message_type === 'assistant' && !isAdmin;

                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${isUser ? 'justify-start' : 'justify-end'}`}
                      >
                        {isUser && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-start' : 'items-end'}`}>
                          <div
                            className={`rounded-2xl px-4 py-2.5 ${isUser
                              ? 'bg-primary text-primary-foreground rounded-tl-sm'
                              : isAdmin
                                ? 'bg-accent text-accent-foreground rounded-tr-sm'
                                : 'bg-muted text-foreground rounded-tr-sm'
                              }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-1 px-1">
                            <span className="text-xs text-muted-foreground">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isAssistant && msg.response_time_ms && (
                              <span className="text-xs text-muted-foreground">
                                • {msg.response_time_ms}ms
                              </span>
                            )}
                          </div>
                        </div>
                        {!isUser && (
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${isAdmin
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted text-muted-foreground'
                            }`}>
                            {isAdmin ? 'A' : <Bot className="w-4 h-4" />}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input Area - Always Visible */}
              {selectedConversation.status === 'active' && (
                <div className="px-6 py-4 border-t bg-background">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 relative">
                      <Textarea
                        placeholder={
                          selectedConversation.manual_reply_active
                            ? "Type your reply as admin..."
                            : "Auto mode - Chatbot will respond automatically"
                        }
                        value={manualReplyMessage}
                        onChange={(e) => setManualReplyMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey && selectedConversation.manual_reply_active) {
                            e.preventDefault();
                            handleSendManualReply();
                          }
                        }}
                        disabled={!selectedConversation.manual_reply_active}
                        rows={2}
                        className="resize-none pr-12"
                      />
                      {selectedConversation.manual_reply_active && (
                        <div className="absolute right-2 bottom-2 text-xs text-muted-foreground">
                          Press Enter to send
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handleSendManualReply}
                      disabled={!selectedConversation.manual_reply_active || !manualReplyMessage.trim() || isManualReplyLoading}
                      size="icon"
                      className="h-10 w-10"
                    >
                      {isManualReplyLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {!selectedConversation.manual_reply_active && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Switch to Manual Mode to reply as admin
                    </p>
                  )}
                </div>
              )}

              {/* Footer Info */}
              {selectedConversation.status === 'completed' && (
                <div className="px-6 py-3 border-t bg-muted/30 text-center text-sm text-muted-foreground">
                  This conversation has been completed
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog >
    </div >
  );
};

export default ChatbotSessions;

