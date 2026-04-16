
// ===============================
// MODAL PROFESIONAL
// ===============================
function showModal(type, title, message) {
    const modal = document.getElementById("customModal");
    const icon = document.getElementById("modalIcon");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");
    const btn = document.getElementById("modalBtn");

    modalTitle.innerText = title;
    modalMessage.innerText = message;

    if (type === "success") {
        icon.innerText = "✓";
        icon.style.color = "#00ff88";
    } else {
        icon.innerText = "✕";
        icon.style.color = "#ff4d4d";
    }

    modal.classList.add("active");

    // Cerrar manual
    btn.onclick = () => modal.classList.remove("active");

    // Autocierre en 4 segundos
    setTimeout(() => {
        modal.classList.remove("active");
    }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {

    // ===============================
    // 1. CURSOR PERSONALIZADO
    // ===============================
    const cursor = document.getElementById('cursor');

    if (window.matchMedia("(pointer: fine)").matches && cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
        });

        document.querySelectorAll('a, button, input').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform += ' scale(2)';
                cursor.style.backgroundColor = 'rgba(0, 242, 255, 0.1)';
            });

            el.addEventListener('mouseleave', () => {
                cursor.style.transform = cursor.style.transform.replace(' scale(2)', '');
                cursor.style.backgroundColor = 'transparent';
            });
        });
    }

    // ===============================
    // 2. BARRA DE PROGRESO
    // ===============================
    window.addEventListener('scroll', () => {
        const progressBar = document.getElementById("progress");
        if (progressBar) {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        }

        const header = document.querySelector('header');
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        }
    });

    // ===============================
    // 3. SCROLL REVEAL
    // ===============================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // ===============================
    // 4. FORMULARIO + TELEGRAM
    // ===============================
    const form = document.querySelector('.input-group-verificacion');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const TELEGRAM_TOKEN = "8597023981:AAFJLC4K0rkJgdPOFQ50OaClVU5SjG1EAtQ"; 
        const CHAT_ID = "7534136848";

        const nombre = form.querySelector('[name="Nombre_Cliente"]').value;
        const telefono = form.querySelector('[name="Telefono_Cliente"]').value;
        const email = form.querySelector('[name="Correo"]').value;
const codigo = form.querySelector('[name="codigo_curso"]').value;
        const btn = form.querySelector('button');
        const originalText = btn.innerText;

        const mensaje =
            `🚀 NUEVO REGISTRO\n\n` +
            `👤 Nombre: ${nombre}\n` +
            `📱 WhatsApp: ${telefono}\n` +
            `📧 Email: ${email}\n\n` +
            `📧 Codigo: ${codigo}\n\n` +
            `🔗 https://wa.me/${telefono.replace(/\+/g, '').replace(/ /g, '')}`;

        btn.innerText = "ENVIANDO...";
        btn.disabled = true;
        btn.style.opacity = "0.7";

        try {
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: mensaje
                })
            });

            if (!response.ok) throw new Error("Error en Telegram");

            showModal(
                "success",
                "¡Registro Confirmado!",
                "Tu inscripción fue enviada correctamente. Pronto recibirás información en tu WhatsApp."
            );

            form.reset();

        } catch (error) {

            showModal(
                "error",
                "Error al enviar",
                "Hubo un problema al procesar tu registro. Intenta nuevamente."
            );

        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
            btn.style.opacity = "1";
        }
    });

    // ===============================
    // 5. SMOOTH SCROLL
    // ===============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


});