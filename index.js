const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const opcao1 = require('./opcao1'); // Importando opcao1.js

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    console.log('📌 Escaneie este QR Code com o WhatsApp Web:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot conectado com sucesso!');
});

// Lista de números autorizados
const numerosAutorizados = ['5518991550109@c.us'];

// Gerencia os estados dos usuários
const estadosUsuarios = {};

client.on('message', async (message) => {
    try {
        // Verifica se o número está na lista de autorizados
        if (!numerosAutorizados.includes(message.from)) {
            console.log(`❌ Mensagem ignorada de: ${message.from}`);
            return;
        }

        // Verifica se a mensagem não está vazia
        if (!message.body || message.body.trim() === '') {
            console.log(`⚠️ Mensagem vazia recebida de ${message.from}, ignorando.`);
            return;
        }

        console.log(`📩 Mensagem recebida de ${message.from}: ${message.body}`);


        // Verifica se veio de outro fluxo
        if (estadosUsuarios[message.from] === 'Culto') {
            await opcao1(client, message, estadosUsuarios);
            return;
        };
        if (estadosUsuarios[message.from] === 'culto_encerrado') {
            await opcao1(client, message, estadosUsuarios);
            return;
        };
        if (estadosUsuarios[message.from] === 'resposta_encerramento') {
            await opcao1(client, message, estadosUsuarios);
            return;
        };




        // Enviar mensagem de boas-vindas apenas uma vez por usuário
        if (!estadosUsuarios[message.from]) {
            const mensagemBoasVindas = `👋 Olá! Seja bem-vindo(a)!`;
            await client.sendMessage(message.from, mensagemBoasVindas);
            estadosUsuarios[message.from] = 'inicio'; // Marca o usuário como ativo
        }

        // ✅ Encaminha para opcao1.js se for a opção 1
        if (message.body === '1') {
            await opcao1(client, message, estadosUsuarios);
            return;
        } else if (message.body === '2') {
            await client.sendMessage(message.from, '🎉 Os próximos eventos da igreja incluem um Retiro Espiritual no próximo mês e uma Vigília especial na sexta-feira! Para mais detalhes, acesse nosso site ou fale com a secretaria da igreja.');
            return;
        } else if (message.body === '3') {
            await client.sendMessage(message.from, '📍 Nossa igreja em Sorocaba está localizada na Rua Exemplo, 123, Bairro Centro. Para mais informações, entre em contato pelo telefone (15) 99999-9999.');
            return;
        } else if (message.body === '4') {
            await client.sendMessage(message.from, 'ℹ️ A ADVEC (Assembleia de Deus Vitória em Cristo) é uma igreja fundada pelo pastor Silas Malafaia, com igrejas em várias cidades do Brasil. Para mais informações, acesse o site oficial: [www.advec.com.br](https://www.advec.com.br)');
            return;
        }

        // Se for uma mensagem inválida, reenvia o menu inicial
        const menu = `📌 *Escolha uma opção digitando o número correspondente:*\n
        1️⃣ - Cultos da igreja\n
        2️⃣ - Eventos da igreja\n
        3️⃣ - Informações da igreja em Sorocaba\n
        4️⃣ - Informações da ADVEC\n
        \nDigite o número da opção desejada.`;

        await client.sendMessage(message.from, menu);

    } catch (error) {
        console.error(`❌ Erro ao processar mensagem de ${message.from}:`, error.message);
    }
});

client.initialize();
