// pages/api/leaderboard.js
import User from '@/models/User';

export default async function handler(req, res) {
  // get top 10 users by Points
  const users = await User.find({}).sort({ points: -1 }).limit(10).select('firstName points');
  return res.status(200).json(users);

}