import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from '../../utils/server';

const AllContactSubmits = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true); // Start loading indicator

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found'); // Handle this case according to your app's logic
        }

        const response = await axios.get(`${server}/contact`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Sort contacts by createdAt date from newest to oldest
        const sortedContacts = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setContacts(sortedContacts);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) return <p className='w-auto ml-auto mr-auto mt-4'>Loading...</p>;
  if (error) return <p className='w-auto ml-auto mr-auto mt-4'>Error fetching contacts: {error.message}</p>;

  return (
    <div className='w-full'>
      <section className='p-6 m-2 w-full'>
        <div className="mb-4 w-full">
          <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2 w-full">
            <div className="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
              <div>
                <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900 mb-1">
                  Contact Submissions
                </h6>
                <p className="block antialiased tracking-normal font-sans text-sm leading-normal font-normal text-blue-gray-600">
                  View all contact submissions
                </p>
              </div>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        First Name
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Last Name
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Email
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Phone
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Message
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Date
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map(contact => (
                    <tr key={contact._id}>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 text-start">
                          {contact.firstname}
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 text-start">
                          {contact.lastname}
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-600 text-start">
                          {contact.email}
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-600 text-start">
                          {contact.phone}
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-600 text-start">
                          {contact.message}
                        </p>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50">
                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-600 text-start">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AllContactSubmits;
