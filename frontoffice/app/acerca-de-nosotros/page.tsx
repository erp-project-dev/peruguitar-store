import { Breadcrumb } from "@/features/components/Breadcrumb";
import { getBasePath } from "@/features/helpers/path.helper";

const title = "Acerca de nosotros";
const description =
  "Conoce Peru Guitar, un marketplace curado para guitarristas donde se publican productos y servicios seleccionados. Conectamos a la comunidad de forma directa y transparente.";

export const metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: getBasePath("acerca-de-nosotros"),
  },
};

export default function AboutUs() {
  return (
    <section className="max-w-3xl space-y-6">
      <Breadcrumb items={[{ label: "Acerca de nosotros" }]} />

      <h1 className="text-3xl font-bold">Acerca de Peru Guitar</h1>

      <p className="leading-relaxed">
        <strong>Peru Guitar</strong> es un{" "}
        <strong>marketplace curado para guitarristas</strong>, creado con el
        objetivo de reunir en un solo lugar{" "}
        <strong>productos y servicios relevantes</strong> para la comunidad.
        Nuestro enfoque no es la cantidad, sino la{" "}
        <strong>calidad, la curaduría y la utilidad real</strong> de cada
        publicación.
      </p>

      <p className="leading-relaxed">
        En la plataforma puedes encontrar desde instrumentos y equipamiento,
        hasta libros, accesorios y <strong>servicios especializados</strong>{" "}
        como luthería, clases, mantenimiento o asesoría técnica. Cada
        publicación es evaluada para asegurar que aporte valor y encaje con el
        espíritu de <strong>Peru Guitar</strong>.
      </p>

      <p className="leading-relaxed">
        Por esta razón, <strong>no aceptamos cualquier contenido</strong>. Todas
        las publicaciones pasan por un proceso de revisión donde analizamos su
        relevancia, claridad y coherencia con el catálogo. Esto nos permite
        mantener un espacio <strong>ordenado, confiable y diferenciado</strong>.
      </p>

      <p className="leading-relaxed">
        <strong>Peru Guitar no compra ni vende directamente</strong>. Actuamos
        como una plataforma de <strong>visibilidad y conexión</strong> entre las
        partes. Los productos y servicios pertenecen a sus respectivos
        propietarios, quienes son los <strong>únicos responsables</strong> de la
        información, estado, autenticidad y condiciones ofrecidas. Las
        transacciones se coordinan directamente entre comprador y proveedor.
      </p>

      <p className="leading-relaxed">
        Cuidamos la forma en que se presenta cada publicación: información
        estructurada, descripciones claras y{" "}
        <strong>material visual de calidad</strong> que refleje con fidelidad lo
        que se ofrece.
      </p>

      <p className="leading-relaxed">
        Si deseas publicar o conocer más sobre cómo funciona{" "}
        <strong>Peru Guitar</strong>, puedes contactarnos a través de nuestras
        redes sociales oficiales.
      </p>
    </section>
  );
}
