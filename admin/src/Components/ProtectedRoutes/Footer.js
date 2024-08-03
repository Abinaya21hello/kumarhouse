// FooterAdminPanel.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Footer = () => {
  const [footerItems, setFooterItems] = useState([]);
  const [formData, setFormData] = useState({
    message: '',
    email: '',
    phone: '',
    mobile: ''
  });

  useEffect(() => {
    fetchFooterItems();
  }, []);

  const fetchFooterItems = async () => {
    try {
      const response = await axios.get('/common/footer');
      setFooterItems(response.data);
    } catch (error) {
      console.error('Error fetching footer items:', error);
    }
  };

  const deleteFooterItem = async (id) => {
    try {
      await axios.delete(`/common/footer/${id}`);
      setFooterItems(footerItems.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting footer item:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/common/footer', formData);
      fetchFooterItems();
      setFormData({
        message: '',
        email: '',
        phone: '',
        mobile: ''
      });
    } catch (error) {
      console.error('Error creating footer item:', error);
    }
  };

  const handleEdit = async (id) => {
    try {
      await axios.put(`/common/footer/${id}`, formData);
      fetchFooterItems();
      setFormData({
        message: '',
        email: '',
        phone: '',
        mobile: ''
      });
    } catch (error) {
      console.error('Error editing footer item:', error);
    }
  };

  return (
    <div>
      <h1>Footer Admin Panel</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="message" placeholder="Message" value={formData.message} onChange={handleInputChange} />
        <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} />
        <input type="text" name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleInputChange} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {footerItems.map(item => (
          <li key={item._id}>
            <p>{item.message}</p>
            <p>{item.email}</p>
            <p>{item.phone}</p>
            <p>{item.mobile}</p>
            <button onClick={() => deleteFooterItem(item._id)}>Delete</button>
            <button onClick={() => handleEdit(item._id)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Footer;
