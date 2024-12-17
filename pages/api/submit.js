// pages/api/login.js
import connectMongo from '@/lib/mongodb';
import MapPlays from '@/models/MapPlays';
import User from '@/models/User';
import locs from '../../public/locs.json';
function checkIfCorrect(x,y,correctX,correctY){
  //distance radius within 5
  const dist = Math.sqrt((x-correctX)**2 + (y-correctY)**2);
  return dist<=5;

}

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === 'POST') {

    const { x,y,locId,secret } = req.body;
    const id = locId;
    const loc = locs[id-1];

    // find the user with the secret
    let user = await User.findOne({
      secret
    });
    let plays = await MapPlays.findOne({
      mapId: id
    });
    if(!plays) {
      plays = await MapPlays.create({
        mapId: id,
        plays: 0,
      });
    }


    // make sure user ahsnt already played
    if(
      user.history.length >= id &&
      user.history[id-1] !== null) {
      return res.status(400).json({ error: 'You have already played this location' });
    }
    console.log(plays)

    const points = (100-plays.plays) * (checkIfCorrect(x,y,loc.x,loc.y)?1:0.5);


    user.points += points;

    // increase plays by 1
    plays.plays += 1;
    await plays.save();


    if(user.history.length < id) {
      // extend the history array
      while(user.history.length < id) {
        user.history.push(null);
      }
    }

    // update the user's history
    user.history[id-1] = points;
    await user.save();

    return res.status(200).json({ message: 'Success', points });




  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}