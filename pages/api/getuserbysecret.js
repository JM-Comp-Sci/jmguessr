import connectMongo from '@/lib/mongodb';

import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { secret } = req.query;

  if (!secret) {
    return res.status(400).json({ error: "Missing secret parameter" });
  }

  try {
    await connectMongo();
    const user = await User.findOne({ secret });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error retrieving user by secret:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
