import './Message.css';
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function Message({ user_id }) {
  const [conversations, setConversations] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [users, setUsers] = useState([]);
  const [showNewSidebar, setShowNewSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  // Fetch rooms
  const fetchRoom = useCallback(() => {
    axios.get(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/room/${user_id}`)
      .then((response) => {
        setConversations(response.data);
        setSelectedFriend(response.data[0]);
      })
      .catch((error) => console.error("Erreur getting rooms:", error));
  }, [user_id]);

  useEffect(() => { fetchRoom(); }, [fetchRoom]);

  // Fetch messages
  const fetchMessages = (roomId) => {
    if (!roomId) return;
    axios.get(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/message/room/${roomId}`)
      .then((response) => setMessages(response.data))
      .catch((error) => console.error("Erreur lors du chargement des messages :", error));
  };

  useEffect(() => { if (selectedFriend) fetchMessages(selectedFriend.id); }, [selectedFriend]);

  // Fetch users & friendships
  useEffect(() => {
    if (!user_id) return;

    const fetchData = async () => {
      try {
        const usersRes = await fetch(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/users`);
        const usersData = await usersRes.json();

        const friendshipRes = await fetch(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/friendship/${user_id}`);
        const friendshipData = await friendshipRes.json();
        const friendships = friendshipData.data || [];

        const formattedUsers = usersData.map((user) => {
          const friendship = friendships.find(f => f.follower_id === user_id && f.followed_id === user.id);
          return {
            id: user.id,
            name: user.username,
            isFollowed: !!friendship,
            friendshipId: friendship ? friendship.id : null,
          };
        });

        const filteredOutSelf = formattedUsers.filter(u => u.id !== user_id);
        setUsers(filteredOutSelf);
      } catch (err) { console.error('Erreur lors de la récupération des données :', err); }
    };

    fetchData();
  }, [user_id]);

  const toggleUser = (user) => {
    if (isGroupMode) {
      setSelectedUsers((prev) =>
        prev.some((u) => u.id === user.id)
          ? prev.filter((u) => u.id !== user.id)
          : [...prev, user]
      );
    } else {
      setSelectedUsers([user]);
    }
  };

  const createRoom = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/room`,
        new URLSearchParams({
          name: selectedUsers.map((user) => user.name).join(', '),
          userIds: JSON.stringify([user_id, ...selectedUsers.map((user) => user.id)]),
          admin: user_id,
          type: isGroupMode ? 'group' : 'private',
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      setShowNewSidebar(false);
      fetchRoom();
    } catch (error) {
      console.error("Erreur lors de la création de la room :", error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedFriend) return;

    try {
      await axios.post(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/message`,
        new URLSearchParams({
          roomId: selectedFriend.id,
          userId: user_id,
          content: input.trim()
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      fetchMessages(selectedFriend.id);
      setInput('');
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
  };

  const handleModifyName = async () => {
    if (!newGroupName.trim()) {
      alert("Le nom ne peut pas être vide.");
      return;
    }
  
    try {
      await axios.put(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/room/${selectedFriend.id}`,
        { name: newGroupName }
      );
  
      alert("Nom du groupe modifié avec succès !");
      setShowSettings(false);
      setNewGroupName("");
  
      // On recharge les rooms après modification
      fetchRoom();
    } catch (error) {
      console.error("Erreur lors de la modification du nom :", error);
      alert("Une erreur est survenue lors du renommage.");
    }
  };
  
  const handleDeleteConversation = async () => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette conversation ?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/room/${selectedFriend.id}`
      );
  
      alert("Conversation supprimée avec succès !");
      setShowSettings(false);
      setSelectedFriend(null);
      fetchRoom();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };
  
  return (
    <div className="message-page">

      {/* Sidebar création conversation */}
      {showNewSidebar && (
        <div className={`new-sidebar ${showNewSidebar ? 'visible' : 'hidden'}`}>
          <div className="new-sidebar-header">
            <button onClick={() => setShowNewSidebar(false)} className="back-btn">←</button>
            <h3>Nouvelle discussion</h3>
          </div>

          <ul className={`new-options ${isGroupMode ? 'selected' : ''}`}>
            <li onClick={() => { setIsGroupMode(prev => !prev); setSelectedUsers([]); }}>
              👥 Nouveau groupe {isGroupMode && ''}
            </li>
          </ul>

          <div className="user-list">
            {users.map((user) => (
              <div key={user.id}
                className={`user-card ${selectedUsers.some((u) => u.id === user.id) ? 'selected' : ''}`}
                onClick={() => toggleUser(user)}>
                {user.name}
              </div>
            ))}
          </div>

          <button
            className={`new-convo-btn ${isGroupMode && selectedUsers.length < 2 ? 'disabled' : ''}`}
            onClick={createRoom}
            disabled={isGroupMode && selectedUsers.length < 2}
          >
            Nouvelle conversation
          </button>
        </div>
      )}

      {/* Popup réglages */}
      {showSettings && (
        <>
          <div className="modal-overlay" onClick={() => setShowSettings(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <span>Réglages du groupe</span>
              <button onClick={() => setShowSettings(false)}>❌</button>
            </div>

            <div className="modal-body">
              <input
                type="text"
                className="modal-input"
                placeholder="Nouveau nom du groupe"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <button className="modal-button" onClick={handleModifyName}>
                Modifier le nom
              </button>
              <button className="modal-button" onClick={handleDeleteConversation}>
                Supprimer la conversation
              </button>
            </div>
          </div>
        </>
      )}

      {/* Sidebar liste de conversations */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3 className="sidebar-title">Discussions</h3>
          <button className="add-group-btn" onClick={() => setShowNewSidebar(true)}>+</button>
        </div>

        <ul className="friend-list">
          {conversations.map((friend) => (
            <li key={friend.id}
              className={selectedFriend?.id === friend.id ? 'active' : ''}
              onClick={() => setSelectedFriend(friend)}>
              {friend.name || 'Sans nom'}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat window */}
      <div className="chat-window">
        <div className="chat-header">
          {selectedFriend?.name || '...'}

          {selectedFriend?.isAdministrator && (
            <button className="settings-btn" onClick={() => setShowSettings(true)}>
              Réglage
            </button>
          )}
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message-bubble ${msg.userId === user_id ? 'me' : 'friend'}`}>
              <div className="message-meta">{msg.user?.username || msg.user?.email || 'Utilisateur inconnu'}</div>
              {msg.content}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Écrire votre message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Envoyer</button>
        </div>
      </div>
    </div>
  );
}
