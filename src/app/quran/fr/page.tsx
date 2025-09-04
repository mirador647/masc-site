import QuranViewer from "../../../components/QuranViewer";


export const metadata = { title: "Coran — Français" };


export default function Page() {
return (
<main className="py-8">
<h1 className="text-3xl font-semibold text-center mb-4">Coran — Français</h1>
<QuranViewer path="/quran/fr.json" />
</main>
);
}