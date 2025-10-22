import React from 'react';
import diamantvvs from '../assets/diamant-vvs2.jpg';
import clean from '../assets/clean.jpg';

const samplePosts = [
  {
    id: 1,
    title: "Les bienfaits des pierres précieuses",
    date: "2024-06-01",
    excerpt: "Découvrez comment les pierres précieuses peuvent améliorer votre bien-être et votre énergie au quotidien. Les cristaux ont été utilisés depuis des siècles pour leurs propriétés curatives.",
    image: null, // No image for this one
    layout: 'full',
    link: "https://www.botanic.com/s-informer/bien-etre-hygiene/prendre-soin-de-vous-au-naturel/qu-est-ce-que-la-lithotherapie-et-quels-sont-les-bienfaits-des-pierres.html"
  },
  {
    id: 2,
    title: "Tendances bijoux 2024",
    date: "2025-09-16",
    excerpt: "Un aperçu des dernières tendances en matière de bijoux pour cette année, avec un focus sur les pierres naturelles. Les couleurs vives et les designs minimalistes dominent.",
    image: diamantvvs, // Placeholder image
    layout: 'left-image',
    link: "https://www.goldmarket.fr/quelles-sont-les-tendances-actuelles-en-matiere-de-bijoux-en-or-pour-2025/"
  },
  {
    id: 3,
    title: "Comment entretenir vos bijoux en pierres naturelles",
    date: "2025-08-20",
    excerpt: "Conseils pratiques pour garder vos bijoux en pierres naturelles éclatants et durables. Nettoyez régulièrement et évitez les chocs.",
    image: clean, // Placeholder image
    layout: 'right-image',
    link: "https://valuae.com/guide/criteres-de-qualite/la-purete/diamant_vvs/"
  },
];

export default function Blog() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 text-white">
      <h2 className="text-3xl md:text-4xl font-light tracking-widest text-center text-[#ebc280] mb-12 md:mb-16">
        BLOG
      </h2>
      <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
        {samplePosts.map(post => (
          <article key={post.id} className="bg-zinc-900 p-6 rounded-lg shadow-lg hover:shadow-yellow-400 transition-shadow duration-300">
            {post.layout === 'full' && (
              <>
                <h3 className="text-xl md:text-2xl font-semibold text-[#ebc280] mb-2">{post.title}</h3>
                <time className="block text-sm text-gray-400 mb-4">{new Date(post.date).toLocaleDateString('fr-FR')}</time>
                <p className="text-gray-300 mb-4 text-sm md:text-base">{post.excerpt}</p>
                <a href={post.link} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-[#ebc280] text-black rounded hover:bg-yellow-400 transition text-sm md:text-base min-h-[44px] flex items-center">
                  Lire la suite
                </a>
              </>
            )}
            {post.layout === 'left-image' && (
              <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                <img src={post.image} alt={post.title} className="lg:w-1/2 rounded-lg" />
                <div className="lg:w-1/2">
                  <h3 className="text-xl md:text-2xl font-semibold text-[#ebc280] mb-2">{post.title}</h3>
                  <time className="block text-sm text-gray-400 mb-4">{new Date(post.date).toLocaleDateString('fr-FR')}</time>
                  <p className="text-gray-300 mb-4 text-sm md:text-base">{post.excerpt}</p>
                  <a href={post.link} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-[#ebc280] text-black rounded hover:bg-yellow-400 transition text-sm md:text-base min-h-[44px] flex items-center">
                    Lire la suite
                  </a>
                </div>
              </div>
            )}
            {post.layout === 'right-image' && (
              <div className="flex flex-col lg:flex-row-reverse gap-4 md:gap-6">
                <img src={post.image} alt={post.title} className="lg:w-1/2 rounded-lg" />
                <div className="lg:w-1/2">
                  <h3 className="text-xl md:text-2xl font-semibold text-[#ebc280] mb-2">{post.title}</h3>
                  <time className="block text-sm text-gray-400 mb-4">{new Date(post.date).toLocaleDateString('fr-FR')}</time>
                  <p className="text-gray-300 mb-4 text-sm md:text-base">{post.excerpt}</p>
                  <a href={post.link} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-[#ebc280] text-black rounded hover:bg-yellow-400 transition text-sm md:text-base min-h-[44px] flex items-center">
                    Lire la suite
                  </a>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
