const PDFDocument = require("pdfkit");
const topNavModel = require("../Models/adminModel/topNavModel");

const fontNormal = "Helvetica";
const fontBold = "Helvetica-Bold";

const generateInvoicePDF = async (order) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Fetch topNavbar information from the database
      const topNavData = await topNavModel.findOne();
      if (!topNavData) {
        throw new Error("Seller information not found");
      }

      const sellerInfo = {
        companyName: topNavData.title,
        address: topNavData.addresses[0].street,
        city: topNavData.addresses[0].city,
        state: topNavData.addresses[0].state,
        pincode: topNavData.addresses[0].pincode,
        country: topNavData.addresses[0].country,
        contactNo: topNavData.phone,
      };

      const customerInfo = {
        customerName: order.users[0].userName,
        address: order.deliveryAddress.street,
        city: order.deliveryAddress.district,
        state: order.deliveryAddress.state,
        pincode: order.deliveryAddress.pincode,
        country: order.deliveryAddress.country,
        contactNo: order.users[0].phone,
      };

      const orderInfo = {
        orderNo: order.order_id,
        invoiceNo: order.receipt,
        invoiceDate: new Date(order.createdAt).toLocaleDateString(),
        invoiceTime: new Date(order.createdAt).toLocaleTimeString(),
        products: order.products.map((product) => ({
          id: product.productId,
          name: product.ProductName,
          unitPrice: product.currentPrice,
          totalPrice: product.currentPrice * product.quantity,
          qty: product.quantity,
          grams: product.grams, // Ensure grams is correctly referenced
        })),
        totalValue: order.totalAmount,
      };

      // Calculate subtotal
      const subtotal = orderInfo.products.reduce(
        (sum, product) => sum + product.totalPrice,
        0
      );

      const pdfDoc = new PDFDocument();

      // Collect the PDF data in a buffer
      let buffers = [];
      pdfDoc.on("data", buffers.push.bind(buffers));
      pdfDoc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Footer content
      const footerText = "© 2024 Kumar Herbals. All rights reserved.";

      // Event listener to handle adding the footer
      pdfDoc.on("pageAdded", () => {
        pdfDoc
          .font(fontNormal)
          .fontSize(10)
          .text(footerText, 7, pdfDoc.page.height - 30, {
            width: pdfDoc.page.width - 14,
            align: "center",
          });
      });

      pdfDoc.font(fontBold).text(sellerInfo.companyName, 7, 75);
      pdfDoc
        .fontSize(14)
        .text("Order Invoice/Bill Receipt", 400, 30, { width: 200 });
      pdfDoc
        .fontSize(10)
        .text(`${orderInfo.invoiceDate} ${orderInfo.invoiceTime}`, 400, 46, {
          width: 200,
        });

      pdfDoc.font(fontBold).text("Sold by:", 7, 100);
      pdfDoc
        .font(fontNormal)
        .text(sellerInfo.companyName, 7, 115, { width: 250 });
      pdfDoc.text(sellerInfo.address, 7, 130, { width: 250 });
      pdfDoc.text(`${sellerInfo.city} ${sellerInfo.pincode}`, 7, 145, {
        width: 250,
      });
      pdfDoc.text(`${sellerInfo.state} ${sellerInfo.country}`, 7, 160, {
        width: 250,
      });

      pdfDoc.font(fontBold).text("Customer details:", 400, 100);
      pdfDoc
        .font(fontNormal)
        .text(customerInfo.customerName, 400, 115, { width: 250 });
      pdfDoc.text(customerInfo.address, 400, 130, { width: 250 });
      pdfDoc.text(`${customerInfo.city} ${customerInfo.pincode}`, 400, 145, {
        width: 250,
      });
      pdfDoc.text(`${customerInfo.state} ${customerInfo.country}`, 400, 160, {
        width: 250,
      });

      pdfDoc.text("Order No:" + orderInfo.orderNo, 7, 195, { width: 250 });
      pdfDoc.text("Invoice No:" + orderInfo.invoiceNo, 7, 210, { width: 250 });

      pdfDoc.rect(7, 250, 560, 20).fill("#254336").stroke("#254336");
      pdfDoc
        .fillColor("#fff")
        .text("ID", 20, 256, { width: 90, align: "center" });
      pdfDoc.text("Product", 110, 256, { width: 190, align: "center" });
      pdfDoc.text("Qty", 230, 256, { width: 100, align: "center" });
      pdfDoc.text("Grams", 300, 256, { width: 100, align: "center" }); // Added grams column
      pdfDoc.text("Price", 400, 256, { width: 100, align: "center" });
      pdfDoc.text("Total Price", 500, 256, { width: 100 });

      const startY = 276; // Starting Y position for the first product
      const productLineHeight = 50; // Height allocated for each product entry
      const summaryLineHeight = 20; // Height allocated for each summary entry
      let productNo = 0;

      orderInfo.products.forEach((element) => {
        let y = startY + productNo * productLineHeight;
        pdfDoc.fillColor("#000").text(element.id, 20, y, { width: 90 });
        pdfDoc.text(element.name, 110, y, { width: 190, align: "center" });
        pdfDoc.text(element.qty, 230, y, { width: 100, align: "center" });
        pdfDoc.text(element.grams + "g", 300, y, {
          width: 100,
          align: "center",
        }); // Correctly reference element.grams
        pdfDoc.text(element.unitPrice, 400, y, { width: 100, align: "center" });
        pdfDoc.text(element.totalPrice, 500, y, { width: 100 });
        productNo++;
      });

      // Draw a line after the product entries
      pdfDoc
        .rect(7, startY + productNo * productLineHeight, 560, 0.2)
        .fillColor("#000")
        .stroke("#000");

      // Draw subtotal, shipping fee, and total value after product entries
      const drawSummary = (label, value, offset) => {
        const y =
          startY + productNo * productLineHeight + offset * summaryLineHeight;
        pdfDoc.font(fontBold).text(label, 400, y);
        pdfDoc.font(fontBold).text(value.toFixed(2), 500, y);
      };

      drawSummary("Subtotal:", subtotal, 1);
      const shippingFee = order.totalAmount - subtotal;
      drawSummary("Shipping fee:", shippingFee, 2);

      pdfDoc
        .font(fontBold)
        .fontSize(12)
        .text(
          "Total:",
          400,
          startY + productNo * productLineHeight + 3 * summaryLineHeight
        );
      pdfDoc
        .font(fontBold)
        .fontSize(12)
        .text(
          orderInfo.totalValue.toFixed(2),
          500,
          startY + productNo * productLineHeight + 3 * summaryLineHeight
        );

      pdfDoc.fontSize(10).text(footerText, 200, 650, { width: 200 });

      pdfDoc.end();
    } catch (error) {
      console.error("Error generating invoice:", error);
      reject(error);
    }
  });
};

module.exports = generateInvoicePDF;
