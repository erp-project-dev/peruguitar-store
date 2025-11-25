import PublishForm from "./components/PublishForm";
import { StepCard } from "./components/StepCard";

export const metadata = {
  title: "Publica tu instrumento | Peru Guitar",
  description:
    "Publica tu instrumento musical en Peru Guitar. Contáctate con el administrador para coordinar la publicación.",
};

export default function Publish() {
  return (
    <section className="w-full flex justify-center px-4 py-12">
      <div className="max-w-3xl space-y-10">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold">Publica tu instrumento</h1>

          <p className="text-lg text-gray-700">
            Publica tu instrumento <strong>GRATIS</strong> en{" "}
            <strong>Peru Guitar</strong>, sujeto a aprobación.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">¿Cómo funciona?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StepCard number={1} title="Completa el formulario">
              Ingresa tu nombre, el modelo exacto de tu guitarra y el precio de
              venta.
            </StepCard>

            <StepCard number={2} title="Evaluación de exclusividad">
              Verificamos si el instrumento cumple nuestros criterios de{" "}
              <strong>gama alta, boutique, rarezas o modelos rebuscados</strong>
              .
            </StepCard>

            <StepCard number={3} title="Coordinamos detalles">
              Ajustamos fotos, descripción, ficha técnica y cualquier
              información adicional necesaria.
            </StepCard>

            <StepCard number={4} title="Publicación en catálogo">
              Si es aprobado, publicamos tu instrumento en nuestro catálogo
              exclusivo.
            </StepCard>
          </div>

          <p className="text-gray-500 text-center">
            No participamos en transacciones. Solo brindamos visibilidad a tu
            anuncio y la publicación.
          </p>
        </div>

        <PublishForm />
      </div>
    </section>
  );
}
