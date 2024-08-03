import React from 'react';
import './FloatingMailIcon.css'; // Custom CSS for styling the floating mail icon
import icon from './icons8-mail-48.png'
export default function FloatingMailIcon({ emailAddress }) {
    // const handleEmailClick = () => {
    //     // Open email client or perform action to send email
    //     // For demonstration purposes, let's assume a mailto link
    //     const mailtoLink = `mailto:${emailAddress}`;
    //     window.location.href = mailtoLink;
    // };

    return (
        <div className="floating-mail-icon-container">
            <button className="floating-mail-icon" >
                <a href={`mailto:${emailAddress}`} target="_blank"><img src={icon}></img></a>
            </button>
        </div>
    );
}
