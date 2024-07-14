import React from 'react';

const posts = [
  {
    id: 1,
    title: "Boost your conversion rate",
    description:
      "The best platform for increasing ad revenue. Easy to use and highly effective. I’ve seen a significant boost in my earnings!",
    date: "Jul 14, 2024",
    category: { title: "Marketing" },
    author: {
      name: "Emma Johnson",
      role: "Digital Marketer",
      imageUrl:
        "https://via.placeholder.com/400x400.png?text=Emma+Johnson",
    },
    rating: 5,
  },
  {
    id: 2,
    title: "Excellent ad platform",
    description:
      "Fantastic platform for anyone looking to monetize their traffic. The process is straightforward and the support is top-notch.",
    date: "Jun 25, 2024",
    category: { title: "Advertising" },
    author: {
      name: "John Smith",
      role: "Affiliate Marketer",
      imageUrl:
        "https://via.placeholder.com/400x400.png?text=John+Smith",
    },
    rating: 4,
  },
  {
    id: 3,
    title: "Great user experience",
    description:
      "I’m really impressed with the ease of use and the results I’ve achieved with this ad platform. Highly recommend it for beginners!",
    date: "May 10, 2024",
    category: { title: "User Experience" },
    author: {
      name: "Sophie Lee",
      role: "Content Creator",
      imageUrl:
        "https://via.placeholder.com/400x400.png?text=Sophie+Lee",
    },
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-700 sm:text-4xl">
            What Our Users Say
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Discover how our ad platform is helping users achieve their goals.
          </p>
        </div>
        <div className="mx-auto mt-10 grid grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex max-w-xl flex-col items-center justify-between p-6 bg-gray-50 rounded-lg shadow-lg hover:bg-gray-100"
            >
              <div className="relative flex items-center gap-x-4 text-xs mb-4">
                <time dateTime={post.date} className="text-gray-500">
                  {post.date}
                </time>
                <div className="relative z-10 rounded-full bg-gray-200 px-3 py-1.5 font-medium text-[#29625d] hover:bg-gray-300">
                  {post.category.title}
                </div>
              </div>
              <div className="group relative mb-6 text-center">
                <h3 className="text-lg font-semibold leading-6 text-gray-600 group-hover:text-gray-700">
                  {post.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {post.description}
                </p>
                <div className="mt-4 flex justify-center items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${i < post.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="relative flex items-center gap-x-4">
                <img
                  src={post.author.imageUrl}
                  alt={post.author.name}
                  className="h-12 w-12 rounded-full bg-gray-50"
                />
                <div className="text-sm leading-6">
                  <p className="font-semibold text-[#29625d]">
                    {post.author.name}
                  </p>
                  <p className="text-gray-500">{post.author.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
