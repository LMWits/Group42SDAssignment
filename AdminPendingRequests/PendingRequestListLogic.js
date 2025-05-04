import { db } from '../Admin UI login/firebaseAuth.js';
import {
  collection,
  getDocs,
  deleteDoc,
  setDoc,
  doc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const pendingList = document.getElementById("pendingList");

async function loadPendingAdmins() {
  const q = query(collection(db, "pending_admins"), orderBy("submittedAt", "asc"));
  const snapshot = await getDocs(q);

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const uid = docSnap.id; // ✅ Document ID is the UID
    const { name, email, phone } = data;
    const submittedAt = data.submittedAt?.toDate().toLocaleString() ?? "Unknown";

    const card = document.createElement("div");
    card.className = "request-card";

    card.innerHTML = `
      <h3>${name}</h3>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Submitted:</strong> ${submittedAt}</p>
      <div class="button-group">
        <button class="confirm-btn">Confirm</button>
        <button class="reject-btn">Reject</button>
      </div>
    `;

    card.querySelector(".confirm-btn").addEventListener("click", async () => {
      await confirmAdmin(uid, data);
      card.remove();
    });

    card.querySelector(".reject-btn").addEventListener("click", async () => {
      await rejectAdmin(uid);
      card.remove();
    });

    pendingList.appendChild(card);
  });
}

async function confirmAdmin(uid, data) {
  try {
    // ✅ Create admin record in "users" collection using UID
    await setDoc(doc(db, "users", uid), {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: "admin",
      promotedAt: new Date()
    });

    // ✅ Remove from pending_admins
    await deleteDoc(doc(db, "pending_admins", uid));
    alert(`✅ ${data.name} has been confirmed as an admin.`);
  } catch (err) {
    console.error("❌ Error confirming admin:", err);
    alert("Failed to confirm admin.");
  }
}

async function rejectAdmin(uid) {
  try {
    await deleteDoc(doc(db, "pending_admins", uid));
    alert(`❌ Request from UID ${uid} has been rejected and removed.`);
  } catch (err) {
    console.error("❌ Error rejecting admin:", err);
    alert("Failed to reject admin.");
  }
}

loadPendingAdmins();
