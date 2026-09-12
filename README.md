# 🐻 Super Bear Block Craft - A Grande Jornada dos Ursos

Um jogo 3D multiplayer de block building em tempo real, construído com **Three.js**, **Tailwind CSS** e **Firebase**.

## 🎮 Características

✨ **Modo Solo Offline** - Jogue sem conexão
🌐 **Multiplayer Online** - Até 10 ursos em uma sala
🎨 **Customização** - Personalize seu urso com cores e chapéus
⛏️ **Block Building** - Coloque e quebre blocos em tempo real
🐻 **Resgate de Ursos** - Complete 4 fases épicas
📱 **Mobile Friendly** - Controles touch otimizados
🍯 **Sistema de Moedas** - Ganhe mel roxo ao salvar ursos

## 🎯 Objetivo do Jogo

### Fase 1: Vila & Aldeia das Tartarugas 🐢
Salve 5 ursos para desbloquear o **Vale Nevado**

### Fase 2: Vale Nevado ❄️
Salve 5 ursos no frio para desbloquear o **Deserto**

### Fase 3: Deserto 🏜️
Salve 5 ursos na areia para desbloquear **A Casa**

### Fase 4: A Casa 🏠
Salve o Urso Lendário Final (custa 100 Moedas)

## 🚀 Como Jogar

### Desktop
- **W/A/S/D** - Mover
- **ESPAÇO** - Pular
- **Q** - Quebrar Bloco
- **E** - Colocar Bloco
- **Mouse** - Olhar ao redor

### Mobile
- **Joystick** - Mover (esquerda)
- **Botões** - Quebrar, Colocar, Pular (direita)

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/ftyii/super-bear-block-craft.git
cd super-bear-block-craft
```

2. Abra `index.html` em um navegador moderno

3. (Opcional) Configure Firebase para multiplayer:
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com)
   - Configure as credenciais na variável `firebaseConfig`

## 📦 Estrutura do Projeto

```
super-bear-block-craft/
├── index.html          # Interface HTML principal
├── js/
│   └── game.js        # Lógica do jogo
├── README.md          # Este arquivo
├── LICENSE            # Licença do projeto
└── package.json       # Metadados do projeto
```

## 🔧 Tecnologias Utilizadas

- **Three.js** - Engine 3D WebGL
- **Tailwind CSS** - Framework CSS
- **Firebase** - Backend multiplayer
- **FontAwesome** - Ícones
- **Google Fonts** - Tipografia

## 🎨 Blocos Disponíveis

| Bloco | Emoji | Cor | Tipo |
|-------|-------|-----|------|
| Grama | 🌱 | Verde | Base |
| Mel Roxo | 🍯 | Roxo | Especial |
| Neve | ❄️ | Branco | Fase 2 |
| Gelo | 🧊 | Azul Claro | Fase 2 |
| Areia | ⏳ | Amarelo | Fase 3 |
| Madeira | 🪵 | Marrom | Construção |
| Tijolo | 🧱 | Vermelho | Construção |
| Ouro | ⭐ | Dourado | Raro |

## 👥 Multiplayer

1. Clique em **CRIAR NOVA SALA** para hospedar
2. Compartilhe o código da sala com amigos
3. Eles clicam em **ENTRAR** e digitam o código
4. Máximo 10 ursos por sala

## 🐻 Customização do Urso

### Cores Disponíveis
- 🟤 Marrom (Padrão)
- 🟣 Roxo
- 🟠 Chocolate
- ⬛ Preto
- 🔴 Vermelho

### Chapéus
- Nenhum
- 👑 Coroa (Rei)
- 🎩 Cartola (Elegante)
- 🧢 Boné (Casual)

## 📊 Sistema de Pontuação

- **Urso Resgatado** = +10 Moedas
- **Fase Completa** = +20 Bônus
- **Bloco Especial Colocado** = +5 Moedas
- **Urso Lendário** = -100 Moedas (custo)

## 🐛 Bugs Conhecidos

- Multiplayer requer conexão estável
- Limite de render distante em dispositivos mobile
- Áudio ainda não implementado

## 🎯 Roadmap

- [ ] Sistema de áudio
- [ ] Animações de resgate
- [ ] Partículas de efeito
- [ ] Ranking global
- [ ] Skins de ursos únicos
- [ ] Mapa de mundo expandido
- [ ] Sistema de conquistas

## 📝 Licença

Este projeto é licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuições

Contribuições são bem-vindas! Abra uma issue ou pull request.

## 📧 Contato

Para suporte ou sugestões, abra uma issue no GitHub.

---

**Made with ❤️ by ftyii**
