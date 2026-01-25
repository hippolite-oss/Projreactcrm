import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

class ExportService {
  
  // Export PDF des rapports
  exportToPDF(reportData, period = 'month') {
    try {
      console.log('🔄 Début export PDF...');
      console.log('Données reçues:', reportData);
      
      const doc = new jsPDF();
      const currentDate = new Date().toLocaleDateString('fr-FR');
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(79, 70, 229);
      doc.text('DIGIDEV CRM - Rapport d\'Analyse', 20, 25);
      
      doc.setFontSize(12);
      doc.setTextColor(107, 114, 128);
      doc.text(`Periode: ${this.getPeriodLabel(period)} | Genere le: ${currentDate}`, 20, 35);
      
      // Ligne de séparation
      doc.setDrawColor(243, 244, 246);
      doc.line(20, 45, 190, 45);
      
      let yPosition = 55;
      
      // Section KPI
      doc.setFontSize(16);
      doc.setTextColor(31, 41, 55);
      doc.text('Indicateurs Cles de Performance', 20, yPosition);
      yPosition += 15;
      
      // Vérification des données avant utilisation
      const salesTotal = reportData?.sales?.total || 0;
      const salesGrowth = reportData?.sales?.growth || 0;
      const clientsTotal = reportData?.clients?.total || 0;
      const clientsGrowth = reportData?.clients?.growth || 0;
      const ordersTotal = reportData?.sales?.orders || 0;
      const avgOrder = reportData?.sales?.avgOrder || 0;
      const revenueTotal = reportData?.revenue?.total || 0;
      const revenuePending = reportData?.revenue?.pending || 0;
      
      const kpiData = [
        ['Indicateur', 'Valeur', 'Evolution'],
        ['Chiffre d\'Affaires', this.formatCurrency(salesTotal), `${salesGrowth > 0 ? '+' : ''}${salesGrowth}%`],
        ['Nombre de Clients', clientsTotal.toString(), `${clientsGrowth > 0 ? '+' : ''}${clientsGrowth}%`],
        ['Commandes Totales', ordersTotal.toString(), '-'],
        ['Panier Moyen', this.formatCurrency(avgOrder), '-'],
        ['Revenus Totaux', this.formatCurrency(revenueTotal), '-'],
        ['En Attente', this.formatCurrency(revenuePending), '-']
      ];
      
      doc.autoTable({
        startY: yPosition,
        head: [kpiData[0]],
        body: kpiData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229], textColor: 255 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { left: 20, right: 20 }
      });
      
      yPosition = doc.lastAutoTable.finalY + 20;
      
      // Section Top Produits
      if (reportData?.products?.topSelling && reportData.products.topSelling.length > 0) {
        doc.setFontSize(16);
        doc.setTextColor(31, 41, 55);
        doc.text('Top Produits', 20, yPosition);
        yPosition += 15;
        
        const productsData = [
          ['Rang', 'Produit', 'Ventes', 'Revenus'],
          ...reportData.products.topSelling.slice(0, 5).map((product, index) => [
            `#${index + 1}`,
            product.name || 'N/A',
            (product.sales || 0).toString(),
            this.formatCurrency(product.revenue || 0)
          ])
        ];
        
        doc.autoTable({
          startY: yPosition,
          head: [productsData[0]],
          body: productsData.slice(1),
          theme: 'grid',
          headStyles: { fillColor: [16, 185, 129], textColor: 255 },
          alternateRowStyles: { fillColor: [240, 253, 244] },
          margin: { left: 20, right: 20 }
        });
        
        yPosition = doc.lastAutoTable.finalY + 20;
      }
      
      // Section Évolution Mensuelle
      if (reportData?.revenue?.monthly && reportData.revenue.monthly.length > 0) {
        // Vérifier si on a assez d'espace, sinon nouvelle page
        if (yPosition > 200) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(16);
        doc.setTextColor(31, 41, 55);
        doc.text('Evolution Mensuelle', 20, yPosition);
        yPosition += 15;
        
        const monthlyData = [
          ['Mois', 'Revenus'],
          ...reportData.revenue.monthly.map(item => [
            item.month || 'N/A',
            this.formatCurrency(item.revenue || 0)
          ])
        ];
        
        doc.autoTable({
          startY: yPosition,
          head: [monthlyData[0]],
          body: monthlyData.slice(1),
          theme: 'grid',
          headStyles: { fillColor: [139, 92, 246], textColor: 255 },
          alternateRowStyles: { fillColor: [245, 243, 255] },
          margin: { left: 20, right: 20 }
        });
      }
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(107, 114, 128);
        doc.text(`Page ${i} sur ${pageCount} - DIGIDEV CRM © ${new Date().getFullYear()}`, 20, 285);
      }
      
      // Sauvegarde
      const fileName = `rapport-crm-${period}-${new Date().toISOString().split('T')[0]}.pdf`;
      console.log('💾 Sauvegarde PDF:', fileName);
      doc.save(fileName);
      console.log('✅ Export PDF terminé avec succès');
      
    } catch (error) {
      console.error('❌ Erreur export PDF:', error);
      throw new Error(`Erreur lors de l'export PDF: ${error.message}`);
    }
  }
  
  // Export Excel des rapports
  exportToExcel(reportData, period = 'month') {
    try {
      console.log('🔄 Début export Excel...');
      console.log('Données reçues:', reportData);
      
      const workbook = XLSX.utils.book_new();
      
      // Vérification des données avant utilisation
      const salesTotal = reportData?.sales?.total || 0;
      const salesGrowth = reportData?.sales?.growth || 0;
      const clientsTotal = reportData?.clients?.total || 0;
      const clientsGrowth = reportData?.clients?.growth || 0;
      const clientsNew = reportData?.clients?.new || 0;
      const clientsActive = reportData?.clients?.active || 0;
      const ordersTotal = reportData?.sales?.orders || 0;
      const avgOrder = reportData?.sales?.avgOrder || 0;
      const revenueTotal = reportData?.revenue?.total || 0;
      const revenuePending = reportData?.revenue?.pending || 0;
      
      // Feuille 1: KPI
      const kpiData = [
        ['DIGIDEV CRM - Rapport d\'Analyse'],
        [`Période: ${this.getPeriodLabel(period)}`],
        [`Généré le: ${new Date().toLocaleDateString('fr-FR')}`],
        [],
        ['Indicateurs Clés de Performance'],
        ['Indicateur', 'Valeur', 'Évolution'],
        ['Chiffre d\'Affaires', salesTotal, `${salesGrowth}%`],
        ['Nombre de Clients', clientsTotal, `${clientsGrowth}%`],
        ['Nouveaux Clients', clientsNew, '-'],
        ['Clients Actifs', clientsActive, '-'],
        ['Commandes Totales', ordersTotal, '-'],
        ['Panier Moyen', avgOrder, '-'],
        ['Revenus Totaux', revenueTotal, '-'],
        ['Revenus en Attente', revenuePending, '-']
      ];
      
      const kpiSheet = XLSX.utils.aoa_to_sheet(kpiData);
      XLSX.utils.book_append_sheet(workbook, kpiSheet, 'KPI');
      
      // Feuille 2: Top Produits
      if (reportData?.products?.topSelling && reportData.products.topSelling.length > 0) {
        const productsData = [
          ['Top Produits'],
          [],
          ['Rang', 'Produit', 'Ventes', 'Revenus'],
          ...reportData.products.topSelling.map((product, index) => [
            index + 1,
            product.name || 'N/A',
            product.sales || 0,
            product.revenue || 0
          ])
        ];
        
        const productsSheet = XLSX.utils.aoa_to_sheet(productsData);
        XLSX.utils.book_append_sheet(workbook, productsSheet, 'Top Produits');
      }
      
      // Feuille 3: Évolution Mensuelle
      if (reportData?.revenue?.monthly && reportData.revenue.monthly.length > 0) {
        const monthlyData = [
          ['Évolution Mensuelle'],
          [],
          ['Mois', 'Revenus'],
          ...reportData.revenue.monthly.map(item => [
            item.month || 'N/A',
            item.revenue || 0
          ])
        ];
        
        const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyData);
        XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Évolution');
      }
      
      // Feuille 4: Catégories
      if (reportData?.products?.categories && reportData.products.categories.length > 0) {
        const categoriesData = [
          ['Répartition par Catégories'],
          [],
          ['Catégorie', 'Pourcentage'],
          ...reportData.products.categories.map(cat => [
            cat.name || 'N/A',
            `${cat.percentage || 0}%`
          ])
        ];
        
        const categoriesSheet = XLSX.utils.aoa_to_sheet(categoriesData);
        XLSX.utils.book_append_sheet(workbook, categoriesSheet, 'Catégories');
      }
      
      // Sauvegarde
      const fileName = `rapport-crm-${period}-${new Date().toISOString().split('T')[0]}.xlsx`;
      console.log('💾 Sauvegarde Excel:', fileName);
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      console.log('✅ Export Excel terminé avec succès');
      
    } catch (error) {
      console.error('❌ Erreur export Excel:', error);
      throw new Error(`Erreur lors de l'export Excel: ${error.message}`);
    }
  }
  
  // Export CSV simple
  exportToCSV(reportData, type = 'kpi') {
    try {
      console.log(`🔄 Début export CSV ${type}...`);
      console.log('Données reçues:', reportData);
      
      let csvContent = '';
      let fileName = '';
      
      switch (type) {
        case 'kpi':
          csvContent = 'Indicateur,Valeur,Evolution\n';
          csvContent += `Chiffre d'Affaires,${reportData?.sales?.total || 0},${reportData?.sales?.growth || 0}%\n`;
          csvContent += `Clients Total,${reportData?.clients?.total || 0},${reportData?.clients?.growth || 0}%\n`;
          csvContent += `Nouveaux Clients,${reportData?.clients?.new || 0},-\n`;
          csvContent += `Commandes,${reportData?.sales?.orders || 0},-\n`;
          csvContent += `Panier Moyen,${reportData?.sales?.avgOrder || 0},-\n`;
          fileName = 'kpi-rapport.csv';
          break;
          
        case 'products':
          csvContent = 'Rang,Produit,Ventes,Revenus\n';
          if (reportData?.products?.topSelling && reportData.products.topSelling.length > 0) {
            reportData.products.topSelling.forEach((product, index) => {
              csvContent += `${index + 1},${product.name || 'N/A'},${product.sales || 0},${product.revenue || 0}\n`;
            });
          }
          fileName = 'top-produits.csv';
          break;
          
        case 'monthly':
          csvContent = 'Mois,Revenus\n';
          if (reportData?.revenue?.monthly && reportData.revenue.monthly.length > 0) {
            reportData.revenue.monthly.forEach(item => {
              csvContent += `${item.month || 'N/A'},${item.revenue || 0}\n`;
            });
          }
          fileName = 'evolution-mensuelle.csv';
          break;
      }
      
      console.log('💾 Sauvegarde CSV:', fileName);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, fileName);
      console.log('✅ Export CSV terminé avec succès');
      
    } catch (error) {
      console.error('❌ Erreur export CSV:', error);
      throw new Error(`Erreur lors de l'export CSV: ${error.message}`);
    }
  }
  
  // Utilitaires
  formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }
  
  getPeriodLabel(period) {
    const labels = {
      week: 'Cette semaine',
      month: 'Ce mois',
      quarter: 'Ce trimestre',
      year: 'Cette année'
    };
    return labels[period] || 'Ce mois';
  }
}

export default new ExportService();