import "./index.scss";

const AboutFarm = () => {
  return (
    <section className="about__farm">
      <h2>ABOUT OUR FARM</h2>
      <div className="farm__video">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/A1d52Epeu_Q?autoplay=1&mute=1&vq=hd1080"
          title="Koi Fish Farm Tour"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
};

export default AboutFarm;
