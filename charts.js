// Gauge Chart
const setupGaugeChart = () => {
  const ctx = document.getElementById('gauge-chart').getContext('2d');
  
  const gaugeChartConfiguration = {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [20, 20, 20, 20, 20, 75], // Last value is the needle position (75 = "Excelente")
        backgroundColor: [
          '#dc2626', // Vermelho - Ruim
          '#f59e0b', // Laranja - Regular
          '#10b981', // Verde claro - Bom
          '#059669', // Verde escuro - Muito Bom
          '#2563eb', // Azul - Excelente
          'rgba(0, 0, 0, 0)' // Transparent for needle space
        ],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
      }],
      labels: ['Ruim', 'Regular', 'Bom', 'Muito Bom', 'Excelente']
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            generateLabels: (chart) => {
              const labels = chart.data.labels;
              const colors = chart.data.datasets[0].backgroundColor;
              return labels.map((label, i) => ({
                text: label,
                fillStyle: colors[i],
                strokeStyle: colors[i],
                lineWidth: 0,
                hidden: false,
                index: i
              })).slice(0, 5); // Only show the 5 categories, not the needle
            }
          }
        },
        tooltip: {
          enabled: false
        }
      },
      layout: {
        padding: {
          top: 20
        }
      }
    }
  };

  // Create gauge chart
  const gaugeChart = new Chart(ctx, gaugeChartConfiguration);

  // Add needle indicator
  const addNeedle = () => {
    const needleValue = 75; // Position for "Excelente"
    const dataTotal = gaugeChartConfiguration.data.datasets[0].data.reduce((a, b) => a + b, 0);
    const angle = Math.PI * (1 - (needleValue / dataTotal));
    const ctx = gaugeChart.ctx;
    const cw = ctx.canvas.offsetWidth;
    const ch = ctx.canvas.offsetHeight;
    const cx = cw / 2;
    const cy = ch - (ch / 4);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // Draw needle
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(ch / 2, 0);
    ctx.lineTo(0, 2);
    ctx.fillStyle = '#475569';
    ctx.fill();

    // Draw needle center point
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#475569';
    ctx.fill();

    ctx.restore();

    // Add current value text
    ctx.save();
    ctx.translate(cx, cy);
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#475569';
    ctx.textAlign = 'center';
    ctx.fillText('Excelente', 0, 20);
    ctx.font = '16px Arial';
    ctx.fillText('Credit Score: A', 0, 45);
    ctx.restore();
  };

  // Call addNeedle after chart render
  gaugeChart.options.animation = {
    onComplete: () => {
      addNeedle();
    }
  };
};

// Margin Evolution Chart
const setupMarginChart = () => {
  const ctx = document.getElementById('margin-chart').getContext('2d');
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [{
        label: 'Margem de Endividamento',
        data: [30, 35, 33, 38, 40, 42],
        borderColor: '#2563eb',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
};

// Updated Indicators Chart
const setupIndicatorsChart = () => {
  const ctx = document.getElementById('indicators-chart').getContext('2d');
  
  // Create container for indicators
  const container = document.createElement('div');
  container.className = 'indicators-container';
  ctx.canvas.parentNode.appendChild(container);
  
  // Create indicator cards
  const indicators = [
    {
      title: 'TIR',
      value: '31.6%',
      subtitle: 'Taxa Interna de Retorno',
      color: '#2563eb',
      icon: 'chart-line'
    },
    {
      title: 'VPL',
      value: 'R$ 102,384',
      subtitle: 'Valor Presente Líquido',
      color: '#10b981',
      icon: 'money-bill-trend-up'
    },
    {
      title: 'Payback',
      value: '3.5 Anos',
      subtitle: 'Tempo de Retorno',
      color: '#f59e0b',
      icon: 'clock'
    },
    {
      title: 'Média ICSD',
      value: '4.78',
      subtitle: 'Índice de Cobertura do Serviço da Dívida',
      color: '#8b5cf6',
      icon: 'chart-pie'
    }
  ];

  // Create and append indicator cards
  indicators.forEach(indicator => {
    const card = document.createElement('div');
    card.className = 'indicator-card';
    card.style.borderColor = indicator.color;
    
    card.innerHTML = `
      <div class="indicator-icon" style="background: ${indicator.color}">
        <i class="fas fa-${indicator.icon}"></i>
      </div>
      <div class="indicator-content">
        <div class="indicator-title">${indicator.title}</div>
        <div class="indicator-value" style="color: ${indicator.color}">${indicator.value}</div>
        <div class="indicator-subtitle">${indicator.subtitle}</div>
      </div>
    `;
    
    container.appendChild(card);
  });

  // Hide original canvas since we're using custom indicators
  ctx.canvas.style.display = 'none';
};

// Financial Evolution Charts
const setupFinancialCharts = () => {
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Get data from financial table
  const getData = (rowDescription) => {
    const row = financialData.find(r => r.description === rowDescription);
    return row ? row.values.filter((_, i) => i >= 3) : [];
  };

  const years = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // Revenue Chart - Updated with new style
  const revenueCtx = document.getElementById('revenue-chart').getContext('2d');
  new Chart(revenueCtx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: 'Receitas',
        data: getData('Faturamento - ROL'),
        borderColor: '#2563eb',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      ...commonOptions,
      plugins: {
        ...commonOptions.plugins,
        legend: {
          display: true,
          position: 'top'
        }
      }
    }
  });

  // EBIT Chart
  const ebitCtx = document.getElementById('ebit-margin-chart').getContext('2d');
  new Chart(ebitCtx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        data: getData('Ebit'),
        borderColor: '#10b981',
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(16, 185, 129, 0.1)'
      }]
    },
    options: commonOptions
  });

  // Costs Chart
  const cashFlowCtx = document.getElementById('cash-flow-chart').getContext('2d');
  new Chart(cashFlowCtx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        data: getData('% Custos').map(val => parseFloat(val.replace(',', '.').replace('%', ''))),
        borderColor: '#f59e0b',
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(245, 158, 11, 0.1)'
      }]
    },
    options: {
      ...commonOptions,
      scales: {
        ...commonOptions.scales,
        y: {
          ...commonOptions.scales.y,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });

  // Operating Expenses Chart
  const debtCtx = document.getElementById('debt-chart').getContext('2d');
  new Chart(debtCtx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        data: getData('% Despesas Operacionais').map(val => parseFloat(val.replace(',', '.').replace('%', ''))),
        borderColor: '#dc2626',
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(220, 38, 38, 0.1)'
      }]
    },
    options: {
      ...commonOptions,
      scales: {
        ...commonOptions.scales,
        y: {
          ...commonOptions.scales.y,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });

  // ROE Chart (ICSD)
  const roeCtx = document.getElementById('roe-chart').getContext('2d');
  new Chart(roeCtx, {
    type: 'line',
    data: {
      labels: ['Ano 1', 'Ano 2', 'Ano 3', 'Ano 4', 'Ano 5', 'Ano 6', 'Ano 7', 'Ano 8', 'Ano 9', 'Ano 10'],
      datasets: [{
        data: [1.72, 4.89, 2.81, 3.22, 4.66, 5.15, 5.57, 6.04, 6.57, 7.18],
        borderColor: '#8b5cf6',
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(139, 92, 246, 0.1)'
      }]
    },
    options: commonOptions
  });
};

// TIR Chart
const setupTIRChart = () => {
  const ctx = document.getElementById('tir-chart').getContext('2d');
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Ano 0', 'Ano 1', 'Ano 2', 'Ano 3', 'Ano 4', 'Ano 5'],
      datasets: [{
        label: 'Fluxo de Caixa Descontado',
        data: [-100000, 25000, 35000, 45000, 55000, 65000],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: false
          }
        }
      }
    }
  });
};

// VPL Chart
const setupVPLChart = () => {
  const ctx = document.getElementById('vpl-chart').getContext('2d');
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Ano 0', 'Ano 1', 'Ano 2', 'Ano 3', 'Ano 4', 'Ano 5', 'Ano 6', 'Ano 7', 'Ano 8', 'Ano 9', 'Ano 10'],
      datasets: [{
        label: 'Fluxo de Caixa Descontado',
        data: [-60000, 12892, 16373, 19111, 21598, 25059, 29750, 30884, 32037, 33211, 34405],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: false
          }
        }
      }
    }
  });
};

// Payback Chart
const setupPaybackChart = () => {
  const ctx = document.getElementById('payback-chart').getContext('2d');
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Início', 'Ano 1', 'Ano 2', 'Ano 3', 'Ano 4', 'Ano 5', 'Ano 6', 'Ano 7', 'Ano 8', 'Ano 9', 'Ano 10'],
      datasets: [{
        label: 'Saldo Acumulado',
        data: [-60000, -47108, -30735, -11624, 9974, 35033, 64784, 95668, 127705, 160916, 195321],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          grid: {
            display: false
          }
        }
      }
    }
  });
};

// Setup ICSD Chart
const setupICSDChart = () => {
  const ctx = document.getElementById('icsd-chart').getContext('2d');
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Ano 1', 'Ano 2', 'Ano 3', 'Ano 4', 'Ano 5', 'Ano 6', 'Ano 7', 'Ano 8', 'Ano 9', 'Ano 10'],
      datasets: [{
        label: 'ICSD',
        data: [1.72, 4.89, 2.81, 3.22, 4.66, 5.15, 5.57, 6.04, 6.57, 7.18],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: false
          }
        }
      }
    }
  });
};

// New function for debt limit doughnut chart
const setupDebtLimitChart = () => {
  const ctx = document.getElementById('debt-limit-chart').getContext('2d');
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Endividamento Atual', 'Potencial Adicional'],
      datasets: [{
        data: [14, 86],
        backgroundColor: ['#2563eb', '#e5e7eb'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            font: {
              size: 14
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.raw}%`;
            }
          }
        }
      },
      cutout: '70%'
    }
  });
};

// Initialize all charts
document.addEventListener('DOMContentLoaded', () => {
  setupGaugeChart();
  setupMarginChart();
  setupIndicatorsChart();
  setupFinancialCharts();
  setupTIRChart();
  setupVPLChart();
  setupPaybackChart();
  setupICSDChart();
  setupDebtLimitChart();
});