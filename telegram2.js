const BOT_TOKEN = "8928441762:AAGO7JuDWYnU1sOcJ2FXY6jAl3EpFS5bgIs";
const CHAT_ID = "8661934309";

export async function enviarTelegram(datos){

    const fecha = new Date();

    const mensaje = `
🎓 NUEVA INSCRIPCIÓN

👦 Alumno:
${datos.nombre}

🎂 Edad:
${datos.edad}

📱 WhatsApp:
${datos.telefono}

📧 Correo:
${datos.correo || "No proporcionado"}


💻 Programa:
Emprende con IA: de una idea a tu primer negocio digital

📅 Fecha:
${fecha.toLocaleDateString("es-MX")}

🕒 Hora:
${fecha.toLocaleTimeString("es-MX")}



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