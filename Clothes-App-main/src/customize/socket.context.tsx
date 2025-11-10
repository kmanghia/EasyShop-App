import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { AppConfig } from "@/src/common/config/app.config";
import { WebSocketNotificationType } from "@/src/common/resource/websocket";
import { Subject, Observable } from "rxjs";
import { useSelector } from "react-redux";
import { RootState } from "../data/types/global";
import { UserStoreState } from "../data/store/reducers/user/user.reducer";

interface WebSocketContextType {
    subscribe: () => Observable<any>;
    sendMessage: (message: any) => void;
    lastCheckedShopId: number | null;
    setLastCheckedShopId: (shopId: number | null) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const wsRef = useRef<WebSocket | null>(null);
    const isConnecting = useRef(false);
    const [lastCheckedShopId, setLastCheckedShopId] = useState<number | null>(null);
    const messageSubject = useRef(new Subject<any>());
    const userSelector: UserStoreState = useSelector((state: RootState) => state.userLogged);

    const reconnect = () => {
        if (!userSelector.isLogged || isConnecting.current || (wsRef.current && wsRef.current.readyState === WebSocket.OPEN)) return;
        isConnecting.current = true;
        const domain = new AppConfig().getDomain();
        const hostMatch = domain.match(/https?:\/\/([^:/]+)/);
        const host = hostMatch ? hostMatch[1] : "localhost";
        const wsUrl = `ws://${host}:3001`; // Kiểm tra URL này với backend
        console.log("Kết nối WebSocket tới:", wsUrl);

        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
            isConnecting.current = false;
            console.log("WebSocket kết nối thành công, đăng ký userId:", userSelector.id);
            if (wsRef.current && userSelector.isLogged) {
                wsRef.current.send(JSON.stringify({
                    type: WebSocketNotificationType.REGISTER,
                    userId: userSelector.id
                }));
            }
        };

        wsRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("WebSocket nhận dữ liệu:", data.type);
                messageSubject.current.next(data);
            } catch (error) {
                console.error("Lỗi phân tích dữ liệu:", error);
            }
        };

        wsRef.current.onerror = (error) => {
            console.error("Lỗi WebSocket:", error);
            isConnecting.current = false;
        };

        wsRef.current.onclose = () => {
            console.log("WebSocket đóng, thử kết nối lại...");
            wsRef.current = null;
            isConnecting.current = false;
            if (userSelector.isLogged) {
                console.log('Tái kích hoạt WebSocket nếu còn login');
                setTimeout(reconnect, 2000);
            }
        };
    };

    useEffect(() => {
        reconnect();
        return () => {
            console.log("Ngắt kết nối WebSocket...");
            if (wsRef.current) {
                wsRef.current = null;
            }
        };
    }, [userSelector.id]);

    const subscribe = () => {
        return messageSubject.current.asObservable();
    };

    const sendMessage = (message: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            console.log("Gửi thông báo:", message);
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.log("WebSocket chưa sẵn sàng, không gửi được:", message);
            reconnect(); // Thử kết nối lại nếu WebSocket không sẵn sàng
        }
    };

    return (
        <WebSocketContext.Provider value={{ subscribe, sendMessage, lastCheckedShopId, setLastCheckedShopId }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket phải được dùng trong WebSocketProvider");
    }
    return context;
};