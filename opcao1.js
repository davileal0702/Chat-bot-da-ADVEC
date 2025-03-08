module.exports = async (client, message, estadosUsuarios) => {
    try {
        if (!estadosUsuarios[message.from] || estadosUsuarios[message.from] === 'inicio') {
            estadosUsuarios[message.from] = 'Culto';

            const menu = `📌 *Qual culto você gostaria de saber?*\n
            1️⃣ - Culto de domingo\n
            2️⃣ - Culto de segunda-feira\n
            3️⃣ - Culto de terça\n
            4️⃣ - Culto de quinta\n
            5️⃣ - Culto de sábado\n
            6️⃣ - Voltar para o início`;

            await client.sendMessage(message.from, menu);
            return;
        }

        // ✅ Processa a resposta do usuário sobre os cultos
        if (estadosUsuarios[message.from] === 'Culto') {
            const respostas = {
                '1': '📅 O culto de domingo acontece às 09h30 e às 18h30.',
                '2': '📅 O culto de segunda-feira acontece às 19h30.',
                '3': '📅 O culto de terça-feira acontece às 15h.',
                '4': '📅 O culto de quinta-feira acontece às 19h30.',
                '5': '📅 No sábado temos *Manhã com Deus* às 09h, *Interligados (Adolescentes)* às 16h e *Connect (Jovens)* às 19h30.'
            };

            if (respostas[message.body]) {
                await client.sendMessage(message.from, respostas[message.body]);
                estadosUsuarios[message.from] = 'culto_encerrado';
            } else if (message.body === '6') {
                estadosUsuarios[message.from] = 'inicio';
                await client.sendMessage(message.from, `📌 *Escolha uma opção digitando o número correspondente:*\n
                    1️⃣ - Cultos da igreja\n
                    2️⃣ - Eventos da igreja\n
                    3️⃣ - Informações da igreja em Sorocaba\n
                    4️⃣ - Informações da ADVEC\n
                    \nDigite o número da opção desejada.`);
                return;
            } else {
                await client.sendMessage(message.from, '⚠️ Opção inválida. Digite apenas um número de 1 a 6.');
                return;
            }
        }

        if (estadosUsuarios[message.from] === 'culto_encerrado') {
            const perguntaDuvida = `❓ *Você tem mais alguma dúvida?*\n
            1️⃣ - Sim, sobre os cultos\n
            2️⃣ - Sim, sobre outra coisa\n
            3️⃣ - Não tenho mais dúvidas.`;

            await client.sendMessage(message.from, perguntaDuvida);
            estadosUsuarios[message.from] = 'resposta_encerramento';
            return;
        }

        if (estadosUsuarios[message.from] === 'resposta_encerramento') {
            if (message.body === '1') {
                estadosUsuarios[message.from] = 'Culto';
                
                const menu = `📌 *Qual culto você gostaria de saber?*\n
                1️⃣ - Culto de domingo\n
                2️⃣ - Culto de segunda-feira\n
                3️⃣ - Culto de terça\n
                4️⃣ - Culto de quinta\n
                5️⃣ - Culto de sábado\n
                6️⃣ - Voltar para o início`;

                await client.sendMessage(message.from, menu);
                return;
            } else if (message.body === '2') {
                estadosUsuarios[message.from] = 'inicio'; // Volta ao menu principal
                
                const menuPrincipal = `📌 *Escolha uma opção digitando o número correspondente:*\n
                1️⃣ - Cultos da igreja\n
                2️⃣ - Eventos da igreja\n
                3️⃣ - Informações da igreja em Sorocaba\n
                4️⃣ - Informações da ADVEC\n
                \nDigite o número da opção desejada.`;

                await client.sendMessage(message.from, menuPrincipal);
                return;
            } else if (message.body === '3') {
                await client.sendMessage(message.from, '🙏 Obrigado! Se precisar de mais informações no futuro, estou aqui para ajudar. 😊');
                delete estadosUsuarios[message.from];
                return;
            }
        }
    } catch (error) {
        console.error(`❌ Erro ao processar mensagem de ${message.from}:`, error.message);
    }
};
