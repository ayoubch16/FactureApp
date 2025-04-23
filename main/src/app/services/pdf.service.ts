import { Injectable } from '@angular/core';
import { Client, Facture, ArticleTableFacture } from '../interfaces/entites';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor() {}

  /**
   * Génère un PDF à partir des informations de la facture ou BL
   * @param facture - Les informations de la facture
   * @param options - Options de génération (type de document, avec signature, etc.)
   */
  async generateFacturePdf(facture: Facture, options: {
    type: 'FACTURE' | 'DEVIS' | 'BL',
    withSignature: boolean,
    printVersion?: boolean
  } = { type: 'FACTURE', withSignature: true }): Promise<Blob> {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;

    // En-tête
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('SPLENDOR ART', pageWidth / 2, 20, { align: 'center' });

    // Informations client
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`CLIENT: ${facture.client.raisonSociale}`, margin, 40);
    doc.text(`ADRESSE: ${facture.client.ville?.nom || ''}`, margin, 47);
    doc.text(`ICE: ${facture.client.ice || ''}`, margin, 54);

    // Informations facture/devis/BL selon le type
    doc.setFont('helvetica', 'bold');
    let documentLabel = options.type === 'FACTURE' ? 'FACTURE' :
      options.type === 'DEVIS' ? 'DEVIS' : 'BON DE LIVRAISON';

    doc.text(`${documentLabel}: N ${facture.numFacture}`, pageWidth - margin, 40, { align: 'right' });
    doc.text(`DATE: ${new Date(facture.date).toLocaleDateString('fr-FR')}`, pageWidth - margin, 47, { align: 'right' });

    // Tableau des articles
    this.generateArticlesTable(doc, facture.articles, margin, 70, options.type === 'BL');

    // Totaux (pas pour les BL)
    if (options.type !== 'BL') {
      const totalHT = facture.articles.reduce((sum, article) => sum + article.prixTotal, 0);
      const tva = totalHT * 0.2;
      const totalTTC = totalHT + tva;

      const yPosition = 70 + facture.articles.length * 10 + 20;
      doc.setFillColor(240, 240, 240);
      doc.rect(pageWidth / 2, yPosition, pageWidth / 2 - margin, 30, 'F');
      doc.setFont('helvetica', 'normal');
      doc.text('Total H.T', pageWidth / 2 + 5, yPosition + 7);
      doc.text('T.V.A', pageWidth / 2 + 5, yPosition + 17);
      doc.text('Total T.T.C', pageWidth / 2 + 5, yPosition + 27);

      doc.setFont('helvetica', 'bold');
      doc.text(`${totalHT.toFixed(2)} DH`, pageWidth - margin - 5, yPosition + 7, { align: 'right' });
      doc.text(`${tva.toFixed(2)} DH`, pageWidth - margin - 5, yPosition + 17, { align: 'right' });
      doc.text(`${totalTTC.toFixed(2)} DH`, pageWidth - margin - 5, yPosition + 27, { align: 'right' });

      // Signature (seulement si l'option est activée)
      if (options.withSignature) {
        doc.setFont('helvetica', 'italic');
        doc.text('SPLENDOR ART', pageWidth - margin - 40, yPosition + 60);
        doc.text('05 Apr 1, Rue Dakar', pageWidth - margin - 40, yPosition + 67);
        doc.text('Océan - Rabat', pageWidth - margin - 40, yPosition + 74);

        // Ligne de signature
        doc.setLineWidth(0.5);
        doc.line(pageWidth - margin - 60, yPosition + 80, pageWidth - margin, yPosition + 65);
      }
    } else {
      // Pour les BL, ajouter une mention "Bon de Livraison" et un espace pour signature de réception
      const yPosition = 70 + facture.articles.length * 10 + 20;

      if (options.withSignature) {
        doc.setFont('helvetica', 'normal');
        doc.text('Signature et Cachet Fournisseur:', margin, yPosition + 40);
        doc.text('SPLENDOR ART', margin + 10, yPosition + 50);

        // Signature côté réception
        doc.text('Signature et Cachet Réception:', pageWidth - margin - 60, yPosition + 40);
        doc.rect(pageWidth - margin - 70, yPosition + 45, 60, 30);
      }
    }

    return doc.output('blob');
  }

  /**
   * Génère un tableau d'articles dans le PDF
   * @param doc - Le document PDF
   * @param articles - Liste des articles
   * @param x - Position x du tableau
   * @param y - Position y du tableau
   * @param hidePrices - Option pour cacher les prix (pour les BL)
   */
  private generateArticlesTable(doc: jsPDF, articles: ArticleTableFacture[], x: number, y: number, hidePrices: boolean = false): void {
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const tableWidth = pageWidth - 2 * margin;

    // En-têtes de colonnes
    doc.setFillColor(50, 50, 50);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.rect(x, y, tableWidth, 10, 'F');

    if (hidePrices) {
      // Version BL - sans prix
      doc.text('Désignation', x + 5, y + 6);
      doc.text('Description', x + tableWidth * 0.4, y + 6);
      doc.text('Quantité', x + tableWidth * 0.8, y + 6);
    } else {
      // Version Facture/Devis - avec prix
      doc.text('Désignation', x + 5, y + 6);
      doc.text('Quantité', x + tableWidth * 0.5, y + 6);
      doc.text('P.U.H.T', x + tableWidth * 0.65, y + 6);
      doc.text('Coût Total', x + tableWidth * 0.85, y + 6);
    }

    // Lignes des articles
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    articles.forEach((article, index) => {
      const yPos = y + 10 + index * 10;

      // Fond alterné pour les lignes
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(x, yPos, tableWidth, 10, 'F');
      }

      if (hidePrices) {
        // Version BL - sans prix
        doc.text(article.designation, x + 5, yPos + 6);
        doc.text(article.description?.substring(0, 40) || '', x + tableWidth * 0.4, yPos + 6);
        doc.text(article.quantite.toString(), x + tableWidth * 0.8, yPos + 6);
      } else {
        // Version Facture/Devis - avec prix
        doc.text(article.designation, x + 5, yPos + 6);
        doc.text(article.quantite.toString(), x + tableWidth * 0.5, yPos + 6);
        doc.text(`${article.prixUnitaire.toFixed(2)} DH`, x + tableWidth * 0.65, yPos + 6);
        doc.text(`${article.prixTotal.toFixed(2)} DH`, x + tableWidth * 0.85, yPos + 6);
      }
    });
  }
  /**
   * Génère un PDF à partir d'un élément HTML
   */
  async generatePdfFromElement(elementId: string, filename: string): Promise<Blob> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID ${elementId} not found`);
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const imgHeight = canvas.height * imgWidth / canvas.width;

    const doc = new jsPDF('p', 'mm', 'a4');
    doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    return doc.output('blob');
  }

  /**
   * Télécharge un PDF
   */
  downloadPdf(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
