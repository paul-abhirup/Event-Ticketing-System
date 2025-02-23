class WebSocketService {
  private socket: WebSocket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  connect() {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    this.socket = new WebSocket(`${import.meta.env.VITE_WS_URL}`);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'newBid') {
        const listeners = this.listeners.get(`bid:${data.tokenId}`);
        listeners?.forEach(listener => listener(data));
      }
    };

    this.socket.onclose = () => {
      setTimeout(() => this.connect(), 1000); // Reconnect after 1 second
    };
  }

  subscribeToBids(tokenId: number, callback: (data: any) => void) {
    const key = `bid:${tokenId}`;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)?.add(callback);

    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'subscribe',
        event: 'bids',
        tokenId
      }));
    }
  }

  unsubscribeFromBids(tokenId: number, callback: (data: any) => void) {
    const key = `bid:${tokenId}`;
    this.listeners.get(key)?.delete(callback);
    if (this.listeners.get(key)?.size === 0) {
      this.listeners.delete(key);
    }
  }
}

export const wsService = new WebSocketService(); 