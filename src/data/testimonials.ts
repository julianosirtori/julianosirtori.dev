export interface Testimonial {
  name: string;
  role: string;
  company: string;
  linkedIn: string;
  date: string;
  content: string[];
  originalLanguage: "pt" | "en";
  source: "LinkedIn";
  photo?: string;
  photoAuthorized: boolean;
  publicationAuthorized: boolean;
}
// The phase-2 brief authorizes republication of these three existing recommendations.
// Original wording is preserved. Two further recommendations await content and permission.
const testimonials: Testimonial[] = [
  {
    name: "Ivander Salvador Ruiz",
    company: "aiqfome",
    originalLanguage: "pt",
    source: "LinkedIn",
    photo: "/images/recommendations/ivander-salvador-ruiz.jpg",
    photoAuthorized: true,
    publicationAuthorized: true,
    role: "Full-stack developer · aiqfome",
    linkedIn: "https://www.linkedin.com/in/ivandersr/",
    date: "2023-09-20",
    content: [
      "O Juliano foi meu colega de trabalho por aproximadamente um ano, e posso garantir que ele é um desenvolvedor flexível e atento aos detalhes. Além da qualidade nas entregas, posso destacar a facilidade de trabalhar com ele, estando sempre animado e receptivo para discussões e novas ideias.",
    ],
  },
  {
    name: "Daniel Gazzaneo Denardo",
    company: "aiqfome",
    originalLanguage: "en",
    source: "LinkedIn",
    photo: "/images/recommendations/daniel-gazzaneo-denardo.jpg",
    photoAuthorized: true,
    publicationAuthorized: true,
    role: "Frontend developer · aiqfome",
    linkedIn: "https://www.linkedin.com/in/dangazzaneo/",
    date: "2023-03-16",
    content: [
      "I had the pleasure of working with Juliano in two different companies over the course of two years and I can say that he is an exceptional colleague. He is capable of developing highly efficient and scalable solutions, always demonstrating great attention to detail and a high level of understanding of business rules abstractions.",
      "In addition, Juliano is an excellent team collaborator, with strong interpersonal skills and clear communication abilities. He has a collaborative approach, always seeking to work together to achieve the best possible results. Without a doubt, he is a professional who adds a lot to any project.",
    ],
  },
  {
    name: "Emerson Santana Cunha",
    company: "aiqfome",
    originalLanguage: "pt",
    source: "LinkedIn",
    photo: "/images/recommendations/emerson-santana-cunha.png",
    photoAuthorized: true,
    publicationAuthorized: true,
    role: "Product Owner · aiqfome",
    linkedIn: "https://www.linkedin.com/in/emerson-santana-cunha-007b0873/",
    date: "2021-09-20",
    content: [
      "Trabalhei diretamente com o Juliano em alguns projetos e sem dúvidas é um ótimo desenvolvedor.",
      "Sempre entregando soluções de qualidade,  buscando atender as necessidades dos clientes, empenhado em seu plano de aprendizagem técnica, com seu perfil colaborativo e motivado, consegue garantir ótimas entregas.",
    ],
  },
];

export const recommendations = testimonials.filter(
  (item) => item.publicationAuthorized,
);
