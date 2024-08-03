// Contact.js

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createContact } from "../../redux/actions/contactActions";
import { toast, ToastContainer } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import "./contact.css";
import axiosInstance from "../../api/axiosInstance";

const Contact = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.contact);
  const [addresses, setAddresses] = useState([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    axiosInstance
      .get("api/gettopnav")
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const topNavData = response.data[0]; // Assuming you are fetching a single topNav record
          setAddresses(topNavData.addresses || []); // Ensure addresses is an array or fallback to empty array
          setEmail(topNavData.email || ""); // Set email from topNavData
          setPhone(topNavData.phone || "");
        } else {
          setAddresses([]); // Fallback to empty array if no data returned
        }
      })
      .catch((error) => {
        console.error("Error fetching addresses:", error);
      });
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(
        /^[a-zA-Z\s]+$/,
        "Name should not contain numbers or special characters"
      )
      .max(15, "Name must be at most 15 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address format")
      .required("Email is required"),
    phone: Yup.string()
      .matches(
        /^[1-9][0-9]{9,14}$/,
        "Phone number must be between 10 and 15 digits and should not start with 0"
      )
      .required("Phone is required"),
    category: Yup.string().required("Category is required"),
    message: Yup.string().required("Message is required"),
    location: Yup.string()
      .matches(
        /^[a-zA-Z\s,-]+$/,
        "Location should not contain special characters or numbers"
      )
      .required("Location is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const trimmedValues = {
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      category: values.category.trim(),
      message: values.message.trim(),
      location: values.location.trim(),
    };

    try {
      await dispatch(createContact(trimmedValues));
      alert("Contact successfully sent");
      resetForm();
    } catch (error) {
      alert("Failed to send contact");
    } finally {
      setSubmitting(false);
    }
  };

  const map =
    "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3927.8962979536127!2d77.54450397503258!3d10.107573990003425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTDCsDA2JzI3LjMiTiA3N8KwMzInNDkuNSJF!5e0!3m2!1sen!2sin!4v1718969311660!5m2!1sen!2sin";

  return (
    <>
      <div className="container-fluid bg-breadcrumb">
        <div className="container text-center py-5" style={{ maxWidth: 900 }}>
          <h3
            className="text display-3 mb-4 wow fadeInDown"
            style={{ fontWeight: "600", fontSize: "7vw", color: "black" }}
            data-wow-delay="0.1s"
          >
            Contact Us
          </h3>
        </div>
      </div>
      <section className="contacts padding">
        <div className="container shadow grid">
          <div className="left">
            <iframe src={map} title="Google Map"></iframe>
          </div>
          <div className="right">
            <h1>Contact us</h1>
            <p>We're open for any suggestion or just to have a chat</p>
            <div className="items grid2">
              {addresses.map((address, index) => (
                <div className="box" key={index}>
                  <h4>ADDRESS:</h4>
                  <p>{`${address.street}, ${address.city}, ${address.state}, ${address.country} - ${address.pincode}`}</p>
                </div>
              ))}
              <div className="box">
                <h4>EMAIL:</h4>
                <p>{email}</p>
              </div>
              <div className="box">
                <h4>PHONE:</h4>
                <p>{phone}</p>
              </div>
            </div>
            <Formik
              initialValues={{
                name: "",
                email: "",
                phone: "",
                category: "",
                message: "",
                location: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field type="text" name="name" placeholder="Name" />
                  <ErrorMessage
                    name="name"
                    style={{ fontSize: "22px", marginBottom: "15px" }}
                    component="div"
                    className="error"
                  />
                  <Field type="email" name="email" placeholder="Email" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error"
                    style={{ fontSize: "22px", marginBottom: "15px" }}
                  />
                  <Field type="text" name="phone" placeholder="Phone" />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="error"
                    style={{ fontSize: "22px", marginBottom: "15px" }}
                  />
                  <Field as="select" name="category">
                    <option value="">Select Category</option>
                    <option value="General Enquiry">General Enquiry</option>
                    <option value="Product">Product</option>
                    <option value="Complaint">Complaint</option>
                    <option value="Other">Other</option>
                  </Field>
                  <ErrorMessage
                    style={{ fontSize: "22px", marginBottom: "15px" }}
                    name="category"
                    component="div"
                    className="error"
                  />
                  <Field as="textarea" name="message" placeholder="Message" />
                  <ErrorMessage
                    name="message"
                    component="div"
                    className="error"
                    style={{ fontSize: "22px", marginBottom: "15px" }}
                  />
                  <Field type="text" name="location" placeholder="Location" />
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="error"
                    style={{ fontSize: "22px", marginBottom: "15px" }}
                  />
                  <button
                    className="primary-btn"
                    type="submit"
                    disabled={isSubmitting || loading}
                  >
                    SEND MESSAGE
                  </button>
                  {error && <p>{error}</p>}
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <ToastContainer />
      </section>
    </>
  );
};

export default Contact;
