import { useRouter } from "next/router";
import Auth from "./Auth";


export default function Home(){

    const templates = [
        {title: "Blank Document", subtitle: "", imageURL: ""},
        {title: "The Aeneid", subtitle: "Random Excerpt", imageURL: "aeneid.jpg"},
        {title: "Catullus", subtitle: "Random Poem", imageURL: "catullus.jpg"},
        {title: "Gallic Wars", subtitle: "Random Excerpt", imageURL: "gallicwars.jpg"},
        {title: "Metamorphoses", subtitle: "Random Excerpt", imageURL: "metamorphoses.jpg"}
    ]

    const router = useRouter();

    const gotoTest = (id) =>{
        router.push(`/test/${id}`);
    }



    return <div id="home-container">
        <div id="home-main">
            <section>
                <h3>What is Translationeer?</h3>
                <p className="section-description">Translationeer is an online platform that makes translating easier and hassle-free!</p>
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
            <section>
                <h3>Try It!</h3>
                <p className="section-description">Want to see how it works? Open an example template and start translating!</p>
                <ul className="horiz-blocks row">
                    {templates.map(t=>{
                    return <li className="small-block">
                        <button className="block-image" style={{backgroundImage: `url("/images/${t.imageURL}")`}}></button>
                        <label>{t.title}</label>
                        <p>{t.subtitle}</p>
                    </li>
                    })}
                </ul>
            </section>
        </div>
        <div id="home-auth">
            <Auth></Auth>
        </div>
    </div>
}