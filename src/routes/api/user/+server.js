import { json } from "@sveltejs/kit";

import { doc, getDoc } from "firebase/firestore"; 
import { firebaseDb } from '$lib/scripts/firebase';

export const POST =  async ({ request }) => {

  try {
    const { owners } = await request.json();  // `owners` のリストを受け取る

    if (!owners || !Array.isArray(owners) || owners.length === 0) {
      return json({ error: "Invalid owners list" }, { status: 400 });
    }

    // Firestore から `owners` のデータを取得
    const ownerPromises = owners.map(async (owner) => {
      const ownerRef = doc(firebaseDb, "users", owner);
      const ownerSnap = await getDoc(ownerRef);
      return ownerSnap.exists() ? ownerSnap.data() : null;
    });

    const ownerData = await Promise.all(ownerPromises);


    return new Response(JSON.stringify(ownerData), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });

  } catch (error) {
    console.error("Error fetching owner data:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" }
    });
  }
};
