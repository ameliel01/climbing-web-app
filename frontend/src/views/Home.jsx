import './Home.css'
import React, { useState, useEffect } from "react";
import axios from "axios";
import PostPerformance from '../components/PostPerformance';

export default function Home({ user_id }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/user/${user_id}/post/`)
      .then((response) => {
        console.log("Got all post:", response.data);
        setPosts(response.data); // <- tableau de posts
      })
      .catch((error) => {
        console.error("Erreur getting post:", error);
      });
  }, [user_id]);

  return (
    <div className="home-page">
      <h1>Voici les dernières news coté grimpe !</h1>
      {posts && posts.map((p) => (
        <PostPerformance key={p.id} post_id={p.id} user_id={user_id} createdAt={p.createdAt} route={p.route} content={p.content} />
    ))}

    </div>
  );
}
