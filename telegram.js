const BOT_TOKEN = "8815025321:AAEmTdvVSgTyv3of4ZChV4IqmLAIv3Gf5iY";
const CHAT_ID = "8661934309";

export async function enviarTelegram(datos){

    const fecha = new Date();

    const mensaje = `
🎓 NUEVA INSCRIPCIÓN

━━━━━━━━━━━━━━━━━━━━━━

👦 Alumno:
${datos.nombre}

🎂 Edad:
${datos.edad}

📱 WhatsApp:
${datos.telefono}

📧 Correo:
${datos.correo || "No proporcionado"}

━━━━━━━━━━━━━━━━━━━━━━

💻 Programa:
Talento Digital Junior PLUS

📅 Fecha:
${fecha.toLocaleDateString("es-MX")}

🕒 Hora:
${fecha.toLocaleTimeString("es-MX")}

━━━━━━━━━━━━━━━━━━━━━━

🚀 Trujillo Digital Hub
`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const respuesta = await fetch(url,{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({
        chat_id: CHAT_ID,
        text: mensaje
    })
});

return respuesta;
}