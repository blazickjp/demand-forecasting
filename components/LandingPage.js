export default function LandingPage({ onProceed }) {
    return (
      <div className="w-full max-w-md">
        {/* ... */}
        <p className="mb-8 text-gray-700 dark:text-gray-300">
          Start using our Demand Forecasting App today to unlock the potential of data-driven decision-making and see the positive impact on your small retail business.
        </p>
        <button
          onClick={onProceed}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Proceed
        </button>
      </div>
    );
  }
  