// pages/api/login.js
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === 'POST') {
    console.log(req.body)
    const { firstName, studentId } = req.body;

    if (!firstName || !studentId) {
      return res.status(400).json({ error: 'First name and student ID are required.' });
    }

    try {
      // Check if the user already exists
      let user = await User.findOne({ studentId });

      if (!user) {
        // Create a new user if none exists
        user = await User.create({
          firstName,
          studentId,
        });
        return res.status(201).json({ message: 'User created', user });
      }

      // Log the user in
      return res.status(200).json({ message: 'User logged in', user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
