// pages/leaderboard.js
import { useEffect, useState } from 'react';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      setUsers(data);
    };
    fetchLeaderboard();
  }, []);

  return (
    <center>
      <h1 style={{ color: 'black' }}
      >Leaderboard</h1>
      <br/>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.firstName}</td>
              <td>{user.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </center>
  );
}