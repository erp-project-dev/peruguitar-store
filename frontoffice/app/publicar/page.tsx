import { Breadcrumb } from "@/features/components/Breadcrumb";
import { getBasePath } from "@/features/helpers/path.helper";

import PublishForm from "./components/PublishForm/PublishForm";
import { StepCard } from "./components/StepCard";

const title = "Publica tu producto o servicio | Peru Guitar";
const description =
  "Publica tu producto o servicio en Peru Guitar. La publicación es gratuita y está sujeta a aprobación.";

export const metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [
      {
        url: getBasePath("/peruguitar-og-image.jpg"),
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
};

export default function Publish() {
  return (
    <section className="max-w-3xl space-y-10">
      <div className="space-y-4">
        <Breadcrumb items={[{ label: "Publicar" }]} />

        <h1 className="text-3xl font-bold">Publica tu producto o servicio</h1>

        <p className="text-lg text-gray-700">
          Publica tu producto o servicio <strong>GRATIS</strong> en{" "}
          <strong>Peru Guitar</strong>, sujeto a aprobación.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">¿Cómo funciona?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StepCard number={1} title="Completa el formulario">
            Selecciona la categoría e ingresa la información básica del producto
            o servicio.
          </StepCard>

          <StepCard number={2} title="Revisión">
            Verificamos que la publicación cumpla con nuestros criterios de
            evaluación.
          </StepCard>

          <StepCard number={3} title="Ajustes">
            De ser necesario, coordinamos mejoras en la información o material
            enviado.
          </StepCard>

          <StepCard number={4} title="Publicación">
            Si es aprobado, publicamos el producto o servicio en la plataforma.
          </StepCard>
        </div>

        <p className="text-gray-500 text-center max-w-md mx-auto mt-10">
          Peru Guitar no participa en transacciones ni pagos. La coordinación se
          realiza directamente entre las partes.
        </p>
      </div>

      <PublishForm />
    </section>
  );
}
