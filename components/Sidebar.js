export default function Sidebar({ activeTab, setActiveTab }) {
    const Tab = ({ tabName }) => {
      const isActive = activeTab === tabName;
      return (
        <li
          className={`cursor-pointer py-3 px-6 block hover:text-blue-500 focus:outline-none text-gray-800 dark:text-gray-300 ${
            isActive ? 'text-blue-500 border-b-2 font-medium border-blue-500' : ''
          }`}
          onClick={() => setActiveTab(tabName)}
        >
          {tabName}
        </li>
      );
    };
  
    return (
      <div className="w-64 h-screen bg-white dark:bg-gray-900 shadow-md">
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-6">Demand Forecasting App</h1>
          <ul className="border-b flex items-center justify-between">
            <Tab tabName="Home" />
            <Tab tabName="Forecast" />
          </ul>
        </div>
      </div>
    );
  }
  