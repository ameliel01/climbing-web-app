import './Search.css';
import { React, useState, useEffect } from 'react';

export default function Search({ user_id }) {
  console.log(user_id);
  const [filter, setFilter] = useState('all');
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user_id) return;

    const fetchData = async () => {
      try {
        // 1. Récupérer tous les utilisateurs
        const usersRes = await fetch(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/users`);
        const usersData = await usersRes.json();

        // 2. Récupérer les amitiés de l'utilisateur courant
        const friendshipRes = await fetch(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/friendship/${user_id}`);
        const friendshipData = await friendshipRes.json();
        const friendships = friendshipData.data || [];

        // 3. Mapper les utilisateurs avec leurs amitiés
        const formattedUsers = usersData.map((user) => {
          const friendship = friendships.find(
            (f) => f.follower_id === user_id && f.followed_id === user.id
          );
          return {
            id: user.id,
            name: user.username,
            isFollowed: !!friendship,
            friendshipId: friendship ? friendship.id : null, // Inclure l'ID de l'amitié
          };
        });

        // 4. Enlever l'utilisateur lui-même de la liste
        const filteredOutSelf = formattedUsers.filter(u => u.id !== user_id);

        setUsers(filteredOutSelf);
      } catch (err) {
        console.error('Erreur lors de la récupération des données :', err);
      }
    };

    fetchData();
  }, [user_id]);

  const followUser = async (followed_id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/friendship`, { // Fixed the URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follower_id: user_id, followed_id }),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la création de l\'amitié');
      }

      const newFriendship = await res.json();
      setUsers((prev) =>
        prev.map((u) =>
          u.id === followed_id
            ? { ...u, isFollowed: true, friendshipId: newFriendship.data.id }
            : u
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const unfollowUser = async (friendshipId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/friendship/${friendshipId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la suppression de l\'amitié');
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.friendshipId === friendshipId
            ? { ...u, isFollowed: false, friendshipId: null }
            : u
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollow = (id, isFollowed, friendshipId) => {
    if (isFollowed) {
      unfollowUser(friendshipId);
    } else {
      followUser(id);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredUsers =
    filter === 'friends' ? users.filter((u) => u.isFollowed) : users;

  const displayedUsers = filteredUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="user-search-wrapper">
      <div className="user-search-container">
        <input
          type="text"
          placeholder="Barre de recherche"
          className="search-bar"
          value={searchTerm}
          onChange={handleSearch}
        />

        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            Utilisateur de l’application
          </button>
          <button
            className={filter === 'friends' ? 'active' : ''}
            onClick={() => setFilter('friends')}
          >
            Mes amis
          </button>
        </div>

        <div className="user-list">
          {displayedUsers.map((user) => (
            <div className="user-card" key={user.id}>
              <div
                className="user-name"
                onClick={() => alert(`Aller au profil de ${user.name}`)}
              >
                {user.name}
              </div>
              <button
                className={`follow-button ${user.isFollowed ? 'followed' : ''}`}
                onClick={() => handleFollow(user.id, user.isFollowed, user.friendshipId)}
              >
                {user.isFollowed ? 'SUIVI' : 'SUIVRE'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
