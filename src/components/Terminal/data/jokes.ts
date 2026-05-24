import { Lang } from "../types";

interface Localized {
  en: string[];
  pt: string[];
}

const JOKES: Localized = {
  en: [
    "There are 10 kinds of people in the world: those who understand binary, and those who don't.",
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "A SQL query walks into a bar, walks up to two tables and asks: can I join you?",
    "I'd tell you a UDP joke, but you might not get it.",
    "Why was the JavaScript developer sad? Because he didn't 'null' how to 'express' himself.",
    "Real programmers count from 0.",
    "It's not a bug. It's an undocumented feature.",
    "There's no place like 127.0.0.1.",
    "Programming is 10% writing code and 90% understanding why it doesn't work.",
    "I would tell you a recursion joke, but I'd have to tell you a recursion joke first.",
  ],
  pt: [
    "Existem 10 tipos de pessoas: as que entendem binário e as que não.",
    "Por que dev gosta de dark mode? Porque luz atrai bugs.",
    "Uma query SQL entra num bar, chega em duas mesas e pergunta: posso me juntar a vocês?",
    "Eu te contaria uma piada UDP, mas você pode não receber.",
    "Programar é 10% escrever código e 90% entender por que não funciona.",
    "Não é bug. É feature não documentada.",
    "Programador conta começando do zero. Sempre.",
    "Não existe lugar como 127.0.0.1.",
    "Eu te contaria uma piada sobre recursão, mas antes eu teria que te contar uma piada sobre recursão.",
    "Dev brasileiro: aquele que comenta o código em duas línguas e ainda assim ninguém entende.",
  ],
};

const QUOTES: Localized = {
  en: [
    '"Programs must be written for people to read, and only incidentally for machines to execute." Harold Abelson',
    '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." Martin Fowler',
    '"Simplicity is the soul of efficiency." Austin Freeman',
    '"The best error message is the one that never shows up." Thomas Fuchs',
    '"Make it work, make it right, make it fast." Kent Beck',
    '"Talk is cheap. Show me the code." Linus Torvalds',
    '"Premature optimization is the root of all evil." Donald Knuth',
    '"Truth can only be found in one place: the code." Robert C. Martin',
  ],
  pt: [
    '"Programas devem ser escritos para pessoas lerem, e só incidentalmente para máquinas executarem." Harold Abelson',
    '"Qualquer tolo escreve código que o computador entende. Bons programadores escrevem código que humanos entendem." Martin Fowler',
    '"Simplicidade é a alma da eficiência." Austin Freeman',
    '"A melhor mensagem de erro é a que nunca aparece." Thomas Fuchs',
    '"Faça funcionar, faça certo, faça rápido." Kent Beck',
    '"Conversa é barata. Me mostra o código." Linus Torvalds',
    '"Otimização prematura é a raiz de todo mal." Donald Knuth',
    '"A verdade só pode ser encontrada em um lugar: o código." Robert C. Martin',
  ],
};

export function randomJoke(lang: Lang): string {
  const pool = JOKES[lang];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function randomQuote(lang: Lang): string {
  const pool = QUOTES[lang];
  return pool[Math.floor(Math.random() * pool.length)];
}
