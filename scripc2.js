document.addEventListener('DOMContentLoaded', () => {
    
    // 1. LÓGICA DEL CURSOR PERSONALIZADO
    const cursor = document.getElementById('cursor');
    
    // Solo activamos el movimiento si el dispositivo tiene puntero (PC)
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
        });

        // Efecto visual al pasar sobre elementos interactivos
        const interactivos = document.querySelectorAll('a, button, input');
        interactivos.forEach(el => {
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

    // 2. BARRA DE PROGRESO DE LECTURA (TOP)
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.getElementById("progress");
        if (progressBar) progressBar.style.width = scrolled + "%";

        // Efecto del Header al hacer scroll
        const header = document.querySelector('header');
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            // En la página de curso lo mantenemos scrolled o no según prefieras
            // header.classList.remove('scrolled'); 
        }
    });

    // 3. ANIMACIÓN DE REVELACIÓN (SCROLL REVEAL)
    // Hace que los elementos aparezcan suavemente al bajar
    const observerOptions = {
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // 4. MANEJO DEL FORMULARIO DE INSCRIPCIÓN
    const cursoForm = document.querySelector('.input-group-verificacion');
    if (cursoForm) {
        cursoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = cursoForm.querySelector('button');
            const originalText = btn.innerText;
            
            // Simulación de envío con feedback visual
            btn.innerText = "PROCESANDO ADMISIÓN...";
            btn.style.opacity = "0.7";
            btn.disabled = true;

            setTimeout(() => {
                btn.innerText = "¡SOLICITUD ENVIADA!";
                btn.style.background = "linear-gradient(90deg, #00ff88, #00f2ff)";
                
                alert("Tu solicitud para el curso ha sido recibida. Un asesor académico se contactará contigo en menos de 24 horas.");
                
                cursoForm.reset();
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = "";
                    btn.style.opacity = "1";
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // 5. SMOOTH SCROLL PARA ENLACES INTERNOS
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});



document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // --- CONFIGURACIÓN ---
        const TELEGRAM_TOKEN = "8518735233:AAF3TVBYFIxQR6iG9TcCFiL5qNhHF-WpY90"; // El código de BotFather
        const CHAT_ID = "7534136848"; // El número de IDBot
        // ---------------------

        const nombre = form.querySelector('[name="Nombre_Cliente"]').value;
        const telefono = form.querySelector('[name="Telefono_Cliente"]').value;
        const email = form.querySelector('[name="Correo"]').value;
        const codigo = form.querySelector('[name="Codigo del Curso"]').value;
        const btn = form.querySelector('button');

        const mensaje = `🚀 *¡NUEVO REGISTRO!*\n\n` +
                        `👤 *Nombre:* ${nombre}\n` +
                        `📱 *WhatsApp:* ${telefono}\n` +
                        `📧 *Email:* ${email}\n\n` +
                        `📧 *codigo:* ${codigo}\n\n` +
                        `🔗 [Click para escribirle](https://wa.me/${telefono.replace(/\+/g, '').replace(/ /g, '')})`;

        btn.innerText = "ENVIANDO...";
        btn.disabled = true;

        try {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: mensaje,
                    parse_mode: "Markdown"
                })
            });

            alert("¡Registro exitoso! Te contactaremos pronto.");
            form.reset();
        } catch (error) {
            alert("Error al enviar los datos.");
        } finally {
            btn.innerText = "Inscribirme ahora";
            btn.disabled = false;
        }
    });
});