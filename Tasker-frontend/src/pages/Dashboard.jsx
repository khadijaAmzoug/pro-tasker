import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold text-[#283593]">Dashboard</h2>
        <p>Welcome to Pro-Tasker 🎉</p>
      </div>
    </>
  );
}
