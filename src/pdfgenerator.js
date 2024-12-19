import { jsPDF } from "jspdf";
import { orderNumber } from './checkout.js'; // Import OrderNumber

document.addEventListener('DOMContentLoaded', () => {
    const generatePDFButton = document.querySelector('#PDFButton');

    // Import Cart
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];

    // Calculate Tax and Subtotal for Order
    let Subtotal = 0;
    let Tax = 0;
    cart.forEach(item => {
        Subtotal += (item.price * item.quantity);
        Tax += (0.07) * Subtotal;
    });

    generatePDFButton.addEventListener('click', () => {
        // Create PDF
        const doc = new jsPDF();

        // Retrieve customer data first
        const customerData = JSON.parse(sessionStorage.getItem('customerData')) || {
            firstName: 'Sample',
            lastName: 'Customer',
            address: 'Sample Address',
            city: 'Sample City',
            state: 'Sample State'
        };

        doc.setFontSize(25);
        const WrenchCorpInvoice = 'WrenchCorp Invoice';
        const textWidth = doc.getTextWidth(WrenchCorpInvoice);
        const pageWidth = doc.internal.pageSize.width;
        const xPosition = (pageWidth - textWidth) / 2;
        const customerName = `${customerData.firstName} ${customerData.lastName}`;
        const customerAddr = customerData.address;
        const ShippingLabel = 'Shipping Label';
        const customerState = customerData.state;
        const customerCity = customerData.city;
        const Shipping = 20;
        const Total = (parseFloat(Subtotal) + parseFloat(Shipping) + parseFloat(Tax)).toFixed(2);

        // Invoice
        doc.text(WrenchCorpInvoice, xPosition, 20);
        doc.setFontSize(12);
        doc.text('Order Number: #' + orderNumber, 20, 70); // Use imported OrderNumber
        doc.text('Subtotal: $' + Subtotal.toFixed(2), 20, 30);
        doc.text('Shipping: $' + Shipping, 20, 40);
        doc.text('Tax: $' + Tax.toFixed(2), 20, 50);
        doc.text('Total: $' + Total, 20, 60);

    // Shipping Label
    doc.setFontSize(25);
    doc.text(ShippingLabel,xPosition+7,100);
    doc.setFontSize(8);
    doc.text('Warehouse 2',20,110);
    doc.text('123 Wrench Ln',20,115);
    doc.text('Wrench City, KT',20,120);
    doc.setFontSize(12);
    doc.text(customerName,xPosition+7,130);
    doc.text(customerAddr,xPosition+7,140);
    doc.text(customerState+ ', ' + customerCity,xPosition+7,150);
    doc.text('United States of America',xPosition+7,160);








    doc.save('TheWrenchInvoice.pdf');
});
});