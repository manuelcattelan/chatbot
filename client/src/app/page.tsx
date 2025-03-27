"use client";

import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const query = useQuery({
    queryKey: ["hello-world"],
    queryFn: async () => {
      const response = await fetch("/api/hello-world");
      return await response.text();
    },
  });

  return (
    <div>
      <main>
        <div>
          <h1>{query.data}</h1>
        </div>
      </main>
    </div>
  );
}
