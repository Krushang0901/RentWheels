import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const downloadInvoice = (booking) => {
  const pdf = new jsPDF();

  // Company Logo
  const img = new Image();
  img.src = './RentWheellogo.png'; // Replace with your logo path
  img.onload = function () {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = 50;
    const imgHeight = 20;
    const margin = 10;
    const imgX = (pageWidth - imgWidth) / 2;

    pdf.addImage(img, 'PNG', imgX, margin, imgWidth, imgHeight); // Centered logo

    pdf.setFontSize(12);
    const dateX = pageWidth - 60;
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, dateX, margin);
    pdf.text(`Time: ${new Date().toLocaleTimeString()}`, dateX, margin + 10);

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text("User Details", margin, 40);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Username: ${booking.user.username}`, margin, 50);
    pdf.text(`Email: ${booking.user.email}`, margin, 55);

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Car Details", margin, 75);

    pdf.autoTable({
      startY: 85,
      head: [['Make', 'Model', 'Year', 'Plate', 'Booking Date', 'Return Date', 'Status', 'Total Price']],
      body: [
        [
          booking.car.make,
          booking.car.model,
          booking.car.year,
          booking.car.plate,
          new Date(booking.bookingDate).toLocaleDateString(),
          new Date(booking.returnDate).toLocaleDateString(),
          booking.status,
          `$${booking.totalPrice}`
        ]
      ]
    });

    const finalY = pdf.lastAutoTable.finalY;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Terms and Conditions", margin, finalY + 20);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text("1. The rental car must be returned with a full tank of gas.", margin, finalY + 30);
    pdf.text("2. Smoking is strictly prohibited in the rental car.", margin, finalY + 35);
    pdf.text("3. Any damage to the car will be the renter's responsibility.", margin, finalY + 40);
    pdf.text("4. Late returns will incur additional charges.", margin, finalY + 45);
    pdf.text("5. All traffic fines are the responsibility of the renter.", margin, finalY + 50);

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Return Policy", margin, finalY + 70);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text("The car must be returned to the designated return location by the return date and time specified in the booking details.", margin, finalY + 80);
    pdf.text("Please ensure the car is in the same condition as when it was rented, with a full tank of gas.", margin, finalY + 85);
    pdf.text("Any late returns will result in additional charges as per the rental agreement.", margin, finalY + 90);
    pdf.text("If the car is returned after office hours, please use the key drop box and note the return time.", margin, finalY + 95);

    pdf.save("invoice.pdf");
  };
};
