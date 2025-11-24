export default function Footer() {
  return (
    <footer className="w-full py-6 bg-[#171717] text-white text-center">
      <p className=" text-gray-300">
        © {new Date().getFullYear()} Peru Guitar - Todos los derechos
        reservados.
      </p>
    </footer>
  );
}
