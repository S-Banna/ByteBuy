// app/buyer/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";

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
            } else {
                const data = await res.json();
                setLoginError(data.error ?? "Invalid credentials");
            }
        } catch {
            setLoginError("Network error");
        }
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

        const nextMessages: ChatMessage[] = [
            ...messages,
            { role: "user", text: userText }
        ];
        setMessages(nextMessages);
        setTextboxValue("");
        setShowMain(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: userText,
                    history,    // send entire chat history: TB replaced with summaries
                }),
            });

            const data = await res.json();

            const reply = data.reply;
            setMessages((prev) => [...prev, { role: "bot", text: reply }]);
            setHistory((prev) => [
                ...prev,
                { role: "user", content: userText },
                { role: "assistant", content: reply }
            ]);
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
                        <span className={styles.invSpan}>
                            User Chat History
                        </span>
                    </p>
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
                                {msg.text}
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
                            placeholder="Email (admin)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            className={styles.popupInput}
                        />

                        <input
                            type="password"
                            placeholder="Password (admin)"
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