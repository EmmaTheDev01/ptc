import React, { useState } from "react";

const WithdrawForm = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        userEmail: "",
        phone: "",
        amount: "",
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
        // Example: Submit formData to backend API or save to database
        // Ensure to handle validation, data formatting, and API calls appropriately
    };

    return (
        <div className="flex justify-center mt-10">
            <div className="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-center text-2xl font-bold mb-6">Withdraw Money</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 flex flex-col">
                        <label
                            htmlFor="fullName"
                            className="text-gray-700 text-sm font-bold mb-2"
                        >
                            Full Name
                        </label>
                        <input
                            className="appearance-none bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="fullName"
                            type="text"
                            placeholder="Jane Doe"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4 flex flex-col">
                        <label
                            htmlFor="userEmail"
                            className="text-gray-700 text-sm font-bold mb-2"
                        >
                            Email Address
                        </label>
                        <input
                            className="appearance-none bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="userEmail"
                            type="email"
                            placeholder="example@example.com"
                            value={formData.userEmail}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4 flex flex-col">
                        <label
                            htmlFor="phone"
                            className="text-gray-700 text-sm font-bold mb-2"
                        >
                            Phone Number
                        </label>
                        <input
                            className="appearance-none bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="phone"
                            type="tel"
                            placeholder="123-456-7890"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-6 flex flex-col">
                        <label
                            htmlFor="amount"
                            className="text-gray-700 text-sm font-bold mb-2"
                        >
                            Amount to Withdraw
                        </label>
                        <input
                            className="appearance-none bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="amount"
                            type="number"
                            placeholder="Enter amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            className="bg-[#29625d] hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Withdraw
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-600 text-xs mt-3">
                    Please fill out all fields to withdraw money.
                </p>
            </div>
        </div>
    );
};

export default WithdrawForm;
