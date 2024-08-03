  import React from 'react'
  import { FloatingWhatsApp } from 'react-floating-whatsapp';
  import './whatsapp.css'
  export default function WhatsApp({ phoneNumber }) {
      const onMessageReceived = (message) => {
          // Handle the received message (e.g., send to WhatsApp)
          const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
          window.open(whatsappLink, '_blank');
        };
    return (
      <div className="whatsapp-container"> 
      <FloatingWhatsApp
        phoneNumber={phoneNumber}
        accountName="Kumar Herbals" // Optional: Set your company name
        // avatar="assets/logo.jpg" // Optional: Set your avatar image URL
        messageText="Hello, how can we help you?" // Optional: Set a default message
        onMessageReceived={onMessageReceived}
style={{width:'93',height:'93'}}
      />
    </div>
    )
  }
