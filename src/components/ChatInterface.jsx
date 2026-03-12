import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

function generateBotReply(text) {
  const lowerText = text.toLowerCase();

  if (lowerText.includes("price") || lowerText.includes("cost")) {
    return "Our products currently range from $19.9 to $79. The Smart Watch is $79, Wireless Headphones are $49.99, Mechanical Keyboard is $59.5, and Desk Lamp is $19.9.";
  }

  if (lowerText.includes("watch")) {
    return "The Smart Watch costs $79. It can track fitness and notifications on the go.";
  }

  if (lowerText.includes("headphone")) {
    return "The Wireless Headphones cost $49.99 and offer comfortable wear, clear sound, and long battery life.";
  }

  if (lowerText.includes("keyboard")) {
    return "The Mechanical Keyboard costs $59.5. It provides tactile feedback, fast typing, and durable switches.";
  }

  if (lowerText.includes("lamp")) {
    return "The Desk Lamp costs $19.9 and has a minimal design with adjustable brightness.";
  }

  if (lowerText.includes("available") || lowerText.includes("stock")) {
    return "All products shown on the home page are currently available in this demo store.";
  }

  if (lowerText.includes("hello") || lowerText.includes("hi")) {
    return "Hello! I am your AI shopping assistant. Ask me about product price, features, or availability.";
  }

  return "I am your AI shopping assistant. You can ask me about product price, features, or availability.";
}

export default function ChatInterface() {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    async function loadMessages() {
      setErrorMsg("");

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setMessages(data || []);
      }
    }

    loadMessages();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`messages-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMessage = payload.new;

          if (newMessage.user_id === user.id) {
            setMessages((prev) => {
              const exists = prev.some((msg) => msg.id === newMessage.id);
              if (exists) return prev;
              return [...prev, newMessage];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function handleSendMessage(e) {
    e.preventDefault();
    setErrorMsg("");

    const trimmed = input.trim();
    if (!trimmed || !user) return;

    try {
      setSending(true);

      const { error: userMessageError } = await supabase.from("messages").insert({
        user_id: user.id,
        content: trimmed,
        sender_type: "user",
      });

      if (userMessageError) throw userMessageError;

      setInput("");
      setTyping(true);

      setTimeout(async () => {
        const botReply = generateBotReply(trimmed);

        const { error: botMessageError } = await supabase.from("messages").insert({
          user_id: user.id,
          content: botReply,
          sender_type: "ai",
        });

        if (botMessageError) {
          setErrorMsg(botMessageError.message);
        }

        setTyping(false);
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to send message.");
      setTyping(false);
    } finally {
      setSending(false);
    }
  }

  return (
    <Card className="min-h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Chat with AI Assistant</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex-1 space-y-3 overflow-y-auto rounded-md border p-4 bg-slate-900">
          {messages.length === 0 && !typing && (
            <p className="text-sm text-slate-400">
              No messages yet. Start chatting with the AI assistant.
            </p>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-4 py-2 text-sm ${
                  message.sender_type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-white"
                }`}
              >
                <div className="mb-1 text-xs opacity-70">
                  {message.sender_type === "user" ? "You" : "AI Bot"}
                </div>
                <div>{message.content}</div>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-lg bg-slate-700 px-4 py-2 text-sm text-white">
                <div className="mb-1 text-xs opacity-70">AI Bot</div>
                <div>Typing...</div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about product price, features, or availability..."
            disabled={sending}
          />
          <Button type="submit" disabled={sending || !input.trim()}>
            {sending ? "Sending..." : "Send"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}