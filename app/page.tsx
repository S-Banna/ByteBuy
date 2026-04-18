// app/buyer/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
    role: "user" | "bot";
    text: string;
}

export default function Page() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    const [currentChatId, setCurrentChatId] = useState<number | null>(null);
    const [chats, setChats] = useState<{id: number, title: string}[]>([]);

    const [iconState, setIconState] = useState("send");
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const [showMain, setShowMain] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [textboxValue, setTextboxValue] = useState("");
    const [history, setHistory] = useState<{role: "user"|"assistant", content: string}[]>([]);

    const imgSrc =
        iconState === "loading"
            ? `images/loading_${theme}.gif`
            : `images/send_${theme}.svg`;

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch("/api/auth/me")
            .then((res) => res.ok ? res.json() : null)
            .then((data) => {
                if (data?.id) {
                    setIsLoggedIn(true);
                    setShowLoginPopup(false);
                    loadChats();
                }
            })
            .catch(() => {});
    }, []);

    const handleLogin = async () => {
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (res.ok) {
                setIsLoggedIn(true);
                setShowLoginPopup(false);
                setLoginError("");
                loadChats();
                return;
            }

            // login failed — try to create account with same credentials
            const signupRes = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (signupRes.ok) {
                setIsLoggedIn(true);
                setShowLoginPopup(false);
                setLoginError("");
            } else {
                // signup also failed — email exists but wrong password
                const data = await res.json();
                setLoginError(data.error ?? "Invalid credentials");
            }

        } catch {
            setLoginError("Network error");
        }
    };

    const loadChats = async () => {
        const res = await fetch("/api/chats");
        if (res.ok) {
            const data = await res.json();
            setChats(data);
        }
    };

    const loadChat = async (chatId: number) => {
        const res = await fetch(`/api/messages?chatId=${chatId}`);
        if (!res.ok) return;
        const data = await res.json();

        const loaded: ChatMessage[] = data.map((m: any) => ({
            role: m.role === "user" ? "user" : "bot",
            text: m.content
        }));
        const loadedHistory = data.map((m: any) => ({
            role: m.role as "user" | "assistant",
            content: m.content
        }));

        setMessages(loaded);
        setHistory(loadedHistory);
        setCurrentChatId(chatId);
        setShowMain(true);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    function toggleTheme() {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }


    async function clearMain() {
        // for now, user must be logged in to use the site
        // later will add access to allow one message (no chat history or follow ups unless logged in)
        if (!isLoggedIn) { setShowLoginPopup(true); return; }


        if (textboxValue.trim() === "") return;
        if (iconState === "loading") return;

        setIconState("loading");
        const userText = textboxValue;
        setMessages((prev) => [...prev, { role: "user", text: userText }]);
        setTextboxValue("");
        setShowMain(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userText, history }),
            });

            if (!res.body) throw new Error("No response body");

            // add an empty bot message we'll fill in token by token
            setMessages((prev) => [...prev, { role: "bot", text: "" }]);

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let fullReply = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const token = decoder.decode(value, { stream: true });
                fullReply += token;

                // update the last message (the bot one) in place
                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: "bot", text: fullReply };
                    return updated;
                });
            }

            // only update history once the full reply is done
            setHistory((prev) => [
                ...prev,
                { role: "user", content: userText },
                { role: "assistant", content: fullReply }
            ]);

            let chatId = currentChatId;
            if (!chatId) {
                const title = userText.slice(0, 28) + (userText.length > 28 ? "..." : "");
                const chatRes = await fetch("/api/chats", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title })
                });
                const chat = await chatRes.json();
                chatId = chat.id;
                setCurrentChatId(chatId);
                setChats((prev) => [chat, ...prev]);
            }
            await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chatId, content: userText, role: "user" })
            });
            await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chatId, content: fullReply, role: "assistant" })
            });

            setIconState("send");

        } catch (error) {
            console.error("Error sending message:", error);
            setIconState("send");
        }
    }

    return (
        <>
            <style>{`
                body { margin: 0; font-family: sans-serif; background-color: ${theme === "dark" ? "rgb(33,33,33)" : "rgb(255,255,255)"}; }
                ::-webkit-scrollbar { display: none; }
            `}</style>

            <div className={`${styles.page} ${styles[theme]}`}>
                <div className={styles.side}>
                    <p className={styles.inv}>
                        <span className={styles.invSpan}>Chat History</span>
                    </p>
                    {chats.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => loadChat(chat.id)}
                            className={`${styles.chatHistoryBtn} ${currentChatId === chat.id ? styles.chatHistoryBtnActive : ""}`}
                        >
                            {chat.title}
                        </button>
                    ))}
                </div>

                <div className={styles.main}>
                    <div className={styles.darkmode}>
                        <p className={styles.ByteBuy}>
                            <a className={styles.link} href="">
                                ByteBuy
                            </a>
                        </p>
                        <button className={styles.themeBtn} onClick={toggleTheme}>
                            ⏾/☀︎
                        </button>
                    </div>
                    <br />

                    {!showMain && (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                id="light"
                                src="images/icon-light.png"
                                alt="icon"
                                style={{ display: theme === "light" ? "block" : "none", width: 100, margin: "auto" }}
                            />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                id="dark"
                                src="images/icon-dark.png"
                                alt="icon"
                                style={{ display: theme === "dark" ? "block" : "none", width: 100, margin: "auto" }}
                            />
                            <p className={styles.logotext}>
                                What would you like to buy?
                            </p>
                        </>
                    )}

                    <div className={styles.chatArea}>
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={msg.role === "user" ? styles.messageUser : styles.messageBot}>
                                {msg.role === "bot"
                                    ? <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    : msg.text
                                }
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className={styles.text}>
                    <input
                        placeholder="Ask anything..."
                        id="textbox"
                        className={styles.textbox}
                        value={textboxValue}
                        onChange={(e) => setTextboxValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") clearMain(); }}
                    />
                    <div className={styles.send}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            onClick={clearMain}
                            className={styles.send_dark}
                            src={imgSrc}
                            alt="send"
                            style={{ display: theme === "dark" ? "block" : "none" }}
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            onClick={clearMain}
                            className={styles.send_light}
                            src={imgSrc}
                            alt="send"
                            style={{ display: theme === "light" ? "block" : "none" }}
                        />
                    </div>
                </div>
            </div>

            {/* Login button — only visible when not logged in and popup is closed */}
            {!isLoggedIn && !showLoginPopup && (
                <button
                    className={`${styles.loginBtn} ${styles[theme]}`}
                    onClick={() => setShowLoginPopup(true)}
                >
                    Login
                </button>
            )}
            {isLoggedIn && (
                <div className={`${styles.loginBtn} ${styles[theme]}`}>
                    Signed in
                </div>
            )}

            {/* Login popup */}
            {showLoginPopup && (
                <div className={styles.popupOverlay}>
                    <div className={`${styles.popupBox} ${styles[theme]}`}>

                        <button
                            className={styles.popupClose}
                            onClick={() => setShowLoginPopup(false)}
                        >
                            ✕
                        </button>

                        <h2 className={styles.popupTitle}>Sign in to ByteBuy</h2>

                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            className={styles.popupInput}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            className={styles.popupInput}
                        />

                        {loginError && (
                            <div className={styles.loginError}>
                                {loginError}
                            </div>
                        )}

                        <button className={styles.signInBtn} onClick={handleLogin}>
                            Sign In
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}