// Financial data structure
const financialData = [
  {
    description: 'Faturamento - ROL',
    values: Array(13).fill(0),
    isHeader: true,
    isBold: true
  },
  {
    description: 'Taxa de Crescimento das Receitas',
    values: Array(13).fill('0,0%'),
    isBlue: true
  },
  {
    description: 'Custos - CPV',
    values: Array(13).fill(0),
    isBold: true
  },
  {
    description: '% Custos',
    values: Array(13).fill('0,0%'),
    isBlue: true
  },
  {
    description: 'Lucro Bruto',
    values: Array(13).fill(0),
    isBold: true
  },
  {
    description: 'Despesas Operacionais - Total',
    values: Array(13).fill(0),
    isBold: true
  },
  {
    description: '% Despesas Operacionais',
    values: Array(13).fill('0,0%'),
    isBlue: true
  },
  {
    description: 'Ebit',
    values: Array(13).fill(0),
    isBold: true,
    isHighlight: true
  },
  {
    description: 'Margem Ebit',
    values: Array(13).fill('0,0%'),
    isBlue: true
  },
  {
    description: 'Impostos',
    values: Array(13).fill(0),
    isBold: true
  },
  {
    description: '% de Impostos',
    values: Array(13).fill('0,0%'),
    isBlue: true
  },
  {
    description: 'FCFF (Free Cash Flow to Firm)',
    values: Array(13).fill(0),
    isBold: true,
    isGray: true,
    isHighlight: true
  },
  {
    description: 'Despesa Financeira',
    values: [0, 0, 0, -6968, -5217, -4878, -4014, -3150, -2625, -2100, -1575, -1050, 0],
    isBold: true
  },
  {
    description: 'Endividamento Atual',
    values: [0, 0, 0, -2768, -1017, -678, -339, 0, 0, 0, 0, 0, 0],
    isBold: false
  },
  {
    description: 'Novo Empréstimo',
    values: [0, 0, 0, -4200, -4200, -4200, -3675, -3150, -2625, -2100, -1575, -1050, 0],
    isBold: false
  },
  {
    description: 'Saldo do Fluxo de Caixa após as Despesas Financeiras',
    values: [0, 0, 0, 12892, 16373, 19111, 21598, 25059, 29750, 30884, 32037, 33211, 0],
    isBold: true
  },
  {
    description: 'Amortização de Empréstimos',
    values: [0, 0, 0, -12511, -2421, -9921, -9921, -7500, -7500, -7500, -7500, -7500, 0],
    isBold: true
  },
  {
    description: 'Endividamento Atual',
    values: [0, 0, 0, -12511, -2421, -2421, -2421, 0, 0, 0, 0, 0, 0],
    isBold: false
  },
  {
    description: 'Novo Empréstimo',
    values: [0, 0, 0, 0, 0, -7500, -7500, -7500, -7500, -7500, -7500, -7500, 0],
    isBold: false
  },
  {
    description: 'Saldo Parcial do Fluxo de Caixa',
    values: [0, 0, 0, 381, 13953, 9190, 11677, 17559, 22250, 23384, 24537, 25711, 26905],
    isBold: true
  },
  {
    description: 'Novo Empréstimo - Captação Bancária',
    values: [0, 0, 0, 60000, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    isBold: true
  },
  {
    description: 'Saldo Fluxo de Caixa após as Despesas Financeiras e Amortização de Empréstimos',
    values: Array(13).fill(0),
    isBold: true,
    isHighlight: true
  }
];

const formatValue = (value) => {
  if (typeof value === 'number') {
    return value === 0 ? 'R$ 0' : `R$ ${value.toLocaleString('pt-BR')}`;
  }
  return value;
};

const populateTable = () => {
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';
  
  financialData.forEach(row => {
    const tr = document.createElement('tr');
    if (row.isGray) tr.classList.add('row-gray');
    
    // Description cell
    const tdDesc = document.createElement('td');
    tdDesc.textContent = row.description;
    if (row.isBlue) tdDesc.classList.add('text-blue');
    if (row.isBold) tdDesc.style.fontWeight = 'bold';
    tr.appendChild(tdDesc);
    
    // Value cells
    row.values.forEach((value, index) => {
      const td = document.createElement('td');
      td.className = 'text-end';
      if (index === 3) td.classList.add('vertical-line');
      td.textContent = formatValue(value);
      
      if (row.isHighlight) td.style.fontWeight = 'bold';
      tr.appendChild(td);
    });
    
    tableBody.appendChild(tr);
  });
};

document.addEventListener('DOMContentLoaded', populateTable);