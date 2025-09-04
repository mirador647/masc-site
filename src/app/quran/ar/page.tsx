import QuranViewer from "../../../components/QuranViewer";


export const metadata = { title: "القرآن — عربي" };


export default function Page() {
return (
<main className="py-8">
<h1 className="text-3xl font-semibold text-center mb-4">القرآن — عربي</h1>
<QuranViewer path="/quran/ar.json" rtl />
</main>
);
}