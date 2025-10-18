import type { Payment } from "@/services/types/types";

interface ReceiptData {
  payment: Payment;
  bookingInfo?: {
    customerName: string;
    roomNumber: string;
  };
  accountInfo?: {
    accountName: string;
    accountType: string;
  };
}

export function printPaymentReceipt(data: ReceiptData) {
  const { payment, bookingInfo, accountInfo } = data;

  // Create a new window for printing
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert("Please allow pop-ups to print the receipt");
    return;
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const receiptHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt - ${payment.id.slice(0, 8)}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Courier New', monospace;
            background: #f5f5f5;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          
          .receipt {
            width: 320px;
            background: white;
            padding: 30px 20px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          
          .receipt-header {
            text-align: center;
            margin-bottom: 20px;
          }
          
          .dashed-line {
            border-top: 2px dashed #999;
            margin: 15px 0;
          }
          
          .receipt-title {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
            margin: 10px 0;
          }
          
          .receipt-subtitle {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
          }
          
          .receipt-body {
            margin: 20px 0;
          }
          
          .receipt-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 13px;
            line-height: 1.4;
          }
          
          .receipt-row.item {
            border-bottom: 1px dotted #ddd;
          }
          
          .label {
            color: #555;
            flex: 1;
          }
          
          .value {
            color: #000;
            font-weight: bold;
            text-align: right;
            flex: 1;
          }
          
          .total-section {
            margin: 20px 0;
            padding: 15px 0;
            border-top: 2px solid #333;
            border-bottom: 2px solid #333;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            font-weight: bold;
            padding: 5px 0;
          }
          
          .total-label {
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .total-amount {
            font-size: 20px;
          }
          
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .status-PAID {
            background: #dcfce7;
            color: #166534;
          }
          
          .status-PENDING {
            background: #fef3c7;
            color: #92400e;
          }
          
          .status-FAILED {
            background: #fee2e2;
            color: #991b1b;
          }
          
          .receipt-footer {
            text-align: center;
            margin-top: 25px;
          }
          
          .thank-you {
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 3px;
            margin: 15px 0;
          }
          
          .barcode {
            margin: 20px 0;
            text-align: center;
          }
          
          .barcode-image {
            width: 200px;
            height: 50px;
            background: repeating-linear-gradient(
              90deg,
              #000 0px,
              #000 2px,
              #fff 2px,
              #fff 4px
            );
            margin: 0 auto;
          }
          
          .barcode-text {
            font-size: 10px;
            margin-top: 5px;
            letter-spacing: 2px;
          }
          
          .footer-text {
            font-size: 10px;
            color: #666;
            margin: 5px 0;
          }
          
          .print-date {
            font-size: 9px;
            color: #999;
            margin-top: 15px;
            font-style: italic;
          }
          
          @media print {
            body {
              background: white;
              padding: 0;
            }
            
            .receipt {
              box-shadow: none;
              width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <!-- Header -->
          <div class="receipt-header">
            <div class="dashed-line"></div>
            <div class="receipt-title">RECEIPT</div>
            <div class="dashed-line"></div>
            <div class="receipt-subtitle">Payment Confirmation</div>
          </div>
          
          <!-- Body -->
          <div class="receipt-body">
            ${
              bookingInfo
                ? `
              <div class="receipt-row item">
                <span class="label">Customer</span>
                <span class="value">${bookingInfo.customerName}</span>
              </div>
              <div class="receipt-row item">
                <span class="label">Room Number</span>
                <span class="value">${bookingInfo.roomNumber}</span>
              </div>
            `
                : ""
            }
            
            <div class="receipt-row item">
              <span class="label">Booking ID</span>
              <span class="value">${payment.bookingId.slice(0, 12)}...</span>
            </div>
            
            <div class="receipt-row item">
              <span class="label">Payment Method</span>
              <span class="value">${payment.method.replace("_", " ")}</span>
            </div>
            
            ${
              accountInfo
                ? `
              <div class="receipt-row item">
                <span class="label">Account</span>
                <span class="value">${accountInfo.accountName}</span>
              </div>
            `
                : ""
            }
            
            <div class="receipt-row item">
              <span class="label">Date</span>
              <span class="value">${formatDate(payment.createdAt)}</span>
            </div>
            
            <div class="receipt-row item">
              <span class="label">Status</span>
              <span class="value">
                <span class="status-badge status-${payment.status}">
                  ${payment.status}
                </span>
              </span>
            </div>
          </div>
          
          <!-- Total Section -->
          <div class="total-section">
            <div class="total-row">
              <span class="total-label">Total Amount</span>
              <span class="total-amount">${formatCurrency(
                Number(payment.amount)
              )}</span>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="receipt-footer">
            <div class="dashed-line"></div>
            <div class="thank-you">THANK YOU</div>
            <div class="dashed-line"></div>
            
            <!-- Barcode -->
            <div class="barcode">
              <div class="barcode-image"></div>
              <div class="barcode-text">${payment.id
                .slice(0, 16)
                .toUpperCase()}</div>
            </div>
            
            <div class="footer-text">This is an official receipt</div>
            <div class="footer-text">for your records</div>
            <div class="print-date">Printed: ${new Date().toLocaleString()}</div>
          </div>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(receiptHTML);
  printWindow.document.close();

  // Wait for content to load before printing
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}
