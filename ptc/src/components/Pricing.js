import { CheckIcon } from "@heroicons/react/20/solid";

const includedFeatures = [
  "Private forum access",
  "Member resources",
  "Entry to annual conference",
  "Official member t-shirt",
];

export default function Pricing() {
  return (
    <div className="bg-slate-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Our plans
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            At PTC Master, we offer two streamlined plans designed to match your
            earning ambitions. Whether you're looking for a casual way to earn
            rewards or aiming for higher benefits, our plans cater to your
            needs.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-bold tracking-tight text-gray-300">
              Lifetime membership
            </h3>
            <p className="mt-6 text-base leading-7 text-gray-600">
              Here is what you get from our premium packages.
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-green-600">
                What’s included
              </h4>
              <div className="h-px flex-auto bg-gray-100" />
            </div>
            <ul
              role="list"
              className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
            >
              {includedFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    className="h-6 w-5 flex-none text-green-600"
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:flex-shrink-0">
            <div className="rounded-2xl bg-slate-700 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-300">
                  Pay once, own it forever
                </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    20,000
                  </span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-green-500">
                    RWF
                  </span>
                </p>
                
                <p className="mt-6 text-xs leading-5 text-gray-300">
                  Invoices and receipts available for easy company reimbursement
                </p>
                <a
                  href="#"
                  className="mt-10 block w-full rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  Get access
                </a>
              </div>
            </div>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:flex-shrink-0">
            <div className="rounded-2xl bg-slate-700 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-300">
                  Pay once, own it forever
                </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    30,000
                  </span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-green-500">
                    RWF
                  </span>
                </p>
                
                <p className="mt-6 text-xs leading-5 text-gray-300">
                  Invoices and receipts available for easy company reimbursement
                </p>
                <a
                  href="#"
                  className="mt-10 block w-full rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  Get access
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
