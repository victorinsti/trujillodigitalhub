const { onDocumentCreated, onDocumentUpdated } = require('firebase-functions/v2/firestore');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');

initializeApp();
const db = getFirestore();

function cleanTokens(snap) {
  return snap.docs.map(d => d.data().token).filter(Boolean);
}

async function sendToTokens(tokens, notification, data = {}) {
  const unique = [...new Set(tokens)];
  if (!unique.length) return;
  for (let i = 0; i < unique.length; i += 500) {
    const batch = unique.slice(i, i + 500).map(token => ({
      token,
      notification,
      data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v ?? '')]))
    }));
    const response = await getMessaging().sendEach(batch);
    const invalid = [];
    response.responses.forEach((r, idx) => {
      if (!r.success && ['messaging/registration-token-not-registered','messaging/invalid-registration-token'].includes(r.error?.code)) {
        invalid.push(unique[i + idx]);
      }
    });
    await Promise.all(invalid.map(token => db.collection('fcm_tokens').doc(token).delete().catch(() => null)));
  }
}

async function tokensForMateria(materia) {
  const snap = await db.collection('fcm_tokens').where('materias', 'array-contains', materia).get();
  return cleanTokens(snap);
}

exports.notifyClassroomPost = onDocumentCreated('classroom_posts/{postId}', async (event) => {
  const p = event.data?.data();
  if (!p?.clase) return;
  const tokens = await tokensForMateria(String(p.clase));
  if (!tokens.length) return;
  const isLive = p.tipo === 'Clase en vivo' || p.live === true;
  await sendToTokens(tokens,
    { title: isLive ? '🔴 Clase en vivo · TDH Classroom' : `📝 Nueva publicación · ${p.clase}`,
      body: p.titulo || (isLive ? 'Tu clase está comenzando.' : 'Hay una nueva actividad en tu Classroom.') },
    { type: isLive ? 'live' : 'post', postId: event.params.postId, url: '/classroom.html' }
  );
});

exports.notifyGrade = onDocumentUpdated('entregas/{deliveryId}', async (event) => {
  const before = event.data.before.data() || {};
  const after = event.data.after.data() || {};
  if (after.calificacion == null || after.calificacion === before.calificacion) return;
  const matricula = String(after.matricula || '');
  if (!matricula) return;
  const snap = await db.collection('fcm_tokens').where('matricula', '==', matricula).get();
  await sendToTokens(cleanTokens(snap),
    { title: '⭐ Nueva calificación · TDH Classroom', body: `Tu entrega fue calificada: ${after.calificacion}/100.` },
    { type: 'grade', deliveryId: event.params.deliveryId, url: '/classroom.html' }
  );
});
