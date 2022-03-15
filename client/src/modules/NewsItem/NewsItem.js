import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactHtmlParser from "react-html-parser";
import { Link, useParams } from "react-router-dom";
import excellent from "./assets/star.png";
import good from "./assets/smiling-face.png";
import confused from "./assets/confused.png";
import bad from "./assets/bad-mood.png";
import fb from "./assets/facebook.ico";
import ig from "./assets/instagram.ico";
import tw from "./assets/twitter.ico";
import wpp from "./assets/whatsapp.ico";
import email from "./assets/email.png"
import { BeatLoader } from "react-spinners";
import swal from "sweetalert";
import { Helmet } from "react-helmet";

const NewsItem = () => {
  const [singlePost, setSinlgePost] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loader, setLoader] = useState(true);
  const [rated, setRated] = useState(false);
  const { id } = useParams();

  const handleRate = (rate) => {
    const numberOfRates = singlePost.ratesNumber + 1;
    const rateAcumulator = singlePost.ratesAcumulator + rate;
    const ratePromedy = rateAcumulator / numberOfRates;
    axios
      .patch(
        `https://lujan-en-5-api.herokuapp.com/api/posts/updates/${singlePost._id}`,
        {
          ratesNumber: numberOfRates,
          ratesAcumulator: rateAcumulator,
          ratesPromedy: ratePromedy,
        }
      )
      .then(() =>
        swal({
          title: "gracias por tu valoración",
          button: "aceptar",
          icon: "success",
        })
      )
      .then(() => setRated(true));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(`https://lujan-en-5-api.herokuapp.com/api/posts/${id}`)
      .then((res) => setSinlgePost(res.data))
      .then(() => setLoader(false))
      .then(
        axios
          .get("https://lujan-en-5-api.herokuapp.com/api/posts")
          .then((res) => setPosts(res.data))
          .then(()=>handleViews())
      );
  }, [id]);

  console.log(singlePost);

  const handleViews = () => {
    const views = singlePost.clicks + 1;

    axios.patch(
      `https://lujan-en-5-api.herokuapp.com/api/posts/updates/${singlePost._id}`,
      {
        clicks: views,
      }
    );
  };
  handleViews();

  return loader ? (
    <div className=" w-screen h-screen pb-52 flex justify-center items-center">
      <BeatLoader />
    </div>
  ) : (
    <div>
      <div className="news-page">
        <Helmet>
          <meta property="og:title" content={singlePost.title} />
          <meta property="og:description" content={singlePost.copete} />
          <meta property="og:image" content={singlePost.photo} />
          <meta
            property="og:url"
            content={`http://www.lujanen5.com/noticias/${singlePost._id}`}
          />
        </Helmet>
        {
          <div className="news-item">
            <h4>{singlePost.category}</h4>

            <h2>{singlePost.title}</h2>
            <div className="social-media">
              <a
                href={`https://www.facebook.com/sharer.php?u=https://l5postsog.netlify.app/posts/${singlePost._id}`}
                target="_blank"
              >
                <img src={fb} alt="" />
              </a>
              <a
                href={`mailto:?subject=Nota de luján en 5&amp;body=Luján en 5 hizo una publicación https://l5postsog.netlify.app/posts/${singlePost._id}.`}
              >
                <img src={email} alt="" />
              </a>
              <a
                href={`https://twitter.com/share?url=https://l5postsog.netlify.app/posts/${singlePost._id}&text=${singlePost.title}`}
              >
                <img src={tw} alt="" />
              </a>

              <a
                href={`https://wa.me/?text=${singlePost.title} https://l5postsog.netlify.app/posts/${singlePost._id}`}
                target="_blank"
              >
                <img src={wpp} alt="" />
              </a>
            </div>
            <img src={singlePost.photo} alt="" />
            <div className="news-body">
              <div className="column-social">
                <div className="social-col-items">
                  <a
                    href={`https://www.facebook.com/sharer.php?u=https://l5postsog.netlify.app/posts/${singlePost._id}`}
                    target="_blank"
                  >
                    <img src={fb} alt="" />
                  </a>
                  <a
                    href={`mailto:?subject=Nota de luján en 5&amp;body=Luján en 5 hizo una publicación http://www.lujanen5.com/noticias/${singlePost._id}.`}
                  >
                    <img src={email} alt="" />
                  </a>
                  <a
                    href={`https://twitter.com/share?url=https://l5postsog.netlify.app/posts/${singlePost._id}&text=${singlePost.title}`}
                  >
                    <img src={tw} alt="" />
                  </a>
                  <a
                    href={`https://wa.me/?text=${singlePost.title} https://l5postsog.netlify.app/posts/${singlePost._id}`}
                    target="_blank"
                  >
                    <img src={wpp} alt="" />
                  </a>
                </div>
              </div>
              <div className="body">
                {ReactHtmlParser(singlePost.description)}
              </div>
            </div>
            {rated ? (
              ""
            ) : (
              <div className="rate">
                <p className="rate">Qué te pareció la nota?</p>
                <div className="icons-rate">
                  <img onClick={() => handleRate(10)} src={excellent} alt="" />
                  <img onClick={() => handleRate(7.5)} src={good} alt="" />
                  <img onClick={() => handleRate(5)} src={confused} alt="" />
                  <img onClick={() => handleRate(2.5)} src={bad} alt="" />
                </div>
              </div>
            )}
          </div>
        }

        <div className="recommended">
          <h4>
            <strong>Noticias recientes</strong>{" "}
          </h4>
          <div className="recent-card-container">
            {posts
              .slice(0, 6)
              .filter((i) => i._id !== id)
              .map((i) => (
                <Link className="recent-card" to={`/noticias/${i._id}`}>
                  <div className="recent-card-image">
                    <img src={i.photo} alt="" />
                  </div>
                  <div className="recent-card-info">
                    <h4>{i.title}</h4>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;
