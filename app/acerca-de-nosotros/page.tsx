export const metadata = {
  title: "Acerca de Peru Guitar",
  description:
    "Conoce qué es Peru Guitar, cómo funciona y cuál es nuestra misión.",
};

export default function AboutUs() {
  return (
    <section className="w-full flex justify-center px-4">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold">Acerca de Peru Guitar</h1>

        <p className="leading-relaxed">
          <strong>Peru Guitar</strong> es un
          <strong> marketplace de anuncios</strong> dedicado a la difusión de
          instrumentos musicales.
        </p>

        <p className="leading-relaxed">
          No vendemos productos directamente ni participamos en transacciones.
          Nuestro rol es brindar
          <strong> exposición y visibilidad</strong> a las publicaciones de
          terceros a través de nuestra plataforma y red de contactos.
        </p>

        <p className="leading-relaxed">
          Cada instrumento publicado pertenece a su respectivo vendedor, quien
          es
          <strong>
            {" "}
            responsable total del estado, veracidad y disponibilidad
          </strong>{" "}
          del producto. Peru Guitar únicamente actúa como un medio adicional de
          promoción, similar a un directorio de anuncios, ampliando el alcance
          de las publicaciones más allá de los canales tradicionales.
        </p>

        <p className="leading-relaxed">
          Si deseas publicar tu instrumento o conocer más sobre nuestra
          plataforma, puedes contactarnos a través de nuestras redes sociales
          oficiales.
        </p>
      </div>
    </section>
  );
}
