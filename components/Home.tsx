import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import updateTitle from "../services/updateTitle";
import Auth from "./Auth";

export default function Home() {
  const templates = [
    { title: "Blank Document", subtitle: "", imageURL: "", id: "blank" },
    {
      title: "The Aeneid",
      subtitle: "Random Excerpt",
      imageURL: "aeneid.jpg",
      id: "aeneid",
    },
    {
      title: "Catullus",
      subtitle: "Random Poem",
      imageURL: "catullus.jpg",
      id: "catullus",
    },
    {
      title: "Gallic Wars",
      subtitle: "Random Excerpt",
      imageURL: "gallicwars.jpg",
      id: "gallicwars",
    },
    {
      title: "Metamorphoses",
      subtitle: "Random Excerpt",
      imageURL: "metamorphoses.jpg",
      id: "metamorphoses",
    },
  ];

  const router = useRouter();

  const gotoTest = (id) => {
    router.push(`/test/${id}`);
  };

  updateTitle("Translationeer");

  return (
    <div id="home-container">
      <div id="home-main">
        <div id="first-row">
          <section id="first-section">
            <h3>What is Translationeer?</h3>
            <p className="section-description">
              Translationeer is an online platform that makes translating easier and more efficient! It is free and open source.
            </p>
            <ul className="horiz-blocks row">
              <li className="large-block">
                <div className="block-image  clickdefinition"></div>
                <label>Click a Word for Definition</label>
              </li>
              <li className="large-block">
                <div className="block-image structure"></div>
                <label>Organize and Break Up Text</label>
              </li>
              <li className="large-block">
                <div className="block-image sidebyside"></div>
                <label>Side-by-Side Translation</label>
              </li>
            </ul>
          </section>
          <div id="home-auth">
            <Auth></Auth>
          </div>
        </div>
        <section id="templates-section">
          <h3>Try It!</h3>
          <p className="section-description">
            Want to see how it works? Open an example template and start
            translating!
          </p>
          <ul className="horiz-blocks row">
            {templates.map((t) => {
              return (
                <li className="small-block" key={t.id}>
                  <button
                    onClick={() => gotoTest(t.id)}
                    className="block-image center"
                    style={{ backgroundImage: `url("/images/${t.imageURL}")` }}
                  >{t.id=="blank"&&<FontAwesomeIcon className="sib" icon={faPlus}></FontAwesomeIcon>}</button>
                  <label>{t.title}</label>
                  <p>{t.subtitle}</p>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
