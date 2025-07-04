import React, { useState } from "react";

export default function AuctionChecker() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("https://api.hyperliquid.xyz/info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "spotDeployState",
          token: token.toUpperCase(),
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Ошибка запроса. Проверь соединение или тикер." });
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>Hyperliquid: Цена Аукциона</h1>
      <input
        placeholder="Введите тикер токена (например, SOLV)"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />
      <button onClick={handleCheck} disabled={loading || !token} style={{ padding: 10 }}>
        {loading ? "Загрузка..." : "Проверить"}
      </button>

      {result && (
        <div style={{ marginTop: 20, background: "#f9f9f9", padding: 15 }}>
          {result.error ? (
            <p style={{ color: "red" }}>{result.error}</p>
          ) : result.states && result.states.length > 0 ? (
            <div>
              <p><strong>Токен:</strong> {token.toUpperCase()}</p>
              <p><strong>Дата аукциона:</strong> {new Date(result.states[0].gasAuction.startTimeSeconds * 1000).toLocaleString()}</p>
              <p><strong>Начальная ставка (HYPE):</strong> {result.states[0].gasAuction.startGas}</p>
              <p><strong>Победная ставка (HYPE):</strong> {result.states[0].gasAuction.endGas}</p>
            </div>
          ) : (
            <p style={{ color: "#666" }}>Нет данных по аукциону для этого токена.</p>
          )}
        </div>
      )}
    </div>
  );
}
