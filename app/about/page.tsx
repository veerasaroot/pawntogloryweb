import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="container py-20 mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">About Pawn to Glory</h1>
      <p className="text-lg text-muted-foreground mb-4">
        We are dedicated to elevating the chess community through professional tournaments, 
        expert courses, and a vibrant club atmosphere.
      </p>
      <p className="text-lg text-muted-foreground">
        Founded in 2026, Pawn to Glory has grown into a hub for players of all levels.
      </p>
    </div>
  );
}
