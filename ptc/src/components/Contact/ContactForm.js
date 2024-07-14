/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import axios from "axios";  // Import axios
import { Field, Label, Switch } from "@headlessui/react";
import { server } from "../../utils/server";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import the CSS for toast notifications

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ContactForm() {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  // Form state management
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    message: '',
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreed) {
      toast.warning('Please agree to the privacy policy before submitting.', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await axios.post(`${server}/contact/send`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // If the response is successful, show a success toast and navigate to the earn page
      if (response.status === 200) {
        toast.success('Your message has been sent successfully!', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });

        // Clear form fields and reset the agreed state
        setFormData({
          firstname: '',
          lastname: '',
          email: '',
          phone: '',
          message: '',
        });
        setAgreed(false);

        // Navigate to the earn page
        navigate('/earn');
      }
    } catch (error) {
      // Show an error toast
      toast.error('There was an error sending your message. Please try again.', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
      console.error("Error sending message:", error.message);
    }
  };

  return (
    <div className="bg-white px-4 py-12 sm:py-20 lg:px-8 flex flex-col lg:flex-row gap-8">
      {/* Contact Details Section */}
      <div className="w-full lg:w-1/2 px-4 py-6 bg-white ">
        <div className="max-w-lg mx-auto">
          <h2 className="text-3xl font-bold text-start sm:text-4xl mb-4 text-[#29635d]">
            Contact Details
          </h2>
          <p className="text-md text-gray-600 mb-6 text-start">
            You can reach out to us using the contact details provided below,
            and we will make sure to get back to you as soon as possible.
            Whether you have questions, need assistance, or just want to get in
            touch, we are here to help. Our team is dedicated to providing you
            with the support you need, and we look forward to hearing from you.
            Don’t hesitate to reach out; we’re eager to assist you and will
            respond as quickly as we can.
          </p>

          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-md font-bold text-[#29625d] mr-4">
                Email:
              </span>
              <p className="text-md text-gray-700">guriraline@kptc.com</p>
            </div>
            <div className="flex items-center">
              <span className="text-md font-bold text-[#29625d] mr-4">
                Phone:
              </span>
              <p className="text-md text-gray-700">(250) 789 485 436</p>
            </div>
            <div className="flex items-center">
              <span className="text-md font-bold text-[#29625d] mr-4">
                Address:
              </span>
              <p className="text-md text-gray-700">
                KK 18 AVE Main Street, Kigali RW
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 px-4 py-6">
        <h4 className="text-3xl font-bold text-center sm:text-4xl mb-4 text-[#29625d]">
          Get in touch
        </h4>
        <p className="text-md text-gray-600 mb-6 text-center">
          Shoot us a message and we will get back to you as soon as possible
        </p>
        <form className="mt-12 max-w-xl mx-auto" onSubmit={handleSubmit}>
          {/* First Name and Last Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 mt-6">
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-semibold text-[#29625d]"
              >
                First name
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                autoComplete="given-name"
                className="w-full px-3.5 py-2 text-[#29625d] placeholder-gray-400 bg-gray-100 rounded-md shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-[#29625d] sm:text-sm sm:leading-6"
                value={formData.firstname}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="lastname"
                className="block text-sm font-semibold text-[#29625d]"
              >
                Last name
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                autoComplete="family-name"
                className="w-full px-3.5 py-2 text-[#29625d] placeholder-gray-400 bg-gray-100 rounded-md shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-[#29625d] sm:text-sm sm:leading-6"
                value={formData.lastname}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email and Phone Number Fields */}
          <div className="mt-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#29625d]"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                className="w-full px-3.5 py-2 text-[#29625d] placeholder-gray-400 bg-gray-100 rounded-md shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-[#29625d] sm:text-sm sm:leading-6"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-[#29625d]"
              >
                Phone number
              </label>
              <div className="relative mt-1">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                  className="w-full px-3.5 py-2 pl-16 text-[#29625d] placeholder-gray-400 bg-gray-100 rounded-md shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-[#29625d] sm:text-sm sm:leading-6"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-y-6 sm:gap-x-8 mt-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-[#29625d]"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full px-3.5 py-2 text-[#29625d] placeholder-gray-400 bg-gray-100 rounded-md shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-[#29625d] sm:text-sm sm:leading-6"
                placeholder=""
                value={formData.message}
                onChange={handleChange}
              />
            </div>
            <Field
              as="div"
              className="flex items-center gap-x-4 sm:col-span-2 mt-4"
            >
              <Switch
                checked={agreed}
                onChange={setAgreed}
                className={classNames(
                  agreed ? "bg-[#29625d]" : "bg-gray-200",
                  "flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29625d]"
                )}
              >
                <span className="sr-only">Agree to policies</span>
                <span
                  className={classNames(
                    agreed ? "translate-x-3.5" : "translate-x-0",
                    "h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out"
                  )}
                  aria-hidden="true"
                />
              </Switch>
              <Label className="text-sm text-gray-600 leading-6">
                By selecting this, you agree to our{" "}
                <a href="#" className="font-semibold text-[#29625d]">
                  privacy policy
                </a>
                .
              </Label>
            </Field>
            <div className="mt-8">
              <button
                type="submit"
                className="w-full px-3.5 py-2.5 text-sm font-semibold text-white bg-[#29625d] rounded-md shadow-sm hover:bg-[#fed7b1] focus:ring-2 focus:ring-[#29625d] focus:ring-offset-2 focus:ring-offset-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#29625d]"
              >
                Contact Us
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
