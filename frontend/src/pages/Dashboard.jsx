import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <Link
        to="/whiteboard"
        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
      >
        Go to Whiteboard
      </Link>
    </div>
  );
};

export default Dashboard;
