import { Developers, Item, PrismaClient, User, UserType } from '@prisma/client';

// Initialize Prisma Client
const debug = false;
const prisma = debug
  ? new PrismaClient({ log: ['query'] })
  : new PrismaClient();

async function generateUser(
  userModel: User,
  initialClaps: number,
  initialCoins: number,
  walletLimit: number,
): Promise<User> {
  return await prisma.user.upsert({
    where: { userId: userModel.userId },
    update: {},
    create: {
      ...userModel,
      wallet: {
        create: {
          walletId: userModel.walletId,
          claps: initialClaps,
          coins: initialCoins,
          walletLimit: walletLimit,
          coinsMultiplier: 1.0,
        },
      },
    },
  });
}

async function generateItem(itemModel: Item): Promise<Item> {
  return await prisma.item.upsert({
    where: { itemId: itemModel.itemId },
    update: {},
    create: {
      ...itemModel,
    },
  });
}

async function generateDeveloper(
  developerModel: Developers,
): Promise<Developers> {
  return await prisma.developers.upsert({
    where: { id: developerModel.id },
    update: {},
    create: developerModel,
  });
}

async function clearDatabase(sure: boolean) {
  if (!sure) return;
  const prompt = require('prompt-sync')({ sigint: true });
  const answer = prompt(
    '\u001b[1;33mAre you sure you want to drop all tables? (y/N)\u001b[0m ',
  );
  const REALLY_SURE = answer.toLowerCase() === 'y';
  if (REALLY_SURE) {
    console.log('\u001b[1;31mDropping all tables...\u001b[0m');
    const tables = [
      'item',
      'wallet',
      'feedback',
      'transaction',
      'user',
      'developers',
    ];
    for (const table of tables) await prisma[table].deleteMany({});
  }
}

async function main() {
  // Clear database (use with caution)
  const DRASTIC = false;
  await clearDatabase(DRASTIC);

  const fromAWS = (folder: string, key: string) =>
    `https://globo-aplauso.s3.amazonaws.com/${folder}/${key}`;

  const fromLinkedin = (profileId: string) =>
    `https://linkedin.com/in/${profileId}/`;

  function toObj(name: string, email: string, image?: string) {
    return {
      name,
      email,
      image: image ?? fromAWS('team', 'default_user.png'),
    };
  }
  const users = [
    toObj(
      'Luciane Fortes',
      'luciane.fortes@g.globo.com',
      fromAWS('team', 'luciane_fortes.jpg'),
    ),
    toObj(
      'Alessandra Dutra',
      'alessandra.dutra@pucrs.br',
      fromAWS('team', 'alessandra_dutra.jpg'),
    ),
    toObj(
      'Eduarda Keller',
      'eduarda.k@edu.pucrs.br',
      fromAWS('team', 'eduarda_keller.jpg'),
    ),
    toObj(
      'Julia Makowski',
      'julia.makowski@edu.pucrs.br',
      fromAWS('team', 'julia_makowski.jpg'),
    ),
    toObj(
      'Guilherme Stefani',
      'guilherme.stefani@edu.pucrs.br',
      fromAWS('team', 'guilherme_stefani.jpg'),
    ),
    toObj(
      'Henrique Zanette',
      'henrique.zanette01@edu.pucrs.br',
      fromAWS('team', 'henrique_zanette.jpg'),
    ),
    toObj(
      'Bernardo Müller',
      'b.lorenzi@edu.pucrs.br',
      fromAWS('team', 'bernardo_muller.jpg'),
    ),
    toObj(
      'David Campos',
      'david.castro001@edu.pucrs.br',
      fromAWS('team', 'david_campos.jpg'),
    ),
    toObj(
      'Felipe Freitas',
      'f.freitas007@edu.pucrs.br',
      fromAWS('team', 'felipe_freitas.jpg'),
    ),
    toObj(
      'Francisco Lisboa',
      'francisco.lisboa@edu.pucrs.br',
      fromAWS('team', 'francisco_lisboa.jpg'),
    ),
    toObj(
      'João Schwingel',
      'joao.schwingel002@edu.pucrs.br',
      fromAWS('team', 'joao_schwingel.jpg'),
    ),
    toObj(
      'Leonardo Sabino',
      'leonardo.botton@edu.pucrs.br',
      fromAWS('team', 'leonardo_botton.jpg'),
    ),
    toObj(
      'Thomas Mundstock',
      'thomas.mundstock@edu.pucrs.br',
      fromAWS('team', 'thomas_mundstock.jpg'),
    ),
    toObj(
      'André Fabião',
      'andre.fabiao@edu.pucrs.br',
      fromAWS('team', 'andre_fabiao.jpg'),
    ),
    toObj(
      'Arthur Both',
      'arthur.both001@edu.pucrs.br',
      fromAWS('team', 'arthur_both.jpg'),
    ),
    toObj('Guilherme Barreto', 'guilherme.poglia@edu.pucrs.br'),
    toObj(
      'Isabela Araujo',
      'i.kuser@edu.pucrs.br',
      fromAWS('team', 'isabela_kuser.jpg'),
    ),
    toObj('Lucas Vieira', 'vieira.lucas22@edu.pucrs.br'),
    toObj(
      'Murilo Vargas',
      'murilo.vargas@edu.pucrs.br',
      fromAWS('team', 'murilo_vargas.jpeg'),
    ),
    toObj(
      'Nicholas Luz',
      'nicholas.stefanello@edu.pucrs.br',
      fromAWS('team', 'nicholas_luz.jpg'),
    ),
    toObj(
      'Vitor Jacom',
      'vitor.jacom@edu.pucrs.br',
      fromAWS('team', 'vitor_jacom.jpg'),
    ),
  ];
  console.log(`\n\u001b[1;34mCreating ${users.length} users...\u001b[0m`);
  users.forEach(async ({ name, email, image }, index) => {
    const userId = index + 1;
    const isAdmin = index < 1;
    const user = await generateUser(
      {
        userId: userId,
        name: name,
        email: email,
        password: 'Senh@123',
        cpf: `123456789${userId + 10}`,
        profilePicture: image,
        userType: isAdmin ? UserType.ADMIN : UserType.BASIC,
        walletId: userId,
      },
      0,
      100,
      100000,
    );
    console.log(
      `(${userId}) Created ${user.userType} user ${user.name} with email ${user.email}`,
    );
  });

  const usersTest = [
    {
      name: 'Test User COINS',
      email: 'testuser1@g.globo.com',
      coins: 100000,
      applauses: 100000,
      walletLimit: 100000,
    },
    {
      name: 'Test User NO COINS',
      email: 'testuser2@g.globo.com',
      coins: 0,
      applauses: 0,
      walletLimit: 0,
    },
  ];
  console.log(
    `\n\u001b[1;34mCreating ${usersTest.length} test users...\u001b[0m`,
  );
  console.log(
    `\n\u001b[1;34mCreating ${usersTest.length} test users...\u001b[0m`,
  );
  for (let index = 0; index < usersTest.length; index++) {
    const { name, email, coins, applauses, walletLimit } = usersTest[index];
    const userId = users.length + index + 1;
    const userTest = await generateUser(
      {
        userId: userId,
        name: name,
        email: email,
        password: 'Senh@123',
        cpf: `123456789${userId + 10}`,
        profilePicture: fromAWS('team', 'default_user.png'),
        userType: UserType.BASIC,
        walletId: userId,
      },
      coins,
      applauses,
      walletLimit,
    );
    console.log(
      `(${userId}) [Test] - Created ${userTest.userType} user ${userTest.name} with email ${userTest.email}`,
    );
  }

  let itemId = 1;
  const items: Item[] = [
    await generateItem({
      itemId: itemId++,
      name: 'Amazon Echo Dot 5ª geração',
      description:
        'O Echo Dot conta com speaker de melhor qualidade, proporcionando vocais mais nítidos, graves mais potentes e um som mais vibrante. Peça para Alexa reproduzir músicas e podcasts e aproveite a experiência sonora dinâmica em qualquer ambiente da sua casa.',
      price: 50,
      image: fromAWS('items', 'echo_dot.jpg'),
      available: true,
      updatedAt: new Date(),
    }),
    await generateItem({
      itemId: itemId++,
      name: 'Cartão de presente iFood - R$ 50,00',
      description:
        'O iFood Card é o cartão presente do iFood. Baixe o aplicativo na sua loja de aplicativos ou se já o possui, acesse o aplicativo para utilizar o iFood Card. Termos e condições: ifood.com.br/ifoodcard.',
      price: 10,
      image: fromAWS('items', 'gift_card_ifood.png'),
      available: true,
      updatedAt: new Date(),
    }),
    await generateItem({
      itemId: itemId++,
      name: 'Cartão de presente Xbox Game Pass - 3 Meses',
      description: 'Código digital.',
      price: 5,
      image: fromAWS('items', 'xbox_game_pass.jpg'),
      available: true,
      updatedAt: new Date(),
    }),
    await generateItem({
      itemId: itemId++,
      name: 'Cartão de presente Disney+ - 1 Mês',
      description: 'Código digital.',
      price: 5,
      image: fromAWS('items', 'gift_card_disney_plus.jpg'),
      available: true,
      updatedAt: new Date(),
    }),
  ];
  console.log(`\n\u001b[1;34mCreating ${items.length} items...\u001b[0m`);
  items.forEach(async ({ itemId, name, price }) => {
    console.log(`(${itemId}) Created item '${name}' - R$${price}`);
  });

  function toDeveloperObj(
    name: string,
    profileId: string,
    image_name: string,
    title: string,
  ): Developers {
    return {
      id: developerId++,
      name,
      url: fromLinkedin(profileId),
      image: fromAWS('team', image_name),
      title,
    };
  }
  let developerId = 1;
  const developers: Developers[] = [
    toDeveloperObj(
      'Luciane Fortes',
      'luciane-fortes',
      'luciane_fortes.jpg',
      'People Manager - Product Manager - IT Engineer manager- MSc',
    ),
    toDeveloperObj(
      'Alessandra Costa Smolenaars Dutra, Ph.D, PMP',
      'alessandra-smolenaars-dutra',
      'alessandra_dutra.jpg',
      'Coordenadora do Curso de Sistemas de Informação, do Análise e Desenvolvimento de Sistemas PUCRS, da AGES - Agência Experimental de Engenharia de Software, Professora de Gradução e MBA (PUC, FGV, IBCMED).Consultora KOBE.',
    ),
    toDeveloperObj(
      'Eduarda Keller',
      'eduarda-skeller-',
      'eduarda_keller.jpg',
      'QA Analyst | Engenharia de Software | Scrum | AGES',
    ),
    toDeveloperObj(
      'Júlia Makowski',
      'julia-makowski',
      'julia_makowski.jpg',
      'Software Engineer | Dell',
    ),
    toDeveloperObj(
      'Guilherme Stefani',
      'guilherme-stefani-6b1105219',
      'guilherme_stefani.jpg',
      'Aluno na PUCRS - Pontifícia Universidade Católica do Rio Grande do Sul',
    ),
    toDeveloperObj(
      'Henrique Zanette',
      'henrique-zanette-9b181520a',
      'henrique_zanette.jpg',
      'Student at PUC-RS | FullStack Developer at Zallpy Digital | BMW Group Partner',
    ),
    toDeveloperObj(
      'Bernardo Lorenzi Müller',
      'bernardomuller',
      'bernardo_muller.jpg',
      'Software Developer | Java, React-Native, PL-SQL, MongoDB, .NET |  Currently  Graduate student in Software Engineering at PUC-RS  and  Graduate student in Control and Automation Engineering at UFRGS',
    ),
    toDeveloperObj(
      'David Campos',
      'david-c-campos',
      'david_campos.jpg',
      'Software Engineer | Vue.JS | Typescript | Swift | NextJS | Node.JS | SQL',
    ),
    toDeveloperObj(
      'Felipe Freitas Silva',
      'felipefreitassilva',
      'felipe_freitas.jpg',
      'Software Developer | Typescript | SCSS | SQL',
    ),
    toDeveloperObj(
      'Francisco Lisboa',
      'francisco-lisboa-8876b1250',
      'francisco_lisboa.jpg',
      'Software Engineering @ PUC-RS | Mobile Intern @ Poatek',
    ),
    toDeveloperObj(
      'João Vitor Schwingel',
      'joaov-schwingel',
      'joao_schwingel.jpg',
      'Software development | Java script | Typescript | Reactjs | Nest.js | Delphi | Java',
    ),
    toDeveloperObj(
      'Leonardo Sabino Botton',
      'leonardo-sabino-botton-88216a26b',
      'leonardo_botton.jpg',
      'Software Engineer Intern at Dell Technologies',
    ),
    toDeveloperObj(
      'Thomas Mundstock',
      'thomas-mundstock-292b1478',
      'thomas_mundstock.jpg',
      'Software Engineer',
    ),
    toDeveloperObj(
      'André Fabião',
      'andr%C3%A9fabi%C3%A3o',
      'andre_fabiao.jpg',
      'Estudante de Engenharia de Software',
    ),
    toDeveloperObj(
      'Arthur Antunes de Souza Both',
      'arthurboth',
      'arthur_both.jpg',
      'Aluno na PUCRS - Pontifícia Universidade Católica do Rio Grande do Sul',
    ),
    toDeveloperObj(
      'Guilherme Barreto',
      'guilherme-poglia-3998bb2a0',
      'guilherme_poglia.jpg',
      'Estudante de Engenharia de Software na PUCRS',
    ),
    toDeveloperObj(
      'Isabela Kuser Araujo',
      'isabela-kuser-araujo-00a84b1bb',
      'isabela_kuser.jpg',
      'Aluna de Engenharia de Software na PUCRS',
    ),
    toDeveloperObj(
      'Lucas Pinto Vieira',
      'lucas-pinto-vieira-042214259',
      'lucas_vieira.jpg',
      'Estudante de Engenharia de Software na PUCRS',
    ),
    toDeveloperObj(
      'Murilo Vargas',
      'murilorvargas',
      'murilo_vargas.jpeg',
      'Software Developer | React | Node.js | Python | BaaS',
    ),
    toDeveloperObj(
      'Nicholas Luz',
      'nicholas-luz-141045186',
      'nicholas_luz.jpg',
      'Engenheiro Químico / Estudante de Engenharia de Software',
    ),
    toDeveloperObj(
      'Vitor Jacom',
      'vitorjacom',
      'vitor_jacom.jpg',
      'Estudante de Engenharia de Software | Aluno PUCRS | Java | Dev',
    ),
  ];
  console.log(
    `\n\u001b[1;34mRegistering ${developers.length} developers...\u001b[0m`,
  );
  developers.forEach(async (developer) => {
    await generateDeveloper(developer);
    console.log(
      `(${developer.id}) Registered dev ${developer.name} - ${developer.title}`,
    );
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma Client at the end
    await prisma.$disconnect();
  });
