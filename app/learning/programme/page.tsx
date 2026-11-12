import { Suspense } from "react";
import ProgrammeContent from "./ProgrammeContent";

export default function ProgrammePage() {
  return (
    <Suspense fallback={<main className="section"><div className="container"><p>Loading your learning programme…</p></div></main>}>
      <ProgrammeContent />
    </Suspense>
  );
}
