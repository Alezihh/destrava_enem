import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle2, Clock, BookOpen, Trophy, Star, Shield, Zap, Download, Users, Target, Check } from "lucide-react";
import { trackPurchaseClick, trackPageView, trackViewContent, checkPixelStatus, ensurePixelLoaded } from "@/lib/facebook-api";
// import heroImage from "@/assets/hero-student.jpg";
// import testimonial1 from "@/assets/testimonial-1.jpg";
// import testimonial2 from "@/assets/testimonial-2.jpg";
// import testimonial3 from "@/assets/testimonial-3.jpg";
// import productPreview from "@/assets/product-preview.jpg";

const Index = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [openModal, setOpenModal] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
    // Resetar erros de imagem ao montar
    setImageErrors({});
    
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    
    // Verificar status do Pixel
    setTimeout(() => {
      checkPixelStatus();
    }, 2000);
    
    // Garantir que o Pixel seja carregado
    ensurePixelLoaded();
    
    // Rastrear visualização da página
    trackPageView();
    trackViewContent('Enem Nota Mil Landing Page');
    
    return () => clearInterval(interval);
  }, []);

  const scrollToCTA = () => {
    document.getElementById("cta-section")?.scrollIntoView({ behavior: "smooth" });
  };

  // Mapeamento de matérias para caminhos de imagens (garantindo caracteres especiais)
  // Os arquivos estão em public/resumos/ e são servidos pelo Vite em /resumos/
  const getImagePath = (subjectTitle: string): string => {
    const imageMap: Record<string, string> = {
      "Artes": "/resumos/Artes.webp",
      "Biologia": "/resumos/Biologia.webp",
      "Física": "/resumos/Física.webp",
      "Química": "/resumos/Química.webp",
      "Geografia": "/resumos/Geografia.webp",
      "História": "/resumos/História.webp",
      "Literatura": "/resumos/Literatura.webp",
      "Português": "/resumos/Português.webp",
      "Matemática": "/resumos/Matemática.webp",
      "Sociologia": "/resumos/Sociologia.webp",
      "Filosofia": "/resumos/Filosofia.webp",
    };
    const path = imageMap[subjectTitle] || `/resumos/${subjectTitle}.webp`;
    // Usa encodeURI para garantir que caracteres especiais sejam tratados corretamente
    // Isso é especialmente importante para arquivos com acentos como Física, Química, etc.
    return encodeURI(path);
  };

  // Dados dos tópicos por matéria
  const topicsData: Record<string, { category: string; topics: string[] }[]> = {
    "Artes": [
      { category: "Arte Pré-Histórica", topics: ["Arte Rupestre", "Arte Neolítica", "Arte Paleolítica"] },
      { category: "Arte Antiga", topics: ["Arte Egípcia", "Arte Grega", "Arte Romana", "Arte Bizantina"] },
      { category: "Arte Medieval", topics: ["Arte Gótica", "Arte Islâmica", "Arte Românica"] },
      { category: "Arte Renascentista", topics: ["Renascimento Italiano", "Michelangelo", "Leonardo da Vinci", "Rafael"] },
      { category: "Arte Moderna", topics: ["Impressionismo", "Cubismo", "Arte Abstrata", "Expressionismo", "Surrealismo"] },
      { category: "Arte Brasileira", topics: ["Arte Colonial", "Modernismo Brasileiro", "Arte Barroca", "Semana de Arte Moderna"] },
      { category: "Arte Contemporânea", topics: ["Pop Art", "Arte Digital", "Arte Conceitual", "Street Art"] },
    ],
    "Biologia": [
      { category: "Bioquímica", topics: ["Águas e Sais", "Vitaminas", "Carboidratos e Lipídios", "Intolerância à Lactose", "Proteínas", "Ácido Nucleico"] },
      { category: "Botânica", topics: ["Reino Plantae"] },
      { category: "Citologia", topics: ["Organelas Citoplasmáticas", "Esp. Membrana", "Transporte Celular", "Respiração Celular", "Fotossíntese", "Mutações", "Câncer"] },
      { category: "Embriologia", topics: ["Ovos e Segmentação", "Anexos Embrionários", "Embriologia"] },
      { category: "Ecologia", topics: ["Ciclo do Nitrogênio", "Rel. Ecológicas", "Sucessão Ecológica", "Ecologia"] },
      { category: "Evolução", topics: ["Origem da Vida", "Lamarck", "Darwin", "Especiação", "Evidências Evolutivas"] },
      { category: "Fisiologia", topics: ["Sistema Digestório", "Sistema Respiratório", "Sistema Excretor", "Sistema Urinário", "Sistema Linfático", "Sistema Circulatório", "Sistema Nervoso", "Sistema Endócrino", "Ciclo Menstrual", "Métodos Contraceptivos", "Genital Masculino", "Genital Feminino", "Fecundação", "Gêmeos", "Espermatogênese"] },
      { category: "Genética", topics: ["1ª Lei de Mendel", "Genética", "Sistema RH"] },
      { category: "Histologia", topics: ["Epitélio", "Tecido Nervoso", "Tecido Muscular", "Tecido Conjuntivo"] },
      { category: "Microbiologia", topics: ["Taxonomia e Sistemática", "Algas", "Bactérias", "Bacterioses", "Protozooses", "Micoses", "Viroses", "Coronavirus"] },
      { category: "Zoologia", topics: ["Poríferos", "Celenterados", "Platelmintos", "Nematodeos", "Anfibios", "Répteis", "Aves", "Mamíferos", "Peixes"] },
    ],
    "Física": [
      { category: "Calorimetria", topics: ["Calor", "Calorimetria"] },
      { category: "Cinemática", topics: ["Movimento Uniforme", "MU Variado", "Queda Livre", "Lançamento Vertical", "Lançamentos", "Polias", "Cal. Vetores", "MCU", "Cinemática"] },
      { category: "Dinâmica", topics: ["Forças", "Atrito", "Plano Inclinado", "Lei de Hooke", "Força Centrípeta", "Estática", "Newton"] },
      { category: "Eletrostática", topics: ["Eletrostática"] },
      { category: "Energia", topics: ["Trabalho", "Potência", "Estática"] },
      { category: "Gravitação Universal", topics: ["Gravitação"] },
      { category: "Mecânica Impulsiva", topics: ["Momento Linear", "Alavancas"] },
      { category: "Ondulatória", topics: ["Ondas", "Ondulatória", "Som"] },
      { category: "Termodinâmica", topics: ["Termodinâmica", "Termometria e Dilatometria", "Termologia"] },
      { category: "Fórmulas de Física", topics: ["Fórmulas de Física"] },
    ],
    "Química": [
      { category: "Cinética Química", topics: ["Cinética Química"] },
      { category: "Dispersões", topics: ["Soluções", "Diluição", "Dispersões Coloidais"] },
      { category: "Eletroquímica", topics: ["Pilha", "Eletrólise"] },
      { category: "Equilíbrio Químico", topics: ["Equilíbrio Químico"] },
      { category: "Estudo Físico dos Gases", topics: ["Gás Ideal"] },
      { category: "Ligações Químicas", topics: ["Ligações Químicas", "Polaridade", "Hibridação", "Geometria Molecular"] },
      { category: "Matéria e Energia", topics: ["Química Básica"] },
      { category: "Química Ambiental", topics: ["Poluição Ambiental"] },
      { category: "Química Inorgânica", topics: ["Ácidos", "Bases", "Óxidos", "Sais", "Nox", "Teorias Ácido-Base", "Balanceamento", "Reações Inorgânicas"] },
      { category: "Química Orgânica", topics: ["Orgânica", "Isomeria", "Funções Orgânicas"] },
      { category: "Transformações Químicas", topics: ["Modelos Atômicos", "Distribuição Eletrônica", "Classificação Periódica", "Propriedades Periódicas", "Análise Imediata"] },
      { category: "Termoquímica", topics: ["Termoquímica"] },
    ],
    "Geografia": [
      { category: "Geografia Física", topics: ["Clima", "Hidrografia", "Solos", "Relevo", "Vegetação", "Geologia"] },
      { category: "Geografia Humana", topics: ["População", "Migração", "Crescimento Populacional", "Demografia", "Urbanização"] },
      { category: "Geografia Econômica", topics: ["Economia", "Indústria", "Globalização", "Agropecuária", "Setor Terciário"] },
      { category: "Geografia do Brasil", topics: ["Regionalização", "Características Regionais", "Regiões Brasileiras", "Recursos Naturais"] },
      { category: "Geografia Mundial", topics: ["Continentes", "Países Subdesenvolvidos", "Países Desenvolvidos", "Blocos Econômicos"] },
      { category: "Cartografia", topics: ["Mapas", "Projeções", "Escalas", "Coordenadas Geográficas"] },
      { category: "Geopolítica", topics: ["Conflitos Mundiais", "Fronteiras", "Organização Mundial"] },
    ],
    "História": [
      { category: "História Antiga", topics: ["Pré-História", "Egito Antigo", "Grécia Antiga", "Roma Antiga", "Idade Média"] },
      { category: "História Moderna", topics: ["Renascimento", "Reformas Religiosas", "Absolutismo", "Iluminismo", "Revolução Francesa"] },
      { category: "História Contemporânea", topics: ["Revolução Industrial", "Primeira Guerra Mundial", "Segunda Guerra Mundial", "Guerra Fria"] },
      { category: "História do Brasil Colônia", topics: ["Descobrimento", "Colonização", "Economia Colonial", "Sociedade Colonial", "Inconfidência Mineira"] },
      { category: "Brasil Império", topics: ["Independência", "Primeiro Reinado", "Período Regencial", "Segundo Reinado", "Abolição da Escravidão"] },
      { category: "Brasil República", topics: ["República Velha", "Era Vargas", "Período Democrático", "Ditadura Militar", "Nova República"] },
      { category: "América", topics: ["Colonização da América", "Independências Americanas", "História da América"] },
    ],
    "Literatura": [
      { category: "Literatura Medieval", topics: ["Trovadorismo", "Humanismo"] },
      { category: "Literatura Clássica", topics: ["Classicismo", "Arcadismo", "Barroco"] },
      { category: "Literatura Romântica", topics: ["Romantismo", "1ª Geração Romântica", "2ª Geração Romântica", "3ª Geração Romântica"] },
      { category: "Literatura Realista", topics: ["Realismo", "Parnasianismo", "Naturalismo"] },
      { category: "Literatura Moderna", topics: ["Pré-Modernismo", "1ª Geração Modernista", "Modernismo", "2ª Geração Modernista"] },
      { category: "Literatura Contemporânea", topics: ["3ª Geração Modernista", "Literatura Contemporânea"] },
      { category: "Gêneros Literários", topics: ["Épico", "Dramático", "Lírico", "Figuras de Linguagem"] },
    ],
    "Português": [
      { category: "Fonética e Fonologia", topics: ["Fonemas", "Encontros Consonantais", "Acentuação", "Encontros Vocálicos", "Dígrafos"] },
      { category: "Morfologia", topics: ["Classes Gramaticais", "Adjetivo", "Verbos", "Substantivo", "Pronomes", "Advérbios"] },
      { category: "Sintaxe", topics: ["Análise Sintática", "Período Composto", "Regência", "Período Simples", "Concordância", "Crase"] },
      { category: "Semântica", topics: ["Significado das Palavras", "Homonímia", "Sinônimos", "Polissemia", "Paronímia", "Antônimos"] },
      { category: "Redação", topics: ["Estrutura Textual", "Argumentação", "Coerência", "Dissertação", "Coesão"] },
      { category: "Interpretação de Texto", topics: ["Compreensão Textual", "Gêneros Textuais", "Figuras de Linguagem"] },
    ],
    "Matemática": [
      { category: "Álgebra", topics: ["Equações", "Inequações", "Sistemas Lineares", "Progressões", "Logaritmos", "Exponenciais"] },
      { category: "Funções", topics: ["Função Afim", "Função Quadrática", "Função Exponencial", "Função Logarítmica", "Função Modular"] },
      { category: "Geometria Plana", topics: ["Triângulos", "Quadriláteros", "Polígonos", "Circunferência", "Áreas", "Teorema de Pitágoras"] },
      { category: "Geometria Espacial", topics: ["Prismas", "Pirâmides", "Cilindros", "Cones", "Esferas", "Volume", "Área Superficial"] },
      { category: "Trigonometria", topics: ["Razões Trigonométricas", "Círculo Trigonométrico", "Funções Trigonométricas", "Identidades"] },
      { category: "Estatística e Probabilidade", topics: ["Estatística Descritiva", "Probabilidade", "Análise Combinatória", "Permutações", "Combinações"] },
      { category: "Matemática Financeira", topics: ["Porcentagem", "Juros Simples", "Juros Compostos", "Descontos"] },
    ],
    "Sociologia": [
      { category: "Fundamentos da Sociologia", topics: ["Surgimento da Sociologia", "Objeto de Estudo", "Métodos Sociológicos"] },
      { category: "Teorias Clássicas", topics: ["Auguste Comte", "Max Weber", "Émile Durkheim", "Karl Marx"] },
      { category: "Estratificação Social", topics: ["Classes Sociais", "Desigualdade Social", "Mobilidade Social", "Pobreza"] },
      { category: "Instituições Sociais", topics: ["Família", "Estado", "Trabalho", "Escola", "Religião"] },
      { category: "Movimentos Sociais", topics: ["Movimentos Sociais", "Direitos Humanos", "Cidadania", "Democracia"] },
      { category: "Sociedade Brasileira", topics: ["Formação Social", "Problemas Sociais", "Diversidade Cultural", "Mudanças Sociais"] },
    ],
    "Filosofia": [
      { category: "Filosofia Antiga", topics: ["Pré-Socráticos", "Sócrates", "Platão", "Aristóteles", "Filosofia Helenística", "Estoicismo", "Epicurismo"] },
      { category: "Filosofia Medieval", topics: ["Patrística", "Santo Agostinho", "Escolástica", "São Tomás de Aquino", "Filosofia Islâmica"] },
      { category: "Filosofia Moderna", topics: ["René Descartes", "Racionalismo", "Empirismo", "John Locke", "David Hume", "Immanuel Kant", "Iluminismo"] },
      { category: "Filosofia Contemporânea", topics: ["Hegel", "Nietzsche", "Existencialismo", "Sartre", "Fenomenologia", "Filosofia Analítica", "Pós-Modernismo"] },
      { category: "Ética e Filosofia Moral", topics: ["Ética Aristotélica", "Ética Kantiana", "Utilitarismo", "Bioética", "Direitos Humanos"] },
      { category: "Filosofia Política", topics: ["Contrato Social", "Hobbes", "Locke", "Rousseau", "Maquiavel", "Teorias da Justiça", "Democracia"] },
      { category: "Teoria do Conhecimento", topics: ["Epistemologia", "Ceticismo", "Dogmatismo", "Criticismo", "Método Científico"] },
      { category: "Lógica", topics: ["Lógica Aristotélica", "Silogismo", "Falácias", "Lógica Proposicional", "Argumentação"] },
      { category: "Estética", topics: ["Filosofia da Arte", "Belo e Sublime", "Mimesis", "Arte e Realidade"] },
      { category: "Filosofia Brasileira", topics: ["Pensadores Brasileiros", "Filosofia da Libertação", "Paulo Freire", "Filosofia Indígena"] },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-hero py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge className="mb-3 sm:mb-4 bg-primary-foreground/20 text-primary-foreground border-0 text-xs sm:text-sm font-bold px-2 sm:px-3 md:px-4 py-1 sm:py-2 mx-auto lg:mx-0 inline-block">
                🔥 Promoção por Tempo Limitado!
              </Badge>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-primary-foreground mb-4 sm:mb-6 leading-tight px-1 sm:px-0">
                Destrave no ENEM com +400 resumos e IA que vai te ajudar do início ao fim
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary-foreground/90 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0">
                Uma IA poderosa que destranca seus bloqueios emocionais para você:
              </p>
              <div className="flex justify-center px-2 sm:px-0">
                <Button 
                  variant="hero" 
                  size="xl" 
                  onClick={() => {
                    trackViewContent('Hero CTA Click');
                    scrollToCTA();
                  }} 
                  className="shadow-glow text-xs sm:text-sm md:text-base px-3 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4"
                >
                  Destrave Agora!
                </Button>
              </div>
              <div className="mt-6 sm:mt-8 flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 text-primary-foreground/90 px-2 sm:px-0">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-semibold text-xs sm:text-sm md:text-base">Estudar sem Ansiedade</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-semibold text-xs sm:text-sm md:text-base">Lembrar na Hora H</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-semibold text-xs sm:text-sm md:text-base">Aprender de Verdade</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-semibold text-xs sm:text-sm md:text-base">Fazer Prova Extraordinária</span>
                </div>
              </div>
            </div>
            
            <div className={`hidden lg:block transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative">
                <img 
                  src="/hero-student.jpg" 
                  alt="Estudante feliz preparando-se para o ENEM" 
                  className="rounded-2xl shadow-2xl w-full h-auto transform hover:scale-110 hover:rotate-1 transition-all duration-500"
                  onError={(e) => {
                    console.error('Erro ao carregar imagem:', e);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Benefícios Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 px-2 sm:px-0">
              Por Que Escolher o Destrava Enem?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
              Tecnologia de ponta para superar ansiedade, e material que vai fazer voce tirar sua nota 1000!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Identifica Seus Bloqueios",
                description: "A IA analisa seus medos, ansiedades e padrões emocionais que te impedem de estudar e ter sucesso.",
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "400 resumos",
                description: "400 resumos diretos ao ponto — o atalho para sua aprovação.",
              },
              {
                icon: <Trophy className="w-8 h-8" />,
                title: "Foco no Que Importa",
                description: "Aprenda a estudar de forma eficiente, sem procrastinação, com clareza mental total.",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Ajuda em Todas Matérias",
                description: "Matemática, Redação, Humanas, Natureza... A IA te guia passo a passo em cada dúvida.",
              },
              {
                icon: <Download className="w-8 h-8" />,
                title: "Aumenta Sua Confiança",
                description: "Vença a insegurança e desenvolva a mentalidade vencedora para o dia da prova.",
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Resultados Rápidos",
                description: "Em poucos dias você já sente a diferença: mais calma, mais foco, mais resultado.",
              },
            ].map((benefit, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-card hover:shadow-primary transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-0 text-sm font-bold px-4 py-2">
              ⭐ Resultados Reais
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Veja Quem Já Destravou
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Estudantes que venceram o medo e conquistaram suas aprovações
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Mariana Silva",
                role: "Passou em Medicina",
                image: "/testimonial-1.jpg",
                rating: 5,
                text: "Eu travava toda vez que ia estudar. A ansiedade era tão forte que não conseguia focar. A IA Destrava me ensinou a controlar o medo e finalmente consegui estudar de verdade. Passei em Medicina! 🎉",
              },
              {
                name: "Lucas Oliveira",
                role: "920 em Matemática",
                image: "/testimonial-2.jpg",
                rating: 5,
                text: "Sempre tive bloqueio com matemática. A IA não só me ajudou com as dúvidas, mas principalmente me fez acreditar que eu era capaz. Tirei 920 e nem acredito! 🔥",
              },
              {
                name: "Julia Santos",
                role: "Redação Nota 980",
                image: "/testimonial-3.jpg",
                rating: 5,
                text: "Meu medo de escrever era paralisante. A IA pegou na minha mão, me apoiou em cada parágrafo e me deu confiança. Tirei 980 na redação! Gratidão infinita! ❤️",
              },
            ].map((testimonial, index) => (
              <Card 
                key={index} 
                className={`border-0 shadow-card hover:shadow-secondary transition-all duration-500 cursor-pointer ${
                  activeTestimonial === index ? 'scale-105 shadow-glow ring-2 ring-primary' : 'hover:scale-105'
                }`}
                onMouseEnter={() => setActiveTestimonial(index)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-primary transition-transform duration-300 hover:scale-110"
                    />
                    <div>
                      <h4 className="font-bold text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-5 h-5 fill-primary text-primary transition-transform duration-300 hover:scale-125" 
                        style={{ transitionDelay: `${i * 0.05}s` }}
                      />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Preview do Produto */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-secondary/10 text-secondary border-0 text-sm font-bold px-4 py-2">
                📚 Veja o Que Você Vai Receber
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Uma Experiência Transformadora
              </h2>
              <ul className="space-y-4 mb-8">
                {[
                  "400 resumos essenciais para quem busca a aprovação de verdade.",
                  "IA que conversa com você e entende seus bloqueios",
                  "Técnicas comprovadas para vencer ansiedade e medo",
                  "Ajuda personalizada em TODAS as matérias do ENEM",
                  "Apoio especial para Redação (o terror de muitos!)",
                  "Exercícios práticos de mentalidade vencedora",
                  "Disponível 24/7, sempre que você precisar",
                  "Acesso vitalício - seu para sempre",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-muted/30 rounded-2xl p-8 border border-primary/20">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Desbloqueio Emocional</h3>
                    <p className="text-muted-foreground">Técnicas para eliminar ansiedade e medo</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Apoio em Todas Matérias</h3>
                    <p className="text-muted-foreground">IA te guia em cada dúvida, inclusive Redação</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Mentalidade de Aprovado</h3>
                    <p className="text-muted-foreground">Desenvolva confiança e atitude vencedora</p>
                  </div>
                </div>
                
                <div className="border-t border-muted-foreground/20 pt-6">
                  <p className="text-lg font-medium text-center italic">
                    "A diferença entre passar e não passar está na sua cabeça. Nós te ajudamos a vencer isso."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Resumos */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Por que o Destrava ENEM é a melhor escolha?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tenha em mãos as ferramentas que já aprovaram milhares de estudantes e acelere sua jornada para a universidade.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Artes",
                pages: 20,
                description: "História da arte, movimentos artísticos, arte brasileira e contemporânea.",
                topics: ["Arte Grega", "Barroco", "Expressionismo", "Arte Contemporânea", "Arte Brasileira"],
              },
              {
                title: "Biologia",
                pages: 108,
                description: "Corpo humano, citologia, botânica, zoologia, genética, evolução e ecologia.",
                topics: ["Corpo Humano", "Citologia", "Botânica", "Zoologia", "Genética", "Evolução", "Ecologia"],
              },
              {
                title: "Física",
                pages: 51,
                description: "Cinemática, dinâmica, termologia, ondas, eletricidade e gravitação.",
                topics: ["Cinemática", "Dinâmica", "Termologia", "Ondas", "Eletricidade", "Gravitação"],
              },
              {
                title: "Química",
                pages: 61,
                description: "Química geral, física, orgânica e ambiental.",
                topics: ["Química Geral", "Química Física", "Química Orgânica", "Química Ambiental"],
              },
              {
                title: "Geografia",
                pages: 63,
                description: "Clima, relevo, hidrografia, vegetação, população, economia e regionalização do Brasil e do mundo.",
                topics: ["Clima", "Relevo", "Hidrografia", "Vegetação", "População", "Economia", "Regionalização"],
              },
              {
                title: "História",
                pages: 77,
                description: "História da Antiguidade até o Brasil Contemporâneo.",
                topics: ["Antiguidade", "Idade Média", "Idade Moderna", "Idade Contemporânea", "Brasil Colônia", "Brasil Império", "Brasil República"],
              },
              {
                title: "Literatura",
                pages: 18,
                description: "Escolas literárias e evolução da literatura brasileira.",
                topics: ["Escolas Literárias", "Literatura Brasileira", "Movimentos Literários", "Autores Clássicos"],
              },
              {
                title: "Português",
                pages: 15,
                description: "Gramática prática para interpretação e produção de texto.",
                topics: ["Gramática", "Interpretação", "Produção de Texto", "Análise Textual"],
              },
              {
                title: "Matemática",
                pages: 19,
                description: "Funções, geometria plana, estatística e matemática financeira.",
                topics: ["Funções", "Geometria Plana", "Estatística", "Matemática Financeira", "Álgebra"],
              },
              {
                title: "Sociologia",
                pages: 12,
                description: "Fundamentos da sociologia e teorias clássicas e modernas.",
                topics: ["Fundamentos", "Teorias Clássicas", "Teorias Modernas", "Sociologia Brasileira"],
              },
              {
                title: "Filosofia",
                pages: 14,
                description: "História da filosofia, ética, política e filosofia contemporânea.",
                topics: ["História da Filosofia", "Ética", "Política", "Filosofia Contemporânea"],
              },
            ].map((subject, index) => (
              <Card 
                key={index} 
                className="border-2 border-border shadow-card hover:shadow-primary transition-all duration-500 hover:scale-105 group overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="mb-4 h-48 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 rounded-lg flex items-center justify-center overflow-hidden relative group-hover:shadow-lg transition-shadow">
                    {!imageErrors[index] ? (
                      <img 
                        src={getImagePath(subject.title)} 
                        alt={`Resumo de ${subject.title}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          const imagePath = getImagePath(subject.title);
                          console.error(`Erro ao carregar imagem: ${imagePath}`, e);
                          // Marca como erro para mostrar o fallback
                          setImageErrors(prev => ({ ...prev, [index]: true }));
                        }}
                        onLoad={() => {
                          const imagePath = getImagePath(subject.title);
                          console.log(`Imagem carregada com sucesso: ${imagePath}`);
                        }}
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
                        <BookOpen className="w-20 h-20 text-primary/40 group-hover:scale-110 group-hover:text-primary/60 transition-all duration-300 relative z-10" />
                      </>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {subject.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed min-h-[3rem]">
                    {subject.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-primary">
                      {subject.pages} páginas
                    </span>
                  </div>
                  
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors"
                    onClick={() => {
                      setOpenModal(subject.title);
                    }}
                  >
                    Ver tópicos abordados →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-muted/50 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Estude Onde Estiver</h3>
              <div className="flex items-center justify-center gap-3 mb-4">
                <Download className="w-6 h-6 text-primary" />
                <p className="text-lg text-muted-foreground">
                  Todos os resumos são otimizados para visualização no celular, tablet e computador. Baixe uma vez e acesse offline sempre que precisar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Oferta e Bônus */}
      <section id="cta-section" className="py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 px-2 sm:px-0">
              Escolha Seu Plano e Comece Agora!
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2 sm:px-0">
              Todos os planos com garantia de 7 dias e acesso imediato
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Plano Básico */}
            <Card className="border-2 border-border shadow-card hover:shadow-primary transition-all duration-500 hover:scale-105 relative overflow-hidden group">
              <div className="absolute top-4 right-4">
                <Badge className="bg-secondary text-secondary-foreground font-bold animate-pulse">
                  -76%
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">Destrava Enem Básico</h3>
                <p className="text-muted-foreground mb-4">O essencial para a sua revisão.</p>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                  <Star className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground ml-2">(224)</span>
                </div>

                <div className="mb-6">
                  <p className="text-muted-foreground line-through text-lg">R$ 97,00</p>
                  <p className="text-5xl sm:text-4xl font-extrabold text-foreground mb-1">R$ 9,90</p>
                  <p className="text-sm text-muted-foreground">à vista</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {[
                    "Acesso a todos os +400 resumos em PDF",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <p className="font-bold text-sm mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    Bônus Inclusos:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Acesso à ferramenta de IA</span>
                    </li>
                  </ul>
                </div>

                <Button 
                  variant="default" 
                  size="lg" 
                  className="w-full hover:scale-105 transition-transform duration-300 text-sm sm:text-base px-4 sm:px-6 py-3 sm:py-4"
                  onClick={() => {
                    trackPurchaseClick('basic', 9.90);
                    window.open('https://pay.kirvano.com/96c9b222-7fb1-4c47-94b4-bcb71bfca89b', '_blank');
                  }}
                >
                  COMPRAR AGORA
                </Button>

                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Compra segura
                  </div>
                  <span>•</span>
                  <span>Acesso imediato</span>
                </div>
                <p className="text-center text-xs text-primary font-semibold mt-2">
                  Garantia de 7 dias
                </p>
              </CardContent>
            </Card>

            {/* Plano Completo */}
            <Card className="border-4 border-primary shadow-glow hover:shadow-secondary transition-all duration-500 hover:scale-105 relative overflow-hidden group">
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground font-bold text-sm px-4 py-1 animate-pulse">
                  MAIS VENDIDO
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-primary">Destrava Enem Completo</h3>
                <p className="text-muted-foreground mb-4">O pacote completo para garantir a aprovação.</p>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">(2.128)</span>
                </div>

                <div className="mb-6">
                  <p className="text-muted-foreground line-through text-lg">R$ 197,00</p>
                  <p className="text-5xl sm:text-4xl font-extrabold text-primary mb-1">R$ 19,90</p>
                  <p className="text-sm text-muted-foreground">à vista ou 12x de R$ 1,66</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {[
                    "Acesso a todos os +400 resumos em PDF",
                    "Ferramenta de IA",
                    "Disciplinas: Matemática, Física, Química, Biologia, História, Geografia, Filosofia, Sociologia, Literatura, Português, Artes",
                    "Acesso Vitalício",
                    "Garantia incondicional de 7 dias",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-primary/10 rounded-lg p-4 mb-6 border border-primary/20">
                  <p className="font-bold text-sm mb-2 flex items-center gap-2 text-primary">
                    <Star className="w-4 h-4" />
                    Bônus Inclusos:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Cronograma de Estudos <span className="text-primary font-bold">(R$37,00 GRÁTIS)</span></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Planner Turbo de Revisão <span className="text-primary font-bold">(R$27,00 GRÁTIS)</span></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Mapas Turbo <span className="text-primary font-bold">(R$47,00 GRÁTIS)</span></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Questões Turbo Explicadas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Simulados Relâmpago</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Comunidade Turbo (Grupo Exclusivo)</span>
                    </li>
                  </ul>
                </div>

                <Button 
                  variant="cta" 
                  size="lg" 
                  className="w-full hover:scale-110 transition-transform duration-300 shadow-glow text-sm sm:text-base px-4 sm:px-6 py-3 sm:py-4"
                  onClick={() => {
                    trackPurchaseClick('complete', 19.90);
                    window.open('https://pay.kirvano.com/5b48cfd1-b093-4f1d-9969-e49c5d96da26', '_blank');
                  }}
                >
                  COMPRAR AGORA
                </Button>

                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Compra segura
                  </div>
                  <span>•</span>
                  <span>Acesso imediato</span>
                </div>
                <p className="text-center text-xs text-primary font-semibold mt-2">
                  Garantia de 7 dias
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Garantia */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-card rounded-2xl shadow-card p-12">
            <div className="w-24 h-24 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-12 h-12 text-secondary-foreground" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Garantia Incondicional de 7 Dias
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              Você tem <strong>7 dias completos</strong> para testar o Enem Nota Mil. Se por qualquer motivo você não gostar, basta enviar um email e devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia!
            </p>
            <p className="text-lg font-semibold text-primary">
              Você não tem nada a perder, só a ganhar! 💪
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Como a IA me ajuda com bloqueios emocionais?",
                a: "A IA Destrava usa técnicas comprovadas de psicologia cognitiva e PNL para identificar seus medos, ansiedades e padrões limitantes. Ela conversa com você, entende seu momento e te guia passo a passo para superar cada bloqueio.",
              },
              {
                q: "A IA realmente me ajuda com Redação?",
                a: "Sim! A IA não só te ajuda a estruturar textos, como também trabalha o medo de escrever, te dá confiança e corrige seus erros com empatia. Muitos alunos tiraram notas incríveis na redação depois de usar.",
              },
              {
                q: "É difícil de usar?",
                a: "De jeito nenhum! É super intuitivo. Você abre, conversa como se fosse um amigo que te entende, e a IA te guia em tudo. Funciona no celular e computador.",
              },
              {
                q: "Quanto tempo leva para ver resultados?",
                a: "Muitos alunos já sentem diferença nos primeiros dias. Menos ansiedade, mais foco, mais confiança. O processo é rápido porque você começa a trabalhar seus bloqueios imediatamente.",
              },
              {
                q: "E se eu não gostar?",
                a: "Simples! Você tem 7 dias de garantia total. Se não funcionar para você, devolvemos seu dinheiro sem perguntas. Você não tem nada a perder.",
              },
            ].map((faq, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-card hover:shadow-primary transition-all duration-500 hover:scale-102 cursor-pointer group"
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{faq.q}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-primary-foreground mb-6">
            Não Deixe o Medo Vencer Você
          </h2>
          <p className="text-xl sm:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
            Você tem potencial. Você é capaz. Só precisa destravar o que te impede de brilhar. Comece hoje mesmo por apenas R$ 9,90.
          </p>
          <Button 
            variant="hero" 
            size="xl" 
            onClick={() => {
              trackViewContent('Final CTA Click');
              scrollToCTA();
            }} 
            className="mb-6"
          >
            Destravar Meu Potencial Agora! 🎓
          </Button>
          <div className="flex items-center justify-center gap-8 text-primary-foreground/90 flex-wrap">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="font-semibold">+5.800 Vidas Transformadas</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-semibold">Avaliação 5.0/5.0</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">99% Satisfação</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Tópicos */}
      <Dialog open={openModal !== null} onOpenChange={(open) => !open && setOpenModal(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background dark:bg-gray-900">
          {openModal && topicsData[openModal] && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold mb-2 text-foreground">
                  Tópicos de {openModal}
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  Veja todos os tópicos abordados nos resumos desta disciplina
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-6 space-y-6">
                {topicsData[openModal].map((category, catIndex) => (
                  <div key={catIndex} className="space-y-3">
                    <h3 className="text-lg font-bold text-green-600 dark:text-green-500">
                      {category.category}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {category.topics.map((topic, topicIndex) => (
                        <div 
                          key={topicIndex} 
                          className="flex items-center gap-2 p-2 rounded-md bg-muted/50 dark:bg-gray-800 hover:bg-muted dark:hover:bg-gray-700 transition-colors"
                        >
                          <Check className="w-4 h-4 text-green-600 dark:text-green-500 flex-shrink-0" />
                          <span className="text-sm text-foreground">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-border space-y-4">
                <p className="text-center text-muted-foreground">
                  Todos esses tópicos estão inclusos nos resumos de {openModal}
                </p>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 font-bold"
                  onClick={() => {
                    setOpenModal(null);
                    scrollToCTA();
                  }}
                >
                  QUERO TER ACESSO A TODOS OS RESUMOS
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t">
        <div className="container mx-auto max-w-7xl text-center text-muted-foreground">
          <p className="mb-2">© 2025 Enem Nota Mil - Todos os direitos reservados</p>
          <p className="text-sm">Este produto não garante aprovação, mas oferece o conteúdo completo para estudo.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
