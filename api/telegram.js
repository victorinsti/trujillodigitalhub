export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Método no permitido"
        });
    }

    try {

        const { chatId, mensaje } = req.body;

        if (!chatId || !mensaje) {
            return res.status(400).json({
                error: "Faltan datos"
            });
        }

        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

        if (!BOT_TOKEN) {
            return res.status(500).json({
                error: "No está configurado el token de Telegram"
            });
        }

        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: mensaje,
                    parse_mode: "HTML"
                })
            }
        );

        const resultado = await telegramResponse.json();

        if (!telegramResponse.ok || !resultado.ok) {
            console.error("Error de Telegram:", resultado);

            return res.status(500).json({
                error: "Telegram rechazó el mensaje"
            });
        }

        return res.status(200).json({
            success: true
        });

    } catch (error) {

        console.error("Error interno:", error);

        return res.status(500).json({
            error: "Error interno del servidor"
        });
    }
}