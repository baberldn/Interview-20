import React, { useState } from "react";
import axios from "axios";

// Para birimi kodlarını içeren sabit liste
const CURRENCY_NAME_TO_CODE = {
  "United States Dollar": "USD",
  "Euro": "EUR",
  "British Pound Sterling": "GBP",
  "Turkish Lira": "TRY",
  // Diğer para birimlerini buraya ekleyebilirsiniz
};

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("TRY");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState("");

  // Döviz kuru verisini almak için API çağrısı yapıyoruz
  const convertCurrency = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError("Lütfen geçerli bir tutar girin.");
      return;
    }

    setError(""); // Hata mesajını temizle

    try {
      // API'ye istek atıyoruz
      const response = await axios.get(
        `https://api.exchangerate.host/latest?base=${fromCurrency}`
      );
      const rates = response.data.rates;

      // Hedef para birimine dönüştürme
      const rate = rates[toCurrency];
      if (rate) {
        const result = (amount * rate).toFixed(2);
        setConvertedAmount(result);
      } else {
        setError("Döviz kuru verisi alınamadı.");
      }
    } catch (err) {
      setError("API çağrısında bir hata oluştu.");
      console.error("API Hatası:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Döviz Çevirici</h1>

      <div className="mb-4">
        <label className="block text-gray-700">Miktar</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mt-2 p-2 border border-gray-300 rounded"
          placeholder="Miktar girin"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Başlangıç Para Birimi</label>
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="w-full mt-2 p-2 border border-gray-300 rounded"
        >
          {Object.keys(CURRENCY_NAME_TO_CODE).map((currency) => (
            <option key={currency} value={CURRENCY_NAME_TO_CODE[currency]}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Hedef Para Birimi</label>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="w-full mt-2 p-2 border border-gray-300 rounded"
        >
          {Object.keys(CURRENCY_NAME_TO_CODE).map((currency) => (
            <option key={currency} value={CURRENCY_NAME_TO_CODE[currency]}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={convertCurrency}
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Çevir
      </button>

      {convertedAmount && (
        <div className="mt-4 text-xl font-semibold">
          {amount} {fromCurrency} = {convertedAmount} {toCurrency}
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-500">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

function App() {
  return <CurrencyConverter />;
}

export default App;
