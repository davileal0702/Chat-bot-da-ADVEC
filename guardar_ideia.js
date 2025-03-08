client.on('message', async (message) => {
    const estadosUsuarios = {};
    try {
        if (!estadosUsuarios[message.from]) {
            estadosUsuarios[message.from] = 'Culto';
            
            const menu = `Qual culto você gostaria de saber?\n\n\n
            1️⃣ - Culto de domingo\n
            2️⃣ - Culto de segunda-feira\n
            3️⃣ - Culto de terça\n
            4️⃣ - Culto de quinta\n
            5️⃣ - Culto de sábado\n
            6️⃣ - Voltar para o início`;

            await client.sendMessage(message.from, menu);
            return;
        }

        // ✅ Se o usuário já recebeu o menu antes, ele agora está respondendo
        if (estadosUsuarios[message.from] === 'Culto') {
            if (message.body === '1') {
                await client.sendMessage(message.from, 'No domingo temos o *Culto da Celebração* 🙌 às 09h30 e às 18h30.');
                estadosUsuarios[message.from] = 'culto_encerrado';
                return;
            } else if (message.body === '2') {
                await client.sendMessage(message.from, 'Na segunda temos o *Culto da Vitória* 🤩 às 19h30.');
                estadosUsuarios[message.from] = 'culto_encerrado';
                return;
            } else if (message.body === '3') {
                await client.sendMessage(message.from, 'Na terça temos a *Tarde Profética* às 15h.');
                estadosUsuarios[message.from] = 'culto_encerrado';
                return;
            } else if (message.body === '4') {
                await client.sendMessage(message.from, 'Na quinta temos a *Escola da Palavra* 📖 às 19h30.');
                estadosUsuarios[message.from] = 'culto_encerrado';
                return;
            } else if (message.body === '5') {
                await client.sendMessage(message.from, 'No sábado temos:\n*Manhã com Deus* às 09h\n*Interligados (Culto dos Adolescentes)* às 16h\n*Connect (Culto dos Jovens)* às 19h30.');
                estadosUsuarios[message.from] = 'culto_encerrado';
                return;
            } else if (message.body === '6') {
                await opcao1(client, message);
                return;
            } else {
                await client.sendMessage(message.from, '⚠️ Opção inválida. Digite apenas um número de 1 a 6.');
                return;
            }
        }

        // Se o usuário já finalizou a interação, pode ser que queira começar de novo
        if (estadosUsuarios[message.from] === 'culto_encerrado') {
            await client.sendMessage(message.from, `Você tem mais alguma dúvida?\n\n
                1️⃣ - Sim, sobre os cultos\n
                2️⃣ - Sim, sobre outra coisa\n
                3️⃣ - Não tenho mais dúvidas`);
            estadosUsuarios[message.from] = 'resposta_encerramento';
        }

        if (estadosUsuarios[message.from] === 'resposta_encerramento') {
            if (message.body === '1') {
                estadosUsuarios[message.from] = 'Culto';
                return;
            } else if (message.body === '2') {
                await index(client, message);
                return;
            } else if (message.body === '3') {
                await client.sendMessage(message.from, '🙏 Obrigado por entrar em contato! Se precisar de mais informações no futuro, estarei aqui para ajudar. Tenha um ótimo dia! 😊');
                delete estadosUsuarios[message.from];
                setTimeout(async () => {
                    try {
                        await client.deleteChat(message.from);
                    } catch (error) {
                        console.error(`⚠️ Erro ao tentar apagar a conversa de ${message.from}:`, error.message);
                    }
                }, 3000);
                return;
            } else {
                await client.sendMessage(message.from, '⚠️ Opção inválida. Digite apenas um número de 1 a 3.');
                return;
            }
        }

    } catch (error) {
        console.error(`❌ Erro ao processar mensagem de ${message.from}:`, error.message);
    }
});

client.initialize();
































module.exports = async (client, message) => {
    const estadosUsuarios = {}; // Armazena o estado do usuário

    // Pergunta inicial sobre os cultos
    const perguntarSobreCultos = async (user) => {
        estadosUsuarios[user] = 'aguardando_culto';
        const pergunta = `📅 *Qual culto você gostaria de saber?*\n
        1️⃣ - Culto de domingo\n
        2️⃣ - Culto de segunda-feira\n
        3️⃣ - Culto de terça\n
        4️⃣ - Culto de quinta\n
        5️⃣ - Culto de sábado\n
        6️⃣ - Voltar para o início\n
        \nDigite o número da opção desejada.`;
        await client.sendMessage(user, pergunta);
    };

    // Pergunta se o usuário tem mais dúvidas
    const perguntarSeTemDuvidas = async (user) => {
        estadosUsuarios[user] = 'aguardando_duvida';
        const pergunta = `❓ *Você tem mais alguma dúvida?*\n
        1️⃣ - Sim, sobre os cultos\n
        2️⃣ - Sim, sobre outra coisa\n
        3️⃣ - Não tenho mais dúvidas\n
        \nDigite o número da opção desejada.`;
        await client.sendMessage(user, pergunta);
    };

    // Definir respostas para cada culto
    const respostasCultos = {
        '1': '🕊️ O culto de domingo acontece às *10h e 19h*. Você será muito bem-vindo(a)! 🙏',
        '2': '🔥 O culto de segunda-feira é o culto da fé, às *20h*. Venha fortalecer sua caminhada espiritual!',
        '3': '📖 O culto de terça é o estudo bíblico, às *19h30*. Ótimo para aprofundar sua fé!',
        '4': '🎶 O culto de quinta é o culto de louvor e oração, às *20h*. Uma noite de adoração intensa!',
        '5': '🙌 O culto de sábado é o culto da juventude, às *18h*. Um momento especial para os jovens!',
        '6': '🔙 Voltando para o menu principal...'
    };

    // Processar a resposta do usuário
    const processarResposta = async (user, resposta) => {
        if (estadosUsuarios[user] === 'aguardando_culto') {
            if (respostasCultos[resposta]) {
                await client.sendMessage(user, respostasCultos[resposta]);
                if (resposta !== '6') {
                    await perguntarSeTemDuvidas(user); // Pergunta se tem mais dúvidas
                } else {
                    delete estadosUsuarios[user]; // Se escolheu voltar, apaga o estado
                }
            } else {
                await client.sendMessage(user, '⚠️ Opção inválida. Escolha um número de 1 a 6.');
                await perguntarSobreCultos(user);
            }
        } else if (estadosUsuarios[user] === 'aguardando_duvida') {
            if (resposta === '1') {
                await perguntarSobreCultos(user); // Pergunta novamente sobre os cultos
            } else if (resposta === '2') {
                await client.sendMessage(user, '🔄 Voltando ao menu principal...');
                delete estadosUsuarios[user]; // Remove o estado para reiniciar a conversa
            } else if (resposta === '3') {
                await client.sendMessage(user, '✅ Ok! Se precisar de mais alguma coisa, estou à disposição. Deus te abençoe! 🙌');
                delete estadosUsuarios[user]; // Remove o estado para finalizar
            } else {
                await client.sendMessage(user, '⚠️ Opção inválida. Escolha 1, 2 ou 3.');
                await perguntarSeTemDuvidas(user);
            }
        }
    };

    // Inicia a conversa perguntando sobre os cultos
    await perguntarSobreCultos(message.from);

    // Captura as respostas do usuário
    client.on('message', async (msg) => {
        if (msg.from === message.from) {
            await processarResposta(msg.from, msg.body);
        }
    });
};