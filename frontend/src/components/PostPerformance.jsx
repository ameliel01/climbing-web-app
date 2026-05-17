import React from 'react';
import './PostPerformance.css';
import { inverseCotationScale } from "./cotation";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';

export default function PostPerformance({ user_id, post_id, createdAt, route, content }) {
    const [user, setUser] = useState(null);
    const [isLiked, setIsLiked] = useState(null);
    const [comments, setComments] = useState([]);
    const [countLike, setCountLike] = useState(0);
    const [commentInput, setCommentInput] = useState('');
    const fetchComments = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/comment/${post_id}`);
          if (response.ok) {
            const data = await response.json();
            setComments(data); // data = tableau de commentaires
          } else {
            console.error("Erreur lors du fetch des commentaires");
          }
        } catch (error) {
          console.error("Erreur API commentaire :", error);
        }
    };
    // Chargement initial : user, statut du like, et compteur
    useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await fetch(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/users/${route.userId}`);
            if (response.ok) {
              const data = await response.json();
              setUser(data.username);
            }
          } catch (error) {
            console.error("Erreur fetch utilisateur :", error);
          }
        };
      
        const checkIfLiked = async () => {
          try {
            const response = await fetch(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/like/${user_id}/${post_id}/status`);
            if (response.ok) {
              const data = await response.json();
              setIsLiked(data.liked);
            }
          } catch (error) {
            console.error("Erreur fetch like status :", error);
          }
        };
      
        const fetchLikeCount = async () => {
          try {
            const response = await fetch(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/like/${post_id}/count`);
            if (response.ok) {
              const data = await response.json();
              setCountLike(data.likes);
            }
          } catch (error) {
            console.error("Erreur fetch count :", error);
          }
        };
    
        const initialize = async () => {
          await fetchUser();
          await checkIfLiked();
          await fetchLikeCount();
          await fetchComments();
        };
      
        initialize();
      }, [route.userId, user_id, post_id]); 
  
    
      const handleCommentSubmit = async () => {
        if (!commentInput.trim()) return;
      
        try {
          const response = await fetch(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/comment/${post_id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: commentInput,
              author: user_id, // ou currentUserId si tu le stockes ailleurs
            }),
          });
      
          if (response.ok) {
            const newComment = await response.json();
            console.log('Commentaire ajouté :', newComment);
            setCommentInput(''); // vider le champ
      
            // optionnel : recharger les commentaires existants
            fetchComments(); // si tu as une fonction qui recharge les commentaires
          } else {
            console.error("Erreur lors de l'ajout du commentaire");
          }
        } catch (error) {
          console.error("Erreur réseau :", error);
        }
      };
      
    const handleLike = async () => {
        try {
            const method = isLiked ? 'DELETE' : 'POST';
            const response = await fetch(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/like/${user_id}/${post_id}`, {
                method,
            });

            if (response.ok) {
                console.log(isLiked ? "Unliked" : "Liked");
                setIsLiked(!isLiked);
                setCountLike(prev => isLiked ? prev - 1 : prev + 1);
            } else {
                console.error("Échec mise à jour like");
            }
        } catch (error) {
            console.error("Erreur mise à jour like :", error);
        }
    };

    return (
        <div className="post-performance">
            <div className="post-date">{dayjs(createdAt).format('YYYY-MM-DD HH:mm')}</div>
            <p className="post-title">
                {user ? `${user} a ajouté une nouvelle performance à sa progression` : "Chargement..."}
            </p>

            <div className="post-meta">
                <div>{route.route}</div>
                <div>{inverseCotationScale[route.cotation]}</div>
                <div>{route.typeOfRoute}</div>
            </div>

            <div className="post-ressenti">
                "{route.feeling}"
                <div className="likes">{countLike} likes</div>
            </div>

            <div className="post-bottom">
                <div className="button-like" onClick={handleLike}>
                    {isLiked ? "Unliker" : "Liker"}
                </div>
                <div className="button-profil">Voir son profil</div>
            </div>

            <div className="post-commentaires">
                <p className="commentaire-title">Commentaires</p>
                {comments.length > 0 ? (
                    <ul>
                        {comments.map((comment, index) => (
                            <li key={index}>{comment.content}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucun commentaire pour le moment.</p>
                )}
            </div>
            <div className="commentaire-form">
                <input
                    type="text"
                    placeholder="Écrire votre commentaire..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                />
                <button onClick={handleCommentSubmit}>Commenter</button>
            </div>
        </div>
    );
}
