import Uploader from "@/app/uploader";

export default function Home() {
  return (
    <main className="flex justify-center items-center bg-blue-100 h-screen">
      <div className="w-fit bg-white p-8 rounded-md">
        <h1 className="text-2xl">Google Storage Uploader</h1>
        <Uploader />
      </div>
    </main>
  );
}
