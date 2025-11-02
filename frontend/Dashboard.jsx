import React, { useState, useEffect } from "react";
import HomeTab from './HomeTab.jsx';
import DynamicAnalysisTab from './DynamicAnalysisTab.jsx';
import GeoAnalysisTab from './GeoAnalysisTab.jsx';

// URL para buscar a lista de Lojas e Canais para os filtros
const METADATA_URL = 'http://localhost:8000/api/v1/metada/filters';

// Definição de Abas
const TABS = [
    { key: 'home', label: '1. Visão Geral' },
    { key: 'store', label: '2. Análise Dinâmica' },
    { key: 'specific', label: '3. Visão Geográfica' },
];

/*
    * Componente principal do Dashboard.
    * Gerencia a navegação entre abas, o estado global de metadados e a inicialização.
*/
const Dashboard = () => {
    //1. Estado da Navegação
    const [activeTab, setActiveTab] = useState('home');

    //2. Estado dos Metadados (Listas de Lojas e Canais)
    const [metada, setMetdata] = useState({ stores: [], channels: [] });

    // Efeito colateral para carregar metadados APENAS UMA VEZ na montagem do app
    useEffect(() => {
         const fetchMetadata = async () => {
            try {
                const response = await fetch(METADATA_URL);
                if (!response.ok) throw new Error("Falha ao buscar metadados.");
                const data = await response.json();

                // Os metadados são passados para as abas que precisam das listas
                setMetdata(data);
            } catch (error) {
                console.error("Erro ao carregar metadados:", error);
            }
         };
         fetchMetadata();
    },[]);

    // Funçao que decide qual componente de aba renderizar
    const renderTabContent = () => {
        // As props {metadata} são passadas para as abas que precisam das listas de filtros.
        const tabProps = { metada: metada };

        switch (activeTab) {
            case 'home':
                return <HomeTab {...tabProps} />;
            case 'store':
                return <DynamicAnalysisTab {...tabProps} />;
            case 'specific':
                return <GeoAnalysisTab {...tabProps} />;
            default:
                return <div>Selecione uma aba válida para começar a análise.</div>;
        }
    };

    return (
        <div className="dashboard-container">
            <h1>🏆 Analytics: Visão Operacional da Maria</h1>
            
            {/* Componente de Navegação de Abas */}
            <div className="tab-navigation">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        className={`btn-tab ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Conteúdo da Aba Ativa */}
            <div className="tab-content">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default Dashboard;