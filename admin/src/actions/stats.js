'use server';
import { connectMongo } from "@/lib/db";
import User from "@/lib/models/User";

export async function getDashboardStats() {
  await connectMongo();
  
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalExperts = await User.countDocuments({ role: 'expert' });
  const totalOrgs = await User.countDocuments({ role: 'organisation' });
  const totalAdmins = await User.countDocuments({ role: 'admin' });

  // Mock graph data (replace with real appointment data logic later)
  const graphData = [
    { name: 'Users', total: totalUsers },
    { name: 'Experts', total: totalExperts },
    { name: 'Orgs', total: totalOrgs },
  ];

  return {
    cards: { totalUsers, totalExperts, totalOrgs, totalAdmins },
    graph: graphData
  };
}