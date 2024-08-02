import React, { useContext, useEffect, useState } from 'react';
import NavBar from '../components/NavBar/NavBar';
import FreePlan from '../components/plans/FreePlan';
import BasicPlan from '../components/plans/BasicPlan';
import Premium from '../components/plans/Premium';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';

const Plans = () => {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!isLoggedIn && !loading) {
      setRedirect(true);
    }
  }, [isLoggedIn, loading]);

  if (redirect) {
    return (
      <>
        <NavBar />
        <div className="bg-white py-12 px-6 sm:py-16 sm:px-12 text-center">
          <h1 className="text-4xl font-bold leading-tight text-gray-800 sm:text-5xl">
            Please Log In
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            You need to be logged in to view this page.
          </p>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return null; // Render loading indicator or empty screen while loading
  }

  return (
    <div>
      <NavBar />
      <div className="bg-white py-12 px-6 sm:py-16 sm:px-12">
        <div className="max-w-4xl mx-auto text-center mb-20 sm:mb-0">
          <h1 className="text-4xl font-bold leading-tight text-gray-800 sm:text-5xl">
            Choose the Perfect Plan for You
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            We offer a range of plans to suit your needs, whether you're just getting started or ready to take your ad revenue to the next level. Explore our plans below to find the best fit for you!
          </p>
          <div className="mt-8 space-y-4">
            <p className="text-gray-500">
              <strong>Did you know?</strong> Our platform has helped thousands of users achieve their ad revenue goals. With features designed to maximize your earnings and provide valuable insights, you’ll be on your way to success in no time.
            </p>
            <p className="text-gray-500">
              <strong>Pro Tip:</strong> Start with our Free Plan to explore the basics and see how our platform works. When you're ready for more advanced features, upgrade to one of our paid plans for even greater benefits.
            </p>
            <p className="text-gray-500">
              <strong>Interesting Fact:</strong> Our Premium Plan includes exclusive features like personalized support and advanced analytics to give you a competitive edge in the ad market.
            </p>
          </div>
        </div>
      </div>
      <div className='flex justify-start items-start w-full flex-wrap bg-gray-50 p-6'>
        <FreePlan />
        <BasicPlan />
        <Premium />
      </div>
      <Footer />
    </div>
  );
};

export default Plans;
