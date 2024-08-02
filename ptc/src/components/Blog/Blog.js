import React from 'react';

const Blog = () => {
  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: 'Introduction to Paid-to-Click (PTC) Sites',
      author: 'Emma Habumugisha',
      date: 'July 18, 2024',
      content: 'Paid-to-Click (PTC) sites are platforms where users can earn money by viewing advertisements. These sites offer a simple way for individuals to earn extra income online. By clicking on ads, users generate revenue for themselves and sometimes for their referrals as well.',
    },
    {
      id: 2,
      title: 'How to Earn Money through Referrals on Our PTC Site',
      author: 'Bonera Blaise',
      date: 'July 19, 2024',
      content: 'Referrals are a powerful way to boost earnings on our PTC site. By inviting friends, family, or followers to join, users can earn a percentage of their referrals\' earnings. This passive income stream can significantly enhance your earnings over time, making referrals a key strategy for maximizing earnings on our platform.',
    },
    {
      id: 3,
      title: 'Introducing PTC Master: Your Pathway to Earn Real Rewards',
      author: 'Bonera Blaise',
      date: 'July 19, 2024',
      content: `Welcome to PTC Master, where clicking becomes more than a routine action—it transforms into a gateway to real rewards. Join our dynamic community of earners who effortlessly convert their spare moments into valuable opportunities. Our platform offers intuitive navigation, ensuring that every click holds the potential to earn rewards, whether you're at home, on the move, or simply taking a break.\n\nAt PTC Master, we empower you to harness the power of your clicks and unlock a world of possibilities. Begin your journey today and experience firsthand how seamless and rewarding earning online can be with PTC Master.\n\nDiscover the ease, convenience, and limitless potential of earning rewards through PTC Master—where every click counts.`,
    },
    {
      id: 4,
      title: 'Tips for Maximizing Your Earnings on PTC Sites',
      author: 'Emma Habumugisha',
      date: 'July 20, 2024',
      content: `Earning money on PTC sites requires strategy and consistency. Here are some tips to maximize your earnings:\n\n1. Stay Active: Regularly log in to check for new ads.\n2. Refer Friends: Invite others to join using your referral link.\n3. Upgrade Membership: Consider upgrading for access to higher-paying ads.\n4. Complete Offers: Participate in surveys and other offers for additional earnings.\n5. Manage Referrals: Monitor your referrals\' activity and provide support.\n\nBy implementing these strategies, you can optimize your earnings and make the most out of your experience on PTC sites.`,
    },
  ];

  // Avatar URL for all authors
  const defaultUserAvatar = 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?size=626&ext=jpg&ga=GA1.1.1626850552.1721288209&semt=sph';

  // Function to generate the user icon URL based on the author's name
  const getUserIconUrl = (author) => {
    return defaultUserAvatar;
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-700">From Our Blog</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col lg:flex-row items-start">
              <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mr-6">
                <img
                  className="w-16 h-16 border-2 border-[#29625d] rounded-full object-cover"
                  src={getUserIconUrl(post.author)}
                  alt={post.author}
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{post.title}</h2>
                <p className="text-[#29625d] text-start font-medium mb-2">{post.author}</p>
                <p className="mt-2 text-gray-600 text-start">{post.content}</p>
                <p className="text-start mt-4 text-sm text-gray-700 font-medium">{post.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
