"use client";
import React, { useState, useRef, useEffect } from "react";

const App = () => {
  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const nameInputRef = useRef(null);
  const transactionsRef = useRef(null);

  useEffect(() => {
    if (showTransactions && transactionsRef.current) {
      transactionsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showTransactions]);

  const addParticipant = () => {
    if (!name.trim()) return;
    setParticipants([...participants, { name, paid: amount ? parseFloat(amount) : 0 }]);
    setName("");
    setAmount("");
    nameInputRef.current?.focus();
  };

  const removeParticipant = (index) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const calculateSplit = () => {
    if (participants.length === 0) {
      alert("No participants added!");
      return;
    }
    const totalPaid = participants.reduce((sum, p) => sum + p.paid, 0);
    const equalShare = totalPaid / participants.length;
    let creditors = [], debtors = [];
    participants.forEach((p) => {
      const balance = p.paid - equalShare;
      if (balance > 0) creditors.push({ name: p.name, balance });
      if (balance < 0) debtors.push({ name: p.name, balance: -balance });
    });
    let newTransactions = [];
    while (creditors.length > 0 && debtors.length > 0) {
      let creditor = creditors[0];
      let debtor = debtors[0];
      let amount = Math.min(creditor.balance, debtor.balance);
      newTransactions.push({ from: debtor.name, to: creditor.name, amount });
      creditor.balance -= amount;
      debtor.balance -= amount;
      if (creditor.balance === 0) creditors.shift();
      if (debtor.balance === 0) debtors.shift();
    }
    setTransactions(newTransactions);
    setShowTransactions(true);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex flex-col items-center justify-start px-5 font-sans overflow-hidden">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-10 mt-10">
        <div className={`transition-transform duration-700 ${showTransactions ? 'md:-translate-x-10 opacity-100' : 'translate-x-0 opacity-100'} w-full md:w-1/2` }>
          <h1 className="text-4xl font-bold text-white mb-8 shadow-md text-center">Splitwise - Equal Expense Split</h1>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 text-white shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">Add Participants:</h2>
            <div className="flex flex-col gap-4">
              <input ref={nameInputRef} type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50" />
              <input type="number" placeholder="Amount Paid" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-3 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50" />
              <button onClick={addParticipant} className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition">Add</button>
            </div>
          </div>
          {participants.length > 0 && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 text-white shadow-lg mt-6">
              <h2 className="text-2xl font-semibold mb-4 text-center">Participants</h2>
              <ul className="space-y-2">
                {participants.map((p, index) => (
                  <li key={index} className="flex justify-between items-center bg-white/20 p-3 rounded-md">
                    {p.name}: AED {p.paid.toFixed(2)}
                    <button onClick={() => removeParticipant(index)} className="text-red-400 hover:text-red-500">✖</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-center mt-6">
            <button onClick={calculateSplit} className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-md transition">Calculate Split</button>
          </div>
        </div>
        {transactions.length > 0 && (
          <div ref={transactionsRef} className={`transition-transform duration-700 ${showTransactions ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'} w-full md:w-1/2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 text-white shadow-lg mt-10 md:mt-0` }>
            <h2 className="text-2xl font-semibold mb-4 text-center">Who Pays Whom</h2>
            <ul className="space-y-2">
              {transactions.map((t, index) => (
                <li key={index} className="flex justify-between items-center bg-white/20 p-3 rounded-md">
                  {t.from} pays {t.to} AED {t.amount.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
