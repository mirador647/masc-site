import Goals from "./Goals";

export const metadata = { title: "Objectifs" };

export default function Page() {
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-3xl font-semibold mb-4">Objectifs</h1>
      <Goals />
    </main>
  );
}