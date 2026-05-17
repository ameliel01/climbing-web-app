const routeModel = require('../models/routes.js');  // Assure-toi d'importer correctement ton modèle
const db = require('../models/database.js');         // Assure-toi également que ta base de données est bien configurée
const friendshipModel = require('../models/friendship.js'); // Import du modèle friendship
const postModel = require('../models/post.js'); // Import du modèle friendship
const likeModel = require('../models/like.js'); // Import du modèle friendship
const commentModel = require('../models/comment.js'); // Import du modèle friendship
const userModel = require('../models/user.js'); // Import du modèle friendship
const roomModel = require('../models/room.js'); // Import du modèle friendship
const messageModel = require('../models/message.js'); // Import du modèle friendship
const roomuserModel = require('../models/roomuser.js'); // Import du modèle friendship
(async () => {
  try {
    // Synchronisation de la base de données
    await db.sync({ force: true });
    console.log('Base de données régénérée.');

    const testUser = await userModel.create({
      id: '00000000-0000-0000-0000-000000000000',
      email: '00@00.00',
      username: 'test_user',
      first_name:'first_user',
      last_name: 'last_user'
    });
    // Créer une nouvelle route
    const testRoute = await routeModel.create({
      userId: "test_user",
      date: new Date(),
      route: 'Indoor',
      typeOfRoute: 'Verticale',
      cotation: '11',
      feeling: 'Nice!'
    });
    // Cree une amitié
    const testFriendship = await friendshipModel.create({
      follower_id: 'c7b9cd28-66a2-4422-864a-34a7ebd0cae8',
      followed_id: '9ea48a9b-e2db-48c4-b2bf-6d4ac1b3c0bf',
      status: 'pending'
    });
    // Cree un post
    const testPost = await postModel.create({
      user_id: '9ea48a9b-e2db-48c4-b2bf-6d4ac1b3c0bf',
      route_id: 1,
      content: "test_content"
    });
    const testLike = await likeModel.create({
      user_id: '9ea48a9b-e2db-48c4-b2bf-6d4ac1b3c0bf',
      post_id: 1
    });
    const testRoom = await roomModel.create({
      name:'test_room',
      type:'private'
    });
   
    const testRoomUser = await roomuserModel.create({
      roomId: 1,
      userId:'23e13422-f4d8-4fb7-825d-6379696bee49'
    });

    const testRoomUser2 = await roomuserModel.create({
      roomId: 1,
      userId:'9aaa81b1-9b36-4083-9cc6-7e0bfd315e24'
    });

    const testMessage= await messageModel.create({
      roomId: 1,
      userId:'9aaa81b1-9b36-4083-9cc6-7e0bfd315e24',
      content:'haha'
    });
 
    console.log(testPost);
    console.log(testLike);
    console.log(testFriendship);  
    console.log(testRoute);  
    console.log(testRoom);  
    console.log(testRoomUser);  
    console.log(testRoomUser2); 
    console.log(testMessage);
  } catch (error) {
    console.error('Erreur lors de la création de la route :', error);
  }
})();
