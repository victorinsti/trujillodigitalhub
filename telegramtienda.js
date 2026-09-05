const BOT_TOKEN = "8815025321:AAEmTdvVSgTyv3of4ZChV4IqmLAIv3Gf5iY";
const CHAT_ID = "8661934309";

export async function enviarTelegram(datos) {

    try {

        const fecha = new Date();

        const cliente = datos.customer || {};

        const nombre = cliente.name || "";
        const apellido = cliente.lastName || "";
        const telefono = cliente.phone || "No proporcionado";
        const correo = cliente.email || "No proporcionado";

        const mensaje = `
🛒 NUEVO PEDIDO

🆔 Pedido:
${datos.id}

👤 Cliente:
${nombre} ${apellido}

📱 WhatsApp:
${telefono}

📧 Correo:
${correo}

📦 Productos:
${(datos.items || [])
    .map(item => `• ${item.name} x${item.qty} — $${item.price}`)
    .join("\n")}

💰 Total:
$${datos.total} MXN

📌 Estado:
${datos.status}

📅 Fecha:
${fecha.toLocaleDateString("es-MX")}

🕒 Hora:
${fecha.toLocaleTimeString("es-MX")}

🚀 Trujillo Digital Hub
`;

        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        const respuesta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: mensaje
            })
        });

        if (!respuesta.ok) {
            throw new Error("Telegram no pudo enviar el mensaje");
        }

        return respuesta;

    } catch (error) {

        console.error("Error enviando Telegram:", error);

        throw error;
    }
}