import { Breadcrumb } from "@/features/components/Breadcrumb";

export const metadata = {
  title: "Acerca de nosotros",
  description:
    "Conoce Peru Guitar, un marketplace especializado en productos exclusivos para guitarristas. Curamos cada publicación y conectamos compradores y vendedores de forma directa y transparente.",
};

export default function AboutUs() {
  return (
    <section className="max-w-3xl space-y-6 py-12">
      <Breadcrumb items={[{ label: "Acerca de nosotros" }]} />

      <h1 className="text-3xl font-bold">Acerca de Peru Guitar</h1>

      <p className="leading-relaxed">
        <strong>Peru Guitar</strong> nace como un{" "}
        <strong>
          marketplace especializado en productos exclusivos para guitarristas
        </strong>
        . Nuestro enfoque no es la cantidad, sino la{" "}
        <strong>calidad, la curaduría y la relevancia</strong> de cada
        publicación. Aquí no solo encontrarás guitarras, sino también libros,
        equipamiento, accesorios y productos pensados específicamente para
        músicos.
      </p>

      <p className="leading-relaxed">
        Por esta razón, <strong>no aceptamos cualquier producto</strong>. Cada
        publicación pasa por un proceso de selección donde evaluamos su
        utilidad, su valor real y el interés que puede generar en la comunidad.
        El objetivo es mantener un catálogo{" "}
        <strong>curado, atractivo y diferenciado</strong>, donde cada elemento
        tenga un propósito claro.
      </p>

      <p className="leading-relaxed">
        <strong>No compramos ni vendemos directamente</strong>. Peru Guitar
        actúa como un <strong>intermediario independiente</strong> que brinda
        visibilidad y exposición a los vendedores. Cada producto pertenece a su
        propietario original, quien es el <strong>único responsable</strong> del
        estado, autenticidad y veracidad de la información. Las transacciones se
        coordinan directamente entre comprador y vendedor.
      </p>

      <p className="leading-relaxed">
        Nos preocupamos por presentar cada publicación de forma clara y
        profesional: fichas técnicas estructuradas, información precisa y{" "}
        <strong>fotografías de calidad</strong> que reflejen fielmente el
        producto y su estado real.
      </p>

      <p className="leading-relaxed">
        Si deseas publicar un producto o conocer más sobre cómo funciona la
        plataforma, puedes contactarnos a través de nuestras redes sociales
        oficiales.
      </p>
    </section>
  );
}
