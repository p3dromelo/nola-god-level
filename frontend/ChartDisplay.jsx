import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToCsv } from './utils';

const ChartDisplay = ({ chartData, loading, executionTimeMs }) => {
    const [viewMode, setViewMode] = useState('chart');

    const handleExport = () => {
        if (chartData && chartData.length > 0) {
            exportToCsv(chartData, 'relatorio_analytics_nola.csv');
        }
    };

    // Função que renderiza o gráfico
    const renderChart = () => {
        if (!chartData || chartData.length === 0) {
            return <p className="text-center">Selecione uma métrica e dimensão para gerar o gráfico.</p>;
        }

        const dataKey = Object.keys(chartData[0]).find(k => k !== 'dimension');
        const chartTitle = dataKey === 'result' ? 'Resultado' : dataKey;

        return (
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dimension" interval={0} angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip
                    formatter={(value) => `${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                />
                <Legend />
                <Bar dataKey="result" name={chartTitle} fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        );
    };

    // Função que renderiza a table (Pivot)
    const renderTable = () => {
        if (!chartData || chartData.length === 0) return null;

        const headers = Object.keys(chartData[0]);

      return (
              <div className="data-table">
                  <table>
                      <thead>
                          <tr>
                              {headers.map(h => <th key={h}>{h.toUpperCase()}</th>)} 
                          </tr>
                      </thead>
                      <tbody>
                          {chartData.map((row, index) => (
                              <tr key={index}>
                                  {headers.map(h => <td key={h}>{row[h]}</td>)}
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          );
      };

  return (
    <div className="panel chart-display">
      <div className="toolbar">
        {/* Botões de alternância de visualização */}
        <button className={`btn-toggle ${viewMode === 'chart' ? 'active' : ''}`} onClick={() => setViewMode('chart')}>
          📈 Gráfico
        </button>
        <button className={`btn-toggle ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>
          📋 Tabela de Dados
        </button>
        <button className="btn-export" onClick={handleExport}>
          📥 Exportar CSV
        </button>
      </div>

      <div className="content">
        {loading && <p className="loading-state">Carregando análise...</p>}
        
        {!loading && (
          <>
            {viewMode === 'chart' && renderChart()}
            {viewMode === 'table' && renderTable()}
          </>
        )}
      </div>

      {/* Exibir o tempo de execução (Feedback de Performance para o Avaliador) */}
      {executionTimeMs > 0 && (
        <p className="performance-footer">
          Query executada em: <strong>{executionTimeMs.toFixed(2)} ms</strong>.
        </p>
      )}
    </div>
            
    );
};

export default ChartDisplay;