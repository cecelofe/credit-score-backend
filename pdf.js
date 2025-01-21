function generatePDF() {
  const btn = document.getElementById('generatePdfBtn');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Gerando PDF...';

  // Add timestamp in a better position
  const now = new Date();
  const timestamp = document.createElement('div');
  timestamp.className = 'pdf-timestamp';
  timestamp.style.position = 'absolute';
  timestamp.style.top = '10px';
  timestamp.style.right = '10px';
  timestamp.style.fontSize = '10px';
  timestamp.style.color = '#666';
  timestamp.textContent = `Gerado em: ${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR')}`;
  document.body.appendChild(timestamp);

  // Hide the export button during PDF generation
  const exportBtn = document.querySelector('.dropdown');
  exportBtn.style.display = 'none';

  // Configure jsPDF options with better settings for full page capture
  const opt = {
    margin: [10, 10, 10, 10],
    filename: `analise-financeira_${now.toISOString().replace(/[:]/g, '-')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'landscape',
      compress: true
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  // Force all chart canvases to render
  const charts = document.querySelectorAll('canvas');
  charts.forEach(canvas => {
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
  });

  // Generate PDF using html2pdf with better error handling
  html2pdf().set(opt).from(document.body).save()
    .then(() => {
      console.log('PDF generated successfully');
      timestamp.remove();
      exportBtn.style.display = 'block';
      btn.innerHTML = originalText;
      btn.disabled = false;
    })
    .catch(error => {
      console.error('PDF generation error:', error);
      alert('Erro ao gerar PDF. Por favor, tente novamente.');
      timestamp.remove();
      exportBtn.style.display = 'block';
      btn.innerHTML = originalText;
      btn.disabled = false;
    });
}

function exportToExcel() {
  const btn = document.getElementById('exportDropdown');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Gerando Excel...';

  // Get financial data from table
  const workbook = XLSX.utils.book_new();
  
  // Export main financial table
  const mainTable = document.getElementById('financialTable');
  const mainWs = XLSX.utils.table_to_sheet(mainTable);
  XLSX.utils.book_append_sheet(workbook, mainWs, "Dados Financeiros");

  // Export debt amortization table
  const debtTable = document.querySelector('#debt-details .table');
  const debtWs = XLSX.utils.table_to_sheet(debtTable);
  XLSX.utils.book_append_sheet(workbook, debtWs, "Amortização");

  // Export ICSD table
  const icsdTable = document.querySelector('#icsd-section .table');
  const icsdWs = XLSX.utils.table_to_sheet(icsdTable);
  XLSX.utils.book_append_sheet(workbook, icsdWs, "ICSD");

  // Get current timestamp for filename
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:]/g, '-');

  // Generate Excel file
  XLSX.writeFile(workbook, `analise-financeira_${timestamp}.xlsx`);

  // Reset button state
  btn.innerHTML = originalText;
  btn.disabled = false;
}

function exportToWord() {
  const btn = document.getElementById('exportDropdown');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Gerando Word...';

  // Convert HTML content to Word format
  const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
    "xmlns:w='urn:schemas-microsoft-com:office:word' " +
    "xmlns='http://www.w3.org/TR/REC-html40'>" +
    "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
  
  const footer = "</body></html>";
  const sourceHTML = header + document.querySelector('.container').innerHTML + footer;

  const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
  const fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:]/g, '-');
  
  fileDownload.href = source;
  fileDownload.download = `analise-financeira_${timestamp}.doc`;
  fileDownload.click();
  document.body.removeChild(fileDownload);

  btn.innerHTML = originalText;
  btn.disabled = false;
}

function shareViaEmail() {
  // Create email content
  const subject = encodeURIComponent('Análise Financeira');
  const body = encodeURIComponent('Segue em anexo a análise financeira.');
  
  // Generate files first
  Promise.all([
    generatePDFBlob(),
    generateExcelBlob()
  ]).then(([pdfBlob, excelBlob]) => {
    // Create temporary URLs for the files
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const excelUrl = URL.createObjectURL(excelBlob);
    
    // Create email compose window with attachments
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
    
    // Clean up URLs after a delay
    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
      URL.revokeObjectURL(excelUrl);
    }, 1000);
  }).catch(error => {
    console.error('Error generating files:', error);
    alert('Erro ao gerar arquivos para email. Por favor, tente novamente.');
  });
}

// Helper function to generate PDF blob
function generatePDFBlob() {
  return new Promise((resolve, reject) => {
    const element = document.body;
    const opt = {
      margin: [10, 10, 10, 10],
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'landscape'
      }
    };

    html2pdf().set(opt).from(element).outputPdf('blob')
      .then(blob => resolve(blob))
      .catch(error => reject(error));
  });
}

// Helper function to generate Excel blob
function generateExcelBlob() {
  return new Promise((resolve) => {
    const workbook = XLSX.utils.book_new();
    
    // Export main financial table
    const mainTable = document.getElementById('financialTable');
    const mainWs = XLSX.utils.table_to_sheet(mainTable);
    XLSX.utils.book_append_sheet(workbook, mainWs, "Dados Financeiros");

    // Export debt amortization table
    const debtTable = document.querySelector('#debt-details .table');
    const debtWs = XLSX.utils.table_to_sheet(debtTable);
    XLSX.utils.book_append_sheet(workbook, debtWs, "Amortização");

    // Export ICSD table
    const icsdTable = document.querySelector('#icsd-section .table');
    const icsdWs = XLSX.utils.table_to_sheet(icsdTable);
    XLSX.utils.book_append_sheet(workbook, icsdWs, "ICSD");

    // Convert workbook to blob
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    resolve(blob);
  });
}