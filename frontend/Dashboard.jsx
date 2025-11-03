import React, { useState, useEffect } from "react";
import HomeTab from "./HomeTab.jsx";
import DynamicAnalysisTab from "./DynamicAnalysisTab.jsx";
import StoreRankingTab from "./StoreRankingTab.jsx";

const METADATA_URL = "http://localhost:8000/api/v1/metadata/filters";

// Abas do dashboard
const TABS = [
  { key: "home", label: "1. Visão Geral" },
  { key: "store", label: "2. Análise Dinâmica" },
  { key: "ranking", label: "3. Ranking Geral" },
];

/*
 * - Faz o fetch inicial dos metadados (lojas e canais)
 * - Gerencia as abas e passa os metadados para os componentes filhos
*/
const Dashboard = () => {
  // Estado de controle de abas
  const [activeTab, setActiveTab] = useState("home");

  const [metadata, setMetadata] = useState({ stores: [], channels: [] });

  // Carrega metadados apenas uma vez ao montar o componente
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(METADATA_URL);
        if (!response.ok) throw new Error("Falha ao buscar metadados.");

        const data = await response.json();
        setMetadata(data); // ✅ Corrigido
      } catch (error) {
        console.error("Erro ao carregar metadados:", error);
      }
    };

    fetchMetadata();
  }, []);

  // Define qual aba será renderizada
  const renderTabContent = () => {
    const tabProps = { metadata };

    switch (activeTab) {
      case "home":
        return <HomeTab {...tabProps} />;
      case "store":
        return <DynamicAnalysisTab {...tabProps} />;
      case "ranking":
        return <StoreRankingTab {...tabProps} />;
      default:
        return <div>Selecione uma aba válida para começar a análise.</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <h1>🏆 Analytics: Visão Operacional da Maria</h1>

      {/* Navegação entre as abas */}
      <div className="tab-navigation">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`btn-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba ativa */}
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default Dashboard;
