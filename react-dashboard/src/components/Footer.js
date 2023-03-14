import imagen from "../assets/dev4it_iso_naranja_2.ico";

function Footer() {
  return (
    <footer className="bg-light text-center text-white">
      <div claclassNamess="footer">
        <section className="mb-4">
          <a href="/" role="button">
            <img style={{ width: 40 }} src={imagen} alt="Imagen logo" />
          </a>

          <a
            className="btn btn-primary btn-floating m-1"
            style={{ backgroundColor: "#3b5998" }}
            href="https://www.facebook.com/"
            role="button"
          >
            <i className="fab fa-facebook-f"></i>
          </a>

          <a
            className="btn btn-primary btn-floating m-1"
            style={{ backgroundColor: "#55acee" }}
            href="#!"
            role="button"
          >
            <i className="fab fa-twitter"></i>
          </a>

          <a
            className="btn btn-primary btn-floating m-1"
            style={{ backgroundColor: "#dd4b39" }}
            href="#!"
            role="button"
          >
            <i className="fab fa-google"></i>
          </a>

          <a
            className="btn btn-primary btn-floating m-1"
            style={{ backgroundColor: "#ac2bac" }}
            href="#!"
            role="button"
          >
            <i className="fab fa-instagram"></i>
          </a>

          <a
            className="btn btn-primary btn-floating m-1"
            style={{ backgroundColor: "#0082ca" }}
            href="https://www.linkedin.com/in/albertoranno/"
            role="button"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>

          <a
            className="btn btn-primary btn-floating m-1"
            style={{ backgroundColor: "#333333" }}
            href="#!"
            role="button"
          >
            <i className="fab fa-github"></i>
          </a>
        </section>
      </div>

      <div
        className="text-center p-3"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        <i class="fa-solid fa-copyright"></i> 2023 <b>Dev4it</b> Todos los
        derechos Reservados
      </div>
    </footer>
  );
}

export default Footer;
